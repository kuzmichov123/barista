import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/store';
import { fetchPurchasedCourses, fetchCourses, selectPurchasedCourses, selectCourses, selectCoursesStatus, selectCoursesError } from '../redux/slices/coursesSlice';
import { CourseCard } from '../components/CourseCard';

export const MyCourses: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const courses = useSelector(selectCourses); // Все курсы
    const purchasedCourses = useSelector(selectPurchasedCourses); // Купленные курсы
    const status = useSelector(selectCoursesStatus);
    const error = useSelector(selectCoursesError);
    const isAuthenticated = useSelector((state: RootState) => !!state.auth.accessToken);
    const userEmail = useSelector((state: RootState) => state.auth.user?.email || 'пользователь');
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    useEffect(() => {
        if (isAuthenticated && status === 'idle') {
            dispatch(fetchPurchasedCourses());
            dispatch(fetchCourses()); // Загружаем все курсы для админа
        }
    }, [dispatch, status, isAuthenticated]);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Админ видит все курсы, обычный пользователь — только купленные
    const displayedCourses = userRole === 'Admin' ? courses : purchasedCourses;

    console.log('MyCourses: Displayed courses:', displayedCourses);

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#4E3B31] mb-10 font-halmahera">
                    Мои курсы
                </h1>

                {status === 'loading' && (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#5B483D]"></div>
                        <p className="ml-4 text-lg text-[#5B483D] font-medium">Загрузка...</p>
                    </div>
                )}

                {status === 'failed' && error !== 'Курсы не найдены' && (
                    <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                        <p className="text-red-500 text-lg font-medium">
                            {error || 'Не удалось загрузить курсы. Попробуйте позже.'}
                        </p>
                    </div>
                )}

                {status === 'failed' && error === 'Курсы не найдены' && (
                    <div className="bg-white rounded-2xl shadow-md p-8 sm:p-12 text-center">
                        <div className="mb-6">
                            <svg
                                className="mx-auto h-16 w-16 text-[#5B483D]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-[#4E3B31] mb-4 font-halmahera">
                            Пользователь {userEmail} еще не купил ни одного курса.
                        </h2>
                        <p className="text-[#5B483D] text-lg mb-8 font-highSansSerif">
                            Начните свое путешествие в мир кофе с нашими курсами!
                        </p>
                        <Link
                            to="/courses"
                            className="inline-block px-8 py-3 bg-[#5B483D] text-[#F6E7D1] font-semibold rounded-lg hover:bg-[#4E3B31] transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            Перейти к курсам
                        </Link>
                    </div>
                )}

                {status === 'succeeded' && displayedCourses.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                        <p className="text-[#5B483D] text-lg mb-6 font-highSansSerif">
                            {userRole === 'Admin' ? 'Пока курсов нет.' : 'Вы пока не приобрели ни одного курса.'}
                        </p>
                        {userRole !== 'Admin' && (
                            <Link
                                to="/courses"
                                className="inline-block px-8 py-3 bg-[#5B483D] text-[#F6E7D1] font-semibold rounded-lg hover:bg-[#4E3B31] transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Перейти к курсам
                            </Link>
                        )}
                    </div>
                )}

                {status === 'succeeded' && displayedCourses.length > 0 && (
                    <div className="grid grid-cols-1 gap-8">
                        {displayedCourses.map((course) => (
                            <CourseCard
                                key={course.slug}
                                id={course.slug}
                                title={course.title}
                                description={course.description}
                                imageUrl={course.cover_image_url}
                                price={course.price}
                                isAuthenticated={isAuthenticated}
                                isAdmin={userRole === 'Admin'}
                                isPurchased={true}
                                hasAccess={true} // Явно указываем, что доступ есть
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};