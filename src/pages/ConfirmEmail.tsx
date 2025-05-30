import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import apiClient from '../api/api';

export const ConfirmEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('Подтверждение email...');

    useEffect(() => {
        console.log('ConfirmEmail: Component mounted');
        if (!token) {
            setStatus('Ошибка: токен отсутствует');
            console.log('ConfirmEmail: No token provided');
            return;
        }

        console.log('ConfirmEmail: Sending confirm email request with token:', token);
        apiClient
            .post('/v1/user/confirm/email', { token })
            .then(res => {
                console.log('ConfirmEmail: Response status:', res.status);
                if (res.status === 204) {
                    setStatus('Email успешно подтвержден!');
                    console.log('ConfirmEmail: Navigating to /barista/login?confirmed=true');
                    navigate('/barista/login?confirmed=true', { replace: true });
                    console.log('ConfirmEmail: Navigate called');
                } else {
                    console.log('ConfirmEmail: Unexpected response status:', res.status);
                    setStatus('Ошибка: неожиданный ответ сервера');
                }
            })
            .catch(err => {
                console.error('ConfirmEmail: Error:', err);
                const errorMessage = err.response?.data?.message || err.message || 'Ошибка сервера';
                setStatus(`Ошибка: ${errorMessage}`);
            });

        return () => {
            console.log('ConfirmEmail: Component unmounted');
        };
    }, [token, navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>{status}</h2>
        </div>
    );
};