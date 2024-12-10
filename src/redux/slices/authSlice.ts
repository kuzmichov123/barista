import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Интерфейсы данных
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
}

interface AuthState {
    user: { username: string; email: string } | null
    loading: boolean
    error: string | null
}

// Ключ для хранения данных пользователя в localStorage
const LOCAL_STORAGE_USER_KEY = 'authUser'

// Попытка восстановления пользователя из localStorage
const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_KEY)!)
    : null;

console.log('Сохраненный пользователь при инициализации Redux: ', savedUser);


// AsyncThunk: логин пользователя
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: LoginData, thunkAPI) => {
        try {
            console.log('credentials: ', credentials); // Проверяем отправляемые данные
            const response = await fetch('/api/v1/user-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            console.log('response.status: ', response.status); // Проверяем статус ответа

            if (!response.ok) {
                throw new Error('Ошибка при входе');
            }

            const data = await response.json();
            console.log('data: ', data);

            return {
                username: data.username,
                email: data.email,
            };
        } catch (error: any) {
            console.error('Ошибка при входе: ', error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


// AsyncThunk: регистрация пользователя
export const registerUser = createAsyncThunk<
    { username: string; email: string },
    RegisterData,
    { rejectValue: string }
>(
    'auth/register',
    async (data: RegisterData, thunkAPI) => {
        try {
            const payload = {
                nameUser: data.name,
                loginUser: data.username,
                email: data.email,
                password: data.password,
            }

            const response = await fetch('/api/v1/user-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error('Ошибка при регистрации')
            }

            const serverResponse = await response.json()
            console.log('Ответ от сервера после регистрации: ', serverResponse)

            return {
                username: data.username,
                email: data.email,
            }
        } catch (error: any) {
            console.error('Ошибка при регистрации: ', error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

// Slice для авторизации
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: savedUser,
        loading: false,
        error: null,
    } as AuthState,
    reducers: {
        logout: (state) => {
            console.log('Очищаем Redux и localStorage при разлогинивании')
            state.user = null
            localStorage.removeItem(LOCAL_STORAGE_USER_KEY)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log('Login успешен, обновляем хранилище и localStorage', action.payload)
                state.loading = false
                state.user = action.payload
                localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(action.payload))
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? String(action.payload) : 'Ошибка при входе';
            })

            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                console.log('Регистрация успешна, обновляем хранилище и localStorage', action.payload)
                state.loading = false
                state.user = action.payload
                localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(action.payload))
            })
            .addCase(registerUser.rejected, (state, action) => {
                console.error('Ошибка при регистрации: ', action.payload)
                state.loading = false
                state.error = action.payload || 'Ошибка при регистрации'
            })
    },
})

// Экспортируем действия и редьюсер
export const { logout } = authSlice.actions
export default authSlice.reducer
