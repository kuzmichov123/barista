import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../redux/slices/authSlice'
import ReCAPTCHA from 'react-google-recaptcha'
import { AppDispatch } from '../redux/store' 

export const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        captcha: ''
    })

    const dispatch = useDispatch<AppDispatch>()

    const onRecaptchaChange = (value: string | null) => {
        setFormData({ ...formData, captcha: value || '' })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData({ ...formData, [id]: value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(loginUser(formData)) 
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Авторизация</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Имя пользователя/Эл. адрес"
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

                <div className="mb-6">
                    <ReCAPTCHA sitekey="your-site-key" onChange={onRecaptchaChange} />
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#4E3B31] to-[#A08974] text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-[#5A3F32] hover:to-[#B59E83] transition-all duration-300"
                >
                    Вход
                </button>

                <div className="flex justify-between mt-4 text-sm text-gray-700">
                    <a href="/register" className="hover:text-gray-900">Регистрация</a>
                    <a href="" className="hover:text-gray-900">Забыли пароль</a>
                </div>
            </form>
        </div>
    )
}
