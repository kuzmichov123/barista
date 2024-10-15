import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gradient-to-t from-[#4E3B31] to-[#F6E7D1] text-gray-800 p-4 font-halmahera">
            <div className="container mx-auto flex justify-between items-center">
                <p>© 2024 Бариста Курсы. Все права защищены.</p>
                <div className="space-x-6">
                    <a href="https://facebook.com" className="hover:text-yellow-200 transition duration-300">Facebook</a>
                    <a href="https://instagram.com" className="hover:text-yellow-200 transition duration-300">Instagram</a>
                    <a href="https://twitter.com" className="hover:text-yellow-200 transition duration-300">Twitter</a>
                </div>
            </div>
        </footer>
    );
}
