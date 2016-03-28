export const hmrReducer = (appReducer) => (state, {type, payload}) => {
  switch (type) {
    case 'HMR_SET_STATE': return payload;
    default:              return appReducer(state, {type, payload});
  }
};
