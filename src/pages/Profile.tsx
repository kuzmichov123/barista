import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../redux/slices/authSlice';
import { RootState, AppDispatch } from '../redux/store';

export const Profile: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        middleName: user?.middleName || '',
        login: user?.login || '',
    });
    const [message, setMessage] = useState<string | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        if (id === 'login') {
            setLoginError(null); // Сбрасываем ошибку при изменении логина
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(updateUserProfile(formData)).unwrap();
            setMessage('Профиль успешно обновлен.');
            setLoginError(null);
            setIsEditing(false);
        } catch (error: any) {
            const errorData = error || {};
            const errorMessage = errorData?.message || errorData?.toString() || 'Произошла неизвестная ошибка';
            const errorCode = errorData?.error || errorData?.code;

            if (errorCode === 'LOGIN_EXISTS' || errorMessage.toLowerCase().includes('уже существует')) {
                setLoginError(errorMessage);
                setMessage(null);
            } else {
                setMessage(`${errorMessage}`);
                setLoginError(null);
            }
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setMessage(null);
        setLoginError(null);
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="fixed flex h-full w-full items-center justify-center">
            <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-6">
                <div className="flex flex-col items-center lg:items-start">
                    <div className="w-36 h-36 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg transform transition-all duration-500 hover:shadow-2xl hover:scale-105">
                        <svg
                            className="w-24 h-32 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                    <h1 className="mt-3 text-2xl font-extrabold text-gray-800 text-center lg:text-left tracking-tight">
                        {formData.firstName} {formData.lastName}
                    </h1>
                    {user.role !== 'User' && (
                        <p className="mt-1 text-base text-gray-800 font-semibold bg-gradient-to-r from-[#4A90E2] to-[#63B3ED] bg-clip-text text-transparent text-center lg:text-left">
                            {user.role}
                        </p>
                    )}
                </div>
                <div className="flex-1 w-full">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="firstName" className="block text-sm text-gray-700 font-medium">
                                    Имя <span className="text-gray-500 opacity-50">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 p-1.5 bg-transparent border-b-2 border-gray-300 text-gray-800 placeholder-gray-400 focus:border-[#4E3B31] focus:outline-none transition-all duration-300 disabled:border-gray-300 disabled:text-gray-400 text-sm"
                                    required
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm text-gray-700 font-medium">
                                    Фамилия <span className="text-gray-500 opacity-50">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 p-1.5 bg-transparent border-b-2 border-gray-300 text-gray-800 placeholder-gray-400 focus:border-[#4E3B31] focus:outline-none transition-all duration-300 disabled:border-gray-300 disabled:text-gray-400 text-sm"
                                    required
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="middleName" className="block text-sm text-gray-700 font-medium">
                                    Отчество
                                </label>
                                <input
                                    type="text"
                                    id="middleName"
                                    value={formData.middleName}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 p-1.5 bg-transparent border-b-2 border-gray-300 text-gray-800 placeholder-gray-400 focus:border-[#4E3B31] focus:outline-none transition-all duration-300 disabled:border-gray-300 disabled:text-gray-400 text-sm"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label htmlFor="login" className="block text-sm text-gray-700 font-medium">
                                    Имя пользователя <span className="text-gray-500 opacity-50">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="login"
                                    value={formData.login}
                                    onChange={handleInputChange}
                                    className={`w-full mt-1 p-1.5 bg-transparent border-b-2 text-gray-800 placeholder-gray-400 focus:border-[#4E3B31] focus:outline-none transition-all duration-300 disabled:border-gray-300 disabled:text-gray-400 text-sm ${loginError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    required
                                    disabled={!isEditing}
                                />
                                {loginError && (
                                    <div className="text-red-500 text-sm mt-1">{loginError}</div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 font-medium">Почта</label>
                            <p className="mt-1 text-sm text-gray-600">{user.email}</p>
                        </div>
                        {message && (
                            <p className={`mt-2 text-sm ${message.includes('Ошибка') ? 'text-red-500' : 'text-green-500'} font-medium`}>
                                {message}
                            </p>
                        )}
                        {isEditing && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                <button
                                    type="submit"
                                    className="px-5 py-1.5 bg-gradient-to-r from-[#4E3B31] to-[#A08974] text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-[#5A3F32] hover:to-[#B59E83] transition-all duration-300 transform hover:scale-105 text-sm"
                                >
                                    Обновить данные
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-5 py-1.5 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 text-sm"
                                >
                                    Отмена
                                </button>
                            </div>
                        )}
                    </form>
                    {!isEditing && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            <button
                                onClick={handleEditClick}
                                className="px-5 py-1.5 bg-gradient-to-r from-[#4E3B31] to-[#A08974] text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-[#5A3F32] hover:to-[#B59E83] transition-all duration-300 transform hover:scale-105 text-sm"
                            >
                                Редактировать профиль
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="px-5 py-1.5 text-gray-600 font-medium hover:text-gray-800 transition-colors duration-200 border border-gray-300 rounded-full hover:bg-gray-200 hover:border-gray-400 transition-all duration-300 text-sm"
                            >
                                На главную
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};