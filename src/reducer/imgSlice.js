import { createSlice } from '@reduxjs/toolkit'

export const imgSlice = createSlice({
  name: 'images',
  initialState: {
    value: '',
  },
  reducers: {
  
    imagesReducer: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { imagesReducer } = imgSlice.actions

export default imgSlice.reducer