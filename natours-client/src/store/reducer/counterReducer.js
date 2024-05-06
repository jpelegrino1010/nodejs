const initialState = { count: 0 };

const countReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      let countr = state.count + 1;
      return { ...state, count: countr };
  }
  return state;
};

export default countReducer;
