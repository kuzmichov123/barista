import React, { useState } from 'react'

export const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/v1/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            if (!response.ok) {
                throw new Error('Не удалось отправить запрос. Проверьте email и попробуйте снова.')
            }

            setSuccessMessage('Ссылка для восстановления пароля была отправлена на ваш email.')
            setErrorMessage('')
            setEmail('')
        } catch (error: any) {
            setErrorMessage(error.message)
            setSuccessMessage('')
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Забыли пароль</h1>
            <p className="text-sm text-gray-600 mb-4 text-center">
                Введите свой email, и мы отправим вам ссылку для восстановления пароля.
            </p>
            {successMessage && (
                <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                    {errorMessage}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Введите ваш email"
                        value={email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#4E3B31] to-[#A08974] text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-[#5A3F32] hover:to-[#B59E83] transition-all duration-300"
                >
                    Отправить
                </button>

                <div className="flex justify-between mt-4 text-sm text-gray-700">
                    <a href="/login" className="hover:text-gray-900">Назад к входу</a>
                    <a href="/register" className="hover:text-gray-900">Регистрация</a>
                </div>
            </form>
        </div>
    )
}
