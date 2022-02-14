import { combineReducers } from 'redux';

import {
  REQUEST_PRESENTATIONS_PAGE,
  RECEIVE_PRESENTATIONS_PAGE
} from '../actions/presentation-actions';

const presentations = (presentations = [], action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case RECEIVE_PRESENTATIONS_PAGE:
      const { response: { data } } = payload;
      return [...presentations, ...data];
    default:
      return presentations;
  }
};

const pages = (pages = {}, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case REQUEST_PRESENTATIONS_PAGE:
      const { page } = payload;
      return {
        ...pages,
        [page]: {
          ids: [],
          fetching: true,
        }
      };
    case RECEIVE_PRESENTATIONS_PAGE:
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
  return type === REQUEST_PRESENTATIONS_PAGE ? payload.page : currentPage;
};

const lastPage = (lastPage = null, action = {}) => {
  const { type, payload } = action;
  return type === RECEIVE_PRESENTATIONS_PAGE ? payload.response.last_page : lastPage;
};

const pagination = combineReducers({
  pages,
  currentPage,
  lastPage
});

export default combineReducers({
  presentations,
  pagination
});