/**
 * Aggregates per-page `PAGE_SEARCH_META` exports for Support Hub.
 * Importing this file pulls in page modules; keep it dependency-light (no circular imports from pages).
 */
import type { PageSearchMeta } from './siteSearchTypes'
import { PAGE_SEARCH_META as about } from '../pages/AboutPage'
import { PAGE_SEARCH_META as codeOfficials } from '../pages/CodeOfficialsPage'
import { PAGE_SEARCH_META as comboProduct } from '../pages/ComboProductPage'
import { PAGE_SEARCH_META as compliance } from '../pages/CompliancePage'
import { PAGE_SEARCH_META as contact } from '../pages/ContactPage'
import { PAGE_SEARCH_META as customerSelection } from '../pages/CustomerSelectionPage'
import { PAGE_SEARCH_META as emailPreferences } from '../pages/EmailPreferencesPage'
import { PAGE_SEARCH_META as emailSignature } from '../pages/EmailSignaturePage'
import { PAGE_SEARCH_META as home } from '../pages/HomePage'
import { PAGE_SEARCH_META as homeowner } from '../pages/HomeownerHomePage'
import { PAGE_SEARCH_META as hvacPros } from '../pages/HVACProsPage'
import { PAGE_SEARCH_META as installationSetup } from '../pages/InstallationSetupPage'
import { PAGE_SEARCH_META as miniProduct } from '../pages/MiniProductPage'
import { PAGE_SEARCH_META as miniSetup } from '../pages/MiniSetupPage'
import { PAGE_SEARCH_META as privacyPolicy } from '../pages/PrivacyPolicyPage'
import { PAGE_SEARCH_META as productSupport } from '../pages/ProductSupportPage'
import { PAGE_SEARCH_META as productsListing } from '../pages/ProductsPage'
import { PAGE_SEARCH_META as propertyManagers } from '../pages/PropertyManagerPage'
import { PAGE_SEARCH_META as installationScenarios } from '../pages/RecommendedInstallationScenariosPage'
import { PAGE_SEARCH_META as returnRefund } from '../pages/ReturnRefundPolicyPage'
import { PAGE_SEARCH_META as sensorProduct } from '../pages/SensorProductPage'
import { SENSOR_SETUP_SEARCH_ENTRIES } from '../pages/SensorSetupPage'
import { PAGE_SEARCH_META as shippingPolicy } from '../pages/ShippingPolicyPage'
import { PAGE_SEARCH_META as termsOfUse } from '../pages/TermsOfUsePage'
import { PAGE_SEARCH_META as unsubscribe } from '../pages/UnsubscribePage'
import { PAGE_SEARCH_META as warrantyPolicy } from '../pages/WarrantyPolicyPage'
import { PAGE_SEARCH_META as warrantyReturns } from '../pages/WarrantyReturnsPage'

export const SITE_PAGE_SEARCH_ENTRIES: PageSearchMeta[] = [
  home,
  homeowner,
  hvacPros,
  propertyManagers,
  codeOfficials,
  customerSelection,
  productsListing,
  about,
  contact,
  installationSetup,
  miniSetup,
  ...SENSOR_SETUP_SEARCH_ENTRIES,
  installationScenarios,
  productSupport,
  miniProduct,
  sensorProduct,
  comboProduct,
  warrantyReturns,
  compliance,
  privacyPolicy,
  returnRefund,
  shippingPolicy,
  warrantyPolicy,
  termsOfUse,
  emailPreferences,
  unsubscribe,
  emailSignature,
]
