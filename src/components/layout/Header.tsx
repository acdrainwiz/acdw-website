import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Bars3Icon, 
  XMarkIcon, 
  ShoppingCartIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  ShoppingBagIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  ChartBarSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  WrenchScrewdriverIcon,
  CpuChipIcon,
  SparklesIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  DocumentTextIcon,
  CreditCardIcon,
  BellIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'

const baseNavigation = [
  { name: 'Products', href: '/products' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Sensor Monitoring', href: 'https://monitor.acdrainwiz.com/login', external: true },
]

// Enhanced mobile navigation structure
const mobileNavigationSections = {
  shop: {
    title: 'Products',
    icon: ShoppingBagIcon,
    items: [
      { name: 'All Products', href: '/products', icon: ShoppingBagIcon },
      { name: 'AC Drain Wiz Mini', href: '/products/mini', icon: WrenchScrewdriverIcon },
      { name: 'AC Drain Wiz Sensor', href: '/products/sensor', icon: CpuChipIcon },
      { name: 'Mini + Sensor Bundle', href: '/products?product=mini&product=sensor', icon: SparklesIcon },
      { name: 'For Homeowners', href: '/homeowner', icon: HomeIcon },
      { name: 'Special Offers', href: '/promo', icon: RocketLaunchIcon },
    ]
  },
  support: {
    title: 'Support',
    icon: QuestionMarkCircleIcon,
    items: [
      { name: 'Get Help', href: '/support', icon: QuestionMarkCircleIcon },
      { name: 'Installation Guide', href: '/support/installation-scenarios', icon: DocumentTextIcon },
      { name: 'Sensor Setup', href: '/sensor-setup', icon: CpuChipIcon },
      { name: 'Warranty & Returns', href: '/support/warranty-returns', icon: CreditCardIcon },
      { name: 'Product Support', href: '/support/product-support', icon: WrenchScrewdriverIcon },
    ]
  }
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [shopExpanded, setShopExpanded] = useState(false)
  const [supportExpanded, setSupportExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const { getCartCount } = useCart()
  const cartCount = getCartCount()
  const location = useLocation()
  const navigate = useNavigate()

  // Build navigation array with Dashboard first when authenticated
  const navigation = isAuthenticated
    ? [
        { name: 'Dashboard', href: '/dashboard' },
        ...baseNavigation,
      ]
    : baseNavigation

  // Check if a navigation item is active
  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    if (href === '/dashboard') {
      return location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/business/pro')
    }
    return location.pathname.startsWith(href)
  }

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setMobileMenuOpen(false)
      setSearchQuery('')
    }
  }

  // Close mobile menu when route changes
  const handleMobileNavClick = () => {
    setMobileMenuOpen(false)
    setShopExpanded(false)
    setSupportExpanded(false)
  }

  return (
    <header className="header-main-container">
      <nav className="header-navigation-wrapper" aria-label="Top">
        <div className="header-content-layout">
          {/* Logo */}
          <div className="header-logo-section">
            <Link 
              to={isAuthenticated ? "/dashboard" : "/"} 
              className="header-logo-link"
            >
              <img 
                src="/images/ac-drain-wiz-logo.png" 
                alt="AC Drain Wiz Logo" 
                className="header-logo-image"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="header-desktop-navigation">
            {navigation.map((item) => (
              item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header-nav-link"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`header-nav-link ${isActive(item.href) ? 'active' : ''}`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* Right side actions */}
          <div className="header-actions-section">
            {/* Cart - visible on all screen sizes */}
            <button 
              className="header-cart-button"
              onClick={() => navigate('/cart')}
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingCartIcon className="header-cart-icon" />
              {cartCount > 0 && (
                <span className="header-cart-badge">{cartCount}</span>
              )}
            </button>
            
            {/* User menu / auth icon */}
            <div className="header-user-menu-container">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="header-user-menu-button header-user-icon-button"
              >
                <UserCircleIcon className="header-user-icon" />
                {isAuthenticated && <span className="header-user-name">{user?.name}</span>}
              </button>

              {userMenuOpen && (
                isAuthenticated ? (
                  <div className="header-user-dropdown">
                    <Link
                      to="/dashboard"
                      className="header-user-dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      className="header-user-dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Edit Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setUserMenuOpen(false)
                      }}
                      className="header-user-dropdown-item"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="header-guest-menu-backdrop"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    
                    <div className="header-guest-menu" role="menu">
                      {/* Header with close button */}
                      <div className="header-guest-menu-header">
                        <h3 className="header-guest-menu-title">AC Drain Wiz Account</h3>
                        <button
                          onClick={() => setUserMenuOpen(false)}
                          className="header-guest-menu-close"
                          aria-label="Close menu"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>

                      {/* Centered content wrapper */}
                      <div className="header-guest-menu-content">
                        {/* Logo */}
                        <div className="header-guest-menu-logo">
                          <img src="/images/ac-drain-wiz-logo.png" alt="AC Drain Wiz" className="header-guest-menu-logo-img" />
                        </div>

                        {/* Main heading */}
                        <h2 className="header-guest-menu-heading">
                          Access Your Account
                        </h2>

                        {/* Subheading */}
                        <p className="header-guest-menu-subheading">
                          With an AC Drain Wiz account, you can
                        </p>

                        {/* Benefits list */}
                        <div className="header-guest-menu-benefits">
                          <div className="header-guest-menu-benefit-item">
                            <ShoppingBagIcon className="header-guest-menu-benefit-icon" />
                            <span>Order AC Drain Wiz Mini online</span>
                          </div>
                          <div className="header-guest-menu-benefit-item">
                            <BellIcon className="header-guest-menu-benefit-icon" />
                            <span>Track your orders and shipments</span>
                          </div>
                          <div className="header-guest-menu-benefit-item">
                            <ShieldCheckIcon className="header-guest-menu-benefit-icon" />
                            <span>Access support and warranty information</span>
                          </div>
                        </div>

                        {/* Primary CTA */}
                        <Link
                          to="/auth/signin"
                          className="header-guest-menu-cta-primary"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Sign in or create account
                        </Link>

                        {/* Secondary link */}
                        <Link
                          to="/contact?type=sales"
                          className="header-guest-menu-cta-secondary"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Contact sales for contractor pricing
                        </Link>
                      </div>
                    </div>
                  </>
                )
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="header-mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="header-mobile-menu-icon" />
              ) : (
                <Bars3Icon className="header-mobile-menu-icon" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu - Slide-over panel */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="header-mobile-menu-backdrop"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            
            {/* Slide-over panel */}
            <div 
              className="header-mobile-menu-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              {/* Header with logo and close button */}
              <div className="header-mobile-menu-header">
                <Link 
                  to={isAuthenticated ? "/dashboard" : "/"} 
                  className="header-mobile-menu-logo" 
                  onClick={handleMobileNavClick}
                  aria-label="Go to home page"
                >
                  <img 
                    src="/images/ac-drain-wiz-logo.png" 
                    alt="AC Drain Wiz Logo" 
                    className="header-mobile-menu-logo-image"
                  />
                </Link>
                <button
                  type="button"
                  className="header-mobile-menu-close"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <XMarkIcon className="header-mobile-menu-close-icon" aria-hidden="true" />
                </button>
              </div>
              
              {/* Navigation content */}
              <div className="header-mobile-menu-content">
                {/* Search bar */}
                <div className="header-mobile-search-container">
                  <form onSubmit={handleSearch} role="search">
                    <div className={`header-mobile-search-wrapper ${searchFocused ? 'focused' : ''}`}>
                      <MagnifyingGlassIcon className="header-mobile-search-icon" aria-hidden="true" />
                      <input
                        type="search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        className="header-mobile-search-input"
                        aria-label="Search products"
                      />
                    </div>
                  </form>
                </div>

                <nav className="header-mobile-nav" aria-label="Main navigation">
                  {/* Home Link (if not authenticated) */}
                  {!isAuthenticated && (
                    <Link
                      to="/"
                      className={`header-mobile-nav-item ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
                      onClick={handleMobileNavClick}
                    >
                      <HomeIcon className="header-mobile-nav-icon" aria-hidden="true" />
                      <span>Home</span>
                    </Link>
                  )}

                  {/* Dashboard Link (if authenticated) */}
                  {isAuthenticated && (
                    <Link
                      to="/dashboard"
                      className={`header-mobile-nav-item ${isActive('/dashboard') ? 'active' : ''}`}
                      onClick={handleMobileNavClick}
                    >
                      <ChartBarSquareIcon className="header-mobile-nav-icon" aria-hidden="true" />
                      <span>Dashboard</span>
                    </Link>
                  )}

                  {/* Expandable Products Section */}
                  <div className="header-mobile-nav-section">
                    <button
                      onClick={() => setShopExpanded(!shopExpanded)}
                      className="header-mobile-nav-section-button"
                      aria-expanded={shopExpanded}
                      aria-controls="shop-menu"
                    >
                      <div className="header-mobile-nav-section-title">
                        <ShoppingBagIcon className="header-mobile-nav-icon" aria-hidden="true" />
                        <span>Products</span>
                      </div>
                      {shopExpanded ? (
                        <ChevronUpIcon className="header-mobile-nav-chevron" aria-hidden="true" />
                      ) : (
                        <ChevronDownIcon className="header-mobile-nav-chevron" aria-hidden="true" />
                      )}
                    </button>
                    
                    {shopExpanded && (
                      <div className="header-mobile-nav-submenu" id="shop-menu">
                        {mobileNavigationSections.shop.items.map((item) => {
                          const Icon = item.icon
                          return (
                            <Link
                              key={item.name}
                              to={item.href}
                              className={`header-mobile-nav-subitem ${isActive(item.href) ? 'active' : ''}`}
                              onClick={handleMobileNavClick}
                            >
                              <Icon className="header-mobile-nav-subicon" aria-hidden="true" />
                              <span>{item.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Expandable Support Section */}
                  <div className="header-mobile-nav-section">
                    <button
                      onClick={() => setSupportExpanded(!supportExpanded)}
                      className="header-mobile-nav-section-button"
                      aria-expanded={supportExpanded}
                      aria-controls="support-menu"
                    >
                      <div className="header-mobile-nav-section-title">
                        <QuestionMarkCircleIcon className="header-mobile-nav-icon" aria-hidden="true" />
                        <span>Support</span>
                      </div>
                      {supportExpanded ? (
                        <ChevronUpIcon className="header-mobile-nav-chevron" aria-hidden="true" />
                      ) : (
                        <ChevronDownIcon className="header-mobile-nav-chevron" aria-hidden="true" />
                      )}
                    </button>
                    
                    {supportExpanded && (
                      <div className="header-mobile-nav-submenu" id="support-menu">
                        {mobileNavigationSections.support.items.map((item) => {
                          const Icon = item.icon
                          return (
                            <Link
                              key={item.name}
                              to={item.href}
                              className={`header-mobile-nav-subitem ${isActive(item.href) ? 'active' : ''}`}
                              onClick={handleMobileNavClick}
                            >
                              <Icon className="header-mobile-nav-subicon" aria-hidden="true" />
                              <span>{item.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* About Link */}
                  <Link
                    to="/about"
                    className={`header-mobile-nav-item ${isActive('/about') ? 'active' : ''}`}
                    onClick={handleMobileNavClick}
                  >
                    <UserGroupIcon className="header-mobile-nav-icon" aria-hidden="true" />
                    <span>About</span>
                  </Link>

                  {/* Contact Link */}
                  <Link
                    to="/contact"
                    className={`header-mobile-nav-item ${isActive('/contact') ? 'active' : ''}`}
                    onClick={handleMobileNavClick}
                  >
                    <EnvelopeIcon className="header-mobile-nav-icon" aria-hidden="true" />
                    <span>Contact</span>
                  </Link>

                  {/* Sensor Monitoring - External Link */}
                  <a
                    href="https://monitor.acdrainwiz.com/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="header-mobile-nav-item header-mobile-nav-item-external"
                    onClick={handleMobileNavClick}
                  >
                    <ChartBarSquareIcon className="header-mobile-nav-icon" aria-hidden="true" />
                    <span>Sensor Monitoring</span>
                    <svg className="header-mobile-nav-external-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </nav>
                
                {/* Auth section at bottom */}
                <div className="header-mobile-auth-section">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard/profile"
                        className="header-mobile-auth-button-secondary"
                        onClick={handleMobileNavClick}
                      >
                        <UserCircleIcon className="header-mobile-auth-icon" aria-hidden="true" />
                        Edit Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setMobileMenuOpen(false)
                        }}
                        className="header-mobile-signout-button"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth/signin"
                        className="header-mobile-auth-button-secondary"
                        onClick={handleMobileNavClick}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/auth/signup"
                        className="header-mobile-auth-button-primary"
                        onClick={handleMobileNavClick}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  )
}
