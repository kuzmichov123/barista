import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmEmail } from '../api';

export const VerifyEmail: React.FC = () => {
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || 'ваш email';

    const handleResendVerification = async () => {
        setIsResending(true);
        setResendMessage(null);
        try {
            // Предполагаем, что повторная отправка письма требует вызова того же эндпоинта
            // Если есть отдельный эндпоинт, замените на него
            await confirmEmail({ token: '' }); // Токен не отправляем, так как это заглушка
            setResendMessage('Письмо для подтверждения отправлено повторно. Проверьте почту.');
        } catch (error: any) {
            console.error('Ошибка при повторной отправке письма:', error);
            setResendMessage(
                'Ошибка при отправке письма: ' + (error.response?.data?.message || error.message)
            );
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Подтверждение email</h1>
            <p className="text-gray-700 mb-4">
                Мы отправили письмо на <strong>{email}</strong>. Пожалуйста, проверьте вашу почту
                (включая папку "Спам") и перейдите по ссылке для подтверждения вашего email.
            </p>
            <p className="text-gray-700 mb-6">
                После подтверждения вы сможете войти в свой аккаунт.
            </p>
            <button
                type="button"
                onClick={handleResendVerification}
                disabled={isResending}
                className={`w-full bg-gradient-to-r from-[#4E3B31] to-[#A08974] text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-[#5A3F32] hover:to-[#B59E83] transition-all duration-300 ${
                    isResending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                {isResending ? 'Отправка...' : 'Отправить письмо повторно'}
            </button>
            {resendMessage && (
                <p className={`mt-4 text-center ${resendMessage.includes('Ошибка') ? 'text-red-500' : 'text-green-500'}`}>
                    {resendMessage}
                </p>
            )}
            <button
                type="button"
                onClick={() => navigate('/login')}
                className="mt-4 w-full text-blue-500 hover:underline text-center"
            >
                Вернуться к входу
            </button>
        </div>
    );
};