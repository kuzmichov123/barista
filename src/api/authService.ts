import apiClient from "./api";


interface RegisterData {
    firstName: string;
    lastName: string;
    middleName: string;
    login: string;
    email: string;
    password: string;
}

interface LoginData {
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

interface RefreshTokenData {
    refreshToken: string;
}

export const register = async (data: RegisterData) => {
    console.log('Sending registration request with data:', data);
    try {
        const response = await apiClient.post('/v1/user/registration', data);
        console.log('Registration response:', response.status, response.data);
        return {
            username: data.firstName,
            email: data.email,
        };
    } catch (error: any) {
        console.error('Registration error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw new Error('Ошибка регистрации: ' + (error.response?.data?.message || error.message));
    }
};

export const login = async ({ email, password }: LoginData) => {
    console.log('Sending login request with data:', { email, password });
    try {
        const response = await apiClient.post('/v1/user/login', { email, password });
        console.log('Login response:', response.status, response.data);
        return response.data;
    } catch (error: any) {
        console.error('Login error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw new Error('Ошибка авторизации: ' + (error.response?.data?.message || error.message));
    }
};

export const updateProfile = async (data: UpdateProfileData) => {
    console.log('Sending update profile request with data:', data);
    try {
        const response = await apiClient.patch('/v1/user', data);
        console.log('Update profile response:', response.status, response.data);
        return response.data;
    } catch (error: any) {
        console.error('Update profile error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw new Error('Ошибка при обновлении профиля: ' + (error.response?.data?.message || error.message));
    }
};

export const confirmEmail = async ({ token }: ConfirmEmailData) => {
    console.log('Sending confirm email request with token:', token);
    try {
        const response = await apiClient.post('/v1/user/confirm/email', { token });
        console.log('Confirm email response:', response.status, response.data);
        return response.data;
    } catch (error: any) {
        console.error('Confirm email error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw new Error('Ошибка при подтверждении email: ' + (error.response?.data?.message || error.message));
    }
};

export const forgotPassword = async ({ email }: ForgotPasswordData) => {
    console.log('Sending forgot password request for email:', email);
    try {
        const response = await apiClient.post('/v1/user/password', { email });
        console.log('Forgot password response:', response.status, response.data);
        return response.data;
    } catch (error: any) {
        console.error('Forgot password error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw new Error('Ошибка при запросе восстановления пароля: ' + (error.response?.data?.message || error.message));
    }
};

export const confirmPassword = async ({ newPassword }: ConfirmPasswordData) => {
    console.log('Sending confirm password request');
    try {
        const response = await apiClient.post('/v1/user/confirm/password', { newPassword });
        console.log('Confirm password response:', response.status, response.data);
        return response.data;
    } catch (error: any) {
        console.error('Confirm password error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw new Error('Ошибка при сбросе пароля: ' + (error.response?.data?.message || error.message));
    }
};

export const refreshToken = async ({ refreshToken }: RefreshTokenData) => {
    console.log('Sending refresh token request');
    try {
        const response = await apiClient.post('/v1/auth/refresh', { refreshToken });
        console.log('Refresh token response:', response.status, response.data);
        return response.data;
    } catch (error: any) {
        console.error('Refresh token error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw new Error('Ошибка при обновлении токена: ' + (error.response?.data?.message || error.message));
    }
};