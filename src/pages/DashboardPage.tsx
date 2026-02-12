import { useNavigate } from 'react-router-dom'
import { 
  ShoppingCartIcon, 
  CubeIcon, 
  PresentationChartLineIcon,
  ArrowRightIcon,
  ChartBarIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { maskLicenseNumber, maskEIN } from '../utils/verification'
import { US_STATES } from '../config/usStates'

function DashboardContent() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  // TODO: Replace with actual order data from API/Stripe
  // Set to true to show sample order, false to show empty state
  const HAS_ORDERS = false // Change to true when ready to show orders
  
  // TODO: Replace with actual product data from orders/inventory
  // Set to true to show purchased products, false to show empty state
  const HAS_PRODUCTS = false // Change to true when ready to show products

  return (
    <div className="dashboard-page-container">
      <div className="dashboard-content-wrapper">
        <div className="dashboard-main-content">
          {/* Header */}
          <div className="dashboard-header-card">
            <div className="dashboard-header-content">
              <div className="dashboard-welcome-section">
                <h1 className="dashboard-welcome-title">
                  Welcome back, {user?.name}!
                </h1>
                <p className="dashboard-welcome-subtitle">
                  {user?.role.replace('_', ' ')} Account
                </p>
              </div>
              <button
                onClick={logout}
                className="dashboard-signout-button"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Quick Actions - Only for non-homeowners */}
          {user?.role !== 'homeowner' && (
            <div className="dashboard-quick-actions-card">
              <h2 className="dashboard-card-title">Quick Actions</h2>
              <div className="dashboard-quick-actions">
                <button 
                  onClick={() => navigate('/contact?type=sales')}
                  className="dashboard-action-button-primary"
                >
                  <ShoppingCartIcon className="dashboard-action-button-icon" />
                  View Products & Pricing
                  <ArrowRightIcon className="dashboard-action-button-arrow" />
                </button>
                <button 
                  onClick={() => navigate('/contact?type=sales')}
                  className="dashboard-action-button-secondary"
                >
                  <CubeIcon className="dashboard-action-button-icon" />
                  Bulk Order Inquiry
                  <ArrowRightIcon className="dashboard-action-button-arrow" />
                </button>
                <button 
                  onClick={() => navigate('/contact?type=demo-request')}
                  className="dashboard-action-button-secondary"
                >
                  <PresentationChartLineIcon className="dashboard-action-button-icon" />
                  Request Demo
                  <ArrowRightIcon className="dashboard-action-button-arrow" />
                </button>
              </div>
            </div>
          )}

          {/* Dashboard Content - Role-Specific */}
          {user?.role === 'homeowner' ? (
            <>
              {/* My Products Section */}
              <div className="dashboard-card">
                <h2 className="dashboard-card-title">My Products</h2>
                <div className="dashboard-homeowner-product">
                  <div className="dashboard-homeowner-product-header">
                    <div className="dashboard-homeowner-product-info">
                      <h3 className="dashboard-homeowner-product-name">AC Drain Wiz Mini</h3>
                      <div className="dashboard-homeowner-product-details">
                        <span className="dashboard-homeowner-product-detail">
                          <ShieldCheckIcon className="dashboard-homeowner-product-detail-icon" />
                          Status: <strong>Active</strong>
                        </span>
                        <span className="dashboard-homeowner-product-detail">
                          <ClockIcon className="dashboard-homeowner-product-detail-icon" />
                          Warranty: <strong>Valid until 2027</strong>
                        </span>
                      </div>
                    </div>
                    <div className="dashboard-homeowner-product-actions">
                      <button
                        onClick={() => navigate('/dashboard/profile')}
                        className="dashboard-homeowner-product-button-secondary"
                      >
                        Register Product
                      </button>
                      <button
                        onClick={() => navigate('/products?product=mini')}
                        className="dashboard-homeowner-product-button-primary"
                      >
                        Buy Another
                      </button>
                    </div>
                  </div>
                  <div className="dashboard-homeowner-product-footer">
                    <button
                      onClick={() => navigate('/contact?type=support')}
                      className="dashboard-homeowner-product-link"
                    >
                      Get Support
                    </button>
                    <span className="dashboard-homeowner-product-separator">•</span>
                    <button
                      onClick={() => navigate('/support')}
                      className="dashboard-homeowner-product-link"
                    >
                      View Documentation
                    </button>
                  </div>
                </div>
              </div>

              {/* Order History Section */}
              <div className="dashboard-card">
                <h2 className="dashboard-card-title">Order History</h2>
                <div className="dashboard-order-history">
                  {HAS_ORDERS ? (
                    <>
                      {/* Order Item - Populated State */}
                      <div className="dashboard-order-item">
                        <div className="dashboard-order-header">
                          <div className="dashboard-order-info">
                            <span className="dashboard-order-number">Order #12345</span>
                            <span className="dashboard-order-date">January 15, 2025</span>
                          </div>
                          <div className="dashboard-order-status">
                            <CheckCircleIcon className="dashboard-order-status-icon" />
                            <span>Delivered</span>
                          </div>
                        </div>
                        <div className="dashboard-order-details">
                          <span className="dashboard-order-product">AC Drain Wiz Mini × 1</span>
                          <div className="dashboard-order-actions">
                            <button
                              onClick={() => navigate('/products?product=mini')}
                              className="dashboard-order-action-link"
                            >
                              View Product
                            </button>
                            <span className="dashboard-order-separator">•</span>
                            <button
                              onClick={() => {}}
                              className="dashboard-order-action-link"
                            >
                              Download Invoice
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* Additional orders can be added here */}
                    </>
                  ) : (
                    /* Empty State - No Orders Yet */
                    <div className="dashboard-order-empty-state">
                      <div className="dashboard-order-empty-icon-wrapper">
                        <ShoppingCartIcon className="dashboard-order-empty-icon" />
                      </div>
                      <h3 className="dashboard-order-empty-title">No orders yet</h3>
                      <p className="dashboard-order-empty-description">
                        When you make your first purchase, your order history will appear here. 
                        You'll be able to track orders, download invoices, and reorder products.
                      </p>
                      <button
                        onClick={() => navigate('/products?product=mini')}
                        className="dashboard-order-empty-cta"
                      >
                        <ShoppingCartIcon className="dashboard-order-empty-cta-icon" />
                        Purchase Your First AC Drain Wiz Mini
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Resources & Support Section */}
              <div className="dashboard-card">
                <h2 className="dashboard-card-title">Resources & Support</h2>
                <div className="dashboard-resources-grid">
                  <button
                    onClick={() => navigate('/support')}
                    className="dashboard-resource-card"
                  >
                    <DocumentTextIcon className="dashboard-resource-icon" />
                    <h3 className="dashboard-resource-title">Installation Guide</h3>
                    <p className="dashboard-resource-description">Step-by-step installation instructions</p>
                  </button>
                  <button
                    onClick={() => navigate('/support')}
                    className="dashboard-resource-card"
                  >
                    <ClipboardDocumentCheckIcon className="dashboard-resource-icon" />
                    <h3 className="dashboard-resource-title">Maintenance Tips</h3>
                    <p className="dashboard-resource-description">Keep your AC Drain Wiz working perfectly</p>
                  </button>
                  <button
                    onClick={() => navigate('/contact?type=support')}
                    className="dashboard-resource-card"
                  >
                    <QuestionMarkCircleIcon className="dashboard-resource-icon" />
                    <h3 className="dashboard-resource-title">Troubleshooting</h3>
                    <p className="dashboard-resource-description">Common issues and solutions</p>
                  </button>
                  <button
                    onClick={() => navigate('/support')}
                    className="dashboard-resource-card"
                  >
                    <ShieldCheckIcon className="dashboard-resource-icon" />
                    <h3 className="dashboard-resource-title">Warranty Information</h3>
                    <p className="dashboard-resource-description">View warranty details and coverage</p>
                  </button>
                </div>
                <div className="dashboard-resources-actions">
                  <button
                    onClick={() => navigate('/contact?type=support')}
                    className="dashboard-resources-support-button"
                  >
                    <QuestionMarkCircleIcon className="dashboard-resources-support-icon" />
                    Submit Support Request
                  </button>
                </div>
              </div>

              {/* Account Information */}
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h2 className="dashboard-card-title">Account Information</h2>
                  <button
                    onClick={() => navigate('/dashboard/profile')}
                    className="dashboard-edit-profile-link"
                  >
                    Edit Profile
                  </button>
                </div>
                <div className="dashboard-account-info">
                  <div className="dashboard-account-item">
                    <span className="dashboard-account-label">Name:</span>
                    <span className="dashboard-account-value">{user?.name || 'Not set'}</span>
                  </div>
                  <div className="dashboard-account-item">
                    <span className="dashboard-account-label">Email:</span>
                    <span className="dashboard-account-value">{user?.email}</span>
                  </div>
                  <div className="dashboard-account-item">
                    <span className="dashboard-account-label">Role:</span>
                    <span className="dashboard-account-value">{user?.role.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="dashboard-cards-grid">
              {/* Account Info */}
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h2 className="dashboard-card-title">Account Information</h2>
                  <button
                    onClick={() => navigate('/dashboard/profile')}
                    className="dashboard-edit-profile-link"
                  >
                    Edit Profile
                  </button>
                </div>
                <div className="dashboard-account-info">
                  <div className="dashboard-account-item">
                    <span className="dashboard-account-label">Name:</span>
                    <span className="dashboard-account-value">{user?.name || 'Not set'}</span>
                  </div>
                  <div className="dashboard-account-item">
                    <span className="dashboard-account-label">Email:</span>
                    <span className="dashboard-account-value">{user?.email}</span>
                  </div>
                  {user?.company && (
                    <div className="dashboard-account-item">
                      <span className="dashboard-account-label">Company:</span>
                      <span className="dashboard-account-value">{user.company}</span>
                    </div>
                  )}
                  <div className="dashboard-account-item">
                    <span className="dashboard-account-label">Role:</span>
                    <span className="dashboard-account-value">{user?.role.replace('_', ' ')}</span>
                  </div>
                  
                  {/* HVAC Pro Verification Info */}
                  {user?.role === 'hvac_pro' && user?.verification && (
                    <>
                      {user.verification.state && (
                        <div className="dashboard-account-item">
                          <span className="dashboard-account-label">License State:</span>
                          <span className="dashboard-account-value">
                            {US_STATES.find(s => s.code === user.verification?.state)?.name || user.verification.state}
                          </span>
                        </div>
                      )}
                      {user.verification.licenseNumber && (
                        <div className="dashboard-account-item">
                          <span className="dashboard-account-label">License Number:</span>
                          <span className="dashboard-account-value">
                            {maskLicenseNumber(user.verification.licenseNumber)}
                          </span>
                        </div>
                      )}
                      {user.verification.status && (
                        <div className="dashboard-account-item">
                          <span className="dashboard-account-label">Verification Status:</span>
                          <span className={`dashboard-account-value ${
                            user.verification.status === 'verified' ? 'text-green-600' :
                            user.verification.status === 'pending_verification' ? 'text-yellow-600' :
                            user.verification.status === 'rejected' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {user.verification.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Property Manager Verification Info */}
                  {user?.role === 'property_manager' && user?.verification && (
                    <>
                      {user.verification.businessTaxId && (
                        <div className="dashboard-account-item">
                          <span className="dashboard-account-label">Business Tax ID (EIN):</span>
                          <span className="dashboard-account-value">
                            {maskEIN(user.verification.businessTaxId)}
                          </span>
                        </div>
                      )}
                      {user.verification.status && (
                        <div className="dashboard-account-item">
                          <span className="dashboard-account-label">Verification Status:</span>
                          <span className={`dashboard-account-value ${
                            user.verification.status === 'verified' ? 'text-green-600' :
                            user.verification.status === 'pending_verification' ? 'text-yellow-600' :
                            user.verification.status === 'rejected' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {user.verification.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="dashboard-card">
                <h2 className="dashboard-card-title">Recent Activity</h2>
                <div className="dashboard-activity-content">
                  <p className="dashboard-activity-empty">No recent activity</p>
                  <p className="dashboard-activity-message">Start by exploring our products!</p>
                </div>
              </div>
            </div>
          )}

          {/* Property Manager - My Products Section */}
          {user?.role === 'property_manager' && (
            <div className="dashboard-card dashboard-card-my-products">
              <h2 className="dashboard-card-title">My Products</h2>
              {HAS_PRODUCTS ? (
                /* Post-Purchase State - Products Purchased */
                <div className="dashboard-pro-products-list">
                  <div className="dashboard-pro-product-item">
                    <div className="dashboard-pro-product-header">
                      <div className="dashboard-pro-product-info">
                        <h3 className="dashboard-pro-product-name">AC Drain Wiz Mini</h3>
                        <div className="dashboard-pro-product-details">
                          <span className="dashboard-pro-product-detail">
                            <ShieldCheckIcon className="dashboard-pro-product-detail-icon" />
                            Quantity: <strong>50 units</strong>
                          </span>
                          <span className="dashboard-pro-product-detail">
                            <ClockIcon className="dashboard-pro-product-detail-icon" />
                            Last Order: <strong>Jan 15, 2025</strong>
                          </span>
                        </div>
                      </div>
                      <div className="dashboard-pro-product-actions">
                        <button
                          onClick={() => navigate('/contact?type=sales')}
                          className="dashboard-pro-product-button-primary"
                        >
                          Reorder
                        </button>
                      </div>
                    </div>
                    <div className="dashboard-pro-product-footer">
                      <button
                        onClick={() => navigate('/contact?type=support')}
                        className="dashboard-pro-product-link"
                      >
                        Get Support
                      </button>
                      <span className="dashboard-pro-product-separator">•</span>
                      <button
                        onClick={() => navigate('/support')}
                        className="dashboard-pro-product-link"
                      >
                        View Documentation
                      </button>
                    </div>
                  </div>

                  <div className="dashboard-pro-product-item">
                    <div className="dashboard-pro-product-header">
                      <div className="dashboard-pro-product-info">
                        <h3 className="dashboard-pro-product-name">AC Drain Wiz Sensor</h3>
                        <div className="dashboard-pro-product-details">
                          <span className="dashboard-pro-product-detail">
                            <ShieldCheckIcon className="dashboard-pro-product-detail-icon" />
                            Quantity: <strong>25 units</strong>
                          </span>
                          <span className="dashboard-pro-product-detail">
                            <ClockIcon className="dashboard-pro-product-detail-icon" />
                            Last Order: <strong>Jan 10, 2025</strong>
                          </span>
                        </div>
                      </div>
                      <div className="dashboard-pro-product-actions">
                        <button
                          onClick={() => navigate('/contact?type=sales')}
                          className="dashboard-pro-product-button-primary"
                        >
                          Reorder
                        </button>
                      </div>
                    </div>
                    <div className="dashboard-pro-product-footer">
                      <button
                        onClick={() => navigate('/contact?type=support')}
                        className="dashboard-pro-product-link"
                      >
                        Get Support
                      </button>
                      <span className="dashboard-pro-product-separator">•</span>
                      <button
                        onClick={() => navigate('/support')}
                        className="dashboard-pro-product-link"
                      >
                        View Documentation
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Pre-Purchase State - No Products Yet */
                <div className="dashboard-pro-products-empty">
                  <div className="dashboard-pro-products-empty-icon-wrapper">
                    <CubeIcon className="dashboard-pro-products-empty-icon" />
                  </div>
                  <h3 className="dashboard-pro-products-empty-title">No products purchased yet</h3>
                  <p className="dashboard-pro-products-empty-description">
                    Start building your inventory with AC Drain Wiz products. Access property manager pricing, 
                    volume discounts, and bulk ordering options.
                  </p>
                  <button
                    onClick={() => navigate('/contact?type=sales')}
                    className="dashboard-pro-products-empty-cta"
                  >
                    <ShoppingCartIcon className="dashboard-pro-products-empty-cta-icon" />
                    View Products & Pricing
                  </button>
                </div>
              )}
            </div>
          )}

          {/* HVAC Pro - My Products Section */}
          {user?.role === 'hvac_pro' && (
            <div className="dashboard-card dashboard-card-my-products">
              <h2 className="dashboard-card-title">My Products</h2>
              {HAS_PRODUCTS ? (
                /* Post-Purchase State - Products Purchased */
                <div className="dashboard-pro-products-list">
                  <div className="dashboard-pro-product-item">
                    <div className="dashboard-pro-product-header">
                      <div className="dashboard-pro-product-info">
                        <h3 className="dashboard-pro-product-name">AC Drain Wiz Mini</h3>
                        <div className="dashboard-pro-product-details">
                          <span className="dashboard-pro-product-detail">
                            <ShieldCheckIcon className="dashboard-pro-product-detail-icon" />
                            Quantity: <strong>25 units</strong>
                          </span>
                          <span className="dashboard-pro-product-detail">
                            <ClockIcon className="dashboard-pro-product-detail-icon" />
                            Last Order: <strong>Jan 15, 2025</strong>
                          </span>
                        </div>
                      </div>
                      <div className="dashboard-pro-product-actions">
                        <button
                          onClick={() => navigate('/contact?type=sales')}
                          className="dashboard-pro-product-button-primary"
                        >
                          Reorder
                        </button>
                      </div>
                    </div>
                    <div className="dashboard-pro-product-footer">
                      <button
                        onClick={() => navigate('/contact?type=support')}
                        className="dashboard-pro-product-link"
                      >
                        Get Support
                      </button>
                      <span className="dashboard-pro-product-separator">•</span>
                      <button
                        onClick={() => navigate('/support')}
                        className="dashboard-pro-product-link"
                      >
                        View Documentation
                      </button>
                    </div>
                  </div>

                  <div className="dashboard-pro-product-item">
                    <div className="dashboard-pro-product-header">
                      <div className="dashboard-pro-product-info">
                        <h3 className="dashboard-pro-product-name">AC Drain Wiz Sensor</h3>
                        <div className="dashboard-pro-product-details">
                          <span className="dashboard-pro-product-detail">
                            <ShieldCheckIcon className="dashboard-pro-product-detail-icon" />
                            Quantity: <strong>10 units</strong>
                          </span>
                          <span className="dashboard-pro-product-detail">
                            <ClockIcon className="dashboard-pro-product-detail-icon" />
                            Last Order: <strong>Jan 10, 2025</strong>
                          </span>
                        </div>
                      </div>
                      <div className="dashboard-pro-product-actions">
                        <button
                          onClick={() => navigate('/contact?type=sales')}
                          className="dashboard-pro-product-button-primary"
                        >
                          Reorder
                        </button>
                      </div>
                    </div>
                    <div className="dashboard-pro-product-footer">
                      <button
                        onClick={() => navigate('/contact?type=support')}
                        className="dashboard-pro-product-link"
                      >
                        Get Support
                      </button>
                      <span className="dashboard-pro-product-separator">•</span>
                      <button
                        onClick={() => navigate('/support')}
                        className="dashboard-pro-product-link"
                      >
                        View Documentation
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Pre-Purchase State - No Products Yet */
                <div className="dashboard-pro-products-empty">
                  <div className="dashboard-pro-products-empty-icon-wrapper">
                    <CubeIcon className="dashboard-pro-products-empty-icon" />
                  </div>
                  <h3 className="dashboard-pro-products-empty-title">No products purchased yet</h3>
                  <p className="dashboard-pro-products-empty-description">
                    Start building your inventory with AC Drain Wiz products. Access professional pricing, 
                    bulk discounts, and fast shipping. Your purchased products will appear here for easy 
                    reordering and support access.
                  </p>
                  <button
                    onClick={() => navigate('/contact?type=sales')}
                    className="dashboard-pro-products-empty-cta"
                  >
                    <ShoppingCartIcon className="dashboard-pro-products-empty-cta-icon" />
                    View Professional Catalog & Pricing
                  </button>
                  <div className="dashboard-pro-products-empty-benefits">
                    <div className="dashboard-pro-products-empty-benefit">
                      <CheckCircleIcon className="dashboard-pro-products-empty-benefit-icon" />
                      <span>Professional pricing with quantity discounts</span>
                    </div>
                    <div className="dashboard-pro-products-empty-benefit">
                      <CheckCircleIcon className="dashboard-pro-products-empty-benefit-icon" />
                      <span>Fast shipping on bulk orders</span>
                    </div>
                    <div className="dashboard-pro-products-empty-benefit">
                      <CheckCircleIcon className="dashboard-pro-products-empty-benefit-icon" />
                      <span>Priority technical support</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Professional Features */}
          {user?.role === 'hvac_pro' && (
            <div className="dashboard-professional-features">
              <h2 className="dashboard-professional-title">Professional Features</h2>
              <div className="dashboard-professional-grid">
                <div className="dashboard-professional-feature">
                  <div className="dashboard-professional-feature-icon-wrapper">
                    <ChartBarIcon className="dashboard-professional-feature-icon" />
                  </div>
                  <h3 className="dashboard-professional-feature-title">Bulk Pricing</h3>
                  <p className="dashboard-professional-feature-description">Access professional pricing for large orders</p>
                  <button 
                    onClick={() => navigate('/contact?type=sales')}
                    className="dashboard-professional-feature-link"
                  >
                    View Pricing
                    <ArrowRightIcon className="dashboard-professional-feature-link-icon" />
                  </button>
                </div>
                <div className="dashboard-professional-feature">
                  <div className="dashboard-professional-feature-icon-wrapper">
                    <WrenchScrewdriverIcon className="dashboard-professional-feature-icon" />
                  </div>
                  <h3 className="dashboard-professional-feature-title">Technical Support</h3>
                  <p className="dashboard-professional-feature-description">Get priority support for installation and troubleshooting</p>
                  <button 
                    onClick={() => navigate('/contact?type=support')}
                    className="dashboard-professional-feature-link"
                  >
                    Contact Support
                    <ArrowRightIcon className="dashboard-professional-feature-link-icon" />
                  </button>
                </div>
                <div className="dashboard-professional-feature">
                  <div className="dashboard-professional-feature-icon-wrapper">
                    <BookOpenIcon className="dashboard-professional-feature-icon" />
                  </div>
                  <h3 className="dashboard-professional-feature-title">Installation Guides</h3>
                  <p className="dashboard-professional-feature-description">Download detailed installation and maintenance guides</p>
                  <button 
                    onClick={() => navigate('/support')}
                    className="dashboard-professional-feature-link"
                  >
                    View Guides
                    <ArrowRightIcon className="dashboard-professional-feature-link-icon" />
                  </button>
                </div>
                <div className="dashboard-professional-feature">
                  <div className="dashboard-professional-feature-icon-wrapper">
                    <ShieldCheckIcon className="dashboard-professional-feature-icon" />
                  </div>
                  <h3 className="dashboard-professional-feature-title">ICC Compliance</h3>
                  <p className="dashboard-professional-feature-description">Access code compliance documentation</p>
                  <button 
                    onClick={() => navigate('/compliance')}
                    className="dashboard-professional-feature-link"
                  >
                    View Compliance
                    <ArrowRightIcon className="dashboard-professional-feature-link-icon" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
