import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface LoginData {
    email: string
    password: string
}

interface RegisterData {
    name: string
    username: string 
    email: string
    password: string
    confirmPassword: string
    captcha: string
}

export const loginUser = createAsyncThunk('auth/login', async (credentials: LoginData) => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    })
    if (!response.ok) {
        throw new Error('Ошибка при входе') 
    }
    return await response.json()
})

export const registerUser = createAsyncThunk('auth/register', async (data: RegisterData) => {
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!response.ok) {
        throw new Error('Ошибка при регистрации') 
    }
    return await response.json()
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null as string | null, // Определяем error как string или null
    },
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload // Сохраните пользователя в состоянии
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message ?? 'Ошибка при входе' // Обработка ошибки
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload // Сохраните пользователя в состоянии
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message ?? 'Ошибка при регистрации' // Обработка ошибки
            })
    },
})

export const { } = authSlice.actions 
export default authSlice.reducer
