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
    purchasedCourses: Course[];
    currentCourse: CourseContent | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    accessStatus: { [key: string]: 'idle' | 'checking' | 'accessible' | 'inaccessible' };
    accessError: { [key: string]: string | null };
}

const initialState: CoursesState = {
    courses: [],
    purchasedCourses: [],
    currentCourse: null,
    status: 'idle',
    error: null,
    accessStatus: {},
    accessError: {},
};

export const fetchCourses = createAsyncThunk<
    Course[],
    void,
    { rejectValue: string }
>('courses/fetchCourses', async (_, { rejectWithValue }) => {
    try {
        const response = await apiClient.get('/v1/courses');
        return response.data.courses_preview || [];
    } catch (error: any) {
        console.error('Fetch courses error:', error);
        if (error.response?.status === 409 && error.response?.data?.error === 'COURSE_NOT_FOUND') {
            return rejectWithValue(error.response.data.message || 'Курсы не найдены');
        }
        return rejectWithValue(error.response?.data?.message || 'Не удалось загрузить курсы');
    }
});

export const fetchPurchasedCourses = createAsyncThunk<
    Course[],
    void,
    { rejectValue: string }
>('courses/fetchPurchasedCourses', async (_, { rejectWithValue }) => {
    try {
        const response = await apiClient.get('/v1/courses/purchased');
        return response.data.courses_preview || [];
    } catch (error: any) {
        console.error('Fetch purchased courses error:', error);
        if (error.response?.status === 409 && error.response?.data?.error === 'COURSE_NOT_FOUND') {
            return rejectWithValue(error.response.data.message || 'Курсы не найдены');
        }
        return rejectWithValue(error.response?.data?.message || 'Не удалось загрузить купленные курсы');
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
    { slug: string; hasAccess: boolean },
    string,
    { rejectValue: string }
>('courses/checkCourseAccess', async (slug, { rejectWithValue, getState }) => {
    try {
        console.log(`Checking access for course: ${slug}`);
        const state = getState() as RootState;
        const purchasedCourses = state.courses.purchasedCourses || [];
        const hasAccess = purchasedCourses.some((course: Course) => course.slug === slug);
        console.log(`Access check result for ${slug}: ${hasAccess}`);
        return { slug, hasAccess };
    } catch (error: any) {
        console.error('Check course access error:', error);
        return rejectWithValue(error.response?.data?.message || 'Ошибка проверки доступа');
    }
});

export const purchaseCourse = createAsyncThunk<
    { slug: string },
    string,
    { rejectValue: string }
>('courses/purchaseCourse', async (slug, { rejectWithValue, dispatch, getState }) => {
    try {
        console.log(`Purchasing course: ${slug}`);
        await apiClient.post(`/v1/courses/${slug}/purchase`);
        const state = getState() as RootState;
        const courseToPurchase = state.courses.courses.find(c => c.slug === slug);
        if (courseToPurchase) {
            dispatch(coursesSlice.actions.addPurchasedCourse(courseToPurchase));
        }
        await dispatch(fetchPurchasedCourses()).unwrap();
        return { slug };
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
        addPurchasedCourse(state, action: { payload: Course }) {
            const course = action.payload;
            if (!state.purchasedCourses.some(c => c.slug === course.slug)) {
                state.purchasedCourses.push(course);
            }
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
            .addCase(fetchPurchasedCourses.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchPurchasedCourses.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.purchasedCourses = action.payload;
            })
            .addCase(fetchPurchasedCourses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Не удалось загрузить купленные курсы';
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
            .addCase(checkCourseAccess.pending, (state, action) => {
                state.accessStatus[action.meta.arg] = 'checking';
                state.accessError[action.meta.arg] = null;
            })
            .addCase(checkCourseAccess.fulfilled, (state, action) => {
                const { slug, hasAccess } = action.payload;
                state.accessStatus[slug] = hasAccess ? 'accessible' : 'inaccessible';
                state.accessError[slug] = null;
            })
            .addCase(checkCourseAccess.rejected, (state, action) => {
                const slug = action.meta.arg;
                state.accessStatus[slug] = 'inaccessible';
                state.accessError[slug] = action.payload || 'Ошибка проверки доступа';
            })
            .addCase(purchaseCourse.pending, (state, action) => {
                state.status = 'loading';
                state.error = null;
                state.accessStatus[action.meta.arg] = 'checking';
                state.accessError[action.meta.arg] = null;
            })
            .addCase(purchaseCourse.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.accessStatus[action.payload.slug] = 'accessible';
                state.accessError[action.payload.slug] = null;
            })
            .addCase(purchaseCourse.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Не удалось приобрести курс';
                state.accessStatus[action.meta.arg] = 'inaccessible';
                state.accessError[action.meta.arg] = action.payload || 'Не удалось приобрести курс';
            });
    },
});

export const { resetCourseContent, addPurchasedCourse } = coursesSlice.actions;

export const selectCourses = (state: RootState) => state.courses.courses;
export const selectPurchasedCourses = (state: RootState) => state.courses.purchasedCourses;
export const selectCoursesStatus = (state: RootState) => state.courses.status;
export const selectCoursesError = (state: RootState) => state.courses.error;
export const selectCurrentCourse = (state: RootState) => state.courses.currentCourse;
export const selectAccessStatus = (state: RootState, slug: string) => state.courses.accessStatus[slug] || 'idle';
export const selectAccessError = (state: RootState, slug: string) => state.courses.accessError[slug];

export default coursesSlice.reducer;