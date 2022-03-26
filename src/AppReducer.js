import Account from "./account";

export const initialState = {
  accounts: Account.initAccounts(),
};

export const AppReducer = (state, action) => {
  switch (action.type) {
    case "load_accounts": {
      return {
        ...state,
        accounts: action.value
      }
    }
    
    case "generate_account": {
      state.accounts[action.value.index] = action.value.account;
      return {
        ...state,
        accounts: state.accounts
      }
    }

    case "remove_account": {
      state.accounts[action.value.index] = Account.blankAccount();
      return {
        ...state,
        accounts: state.accounts
      }
    }
    
    case "signIn_account": {
      state.accounts[action.value.index].jwt = action.value.jwt;
      state.accounts[action.value.index].iat = action.value.iat;
      return {
        ...state,
        accounts: state.accounts
      }
    }
  }
};