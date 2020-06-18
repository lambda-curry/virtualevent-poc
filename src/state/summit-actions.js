import axios from 'axios';

export const GET_SUMMIT_DATA = 'GET_SUMMIT_DATA';

export function getSummitData() {

  let url = `${window.EVENT_API_BASE_URL}/api/public/v1/summits/${window.EVENT_SUMMIT_ID}?expand=event_types%2C+tracks%2C+track_groups%2C+presentation_levels%2C+locations.rooms%2C+locations.floors`  

  return function (dispatch) {
    axios.get(url)
      .then((response) => dispatch({
        type: GET_SUMMIT_DATA,
        payload: response.data
      })).catch((response) => dispatch({
        type: GET_SUMMIT_DATA,
        payload: response.error
      }))
  }
}