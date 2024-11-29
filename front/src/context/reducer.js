//actions types backend

//admin &  student
export const USER_ACTION = "USER_ACTION";

export const FORGOT_PASSWORD = "FORGOT_PASSWORD";

export const SET_ACTIVE_PAGE = "SET_ACTIVE_PAGE";
export const ROUTE_INSERT = "ROUTE_INSERT";
//Tests

// initial states
export const initialState = {
  users: {},
  action: "",
  keepMeLoggedIn: false,
  routeHistory: [],
  activePage: "",
};

//app reducer
export const reducer = (initialState, action) => {
  switch (action.type) {
    case USER_ACTION:
      return {
        ...initialState,
        action: action.payload,
      };

    case FORGOT_PASSWORD:
      return {
        ...initialState,
        users: {
          ...initialState.user,
          emailAddress: action.payload,
        },
      };

    case ROUTE_INSERT:
      return {
        ...initialState,
        routeHistory: action.payload,
      };

    case SET_ACTIVE_PAGE:
      return {
        ...initialState,
        activePage: action.payload,
      };

    //      case value:
    // return {
    //   users: {},
    // };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
