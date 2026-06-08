import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { CompareProvider } from './contexts/CompareContext'
import { CompareTray } from './components/products/CompareTray'
import { CompareDrawer } from './components/products/CompareDrawer'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { BottomNav } from './components/layout/BottomNav'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { usePageTracking } from './hooks/useAnalytics'

/**
 * Route components are code-split with React.lazy — the official React pattern,
 * declared at module scope (per react.dev, lazy() must not be created inside a
 * component) — so each page ships as its own chunk and the initial bundle stays
 * small. Our pages use named exports, so each import is adapted to the default
 * export lazy() expects via `.then(m => ({ default: m.X }))`.
 */
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })))
const HomeownerHomePage = lazy(() => import('./pages/HomeownerHomePage').then(m => ({ default: m.HomeownerHomePage })))
const HVACProsPage = lazy(() => import('./pages/HVACProsPage').then(m => ({ default: m.HVACProsPage })))
const CodeOfficialsPage = lazy(() => import('./pages/CodeOfficialsPage').then(m => ({ default: m.CodeOfficialsPage })))
const PropertyManagerPage = lazy(() => import('./pages/PropertyManagerPage').then(m => ({ default: m.PropertyManagerPage })))
const CustomerSelectionPage = lazy(() => import('./pages/CustomerSelectionPage').then(m => ({ default: m.CustomerSelectionPage })))
const ProductsPage = lazy(() => import('./pages/ProductsPage').then(m => ({ default: m.ProductsPage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })))
const SupportHubPage = lazy(() => import('./pages/SupportHubPage').then(m => ({ default: m.SupportHubPage })))
const InstallationSetupPage = lazy(() => import('./pages/InstallationSetupPage').then(m => ({ default: m.InstallationSetupPage })))
const ProductSupportPage = lazy(() => import('./pages/ProductSupportPage').then(m => ({ default: m.ProductSupportPage })))
const WarrantyReturnsPage = lazy(() => import('./pages/WarrantyReturnsPage').then(m => ({ default: m.WarrantyReturnsPage })))
const CompliancePage = lazy(() => import('./pages/CompliancePage').then(m => ({ default: m.CompliancePage })))
const SignInPage = lazy(() => import('./pages/SignInPage').then(m => ({ default: m.SignInPage })))
const SignUpPage = lazy(() => import('./pages/SignUpPage').then(m => ({ default: m.SignUpPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })))
const ReturnRefundPolicyPage = lazy(() => import('./pages/ReturnRefundPolicyPage').then(m => ({ default: m.ReturnRefundPolicyPage })))
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage').then(m => ({ default: m.ShippingPolicyPage })))
const WarrantyPolicyPage = lazy(() => import('./pages/WarrantyPolicyPage').then(m => ({ default: m.WarrantyPolicyPage })))
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage').then(m => ({ default: m.TermsOfUsePage })))
const EmailPreferencesPage = lazy(() => import('./pages/EmailPreferencesPage').then(m => ({ default: m.EmailPreferencesPage })))
const UnsubscribePage = lazy(() => import('./pages/UnsubscribePage').then(m => ({ default: m.UnsubscribePage })))
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage').then(m => ({ default: m.UnauthorizedPage })))
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })))
const MiniProductPage = lazy(() => import('./pages/MiniProductPage').then(m => ({ default: m.MiniProductPage })))
const SensorProductPage = lazy(() => import('./pages/SensorProductPage').then(m => ({ default: m.SensorProductPage })))
const ComboProductPage = lazy(() => import('./pages/ComboProductPage').then(m => ({ default: m.ComboProductPage })))
const SensorSetupPage = lazy(() => import('./pages/SensorSetupPage').then(m => ({ default: m.SensorSetupPage })))
const MiniSetupPage = lazy(() => import('./pages/MiniSetupPage').then(m => ({ default: m.MiniSetupPage })))
const RecommendedInstallationScenariosPage = lazy(() => import('./pages/RecommendedInstallationScenariosPage').then(m => ({ default: m.RecommendedInstallationScenariosPage })))
const EmailSignaturePage = lazy(() => import('./pages/EmailSignaturePage').then(m => ({ default: m.EmailSignaturePage })))
const TrashTheFloatPage = lazy(() => import('./pages/TrashTheFloatPage').then(m => ({ default: m.TrashTheFloatPage })))
const ComplimentaryMiniRequestPage = lazy(() => import('./pages/ComplimentaryMiniRequestPage').then(m => ({ default: m.ComplimentaryMiniRequestPage })))
const CartPage = lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })))
const CheckoutSuccessPage = lazy(() => import('./pages/CheckoutSuccessPage').then(m => ({ default: m.CheckoutSuccessPage })))
const CheckoutCancelPage = lazy(() => import('./pages/CheckoutCancelPage').then(m => ({ default: m.CheckoutCancelPage })))

/** Shown while a lazily-loaded route chunk is fetching. */
function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-orange-600" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}

function AppContent() {
    const location = useLocation()

    usePageTracking()

  // Hide header/footer on sensor setup page for cleaner experience
  const hideHeaderFooter = location.pathname === '/sensor-setup' || location.pathname === '/mini-setup'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!hideHeaderFooter && <Header />}
      <main className={`flex-1 mb-16 md:mb-0 ${!hideHeaderFooter ? 'pt-16' : ''}`}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/homeowner" element={<HomeownerHomePage />} />
              <Route path="/hvac-pros" element={<HVACProsPage />} />
              <Route path="/property-managers" element={<PropertyManagerPage />} />
              <Route path="/code-officials" element={<CodeOfficialsPage />} />
              <Route path="/property-manager" element={<PropertyManagerPage />} />
              <Route path="/customer-selection" element={<CustomerSelectionPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/solutions" element={<ProductsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    {/* /boafcoaa-muni-intake-form retired — MunicipalIntakePage unrouted (file kept for re-enable) */}
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/support" element={<SupportHubPage />} />
                    <Route path="/support/installation-setup" element={<InstallationSetupPage />} />
                    <Route path="/support/product-support" element={<ProductSupportPage />} />
                    <Route path="/support/warranty-returns" element={<WarrantyReturnsPage />} />
                    <Route path="/compliance" element={<CompliancePage />} />
                    <Route path="/auth/signin" element={<SignInPage />} />
              <Route path="/auth/signup" element={<SignUpPage />} />
              <Route path="/login" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/profile" element={<ProfilePage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/return-refund-policy" element={<ReturnRefundPolicyPage />} />
              <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
              <Route path="/warranty-policy" element={<WarrantyPolicyPage />} />
              <Route path="/terms-of-use" element={<TermsOfUsePage />} />
              <Route path="/email-preferences" element={<EmailPreferencesPage />} />
              <Route path="/unsubscribe" element={<UnsubscribePage />} />
              <Route path="/products/mini" element={<MiniProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
                    <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
                    <Route path="/products/sensor" element={<SensorProductPage />} />
                    <Route path="/products/combo" element={<ComboProductPage />} />
                    <Route path="/sensor-setup" element={<SensorSetupPage />} />
                    <Route path="/mini-setup" element={<MiniSetupPage />} />
                    <Route path="/support/installation-scenarios" element={<RecommendedInstallationScenariosPage />} />
                    <Route path="/email-signature" element={<EmailSignaturePage />} />
                    <Route path="/trash-the-float" element={<TrashTheFloatPage />} />
                    <Route path="/complimentary-mini" element={<ComplimentaryMiniRequestPage />} />
                    <Route path="/complimentary-mini/confirmed" element={<ComplimentaryMiniRequestPage />} />
            </Routes>
        </Suspense>
          </main>
          {!hideHeaderFooter && <Footer />}
          {!hideHeaderFooter && <BottomNav />}
          {!hideHeaderFooter && <CompareTray />}
          {!hideHeaderFooter && <CompareDrawer />}
        </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CompareProvider>
          <Router>
            <ScrollToTop />
            <AppContent />
          </Router>
        </CompareProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
