const envVariables = {
  IDP_BASE_URL: typeof window === 'object' ? window.IDP_BASE_URL : process.env.GATSBY_IDP_BASE_URL,
  SUMMIT_API_BASE_URL: typeof window === 'object' ? window.SUMMIT_API_BASE_URL : process.env.GATSBY_SUMMIT_API_BASE_URL,
  SUMMIT_ID: typeof window === 'object' ? window.SUMMIT_ID : process.env.GATSBY_SUMMIT_ID,
  OAUTH2_CLIENT_ID: typeof window === 'object' ? window.OAUTH2_CLIENT_ID : process.env.GATSBY_OAUTH2_CLIENT_ID,
  SCOPES: typeof window === 'object' ? window.SCOPES : process.env.GATSBY_SCOPES,
  MARKETING_API_BASE_URL: typeof window === 'object' ? window.MARKETING_API_BASE_URL : process.env.GATSBY_MARKETING_API_BASE_URL
}

export default envVariables;