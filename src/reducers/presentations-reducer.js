import { combineReducers } from 'redux';
import { isString } from 'lodash';

import {
  SET_INITIAL_DATASET,
  PRESENTATIONS_PAGE_REQUEST,
  PRESENTATIONS_PAGE_RESPONSE,
  VOTEABLE_PRESENTATIONS_UPDATE_FILTER,
  GET_PRESENTATION_DETAILS, GET_RECOMMENDED_PRESENTATIONS
} from '../actions/presentation-actions';
import { START_LOADING, STOP_LOADING } from "openstack-uicore-foundation/lib/actions";

import { filterEventsByAccessLevels } from '../utils/authorizedGroups';

import allVoteablePresentations from '../content/voteable_presentations.json';
import DEFAULT_FILTERS_STATE from '../content/posters_filters.json';

const DEFAULT_VOTEABLE_PRESENTATIONS_STATE = {
  filters: { ...DEFAULT_FILTERS_STATE },
  // ssr collection to create filters content ( this is read only)
  originalPresentations    : [...allVoteablePresentations],
  // ssr collection to perform initial upload
  allPresentations : [...allVoteablePresentations],
  // current poster collection ( with filter applied, this will feed the poster grid)
  filteredPresentations: [...allVoteablePresentations],
  detailedPresentation: null,
  recommendedPresentations: [],
  loading: false
};

const voteablePresentations = (state = DEFAULT_VOTEABLE_PRESENTATIONS_STATE, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case SET_INITIAL_DATASET: {
      const { userProfile: currentUserProfile } = payload;
      // pre filter by user access levels
      let filteredEvents = filterEventsByAccessLevels(allVoteablePresentations, currentUserProfile);
      // suffle
      filteredEvents = filteredEvents.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);
      return { ...state,
        ssrPresentations: filteredEvents,
        allPresentations: filteredEvents,
        filteredPresentations: filteredEvents,
        currentUserProfile: currentUserProfile
      };
    }
    case PRESENTATIONS_PAGE_RESPONSE: {
      const { response: { data } } = payload;
      const { filters, allPresentations, currentUserProfile } = state;
      // get the new data from api bc the temporal public urls
      const oldPresentations = [...allPresentations];
      let newPresentations = [];
      data.forEach(presentation => {
        const index = allPresentations.findIndex((p) => p.id === presentation.id);
        if (index !== -1) {
          oldPresentations.splice(index, 1, presentation);
        } else {
          newPresentations.push(presentation);
        }
      });
      // pre filter new presentations by user access levels
      newPresentations = filterEventsByAccessLevels(newPresentations, currentUserProfile);
      const updatedPresentations = [...oldPresentations, ...newPresentations];
      return { ...state,
        allPresentations: updatedPresentations,
        filteredPresentations: getFilteredVoteablePresentations(updatedPresentations, filters)
      };
    }
    case VOTEABLE_PRESENTATIONS_UPDATE_FILTER: {
      const { type, values } = payload;
      const { filters, allPresentations } = state;
      // TODO: review, can we change state directly?
      filters[type].values = values;
      return { ...state,
        filters,
        filteredPresentations: getFilteredVoteablePresentations(allPresentations, filters)
      };
    }
    case GET_PRESENTATION_DETAILS: {
      const presentation = payload.response || payload.poster;      
      return { ...state, detailedPresentation: presentation };
    }
    case GET_RECOMMENDED_PRESENTATIONS: {
      const recommended = [...payload.response.data.slice(0,-2)];
      return { ...state, loading: false, recommendedPresentations: recommended };
    }
    case START_LOADING:
      return { ...state, loading: true };
    case STOP_LOADING:
      return { ...state, loading: false };
    default:
      return state;
  }
};

const pages = (pages = {}, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case PRESENTATIONS_PAGE_REQUEST:
      const { page } = payload;
      return {
        ...pages,
        [page]: {
          ids: [],
          fetching: true,
        }
      };
    case PRESENTATIONS_PAGE_RESPONSE:
      const { response: { current_page, data } } = payload;
      return {
        ...pages,
        [current_page]: {
          ids: data.map(p => p.id),
          fetching: false,
        }
      };
    default:
      return pages;
  }
};

const currentPage = (currentPage = 1, action = {}) => {
  const { type, payload } = action;
  return type === PRESENTATIONS_PAGE_REQUEST ? payload.page : currentPage;
};

const lastPage = (lastPage = null, action = {}) => {
  const { type, payload } = action;
  return type === PRESENTATIONS_PAGE_RESPONSE ? payload.response.last_page : lastPage;
};

const pagination = combineReducers({
  pages,
  currentPage,
  lastPage
});

export default combineReducers({
  voteablePresentations,
  pagination,
});

/**
 * local filtering
 * @param events
 * @param filters
 * @returns {*}
 */
export const getFilteredVoteablePresentations = (events, filters) => {
  return events.filter((ev) => {
    let valid = true;

    if (filters.track?.values.length > 0) {
      valid = filters.track.values.includes(ev.track.id);
      if (!valid) return false;
    }

    if (filters.speakers?.values.length > 0) {
      valid = ev.speakers?.some((s) => {
        return filters.speakers.values.some((v) => v === s.id);
      });
      if (!valid) return false;
    }

    if (filters.tags?.values.length > 0) {
      valid = ev.tags?.some((t) => filters.tags.values.includes(t.id));
      if (!valid) return false;
    }

    if (filters.abstract?.values && isString(filters.abstract.values)) {
      valid = ev.description
          .toLowerCase()
          .includes(filters.abstract.values.toLowerCase());
      if (!valid) return false;
    }

    if (filters.custom_order?.values && parseInt(filters.custom_order.values) > 0) {
      valid = parseInt( ev.custom_order)  === parseInt(filters.custom_order.values)
      if (!valid) return false;
    }

    return true;
  });
};
