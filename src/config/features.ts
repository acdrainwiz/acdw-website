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
 * "Coming Soon" placeholder. Flip to `true` to go live with Stripe checkout.
 */
export const PURCHASING_ENABLED: boolean = false
