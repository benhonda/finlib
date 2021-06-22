// Actions
const SET = 'finlib/accounts/SET'
const SET_ACCOUNT = 'finlib/accounts/SET_ACCOUNT'
const SET_LOADING = 'finlib/accounts/SET_LOADING'

// Reducer
const defaultAccounts = {
  loading: true,
  account: null,
}

export default function reducer(accounts = defaultAccounts, action = {}) {
  switch (action.type) {
    case SET:
      return action.accounts || accounts
    default:
      return accounts
  }
}

// Action Creators
export const setAccount = (a) => ({ type: SET, accounts: a })
