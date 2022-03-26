import {useEffect, useReducer, createContext, useContext, useMemo } from "react";
import Account from "./account";
import { AppReducer, initialState } from "./AppReducer";

const STORAGE_KEY = "state";
const AppContext = createContext();

export function AppContextWrapper({ children }) {
  const [ state, dispatch ] = useReducer(AppReducer, initialState);

  const contextValue = useMemo(() => {
    return [ state, dispatch ];
  }, [state, dispatch]);

  useEffect(() => {
    const accounts = Account.loadAccounts();
    if (accounts) dispatch({
      type: "load_accounts",
      value: accounts 
    });
  }, []);

  useEffect(() => {
    if (state !== initialState) {
      Account.saveAccounts(state.accounts);
    }
  }, [state]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
