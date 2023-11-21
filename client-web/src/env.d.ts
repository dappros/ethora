/// <reference types="vite/client" />

interface ImportMetaEnvironment {
  readonly VITE_APP_API_URL: string
  readonly VITE_APP_DISABLE_STRICT: string
  readonly VITE_APP_DOMAIN_NAME: string

  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnvironment
}
