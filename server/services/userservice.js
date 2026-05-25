const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const RESET_CODE_TTL_MS = 10 * 60 * 1000;
const MAX_RESET_ATTEMPTS = 5;

class ServiceError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const isBcryptHash = (value = '') => (
  value.startsWith('$2a$') ||
  value.startsWith('$2b$') ||
  value.startsWith('$2y$')
);

const hashResetCode = (code) => crypto.createHash('sha256').update(code).digest('hex');

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

const sendResetCodeEmail = async ({ to, code }) => {
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"TasteBite" <${process.env.MAIL_USER}>`,
    to,
    subject: 'TasteBite password reset code',
    text: `Your TasteBite password reset code is ${code}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>TasteBite password reset</h2>
        <p>Your reset code is:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${code}</p>
        <p>This code expires in 10 minutes. If you did not request it, ignore this email.</p>
      </div>
    `,
  });
};

const isEmailConfigured = () => Boolean(process.env.MAIL_USER && process.env.MAIL_PASS);

class UserService {
  constructor(UserModel) {
    // Dependency Injection: the model is received from outside instead of imported directly.
    this.UserModel = UserModel;
  }

  async registerUser({ name, email, password, role, phone }) {
    if (!name || !email || !password) {
      throw new ServiceError(400, 'Name, email, and password are required');
    }

    const userExists = await this.UserModel.findOne({ email });
    if (userExists) {
      throw new ServiceError(400, 'User already exists');
    }

    const user = await this.UserModel.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      phone,
      authProvider: 'local',
    });

    return sanitizeUser(user);
  }

  async loginUser({ email, password }) {
    if (!email || !password) {
      throw new ServiceError(400, 'Email and password are required');
    }

    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new ServiceError(401, 'Invalid credentials');
    }

    let passwordMatches = false;
    if (isBcryptHash(user.password)) {
      passwordMatches = await bcrypt.compare(password, user.password);
    } else {
      passwordMatches = user.password === password;
      if (passwordMatches) {
        user.password = await bcrypt.hash(password, 10);
        user.authProvider = user.authProvider || 'local';
        await user.save();
      }
    }

    if (!passwordMatches) {
      throw new ServiceError(401, 'Invalid credentials');
    }

    return sanitizeUser(user);
  }

  async googleLogin({ credential }) {
    if (!credential) {
      throw new ServiceError(400, 'Google credential is required');
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new ServiceError(500, 'Google login is not configured on the server');
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload.email_verified) {
      throw new ServiceError(401, 'Google account email is not verified');
    }

    let user = await this.UserModel.findOne({ email: payload.email });

    if (!user) {
      user = await this.UserModel.create({
        name: payload.name || payload.email.split('@')[0],
        email: payload.email,
        googleId: payload.sub,
        password: await bcrypt.hash(crypto.randomUUID(), 10),
        authProvider: 'google',
        role: 'customer',
      });
    } else {
      user.googleId = user.googleId || payload.sub;
      user.authProvider = user.authProvider || 'google';
      await user.save();
    }

    return sanitizeUser(user);
  }

  async forgotPassword({ email }) {
    if (!email) {
      throw new ServiceError(400, 'Email is required');
    }

    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new ServiceError(404, 'No account found with this email');
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    user.resetPasswordCodeHash = hashResetCode(code);
    user.resetPasswordExpiresAt = new Date(Date.now() + RESET_CODE_TTL_MS);
    user.resetPasswordAttempts = 0;
    await user.save();

    if (isEmailConfigured()) {
      await sendResetCodeEmail({ to: user.email, code });
      return { message: 'Reset code sent to your email' };
    }

    return {
      message: 'Email is not configured. Use this development reset code to continue testing.',
      devCode: process.env.NODE_ENV === 'production' ? undefined : code,
    };
  }

  async resetPassword({ email, code, newPassword }) {
    if (!email || !code || !newPassword) {
      throw new ServiceError(400, 'Email, code, and new password are required');
    }

    if (newPassword.length < 6) {
      throw new ServiceError(400, 'Password must be at least 6 characters');
    }

    const user = await this.UserModel.findOne({ email });
    if (!user || !user.resetPasswordCodeHash || !user.resetPasswordExpiresAt) {
      throw new ServiceError(400, 'Invalid or expired reset code');
    }

    if (user.resetPasswordExpiresAt < new Date()) {
      throw new ServiceError(400, 'Reset code expired');
    }

    if (user.resetPasswordAttempts >= MAX_RESET_ATTEMPTS) {
      throw new ServiceError(429, 'Too many attempts. Request a new reset code');
    }

    if (user.resetPasswordCodeHash !== hashResetCode(code)) {
      user.resetPasswordAttempts += 1;
      await user.save();
      throw new ServiceError(400, 'Invalid reset code');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.authProvider = user.googleId ? user.authProvider : 'local';
    user.resetPasswordCodeHash = undefined;
    user.resetPasswordExpiresAt = undefined;
    user.resetPasswordAttempts = 0;
    await user.save();
  }

  async getAllUsers() {
    return this.UserModel.find({}).select('-password -resetPasswordCodeHash');
  }

  async updateUserRole(id, role) {
    if (!role) {
      throw new ServiceError(400, 'Role is required');
    }

    const user = await this.UserModel.findByIdAndUpdate(id, { role }, { new: true })
      .select('-password -resetPasswordCodeHash');

    if (!user) {
      throw new ServiceError(404, 'User not found');
    }

    return user;
  }

  async deleteUser(id) {
    const user = await this.UserModel.findByIdAndDelete(id);

    if (!user) {
      throw new ServiceError(404, 'User not found');
    }
  }
}

module.exports = { UserService, ServiceError };
