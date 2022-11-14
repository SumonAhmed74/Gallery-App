import { configureStore } from '@reduxjs/toolkit'
import imgSlice from './imgSlice'

export default configureStore({
  reducer: {
    image: imgSlice,
  },
})