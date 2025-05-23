import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';

export const Header: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
    };

    const isOnVerifyEmail = location.pathname === '/verify-email';
    const isOnResetPassword = location.pathname === '/reset-password';

    return (
        <header className="bg-[#4E3B31] p-4 font-halmahera">
            <nav className="container mx-auto flex justify-between items-center space-x-8">
                <Link to="/" className="text-[#F6E7D1] text-2xl font-bold">
                    Бариста Курсы
                </Link>

                <div className="flex space-x-6 items-center text-[#F6E7D1]">
                    <Link
                        to="/courses"
                        className="text-lg hover:text-yellow-200 transition-all duration-300"
                    >
                        Курсы
                    </Link>
                    <Link
                        to="/about"
                        className="text-lg hover:text-yellow-200 transition-all duration-300"
                    >
                        О нас
                    </Link>
                    <Link
                        to="/contact"
                        className="text-lg hover:text-yellow-200 transition-all duration-300"
                    >
                        Контакты
                    </Link>
                </div>
                <div className="flex space-x-4 items-center text-[#F6E7D1]">
                    {user ? (
                        <>
                            <Link
                                to="/profile"
                                className="bg-[#4E3B31] px-4 py-2 rounded-lg hover:bg-yellow-200 hover:text-[#4E3B31] transition-all duration-300"
                            >
                                Профиль
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="border-2 border-[#4E3B31] px-4 py-2 rounded-lg hover:text-yellow-200 transition-all duration-300"
                            >
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="bg-[#4E3B31] px-4 py-2 rounded-lg hover:bg-yellow-200 hover:text-[#4E3B31] transition-all duration-300"
                            >
                                Вход
                            </Link>
                            {isOnVerifyEmail ? (
                                <Link
                                    to="/verify-email"
                                    className="border-2 border-[#4E3B31] px-4 py-2 rounded-lg hover:text-yellow-200 transition-all duration-300"
                                >
                                    Подтвердить email
                                </Link>
                            ) : isOnResetPassword ? (
                                <Link
                                    to="/reset-password"
                                    className="border-2 border-[#4E3B31] px-4 py-2 rounded-lg hover:text-yellow-200 transition-all duration-300"
                                >
                                    Сбросить пароль
                                </Link>
                            ) : (
                                <Link
                                    to="/register"
                                    className="border-2 border-[#4E3B31] px-4 py-2 rounded-lg hover:text-yellow-200 transition-all duration-300"
                                >
                                    Регистрация
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};