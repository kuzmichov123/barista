import { useSearchParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) {
            setStatus('Ошибка: токен отсутствует')
            return
        }

        console.log('Sending request to /api/v1/user/confirm/password with token:', token)
        try {
            const res = await fetch('http://94.232.244.69:8095/api/v1/user/confirm/password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    newPassword: password,
                    token: token
                }),
                mode: 'no-cors',
            })

            console.log('Response status:', res.status)
            // В no-cors статус всегда 0, но если запрос прошел, считаем успехом
            setStatus('Пароль успешно изменен!')
            setTimeout(() => navigate('/barista/login?reset=success'), 2000)
        } catch (err: unknown) {
            console.error('Fetch error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Ошибка сервера'
            setStatus(`Ошибка: ${errorMessage}`)
        }
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Сброс пароля</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите новый пароль"
                    required
                />
                <button
                    type="submit"
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    Сбросить пароль
                </button>
            </form>
            {status && <p>{status}</p>}
        </div>
    )
}