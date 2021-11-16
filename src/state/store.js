
import storage from 'redux-persist/lib/storage' //
import {persistCombineReducers, persistStore} from "redux-persist";
import {loggedUserReducer} from "openstack-uicore-foundation/lib/reducers";
import eventReducer from "../reducers/event-reducer";
import summitReducer from "../reducers/summit-reducer";
import userReducer from "../reducers/user-reducer";
import scheduleReducer from "../reducers/schedule-reducer";
import myScheduleReducer from "../reducers/my-schedule-reducer";
import clockReducer from "../reducers/clock-reducer";
import speakerReducer from "../reducers/speaker-reducer";
import settingReducer from "../reducers/setting-reducer";
import sponsorReducer from "../reducers/sponsor-reducer";
import {applyMiddleware, compose, createStore} from "redux";
import thunk from "redux-thunk";

// get from process.env bc window is not set yet
const clientId = process.env.GATSBY_OAUTH2_CLIENT_ID;
const summitID = process.env.GATSBY_SUMMIT_ID;

const config = {
    key: `root_${clientId}_${summitID}`,
    storage: storage,
    blacklist: [
        // this will be not saved to persistent storage see
        // https://github.com/rt2zz/redux-persist#blacklist--whitelist
        'sponsorState',
        'speakerState',
        'eventState',
        'summitState',
        'scheduleState',
        'myScheduleState',
    ]
};

const persistedReducers = persistCombineReducers(config, {
    loggedUserState: loggedUserReducer,
    settingState: settingReducer,
    userState: userReducer,
    scheduleState: scheduleReducer,
    myScheduleState: myScheduleReducer,
    clockState: clockReducer,
    eventState: eventReducer,
    summitState: summitReducer,
    speakerState: speakerReducer,
    sponsorState: sponsorReducer
});

function appendLoggedUser({ getState }) {
    return next => action => {
        const {userState: {userProfile}} = getState();
        // Call the next dispatch method in the middleware chain.
        action.userProfile = userProfile;
        return next(action);
    }
}

const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

const store = createStore(persistedReducers, composeEnhancers(applyMiddleware(appendLoggedUser, thunk)));

const onRehydrateComplete = () => {};

export const persistor = persistStore(store, null, onRehydrateComplete);

export default store;