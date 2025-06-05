import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';

export const Header: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const isOnVerifyEmail = location.pathname === '/verify-email';
    const isOnResetPassword = location.pathname === '/reset-password';

    return (
        <header className="bg-[#4E3B31] p-2 font-halmahera flex items-center justify-center">
            <nav className="container flex justify-between items-center">
                <Link
                    to="/"
                    className="text-[#F6E7D1] text-2xl font-bold hover:text-yellow-200 transition-all duration-300"
                    onClick={closeMenu}
                >
                    Бариста Курсы
                </Link>

                <button
                    className="md:hidden text-[#F6E7D1] text-2xl focus:outline-none hover:text-white transition duration-300"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

                <div className="hidden md:flex space-x-6 items-center text-[#F6E7D1]">
                    <Link
                        to="/courses"
                        className="text-lg hover:text-yellow-200 hover:scale-105 transition-all duration-300"
                    >
                        Курсы
                    </Link>
                    {user && (
                        <Link
                            to="/my-courses"
                            className="text-lg hover:text-yellow-200 hover:scale-105 transition-all duration-300"
                        >
                            Мои курсы
                        </Link>
                    )}
                    <Link
                        to="/about"
                        className="text-lg hover:text-yellow-200 hover:scale-105 transition-all duration-300"
                    >
                        О нас
                    </Link>
                    <Link
                        to="/contact"
                        className="text-lg hover:text-yellow-200 hover:scale-105 transition-all duration-300"
                    >
                        Служба поддержки
                    </Link>
                </div>

                <div className="hidden md:flex space-x-4 items-center text-[#F6E7D1]">
                    {user ? (
                        <>
                            <Link
                                to="/profile"
                                className="bg-[#5B483D] px-4 py-2 rounded-lg text-[#F6E7D1] hover:bg-yellow-200 hover:text-[#4E3B31] hover:scale-105 transition-all duration-300 shadow-md"
                            >
                                Мой аккаунт
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="border-2 border-[#F6E7D1] px-4 py-2 rounded-lg text-[#F6E7D1] hover:bg-yellow-200 hover:text-[#4E3B31] hover:scale-105 transition-all duration-300 shadow-md"
                            >
                                Выйти
                            </button>
                            {user.role === 'Admin' && ( // Добавляем кнопку "Панель управления" для админов
                                <Link
                                    to="/admin/courses"
                                    className="bg-[#5B483D] px-4 py-2 rounded-lg text-[#F6E7D1] hover:bg-yellow-200 hover:text-[#4E3B31] hover:scale-105 transition-all duration-300 shadow-md"
                                >
                                    Панель управления
                                </Link>
                            )}
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="bg-[#5B483D] px-4 py-2 rounded-lg text-[#F6E7D1] hover:bg-yellow-200 hover:text-[#4E3B31] hover:scale-105 transition-all duration-300 shadow-md"
                            >
                                Вход
                            </Link>
                            {isOnVerifyEmail ? (
                                <Link
                                    to="/verify-email"
                                    className="border-2 border-[#F6E7D1] px-4 py-2 rounded-lg text-[#F6E7D1] hover:bg-yellow-200 hover:text-[#4E3B31] hover:scale-105 transition-all duration-300 shadow-md"
                                >
                                    Подтвердить email
                                </Link>
                            ) : isOnResetPassword ? (
                                <Link
                                    to="/reset-password"
                                    className="border-2 border-[#F6E7D1] px-4 py-2 rounded-lg text-[#F6E7D1] hover:bg-yellow-200 hover:text-[#4E3B31] hover:scale-105 transition-all duration-300 shadow-md"
                                >
                                    Сбросить пароль
                                </Link>
                            ) : (
                                <Link
                                    to="/register"
                                    className="border-2 border-[#F6E7D1] px-4 py-2 rounded-lg text-[#F6E7D1] hover:bg-yellow-200 hover:text-[#4E3B31] hover:scale-105 transition-all duration-300 shadow-md"
                                >
                                    Регистрация
                                </Link>
                            )}
                        </>
                    )}
                </div>

                {isMenuOpen && (
                    <div className="md:hidden absolute top-12 py-5 left-0 w-full bg-[#4E3B31] flex flex-col items-center text-[#F6E7D1] z-50 shadow-lg">
                        <Link
                            to="/courses"
                            className="py-3 px-4 my-1 w-11/12 bg-[#5B483D] rounded-lg text-center text-lg text-[#F6E7D1] hover:bg-yellow-200 hover:text-[#4E3B31] hover:scale-105 transition-all duration-300 shadow-md"
                            onClick={toggleMenu}
                        >
                            Курсы
                        </Link>
                        {user && (
                            <Link
                                to="/my-courses"
                                className="py-3 px-4 my-1 w-11/12 bg-[#5B483D] rounded-lg text-center text-lg text-[#F6E7D1] hover:bg-yellow-200 hover:text-[#4E3B31] hover:scale-105 transition-all duration-300 shadow-md"
                                onClick={toggleMenu}
                            >
                                Мои курсы
                            </Link>
                        )}
                        <Link
                            to="/about"
                            className="py-3 px-4 my-1 w-11/12 bg-[#5B483D] rounded-lg text-center text-lg text-[#F6E7D1] hover:bg-yellow-200 hover:text-[#4E3B31] hover:scale-105 transition-all duration-300 shadow-md"
                            onClick={toggleMenu}
                        >
                            О нас
                        </Link>
                        <Link
                            to="/contact"
                            className="py-3 px-4 my-1 w-11/12 bg-[#5B483D] rounded-lg text-center text-lg text-[#F6E7D1] hover:bg-yellow-200 hover:text-[#4E3B31] hover:scale-105 transition-all duration-300 shadow-md"
                            onClick={toggleMenu}
                        >
                            Служба поддержки
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="py-3 px-4 my-1 w-11/12 bg-[#5B483D] rounded-lg text-center text-lg text-[#F6E7D1] hover:bg-yellow-200 hover:text-[#4E3B31] hover:scale-105 transition-all duration-300 shadow-md"
                                    onClick={toggleMenu}
                                >
                                    Мой аккаунт
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="py-3 px-4 my-1 w-11/12 bg-transparent border-2 border-[#F6E7D1] rounded-lg text-center text-lg text-[#F6E7D1] hover:bg-yellow-200 hover:text-[#4E3B31] hover:scale-105 transition-all duration-300 shadow-md"
                                >
                                    Выйти
                                </button>
                                {user.role === 'Admin' && ( // Добавляем "Панель управления" в мобильное меню
                                    <Link
                                        to="/admin/courses"
                                        className="py-3 px-4 my-1 w-11/12 bg-[#5B483D] rounded-lg text-center text-lg text-[#F6E7D1] hover:bg-yellow-200 hover:text-[#4E3B31] hover:scale-105 transition-all duration-300 shadow-md"
                                        onClick={toggleMenu}
                                    >
                                        Панель управления
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="py-3 px-4 my-1 w-11/12 bg-[#5B483D] rounded-lg text-center text-lg text-[#F6E7D1] hover:bg-yellow-200 hover:text-[#4E3B31] hover:scale-105 transition-all duration-300 shadow-md"
                                    onClick={toggleMenu}
                                >
                                    Вход
                                </Link>
                                {isOnVerifyEmail ? (
                                    <Link
                                        to="/verify-email"
                                        className="py-3 px-4 my-1 w-11/12 bg-transparent border-2 border-[#F6E7D1] rounded-lg text-center text-lg text-[#F6E7D1] hover:bg-yellow-200 hover:text-[#4E3B31] hover:scale-105 transition-all duration-300 shadow-md"
                                        onClick={toggleMenu}
                                    >
                                        Подтвердить email
                                    </Link>
                                ) : isOnResetPassword ? (
                                    <Link
                                        to="/reset-password"
                                        className="py-3 px-4 my-1 w-11/12 bg-transparent border-2 border-[#F6E7D1] rounded-lg text-center text-lg text-[#F6E7D1] hover:bg-yellow-200 hover:text-[#4E3B31] hover:scale-105 transition-all duration-300 shadow-md"
                                        onClick={toggleMenu}
                                    >
                                        Сбросить пароль
                                    </Link>
                                ) : (
                                    <Link
                                        to="/register"
                                        className="py-3 px-4 my-1 w-11/12 bg-[#5B483D] rounded-lg text-center text-lg text-[#F6E7D1] hover:bg-yellow-200 hover:text-[#4E3B31] hover:scale-105 transition-all duration-300 shadow-md"
                                        onClick={toggleMenu}
                                    >
                                        Регистрация
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
};