import React from 'react'

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white p-6">
            <div className="container mx-auto text-center">
                <p className="mb-4">© 2024 Бариста Курсы. Все права защищены.</p>
                <div className="space-x-6">
                    <a href="https://facebook.com" className="hover:text-pink-500 transition duration-300">Facebook</a>
                    <a href="https://instagram.com" className="hover:text-pink-500 transition duration-300">Instagram</a>
                    <a href="https://twitter.com" className="hover:text-pink-500 transition duration-300">Twitter</a>
                </div>
            </div>
        </footer>
    )
}
