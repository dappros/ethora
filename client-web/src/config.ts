export const config = {
  DOMAIN_NAME: process.env.REACT_APP_DOMAIN_NAME,
  API_URL: process.env.REACT_APP_API_URL,
  IS_PRODUCTION:
    process.env.REACT_APP_PRODUCTION_MODE === "true" ? true : false,
  STRIPE_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: process.env.REACT_APP_STRIPE_SECRET_KEY
};
