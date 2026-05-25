import './index.css'

import { LandingPage } from './pages/homepage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { MenuPage } from './pages/MenuPage.jsx'
import { CartPage } from './pages/CartPage.jsx'
import { PickupPage } from './pages/ReservationPage.jsx'
import { CustomerDashboard } from './pages/CustomerDashboard.jsx'
import { KitchenDashboard } from './pages/KitchenDashboard.jsx'
import { ServiceDashboard } from './pages/ServiceDashboard.jsx'
import { DeliveryDashboard } from './pages/DeliveryDashboard.jsx'
import { ManagerDashboard } from './pages/ManagerDashboard.jsx'
import { SupplierDashboard } from './pages/SupplierDashboard.jsx'
import { NotFoundPage } from './pages/NotFoundPage.jsx'
import { ForgetPasswordPage } from './pages/ForgetPasswordPage.jsx'
import { CheckoutPage } from './pages/CheckoutPage.jsx'
import { OrderTrackingPage } from './pages/OrderTrackingPage.jsx'

/**
 * Simple client-side router — no react-router package needed.
 * Vite serves index.html for all paths (SPA appType), so
 * window.location.pathname gives us the current route.
 */
const ROUTES = {
  '/': LandingPage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/menu': MenuPage,
  '/cart': CartPage,
  '/reservations': PickupPage,
  '/customer/dashboard': CustomerDashboard,
  '/orders': CustomerDashboard,
  '/kitchen': KitchenDashboard,
  '/service': ServiceDashboard,
  '/delivery': DeliveryDashboard,
  '/manager': ManagerDashboard,
  '/manager/dashboard': ManagerDashboard,
  '/supplier': SupplierDashboard,
  '/supplier/dashboard': SupplierDashboard,
  '/forgot-password': ForgetPasswordPage,
  '/checkout': CheckoutPage,
  '/track-order': OrderTrackingPage,
}

function App() {
  const path = window.location.pathname
  let Page = ROUTES[path]

  if (path.startsWith('/track-order/')) {
    Page = OrderTrackingPage
  }

  Page = Page ?? NotFoundPage
  return <Page />
}

export default App
