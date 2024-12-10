import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { registerUser } from '../redux/slices/authSlice'
import { useNavigate } from 'react-router-dom' // Импорт useNavigate
import { AppDispatch } from '../redux/store'

export const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const dispatch = useDispatch<AppDispatch>() // Используем типизированный dispatch
    const navigate = useNavigate() // Инициализация useNavigate

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData({ ...formData, [id]: value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            alert('Пароли не совпадают')
            return
        }

        try {
            await dispatch(registerUser(formData)).unwrap()
            console.log('Регистрация успешна')
            navigate('/') // Перенаправление на главную страницу
        } catch (error) {
            console.error('Ошибка при регистрации:', error)
            alert('Ошибка при регистрации. Попробуйте снова.')
        }
    }

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Регистрация</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700">Имя <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Имя"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700">Имя пользователя <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Имя пользователя (только латинские символы)"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
                    />
                    <p className="text-sm text-gray-500 mt-1">Только латинские символы</p>
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">Эл. адрес <span className="text-red-500">*</span></label>
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
                    <label htmlFor="password" className="block text-gray-700">Пароль <span className="text-red-500">*</span></label>
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

                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-gray-700">Подтверждение пароля <span className="text-red-500">*</span></label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Подтверждение пароля"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#4E3B31] to-[#A08974] text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-[#5A3F32] hover:to-[#B59E83] transition-all duration-300"
                >
                    Зарегистрируйтесь сейчас
                </button>
            </form>
        </div>
    )
}
