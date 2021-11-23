import settings from '../content/settings.json';
import colors from '../content/colors.json';
import marketing_site from '../content/marketing-site.json';
import disqus_settings from '../content/disqus-settings.json';
import home_settings from '../content/home-settings.json';

import { START_LOADING, STOP_LOADING, LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";
import { RESET_STATE, SYNC_DATA } from "../actions/base-actions";

const DEFAULT_STATE = {
  lastBuild: settings.lastBuild,
  favicon: settings.favicon,
  widgets: settings.widgets,
  eventImage: settings.eventImage,
  colorSettings: colors,
  siteSettings: marketing_site,
  disqusSettings: disqus_settings,
  homeSettings: home_settings,
};

const settingReducer = (state = DEFAULT_STATE, action) => {
  const { type } = action;

  switch (type) {
    case RESET_STATE:
    case SYNC_DATA:
    case LOGOUT_USER:
      return DEFAULT_STATE;
    case START_LOADING:
      return { ...state, loading: true };
    case STOP_LOADING:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default settingReducer
