import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const ConfirmEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('Подтверждение email...');

    useEffect(() => {
        if (!token) {
            setStatus('Ошибка: токен отсутствует');
            return;
        }

        console.log('Sending request to /api/v1/user/confirm/email with token:', token);
        fetch('/api/v1/user/confirm/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({}),
        })
            .then(res => {
                console.log('Response status:', res.status);
                if (res.status === 204) {
                    setStatus('Email успешно подтвержден!');
                    setTimeout(() => navigate('/barista/login?confirmed=true'), 2000);
                    return;
                }
                if (res.status === 401) {
                    throw new Error('Недействительный или истекший токен');
                }
                return res.json().then(data => {
                    throw new Error(data.error || 'Ошибка сервера');
                });
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setStatus(`Ошибка: ${err.message || 'Ошибка сервера'}`);
            });
    }, [token, navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>{status}</h2>
        </div>
    );
};