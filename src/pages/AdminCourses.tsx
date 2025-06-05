import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {
    createCourse,
    deleteCourse,
    fetchAdminCourses,
    selectAdminCourses,
    selectAdminCoursesStatus,
    selectAdminCoursesError,
} from '../redux/slices/adminCoursesSlice';
import { AppDispatch, RootState } from '../redux/store';
import { Modal } from '../components/Modal';

export const AdminCourses: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const courses = useSelector(selectAdminCourses);
    const status = useSelector(selectAdminCoursesStatus);
    const error = useSelector(selectAdminCoursesError);
    const isAuthenticated = useSelector((state: RootState) => !!state.auth.accessToken);
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [contentFiles, setContentFiles] = useState<File[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null); // Ошибка удаления
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние модального окна
    const [courseToDelete, setCourseToDelete] = useState<string | null>(null); // Slug курса для удаления

    useEffect(() => {
        if (isAuthenticated && userRole === 'Admin' && status === 'idle') {
            dispatch(fetchAdminCourses());
        }
    }, [isAuthenticated, userRole, status, dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !price || !coverImage || contentFiles.length === 0) {
            alert('Заполните все поля и выберите файлы');
            return;
        }
        try {
            await dispatch(
                createCourse({
                    title,
                    description,
                    price: parseFloat(price),
                    coverImage,
                    contentFiles,
                })
            ).unwrap();
            setSuccessMessage('Курс успешно создан!');
            setTitle('');
            setDescription('');
            setPrice('');
            setCoverImage(null);
            setContentFiles([]);
            setTimeout(() => setSuccessMessage(null), 3000); // Скрыть сообщение через 3 секунды
            dispatch(fetchAdminCourses()); // Обновляем список курсов
        } catch (err) {
            console.error('Failed to create course:', err);
        }
    };

    const handleDelete = (slug: string) => {
        setCourseToDelete(slug); // Устанавливаем slug курса для удаления
        setIsModalOpen(true); // Открываем модальное окно
    };

    const handleConfirmDelete = async () => {
        if (courseToDelete) {
            try {
                await dispatch(deleteCourse(courseToDelete)).unwrap();
                setDeleteError(null); // Сбрасываем ошибку при успехе
            } catch (err) {
                console.error('Failed to delete course:', err);
                setDeleteError(err instanceof Error ? err.message : 'Неизвестная ошибка при удалении курса');
            } finally {
                setIsModalOpen(false); // Закрываем модалку после попытки удаления
                setCourseToDelete(null); // Сбрасываем slug
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Закрываем модалку без удаления
        setCourseToDelete(null); // Сбрасываем slug
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    if (userRole !== 'Admin') {
        return (
            <div className="container mx-auto p-6">
                <p className="text-center text-red-500">Доступ запрещён. Требуется роль администратора.</p>
            </div>
        );
    }

    return (
        <div className=" p-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center font-brightSunkiss">
                Управление курсами
            </h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Создать новый курс</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Название курса
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Описание
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows={4}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Цена
                        </label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            step="0.01"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
                            Обложка (изображение)
                        </label>
                        <input
                            type="file"
                            id="coverImage"
                            accept="image/*"
                            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                            className="mt-1 block w-full border border-gray-300"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="contentFiles" className="block text-sm font-medium text-gray-700">
                            Файлы контента
                        </label>
                        <input
                            type="file"
                            id="contentFiles"
                            accept="*/*"
                            multiple
                            onChange={(e) => setContentFiles(Array.from(e.target.files || []))}
                            className="mt-1 block w-full border border-gray-300"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                        disabled={status === 'loading'}
                    >
                        Создать курс
                    </button>
                </form>
                {successMessage && (
                    <p className="mt-4 text-center text-green-500">{successMessage}</p>
                )}
                {error && (
                    <p className="mt-4 text-center text-red-500">Ошибка: {error}</p>
                )}
            </div>
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Существующие курсы</h2>
                {status === 'loading' && <p className="text-center">Загрузка...</p>}
                {status === 'failed' && (
                    <p className="text-center text-red-500">
                        {error || 'Не удалось загрузить курсы.'}
                    </p>
                )}
                {deleteError && ( // Отображаем ошибку удаления на странице
                    <p className="text-center text-red-500 mb-4">Ошибка удаления: {deleteError}</p>
                )}
                {status === 'succeeded' && courses.length === 0 && (
                    <p className="text-center text-gray-500">Пока нет доступных курсов.</p>
                )}
                {status === 'succeeded' && courses.length > 0 && (
                    <div className="flex flex-col gap-4">
                        {courses.map((course) => (
                            <div
                                key={course.slug}
                                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                            >
                                <div>
                                    <h3 className="text-lg font-medium">{course.title}</h3>
                                    <p className="text-gray-600">{course.description}</p>
                                    <p className="text-gray-600">Цена: {course.price}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(course.slug)}
                                    className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700"
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Подтверждение удаления"
                message={`Вы уверены, что хотите удалить курс с slug: ${courseToDelete}?`}
                onConfirm={handleConfirmDelete}
                confirmText="Удалить"
                showCancel={true}
            />
        </div>
    );
};