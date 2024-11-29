import React, { createContext, useContext, useReducer } from 'react';

// The context
const UniidContext = createContext();

// A custom hook to consume the context
export const useAppUniidContext = () => useContext(UniidContext);

// A provider component to wrap the app with context
export const UniidProvider = ({ children, initialState, reducer }) => {
  const [globalState, dispatch] = useReducer(reducer, initialState);

  return (
    <UniidContext.Provider value={[globalState, dispatch]}>
      {children}
    </UniidContext.Provider>
  );
};