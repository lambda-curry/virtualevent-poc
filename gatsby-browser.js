import ReduxWrapper from "./src/state/ReduxWrapper"
import colors from './src/content/colors.json'

window.IDP_BASE_URL = process.env.GATSBY_IDP_BASE_URL;
window.SUMMIT_API_BASE_URL = process.env.GATSBY_SUMMIT_API_BASE_URL;
window.API_BASE_URL = process.env.GATSBY_SUMMIT_API_BASE_URL;
window.SUMMIT_ID = process.env.GATSBY_SUMMIT_ID;
window.OAUTH2_FLOW = process.env.GATSBY_OAUTH2_FLOW;
window.OAUTH2_CLIENT_ID = process.env.GATSBY_OAUTH2_CLIENT_ID;
window.SCOPES = process.env.GATSBY_SCOPES;
window.MARKETING_API_BASE_URL = process.env.GATSBY_MARKETING_API_BASE_URL;
window.REGISTRATION_BASE_URL = process.env.GATSBY_REGISTRATION_BASE_URL;
window.AUTHZ_USER_GROUPS = process.env.GATSBY_AUTHZ_USER_GROUPS;
window.AUTHORIZED_DEFAULT_PATH = process.env.GATSBY_AUTHORIZED_DEFAULT_PATH;
window.STREAM_IO_API_KEY = process.env.GATSBY_STREAM_IO_API_KEY;
window.MUX_ENV_KEY = process.env.GATSBY_MUX_ENV_KEY;
window.SUPABASE_URL = process.env.GATSBY_SUPABASE_URL;
window.SUPABASE_KEY = process.env.GATSBY_SUPABASE_KEY;
window.CHAT_API_BASE_URL = process.env.GATSBY_CHAT_API_BASE_URL;


export const wrapRootElement = ReduxWrapper;

export const onClientEntry = () => {
  // var set at document level
  // preventa widget color flashing from defaults to fetched by widget from marketing api
  Object.entries(colors).forEach(color => {
    document.documentElement.style.setProperty(`--${color[0]}`, color[1]);
    document.documentElement.style.setProperty(`--${color[0]}50`, `${color[1]}50`);
  });
};