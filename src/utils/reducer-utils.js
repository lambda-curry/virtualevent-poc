export const reduceReducers = (...reducers) => (state, action) =>
    reducers.reduce((acc, r) => r(acc, action), state);