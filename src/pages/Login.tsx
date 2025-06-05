import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, forgotUserPassword } from '../redux/slices/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppDispatch } from '../redux/store';

export const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null); // Состояние для ошибки входа
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('confirmed') === 'true') {
            setConfirmationMessage('Ваш email успешно подтвержден! Пожалуйста, войдите.');
        }
        return () => {};
    }, [location.search]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value })); // Обновляем состояние
        setLoginError(null); // Сбрасываем ошибку при изменении
    };

    const handleForgotPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForgotPasswordEmail(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);
        try {
            await dispatch(loginUser(formData)).unwrap();
            navigate('/');
        } catch (error: any) {
            const errorMessage = error || 'Произошла ошибка при входе';
            setLoginError(errorMessage);
        }
    };

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setForgotPasswordMessage(null); // Сбрасываем сообщение перед запросом
        try {
            await dispatch(forgotUserPassword({ email: forgotPasswordEmail })).unwrap();
            setForgotPasswordMessage('Письмо для восстановления пароля отправлено. Проверьте почту.');
        } catch (error: any) {
            setForgotPasswordMessage(error || 'Произошла ошибка при восстановлении пароля');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">
                {isForgotPassword ? 'Восстановить пароль' : 'Вход'}
            </h1>
            {confirmationMessage && (
                <p className="text-green-500 text-center mb-4">{confirmationMessage}</p>
            )}
            {!isForgotPassword ? (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">
                            Эл. адрес <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email" // Исправлено с " `\email" на "email"
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
                    {loginError && (
                        <p className="text-red-500 text-center mb-4">{loginError}</p>
                    )}
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
                    {forgotPasswordMessage && (
                        <p
                            className={`mt-4 text-center ${
                                forgotPasswordMessage.includes('Ошибка')
                                    ? 'text-red-500'
                                    : 'text-green-500'
                            }`}
                        >
                            {forgotPasswordMessage}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#4E3B31] to-[#A08974] text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-[#5A3F32] hover:to-[#B59E83] transition-all duration-300"
                    >
                        Отправить письмо
                    </button>
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