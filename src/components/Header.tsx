import React from 'react'
import { Link } from 'react-router-dom'

export const Header: React.FC = () => {
    return (
        <header className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4">
            <nav className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-2xl font-bold">Бариста Курсы</Link>
                <div className="space-x-4">
                    <Link
                        to="/courses"
                        className="text-white text-lg hover:text-yellow-300 transition-all duration-300">
                        Курсы
                    </Link>
                    <Link
                        to="/contact"
                        className="text-white text-lg hover:text-yellow-300 transition-all duration-300">
                        Контакты
                    </Link>
                </div>
            </nav>
        </header>
    )
}
