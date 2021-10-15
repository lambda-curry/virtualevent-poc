export const getEnvVariable = (name) => {
  return typeof window === 'object' ? window[name] : process.env[`GATSBY_${name}`];
}

export const IDP_BASE_URL                 = 'IDP_BASE_URL';
export const SUMMIT_API_BASE_URL          = 'SUMMIT_API_BASE_URL';
export const SUMMIT_ID                    = 'SUMMIT_ID';
export const OAUTH2_CODE                  = 'OAUTH2_CODE';
export const OAUTH2_CLIENT_ID             = 'OAUTH2_CLIENT_ID';
export const SCOPES                       = 'SCOPES';
export const MARKETING_API_BASE_URL       = 'MARKETING_API_BASE_URL';
export const REGISTRATION_BASE_URL        = 'REGISTRATION_BASE_URL';
export const AUTHZ_USER_GROUPS            = 'AUTHZ_USER_GROUPS';
export const AUTHORIZED_DEFAULT_PATH      = 'AUTHORIZED_DEFAULT_PATH';
export const STREAM_IO_API_KEY            = 'STREAM_IO_API_KEY';
export const MUX_ENV_KEY                  = 'MUX_ENV_KEY';
export const SUPABASE_URL 				  = "SUPABASE_URL";
export const SUPABASE_KEY 				  = "SUPABASE_KEY";
export const CHAT_API_BASE_URL 			  = "CHAT_API_BASE_URL";