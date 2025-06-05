import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../api/api';
import { RootState } from '../store';

interface Course {
    slug: string;
    title: string;
    description: string;
    price: number;
    cover_image_url: string;
}

interface AdminCoursesState {
    courses: Course[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AdminCoursesState = {
    courses: [],
    status: 'idle',
    error: null,
};

export const fetchAdminCourses = createAsyncThunk<
    Course[],
    void,
    { rejectValue: string }
>('adminCourses/fetchAdminCourses', async (_, { rejectWithValue }) => {
    try {
        console.log('Fetching courses from /v1/courses');
        const response = await apiClient.get('/v1/courses');
        return response.data.courses_preview || response.data || [];
    } catch (error: any) {
        console.error('Fetch courses error:', error);
        if (error.response?.status === 404) {
            return [];
        }
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
});

export const createCourse = createAsyncThunk<
    void,
    { title: string; description: string; price: number; coverImage: File; contentFiles: File[] },
    { rejectValue: string }
>('adminCourses/createCourse', async (data, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());
        formData.append('coverImage', data.coverImage);
        data.contentFiles.forEach((file) => {
            formData.append('contentFiles', file); // Simplified to avoid indexing
        });

        console.log('Creating course with FormData:');
        Array.from(formData.entries()).forEach(([key, value]) => {
            console.log(`${key}:`, value instanceof File ? `File(${value.name})` : value);
        });

        console.log('Sending POST request to /v1/admin/courses');
        const response = await apiClient.post('/v1/admin/courses', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Create course response:', response.data);
    } catch (error: any) {
        console.error('Create course error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        return rejectWithValue(
            error.response?.data?.message || 'Внутренняя ошибка сервера при создании курса'
        );
    }
});

export const deleteCourse = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>('adminCourses/deleteCourse', async (slug, { rejectWithValue }) => {
    try {
        console.log('Deleting course with slug:', slug);
        const url = `/v1/admin/courses/${slug}`;
        console.log('Full DELETE URL:', `${apiClient.defaults.baseURL}${url}`); // Логируем полный URL
        const response = await apiClient.delete(url);
        return slug;
    } catch (error: any) {
        console.error('Delete course error:', error);
        return rejectWithValue(error.response?.data?.message || 'Failed to delete course');
    }
});

const adminCoursesSlice = createSlice({
    name: 'adminCourses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminCourses.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAdminCourses.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.courses = action.payload;
            })
            .addCase(fetchAdminCourses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch courses';
            })
            .addCase(createCourse.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createCourse.fulfilled, (state) => {
                state.status = 'succeeded';
                state.status = 'idle'; // Reset for reloading
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to create course';
            })
            .addCase(deleteCourse.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.courses = state.courses.filter((course) => course.slug !== action.payload);
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to delete course';
            });
    },
});

export const selectAdminCourses = (state: RootState) => state.adminCourses.courses;
export const selectAdminCoursesStatus = (state: RootState) => state.adminCourses.status;
export const selectAdminCoursesError = (state: RootState) => state.adminCourses.error;

export default adminCoursesSlice.reducer;