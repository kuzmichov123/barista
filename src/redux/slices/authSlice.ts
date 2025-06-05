import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, register, updateProfile, confirmEmail, forgotPassword, confirmPassword } from '../../api';
import { RootState } from '../store';

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    firstName: string;
    lastName: string;
    middleName: string;
    login: string;
    email: string;
    password: string;
}

interface UpdateProfileData {
    firstName: string;
    lastName: string;
    middleName: string;
    login: string;
}

interface ConfirmEmailData {
    token: string;
}

interface ForgotPasswordData {
    email: string;
}

interface ConfirmPasswordData {
    newPassword: string;
}

interface AuthState {
    user: {
        firstName: string;
        lastName: string;
        middleName: string;
        login: string;
        email: string;
        role: string;
    } | null;
    accessToken: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null | any;
}

const LOCAL_STORAGE_USER_KEY = 'authUser';
const LOCAL_STORAGE_ACCESS_TOKEN = 'accessToken';
const LOCAL_STORAGE_REFRESH_TOKEN = 'refreshToken';

const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_KEY)!)
    : null;
const savedAccessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN) || null;
const savedRefreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN) || null;

export const loginUser = createAsyncThunk<
    { user: AuthState['user']; accessToken: string; refreshToken: string },
    LoginData,
    { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const data = await login(credentials);
        return {
            user: {
                firstName: data.firstName,
                lastName: data.lastName,
                middleName: data.middleName,
                login: data.login,
                email: data.email,
                role: data.role,
            },
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        };
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const registerUser = createAsyncThunk<
    { username: string; email: string },
    RegisterData,
    { rejectValue: any }
>('auth/register', async (data, { rejectWithValue }) => {
    try {
        const result = await register(data);
        return result;
    } catch (error: any) {
        return rejectWithValue(error);
    }
});

export const updateUserProfile = createAsyncThunk<
    AuthState['user'] & { accessToken: string },
    UpdateProfileData,
    { rejectValue: string; state: RootState }
>('auth/updateProfile', async (data, { rejectWithValue, getState }) => {
    try {
        const result = await updateProfile(data);
        const currentUser = getState().auth.user;
        return {
            firstName: result.firstName,
            lastName: result.lastName,
            middleName: result.middleName,
            login: result.login,
            email: currentUser?.email || '',
            role: currentUser?.role || '',
            accessToken: result.accessToken,
        };
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const confirmUserEmail = createAsyncThunk<
    void,
    ConfirmEmailData,
    { rejectValue: string }
>('auth/confirmEmail', async (data, { rejectWithValue }) => {
    try {
        await confirmEmail(data);
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const forgotUserPassword = createAsyncThunk<
    void,
    ForgotPasswordData,
    { rejectValue: string }
>('auth/forgotPassword', async (data, { rejectWithValue }) => {
    try {
        await forgotPassword(data);
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const confirmUserPassword = createAsyncThunk<
    void,
    ConfirmPasswordData,
    { rejectValue: string }
>('auth/confirmPassword', async (data, { rejectWithValue }) => {
    try {
        await confirmPassword(data);
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: savedUser,
        accessToken: savedAccessToken,
        refreshToken: savedRefreshToken,
        loading: false,
        error: null,
    } as AuthState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
            localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
            localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(action.payload.user));
                localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, action.payload.accessToken);
                localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN, action.payload.refreshToken);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка при входе';
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка при регистрации';
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = { ...state.user, ...action.payload } as AuthState['user'];
                state.accessToken = action.payload.accessToken;
                localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(state.user));
                localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, action.payload.accessToken);
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ;
            })
            .addCase(confirmUserEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(confirmUserEmail.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(confirmUserEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка при подтверждении email';
            })
            .addCase(forgotUserPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotUserPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(forgotUserPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка при запросе восстановления пароля';
            })
            .addCase(confirmUserPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(confirmUserPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(confirmUserPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка при сбросе пароля';
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;