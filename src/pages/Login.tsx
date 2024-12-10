import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../redux/slices/authSlice'
import { useNavigate } from 'react-router-dom' // Импорт useNavigate
import { AppDispatch, RootState } from '../redux/store'

export const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate() // Инициализация useNavigate
    const isLoading = useSelector((state: RootState) => state.auth.loading)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData({ ...formData, [id]: value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await dispatch(loginUser(formData)).unwrap()
            console.log('Вход выполнен успешно')
            navigate('/') // Перенаправление на главную страницу
        } catch (error) {
            console.error('Ошибка при входе:', error)
            alert('Неправильный email или пароль')
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Авторизация</h1>
            {isLoading && <p>Загрузка...</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">Email</label>
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
                    <label htmlFor="password" className="block text-gray-700">Пароль</label>
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
                    Вход
                </button>

                <div className="flex justify-between mt-4 text-sm text-gray-700">
                    <a href="/register" className="hover:text-gray-900">Регистрация</a>
                    <a href="/forgot-password" className="hover:text-gray-900">Забыли пароль</a>
                </div>
            </form>
        </div>
    )
}
