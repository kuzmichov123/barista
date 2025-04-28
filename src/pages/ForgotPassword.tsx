import { useState } from 'react';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://94.232.244.69:8095/api/v1/user/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            console.log('Response status:', res.status);
            if (res.status === 204) {
                setStatus('Если email зарегистрирован, ссылка для сброса пароля отправлена.');
                return;
            }

            const data = await res.json();
            throw new Error(data.error || 'Ошибка сервера');
        } catch (err: unknown) {
            console.error('Fetch error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Ошибка сервера';
            setStatus(`Ошибка: ${errorMessage}`);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Восстановление пароля</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Введите ваш email"
                    required
                />
                <button
                    type="submit"
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    Отправить ссылку
                </button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
};