import { configureStore } from '@reduxjs/toolkit'
//import counterSlice from "./features/counterSlice";
import todosSlice from '../features/todosSlice'

// export const store = configureStore({
//     reducer:counterSlice.reducer
// });

export const store = configureStore({
  reducer: todosSlice.reducer,
})
