export const config = {
  DOMAIN_NAME: import.meta.env.VITE_APP_DOMAIN_NAME,
  API_URL: import.meta.env.VITE_APP_API_URL,
  IS_PRODUCTION:
    import.meta.env.VITE_APP_PRODUCTION_MODE === "true" ? true : false,
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: import.meta.env.VITE_APP_STRIPE_SECRET_KEY,
  DISABLE_STRICT: import.meta.env.VITE_APP_DISABLE_STRICT,
}
