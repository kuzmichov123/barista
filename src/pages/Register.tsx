import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../redux/store';

const FullScreenLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#4E3B31]"></div>
        </div>
    );
};

export const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        login: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        middleName?: string;
        login?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        general?: string;
    }>({});
    const [isLoading, setIsLoading] = useState(false); // Состояние для полноэкранного лоудера

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Имя обязательно';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Фамилия обязательна';
        }
        if (!formData.login.trim()) {
            newErrors.login = 'Имя пользователя обязательно';
        } else if (!/^[a-zA-Z0-9]+$/.test(formData.login)) {
            newErrors.login = 'Только латинские символы и цифры';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Эл. адрес обязателен';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Неверный формат эл. адреса';
        }
        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен быть не короче 6 символов';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        setErrors((prev) => ({ ...prev, [id]: undefined, general: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true); // Показываем лоудер

        try {
            const { confirmPassword, ...registerData } = formData;
            await dispatch(registerUser(registerData)).unwrap();
            navigate('/verify-email', { state: { email: formData.email } });
        } catch (error: any) {
            console.log('Server error:', error);
            console.log('Error structure:', JSON.stringify(error, null, 2));

            setErrors((prev) => ({ ...prev, email: undefined, login: undefined, general: undefined }));

            const errorData = error || {};
            const errorMessage = errorData?.message || errorData?.toString() || 'Произошла неизвестная ошибка';
            const errorCode = errorData?.error || errorData?.code;

            console.log('Extracted errorCode:', errorCode);
            console.log('Extracted errorMessage:', errorMessage);

            if (errorCode === 'EMAIL_EXISTS') {
                setErrors((prev) => {
                    const newErrors = { ...prev, email: errorMessage };
                    console.log('Updated errors:', newErrors);
                    return newErrors;
                });
            } else if (errorCode === 'LOGIN_EXISTS') {
                setErrors((prev) => {
                    const newErrors = { ...prev, login: errorMessage };
                    console.log('Updated errors:', newErrors);
                    return newErrors;
                });
            } else {
                setErrors((prev) => {
                    const newErrors = { ...prev, general: errorMessage };
                    console.log('Updated errors:', newErrors);
                    return newErrors;
                });
            }
        } finally {
            setIsLoading(false); // Скрываем лоудер
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Регистрация</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="firstName" className="block text-gray-700">
                        Имя <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        placeholder="Имя"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full border ${errors.firstName ? 'border-red-500 !important bg-red-50 !important' : 'border-gray-300'} p-2 rounded-md focus:ring-2 focus:ring-[#4E3B31] focus:border-transparent`}
                        required
                    />
                    {errors.firstName && (
                        <div className="text-red-500 text-sm mt-1">{errors.firstName}</div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="lastName" className="block text-gray-700">
                        Фамилия <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        placeholder="Фамилия"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full border ${errors.lastName ? 'border-red-500 !important bg-red-50 !important' : 'border-gray-300'} p-2 rounded-md focus:ring-2 focus:ring-[#4E3B31] focus:border-transparent`}
                        required
                    />
                    {errors.lastName && (
                        <div className="text-red-500 text-sm mt-1">{errors.lastName}</div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="middleName" className="block text-gray-700">
                        Отчество
                    </label>
                    <input
                        type="text"
                        id="middleName"
                        placeholder="Отчество"
                        value={formData.middleName}
                        onChange={handleInputChange}
                        className={`w-full border ${errors.middleName ? 'border-red-500 !important bg-red-50 !important' : 'border-gray-300'} p-2 rounded-md focus:ring-2 focus:ring-[#4E3B31] focus:border-transparent`}
                    />
                    {errors.middleName && (
                        <div className="text-red-500 text-sm mt-1">{errors.middleName}</div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="login" className="block text-gray-700">
                        Имя пользователя <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="login"
                        placeholder="Имя пользователя (только латинские символы)"
                        value={formData.login}
                        onChange={handleInputChange}
                        className={`w-full border ${errors.login ? 'border-red-500 !important bg-red-50 !important' : 'border-gray-300'} p-2 rounded-md focus:ring-2 focus:ring-[#4E3B31] focus:border-transparent`}
                        required
                    />
                    <p className="text-sm text-gray-500 mt-1">Только латинские символы и цифры</p>
                    {errors.login && (
                        <div className="text-red-500 text-sm mt-1">{errors.login}</div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">
                        Эл. адрес <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Эл. адрес"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full border ${errors.email ? 'border-red-500 !important bg-red-50 !important' : 'border-gray-300'} p-2 rounded-md focus:ring-2 focus:ring-[#4E3B31] focus:border-transparent`}
                        required
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                        <div id="email-error" className="text-red-500 text-sm mt-1">{errors.email}</div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700">
                        Пароль <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full border ${errors.password ? 'border-red-500 !important bg-red-50 !important' : 'border-gray-300'} p-2 rounded-md focus:ring-2 focus:ring-[#4E3B31] focus:border-transparent`}
                        required
                    />
                    {errors.password && (
                        <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-gray-700">
                        Подтвердите пароль <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Подтвердите пароль"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full border ${errors.confirmPassword ? 'border-red-500 !important bg-red-50 !important' : 'border-gray-300'} p-2 rounded-md focus:ring-2 focus:ring-[#4E3B31] focus:border-transparent`}
                        required
                    />
                    {errors.confirmPassword && (
                        <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>
                    )}
                </div>

                {errors.general && (
                    <div className="mb-4 text-red-500 text-center bg-red-50 p-2 rounded-md">
                        {errors.general}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#4E3B31] to-[#A08974] text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-[#5A3F32] hover:to-[#B59E83] transition-all duration-300"
                    disabled={isLoading}
                >
                    Зарегистрируйтесь сейчас
                </button>
            </form>
            {isLoading && <FullScreenLoader />}
        </div>
    );
};