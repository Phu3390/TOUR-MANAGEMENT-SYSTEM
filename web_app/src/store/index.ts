import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/slice'
import roleReducer from './role/slice'
import userReducer from './user/slice'
import tourReducer from './tour/slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    role: roleReducer,
    user: userReducer,
    tour: tourReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
