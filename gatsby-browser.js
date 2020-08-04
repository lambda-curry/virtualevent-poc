import ReduxWrapper from "./src/state/ReduxWrapper"
import Colors from './src/content/colors.json'

export const wrapRootElement = ReduxWrapper

window.IDP_BASE_URL = process.env.GATSBY_IDP_BASE_URL;
window.SUMMIT_API_BASE_URL = process.env.GATSBY_SUMMIT_API_BASE_URL;
window.SUMMIT_ID = process.env.GATSBY_SUMMIT_ID;
window.OAUTH2_CLIENT_ID = process.env.GATSBY_OAUTH2_CLIENT_ID;
window.SCOPES = process.env.GATSBY_SCOPES;
window.MARKETING_API_BASE_URL = process.env.GATSBY_MARKETING_API_BASE_URL;

export const onClientEntry = () => {
  Object.entries(Colors.colors).map(color => {
    document.documentElement.style.setProperty(`--${color[0]}`, color[1]);
    document.documentElement.style.setProperty(`--${color[0]}50`, `${color[1]}50`);
  });
}