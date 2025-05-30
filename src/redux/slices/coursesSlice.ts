import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import apiClient from '../../api/api';

interface Course {
    slug: string;
    title: string;
    description: string;
    price: number;
    cover_image_url: string;
}

interface CourseContent {
    slug: string;
    title: string;
    description: string;
    price: number;
    cover_image_url: string;
    contents: {
        fileName: string;
        contentType: string;
        contentFileUrl: string;
    }[];
}

interface CoursesState {
    courses: Course[];
    currentCourse: CourseContent | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    accessStatus: 'idle' | 'checking' | 'accessible' | 'inaccessible';
    accessError: string | null;
}

const initialState: CoursesState = {
    courses: [],
    currentCourse: null,
    status: 'idle',
    error: null,
    accessStatus: 'idle',
    accessError: null,
};

export const fetchCourses = createAsyncThunk<
    Course[],
    void,
    { rejectValue: string }
>('courses/fetchCourses', async (_, { rejectWithValue }) => {
    try {
        console.log('Fetching courses from /api/v1/courses');
        const response = await apiClient.get('/v1/courses');
        return response.data.courses_preview || [];
    } catch (error: any) {
        console.error('Fetch courses error:', error);
        return rejectWithValue(error.response?.data?.message || 'Не удалось загрузить курсы');
    }
});

export const fetchCourseContent = createAsyncThunk<
    CourseContent,
    string,
    { rejectValue: string }
>('courses/fetchCourseContent', async (slug, { rejectWithValue }) => {
    try {
        console.log(`Fetching course content for slug: ${slug}`);
        const response = await apiClient.get(`/v1/courses/${slug}/content`);
        return response.data;
    } catch (error: any) {
        console.error('Fetch course content error:', error);
        return rejectWithValue(error.response?.data?.message || 'Не удалось загрузить содержимое курса');
    }
});

export const checkCourseAccess = createAsyncThunk<
    boolean,
    string,
    { rejectValue: string }
>('courses/checkCourseAccess', async (slug, { rejectWithValue }) => {
    try {
        console.log(`Checking access for course: ${slug}`);
        await apiClient.get(`/v1/courses/${slug}/content`);
        return true;
    } catch (error: any) {
        console.error('Check course access error:', error);
        if (error.response?.status === 403) {
            return false;
        }
        return rejectWithValue(error.response?.data?.message || 'Ошибка проверки доступа');
    }
});

export const purchaseCourse = createAsyncThunk<
    void,
    string,
    { rejectValue: string }
>('courses/purchaseCourse', async (slug, { rejectWithValue }) => {
    try {
        console.log(`Purchasing course: ${slug}`);
        await apiClient.post(`/v1/courses/${slug}/purchase`);
    } catch (error: any) {
        console.error('Purchase course error:', error);
        return rejectWithValue(error.response?.data?.message || 'Не удалось приобрести курс');
    }
});

const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        resetCourseContent(state) {
            state.currentCourse = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.courses = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Не удалось загрузить курсы';
            })
            .addCase(fetchCourseContent.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCourseContent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentCourse = action.payload;
            })
            .addCase(fetchCourseContent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Не удалось загрузить содержимое курса';
            })
            .addCase(checkCourseAccess.pending, (state) => {
                state.accessStatus = 'checking';
                state.accessError = null;
            })
            .addCase(checkCourseAccess.fulfilled, (state, action) => {
                state.accessStatus = action.payload ? 'accessible' : 'inaccessible';
                state.accessError = null;
            })
            .addCase(checkCourseAccess.rejected, (state, action) => {
                state.accessStatus = 'inaccessible';
                state.accessError = action.payload || 'Ошибка проверки доступа';
            })
            .addCase(purchaseCourse.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(purchaseCourse.fulfilled, (state) => {
                state.status = 'succeeded';
                state.accessStatus = 'accessible';
            })
            .addCase(purchaseCourse.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Не удалось приобрести курс';
            });
    },
});

export const { resetCourseContent } = coursesSlice.actions;

export const selectCourses = (state: RootState) => state.courses.courses;
export const selectCoursesStatus = (state: RootState) => state.courses.status;
export const selectCoursesError = (state: RootState) => state.courses.error;
export const selectCurrentCourse = (state: RootState) => state.courses.currentCourse;
export const selectAccessStatus = (state: RootState) => state.courses.accessStatus;
export const selectAccessError = (state: RootState) => state.courses.accessError;

export default coursesSlice.reducer;