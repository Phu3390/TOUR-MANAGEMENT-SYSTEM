import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/slice'
import userReducer from './user/slice'
import tourReducer from './tour/slice'
import bookingReducer from './booking/slice'
import bookingHistoryReducer from './booking/bookingHistory'
import voucherReducer from './booking/voucher'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    tour: tourReducer,
    booking: bookingReducer,
    bookingHistory: bookingHistoryReducer,
    voucher: voucherReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
