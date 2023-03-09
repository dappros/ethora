export const config = {
  APP_JWT: process.env.REACT_APP_JWT,
  API_URL: process.env.REACT_APP_API_URL,
  IS_PRODUCTION:
    process.env.REACT_APP_PRODUCTION_MODE === "true" ? true : false,
  STRIPE_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: process.env.REACT_APP_STRIPE_SECRET_KEY
};
