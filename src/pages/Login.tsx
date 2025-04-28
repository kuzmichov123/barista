import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, forgotUserPassword } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../redux/store';

export const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleForgotPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForgotPasswordEmail(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(loginUser(formData)).unwrap();
            console.log('Вход успешен');
            navigate('/');
        } catch (error: any) {
            console.error('Ошибка при входе:', error);
            const errorMessage = error.includes('Email не подтвержден')
                ? 'Ваш email не подтвержден. Пожалуйста, проверьте почту и перейдите по ссылке для подтверждения.'
                : `Ошибка при входе: ${error || 'Попробуйте снова'}`;
            alert(errorMessage);
        }
    };

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(forgotUserPassword({ email: forgotPasswordEmail })).unwrap();
            setForgotPasswordMessage('Письмо для восстановления пароля отправлено. Проверьте почту.');
        } catch (error: any) {
            console.error('Ошибка при восстановлении пароля:', error);
            setForgotPasswordMessage(`Ошибка: ${error || 'Попробуйте снова'}`);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">
                {isForgotPassword ? 'Восстановить пароль' : 'Вход'}
            </h1>
            {!isForgotPassword ? (
                <form onSubmit={handleSubmit}>
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
                            className="w-full border border-gray-300 p-2 rounded-md"
                            required
                        />
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
                            className="w-full border border-gray-300 p-2 rounded-md"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#4E3B31] to-[#A08974] text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-[#5A3F32] hover:to-[#B59E83] transition-all duration-300"
                    >
                        Войти
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="mt-4 w-full text-blue-500 hover:underline text-center"
                    >
                        Забыли пароль?
                    </button>
                </form>
            ) : (
                <form onSubmit={handleForgotPasswordSubmit}>
                    <div className="mb-4">
                        <label htmlFor="forgotPasswordEmail" className="block text-gray-700">
                            Эл. адрес <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="forgotPasswordEmail"
                            placeholder="Эл. адрес"
                            value={forgotPasswordEmail}
                            onChange={handleForgotPasswordChange}
                            className="w-full border border-gray-300 p-2 rounded-md"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#4E3B31] to-[#A08974] text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-[#5A3F32] hover:to-[#B59E83] transition-all duration-300"
                    >
                        Отправить письмо
                    </button>
                    {forgotPasswordMessage && (
                        <p className={`mt-4 text-center ${forgotPasswordMessage.includes('Ошибка') ? 'text-red-500' : 'text-green-500'}`}>
                            {forgotPasswordMessage}
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={() => setIsForgotPassword(false)}
                        className="mt-4 w-full text-blue-500 hover:underline text-center"
                    >
                        Вернуться ко входу
                    </button>
                </form>
            )}
        </div>
    );
};