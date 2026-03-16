import { Link } from 'react-router-dom'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  HomeIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline'

export function RecommendedInstallationScenariosPage() {
  return (
    <div className="support-installation-scenarios-container">

      {/* Hero Banner */}
      <div className="support-hero">
        <div className="support-hero-content">
          <div className="support-hero-header">
            <div className="support-hero-breadcrumb">
              <Link to="/support" className="support-hero-breadcrumb-link">
                Support Center
              </Link>
              <span className="support-hero-breadcrumb-separator">/</span>
              <Link to="/support/installation-setup" className="support-hero-breadcrumb-link">
                Installation & Setup
              </Link>
              <span className="support-hero-breadcrumb-separator">/</span>
              <span className="support-hero-breadcrumb-current">Installation Scenarios</span>
            </div>
            <h1 className="support-hero-title">Recommended Installation Scenarios</h1>
            <p className="support-hero-subtitle">
              Learn about different installation configurations for AC Drain Wiz products and when to use each approach for optimal protection.
            </p>
            <div className="support-hero-badge-row">
              <span className="support-hero-badge">Standard Setup</span>
              <span className="support-hero-badge">Best Practice</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        {/* Introduction */}
        <div className="support-installation-scenarios-intro">
          <p className="support-installation-scenarios-intro-text">
            AC units typically have two side drain ports. Understanding how to configure AC Drain Wiz units 
            for these ports is crucial for effective water damage prevention. The configuration you choose 
            depends on your specific installation location and risk factors.
          </p>
        </div>

        {/* Scenario 1: Standard Installation */}
        <div className="support-installation-scenario-card support-installation-scenario-card-standard">
          <div className="support-installation-scenario-header">
            <div className="support-installation-scenario-header-content">
              <div className="support-installation-scenario-badge support-installation-scenario-badge-standard">
                <CheckCircleIcon className="support-installation-scenario-badge-icon" />
                <span>Scenario 1: Standard / Acceptable Installation</span>
              </div>
              <h2 className="support-installation-scenario-title">Good</h2>
            </div>
          </div>

          <div className="support-installation-scenario-content">
            {/* Image Section */}
            <div className="support-installation-scenario-image-wrapper">
              <img
                src="/images/installation/scenario-1-standard.png"
                alt="Standard installation with one AC Drain Wiz unit on primary drain port, second port capped"
                className="support-installation-scenario-image"
              />
            </div>

            {/* Description */}
            <div className="support-installation-scenario-description">
              <h3 className="support-installation-scenario-description-title">Installation Details</h3>
              <ul className="support-installation-scenario-list">
                <li className="support-installation-scenario-list-item">
                  The AC unit has two side drain ports
                </li>
                <li className="support-installation-scenario-list-item">
                  One port has the condensate drain line connected, with one AC Drain Wiz unit installed inline
                </li>
                <li className="support-installation-scenario-list-item">
                  The second port is capped
                </li>
              </ul>
              <div className="support-installation-scenario-note">
                <p className="support-installation-scenario-note-text">
                  This setup works and is acceptable, but it is not the best-practice option.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scenario 2: Best Practice Installation */}
        <div className="support-installation-scenario-card support-installation-scenario-card-recommended">
          <div className="support-installation-scenario-header">
            <div className="support-installation-scenario-header-content">
              <div className="support-installation-scenario-badge support-installation-scenario-badge-recommended">
                <CheckCircleIcon className="support-installation-scenario-badge-icon" />
                <span>Scenario 2: Best Practice Installation</span>
              </div>
              <h2 className="support-installation-scenario-title">Recommended for High-Risk Areas</h2>
            </div>
          </div>

          <div className="support-installation-scenario-content">
            {/* Image Section */}
            <div className="support-installation-scenario-image-wrapper">
              <img
                src="/images/installation/scenario-2-best-practice.png"
                alt="Best practice installation with two AC Drain Wiz units, one on each drain port"
                className="support-installation-scenario-image"
              />
            </div>

            {/* Description */}
            <div className="support-installation-scenario-description">
              <h3 className="support-installation-scenario-description-title">Installation Details</h3>
              <ul className="support-installation-scenario-list">
                <li className="support-installation-scenario-list-item">
                  The AC unit again has two side drain ports
                </li>
                <li className="support-installation-scenario-list-item">
                  Two AC Drain Wiz units are installed, one on each drain port
                </li>
                <li className="support-installation-scenario-list-item">
                  Each port has its own protection point
                </li>
              </ul>

              {/* Why This Is Best Practice */}
              <div className="support-installation-scenario-best-practice">
                <h4 className="support-installation-scenario-best-practice-title">Why This Is Best Practice</h4>
                <p className="support-installation-scenario-best-practice-text">
                  If debris, algae, sludge, or buildup blocks the drain at the entrance of the AC unit—before 
                  the primary drain line and sensor—having two Drain Wiz units allows detection in more than 
                  one location. This provides earlier and more reliable protection against backups.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* When to Use Each Configuration */}
        <div className="support-installation-scenarios-recommendations">
          <h2 className="support-installation-scenarios-recommendations-title">
            When to Use Each Configuration
          </h2>

          <div className="support-installation-scenarios-recommendations-grid">
            {/* Best Practice Setup */}
            <div className="support-installation-scenarios-recommendation-card support-installation-scenarios-recommendation-card-high-risk">
              <div className="support-installation-scenarios-recommendation-header">
                <ExclamationTriangleIcon className="support-installation-scenarios-recommendation-icon support-installation-scenarios-recommendation-icon-high-risk" />
                <h3 className="support-installation-scenarios-recommendation-title">
                  When to Recommend the Best-Practice (Two-Unit) Setup
                </h3>
              </div>
              <p className="support-installation-scenarios-recommendation-subtitle">
                This configuration should be recommended for high-risk installations, such as:
              </p>
              <ul className="support-installation-scenarios-recommendation-list">
                <li className="support-installation-scenarios-recommendation-list-item">
                  <BuildingOffice2Icon className="support-installation-scenarios-recommendation-list-icon" />
                  <span>Attic units over kitchens</span>
                </li>
                <li className="support-installation-scenarios-recommendation-list-item">
                  <BuildingOffice2Icon className="support-installation-scenarios-recommendation-list-icon" />
                  <span>Second-floor installations</span>
                </li>
                <li className="support-installation-scenarios-recommendation-list-item">
                  <BuildingOffice2Icon className="support-installation-scenarios-recommendation-list-icon" />
                  <span>Any location where water damage would be severe or costly</span>
                </li>
              </ul>
            </div>

            {/* Standard Setup */}
            <div className="support-installation-scenarios-recommendation-card support-installation-scenarios-recommendation-card-low-risk">
              <div className="support-installation-scenarios-recommendation-header">
                <CheckCircleIcon className="support-installation-scenarios-recommendation-icon support-installation-scenarios-recommendation-icon-low-risk" />
                <h3 className="support-installation-scenarios-recommendation-title">
                  When One Unit Is Sufficient
                </h3>
              </div>
              <p className="support-installation-scenarios-recommendation-subtitle">
                In these cases, one AC Drain Wiz unit in the main drain line is sufficient:
              </p>
              <ul className="support-installation-scenarios-recommendation-list">
                <li className="support-installation-scenarios-recommendation-list-item">
                  <HomeIcon className="support-installation-scenarios-recommendation-list-icon" />
                  <span>Ground-level or main-floor installations</span>
                </li>
                <li className="support-installation-scenarios-recommendation-list-item">
                  <HomeIcon className="support-installation-scenarios-recommendation-list-icon" />
                  <span>Areas with low risk of damage (e.g., over tile floors, garages, mechanical rooms)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="support-installation-scenarios-resources">
          <h2 className="support-installation-scenarios-resources-title">Additional Resources</h2>
          <div className="support-installation-scenarios-resources-links">
            <Link 
              to="/sensor-setup" 
              className="support-installation-scenarios-resource-link"
            >
              Sensor Setup Guide
            </Link>
            <Link 
              to="/support" 
              className="support-installation-scenarios-resource-link"
            >
              Support Center
            </Link>
            <Link 
              to="/contact?type=support" 
              className="support-installation-scenarios-resource-link"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

