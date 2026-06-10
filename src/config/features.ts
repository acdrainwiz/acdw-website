/**
 * Feature Flags
 *
 * Site-wide toggles for features that ship in code but aren't ready to expose.
 */

/**
 * Online purchasing (Stripe checkout) toggle.
 *
 * When `false`, every customer-facing purchase entry point — "Buy Now",
 * "Add to Cart", and "Checkout" — is hidden and replaced with a disabled
 * "Coming Soon" placeholder. Set `VITE_PURCHASING_ENABLED=true` in the
 * deployment environment to go live with Stripe checkout.
 */
export const PURCHASING_ENABLED: boolean = import.meta.env.VITE_PURCHASING_ENABLED === 'true'
