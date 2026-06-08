/**
 * Aggregates per-page `PAGE_SEARCH_META` exports for Support Hub.
 *
 * Imports from each page's lightweight `*.search.ts` sibling (metadata only, no
 * component) rather than the page module itself. This keeps page components and
 * their dependency trees out of any chunk that needs the search index, which is
 * what allows the routes to be code-split (see App.tsx React.lazy).
 */
import type { PageSearchMeta } from './siteSearchTypes'
import { PAGE_SEARCH_META as about } from '../pages/AboutPage.search'
import { PAGE_SEARCH_META as codeOfficials } from '../pages/CodeOfficialsPage.search'
import { PAGE_SEARCH_META as comboProduct } from '../pages/ComboProductPage.search'
import { PAGE_SEARCH_META as compliance } from '../pages/CompliancePage.search'
import { PAGE_SEARCH_META as contact } from '../pages/ContactPage.search'
import { PAGE_SEARCH_META as customerSelection } from '../pages/CustomerSelectionPage.search'
import { PAGE_SEARCH_META as emailPreferences } from '../pages/EmailPreferencesPage.search'
import { PAGE_SEARCH_META as emailSignature } from '../pages/EmailSignaturePage.search'
import { PAGE_SEARCH_META as home } from '../pages/HomePage.search'
import { PAGE_SEARCH_META as homeowner } from '../pages/HomeownerHomePage.search'
import { PAGE_SEARCH_META as hvacPros } from '../pages/HVACProsPage.search'
import { PAGE_SEARCH_META as installationSetup } from '../pages/InstallationSetupPage.search'
import { PAGE_SEARCH_META as miniProduct } from '../pages/MiniProductPage.search'
import { PAGE_SEARCH_META as miniSetup } from '../pages/MiniSetupPage.search'
import { PAGE_SEARCH_META as privacyPolicy } from '../pages/PrivacyPolicyPage.search'
import { PAGE_SEARCH_META as productSupport } from '../pages/ProductSupportPage.search'
import { PAGE_SEARCH_META as productsListing } from '../pages/ProductsPage.search'
import { PAGE_SEARCH_META as propertyManagers } from '../pages/PropertyManagerPage.search'
import { PAGE_SEARCH_META as installationScenarios } from '../pages/RecommendedInstallationScenariosPage.search'
import { PAGE_SEARCH_META as returnRefund } from '../pages/ReturnRefundPolicyPage.search'
import { PAGE_SEARCH_META as sensorProduct } from '../pages/SensorProductPage.search'
import { SENSOR_SETUP_SEARCH_ENTRIES } from '../pages/SensorSetupPage.search'
import { PAGE_SEARCH_META as shippingPolicy } from '../pages/ShippingPolicyPage.search'
import { PAGE_SEARCH_META as termsOfUse } from '../pages/TermsOfUsePage.search'
import { PAGE_SEARCH_META as unsubscribe } from '../pages/UnsubscribePage.search'
import { PAGE_SEARCH_META as warrantyPolicy } from '../pages/WarrantyPolicyPage.search'
import { PAGE_SEARCH_META as warrantyReturns } from '../pages/WarrantyReturnsPage.search'

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
