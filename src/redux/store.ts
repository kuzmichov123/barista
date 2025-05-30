import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import coursesReducer from './slices/coursesSlice';
import adminCoursesReducer from './slices/adminCoursesSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        courses: coursesReducer,
        adminCourses: adminCoursesReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
