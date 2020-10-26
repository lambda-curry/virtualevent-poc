const envVariables = {
  IDP_BASE_URL: typeof window === 'object' ? window.IDP_BASE_URL : process.env.GATSBY_IDP_BASE_URL,
  SUMMIT_API_BASE_URL: typeof window === 'object' ? window.SUMMIT_API_BASE_URL : process.env.GATSBY_SUMMIT_API_BASE_URL,
  SUMMIT_ID: typeof window === 'object' ? window.SUMMIT_ID : process.env.GATSBY_SUMMIT_ID,
  OAUTH2_CLIENT_ID: typeof window === 'object' ? window.OAUTH2_CLIENT_ID : process.env.GATSBY_OAUTH2_CLIENT_ID,
  SCOPES: typeof window === 'object' ? window.SCOPES : process.env.GATSBY_SCOPES,
  MARKETING_API_BASE_URL: typeof window === 'object' ? window.MARKETING_API_BASE_URL : process.env.GATSBY_MARKETING_API_BASE_URL,
  REGISTRATION_BASE_URL: typeof window === 'object' ? window.REGISTRATION_BASE_URL : process.env.GATSBY_REGISTRATION_BASE_URL,
  AUTHZ_USER_GROUPS: typeof window === 'object' ? window.AUTHZ_USER_GROUPS : process.env.GATSBY_AUTHZ_USER_GROUPS,
  AUTHZ_SESSION_BADGE: typeof window === 'object' ? window.AUTHZ_SESSION_BADGE : process.env.GATSBY_AUTHZ_SESSION_BADGE,
  AUTHORIZED_DEFAULT_PATH: typeof window === 'object' ? window.AUTHORIZED_DEFAULT_PATH : process.env.GATSBY_AUTHORIZED_DEFAULT_PATH,
  STREAM_IO_API_KEY: typeof window === 'object' ? window.STREAM_IO_API_KEY : process.env.GATSBY_STREAM_IO_API_KEY,
  STREAM_IO_SSO_SLUG: typeof window === 'object' ? window.STREAM_IO_SSO_SLUG : process.env.GATSBY_STREAM_IO_SSO_SLUG,
  MUX_ENV_KEY: typeof window === 'object' ? window.MUX_ENV_KEY : process.env.GATSBY_MUX_ENV_KEY
}

export default envVariables;