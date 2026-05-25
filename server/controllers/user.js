const User = require('../models/user');
const { UserService } = require('../services/userservice');

// IoC: the controller wires dependencies and passes them into the service.
const userService = new UserService(User);

const registerUser = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await userService.loginUser(req.body);
    res.status(200).json({
      message: 'Login successful',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const user = await userService.googleLogin(req.body);
    res.status(200).json({
      message: 'Google login successful',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 401).json({ message: error.statusCode ? error.message : 'Google login failed' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result = await userService.forgotPassword(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    await userService.resetPassword(req.body);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const user = await userService.updateUserRole(req.params.id, req.body.role);
    res.status(200).json({ message: 'Role updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  forgotPassword,
  resetPassword,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
