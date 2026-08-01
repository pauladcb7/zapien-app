import { configureStore } from '@reduxjs/toolkit'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  // Default to demo account if none in localStorage
  user: JSON.parse(localStorage.getItem('user')) || {
    id: 1,
    user_id: 1,
    first_name: 'demo',
    last_name: 'demo',
    email: 'demo@demo.com',
    token: 'test'
  },
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'SET_USER':
      localStorage.setItem('user', JSON.stringify(rest.user))
      return {
        ...state,
        user: rest.user,
      }
    case 'LOG_OUT':
      localStorage.removeItem('user')
      return {
        ...state,
        user: null,
      }
    case 'SET_GPS':
      return {
        ...state,
        gps: rest.gps,
      }
    default:
      return state
  }
}

const store = configureStore({ reducer: changeState })

export default store
