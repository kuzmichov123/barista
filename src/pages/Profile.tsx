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
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(updateUserProfile(formData)).unwrap();
            setMessage('Профиль успешно обновлен.');
        } catch (error: any) {
            console.error('Ошибка при обновлении профиля:', error);
            setMessage(`Ошибка: ${error || 'Попробуйте снова'}`);
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Профиль пользователя</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="firstName" className="block text-gray-700">
                        Имя <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="lastName" className="block text-gray-700">
                        Фамилия <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="middleName" className="block text-gray-700">
                        Отчество
                    </label>
                    <input
                        type="text"
                        id="middleName"
                        value={formData.middleName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="login" className="block text-gray-700">
                        Имя пользователя <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="login"
                        value={formData.login}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <p className="text-gray-700">{user.email}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Роль</label>
                    <p className="text-gray-700">{user.role}</p>
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#4E3B31] to-[#A08974] text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-[#5A3F32] hover:to-[#B59E83] transition-all duration-300"
                >
                    Обновить профиль
                </button>
                {message && (
                    <p className={`mt-4 text-center ${message.includes('Ошибка') ? 'text-red-500' : 'text-green-500'}`}>
                        {message}
                    </p>
                )}
            </form>
            <button
                onClick={() => navigate('/')}
                className="mt-4 w-full text-blue-500 hover:underline text-center"
            >
                На главную
            </button>
        </div>
    );
};