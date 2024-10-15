import React from 'react'
import { Link } from 'react-router-dom'

export const Header: React.FC = () => {
    return (
        <header className="bg-gradient-to-b from-[#4E3B31] to-[#F6E7D1] p-4 font-halmahera">
            <nav className="container mx-auto flex justify-between items-center space-x-8">
                <Link to="/" className="text-[#F6E7D1] text-2xl font-bold">
                    Бариста Курсы
                </Link>

                <div className="flex space-x-6 items-center">
                    <Link
                        to="/courses"
                        className="text-[#4E3B31] text-lg hover:text-yellow-200 transition-all duration-300">
                        Курсы
                    </Link>
                    <Link
                        to="/about"
                        className="text-[#4E3B31] text-lg hover:text-yellow-200 transition-all duration-300">
                        О нас
                    </Link>
                    <Link
                        to="/contact"
                        className="text-[#4E3B31] text-lg hover:text-yellow-200 transition-all duration-300">
                        Контакты
                    </Link>
                </div>

                <div className="flex space-x-4 items-center">
                    <Link
                        to="/login"
                        className="text-[#F6E7D1] bg-[#4E3B31] px-4 py-2 rounded-lg hover:bg-yellow-200 hover:text-[#4E3B31] transition-all duration-300">
                        Вход
                    </Link>
                    <Link
                        to="/register"
                        className="text-[#4E3B31] border-2 border-[#4E3B31] px-4 py-2 rounded-lg hover:bg-[#4E3B31] hover:text-[#F6E7D1] transition-all duration-300">
                        Регистрация
                    </Link>
                </div>
            </nav>
        </header>
    )
}
