import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, fetchPurchasedCourses, selectCourses, selectPurchasedCourses, selectCoursesStatus, selectCoursesError, purchaseCourse } from '../redux/slices/coursesSlice';
import { CourseCard } from '../components/CourseCard';
import { AppDispatch, RootState } from '../redux/store';
import { Modal } from '../components/Modal';
import { useNavigate } from 'react-router-dom';

export const Courses: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const courses = useSelector(selectCourses);
    const purchasedCourses = useSelector(selectPurchasedCourses);
    const status = useSelector(selectCoursesStatus);
    const error = useSelector(selectCoursesError);
    const isAuthenticated = useSelector((state: RootState) => !!state.auth.accessToken);
    const userRole = useSelector((state: RootState) => state.auth.user?.role);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<{ id: string; title: string; price?: number } | null>(null);
    const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
    const [purchaseError, setPurchaseError] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCourses());
            if (isAuthenticated) {
                dispatch(fetchPurchasedCourses());
            }
        }
    }, [status, dispatch, isAuthenticated]);

    const handlePurchaseClick = (courseId: string) => {
        const course = courses.find(c => c.slug === courseId);
        if (!course) return;
        setSelectedCourse({ id: courseId, title: course.title, price: course.price });
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
        } else {
            setPurchaseStatus('idle');
            setPurchaseError(null);
            setIsPurchaseModalOpen(true);
        }
    };

    const handlePurchaseConfirm = async () => {
        if (!selectedCourse) return;
        setPurchaseStatus('loading');
        try {
            await dispatch(purchaseCourse(selectedCourse.id)).unwrap();
            setPurchaseStatus('succeeded');
            // Обновляем списки курсов
            dispatch(fetchCourses());
            dispatch(fetchPurchasedCourses());
        } catch (error: any) {
            setPurchaseStatus('failed');
            setPurchaseError(error || 'Не удалось приобрести курс');
        }
    };

    const handleLoginRedirect = () => {
        setIsAuthModalOpen(false);
        setSelectedCourse(null);
        navigate('/login');
    };

    const handleAuthModalClose = () => {
        setIsAuthModalOpen(false);
        setSelectedCourse(null);
    };

    const handlePurchaseModalClose = () => {
        setIsPurchaseModalOpen(false);
        setSelectedCourse(null);
        setPurchaseStatus('idle');
        setPurchaseError(null);
    };

    // Фильтруем курсы: для авторизованных показываем только не купленные, админу — все
    const displayedCourses = isAuthenticated && userRole !== 'Admin'
        ? courses.filter(course => !purchasedCourses.some(purchased => purchased.slug === course.slug))
        : courses;

    // Формируем сообщение для модалки покупки в зависимости от состояния
    const getPurchaseModalMessage = () => {
        if (purchaseStatus === 'loading') {
            return 'Обработка покупки...';
        }
        if (purchaseStatus === 'succeeded') {
            return 'Курс успешно приобретён! Теперь он доступен в разделе "Мои курсы".';
        }
        if (purchaseStatus === 'failed') {
            return purchaseError || 'Ошибка при покупке курса.';
        }
        return `Стоимость: ${selectedCourse?.price?.toFixed(2)} ₽. Подтвердите покупку курса.`;
    };

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#4E3B31] mb-10 font-halmahera">
                    Курсы
                </h1>

                {status === 'loading' && (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#5B483D]"></div>
                        <p className="ml-4 text-lg text-[#5B483D] font-medium">Загрузка...</p>
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
                            Пока курсов нет!
                        </h2>
                        <p className="text-[#5B483D] text-lg mb-8 font-highSansSerif">
                            Мы готовим что-то крутое для тебя. Следи за обновлениями!
                        </p>
                    </div>
                )}

                {status === 'failed' && error !== 'Курсы не найдены' && (
                    <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                        <p className="text-red-500 text-lg font-medium">
                            {error || 'Не удалось загрузить курсы. Попробуйте позже.'}
                        </p>
                    </div>
                )}

                {status === 'succeeded' && displayedCourses.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                        <p className="text-[#5B483D] text-lg mb-6 font-highSansSerif">
                            {isAuthenticated && userRole !== 'Admin' ? 'Ты приобрёл все доступные курсы!' : 'Пока курсов нет. Добавим скоро!'}
                        </p>
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
                                onPurchaseClick={handlePurchaseClick}
                                isPurchased={false}
                            />
                        ))}
                    </div>
                )}

                <Modal
                    isOpen={isAuthModalOpen}
                    onClose={handleAuthModalClose}
                    title="Необходима авторизация"
                    message="Войди, чтобы купить курс и открыть мир кофе!"
                    onConfirm={handleLoginRedirect}
                    confirmText="Войти"
                    showCancel={true}
                />

                <Modal
                    isOpen={isPurchaseModalOpen}
                    onClose={handlePurchaseModalClose}
                    title={`Купить курс: ${selectedCourse?.title || ''}`}
                    message={getPurchaseModalMessage()}
                    onConfirm={purchaseStatus === 'succeeded' ? handlePurchaseModalClose : handlePurchaseConfirm}
                    confirmText={purchaseStatus === 'succeeded' ? 'Закрыть' : 'Подтвердить'}
                    showCancel={purchaseStatus !== 'loading'}
                    isLoading={purchaseStatus === 'loading'}
                />
            </div>
        </div>
    );
};