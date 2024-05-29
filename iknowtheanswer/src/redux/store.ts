import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./features/user/user-slice";
import matchReducer from "./features/match/match-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    match: matchReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type IRootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch