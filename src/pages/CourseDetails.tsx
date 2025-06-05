import React, { useEffect, useState } from 'react';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import {
    fetchCourseContent,
    resetCourseContent,
    selectAccessStatus,
    selectCoursesError,
    selectCoursesStatus,
    selectCurrentCourse,
    checkCourseAccess,
} from '../redux/slices/coursesSlice';

export const CourseDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { hasAccess } = (location.state as { hasAccess?: boolean }) || { hasAccess: false }; // Получаем hasAccess из state
    const dispatch = useDispatch<AppDispatch>();
    const course = useSelector(selectCurrentCourse);
    const status = useSelector(selectCoursesStatus);
    const error = useSelector(selectCoursesError);
    const accessStatus = useSelector((state: RootState) => id ? selectAccessStatus(state, id) : 'idle');
    const isAuthenticated = useSelector((state: RootState) => !!state.auth.accessToken);
    const isAdmin = useSelector((state: RootState) => state.auth.user?.role === 'Admin');
    const [activeContentIndex, setActiveContentIndex] = useState<number | null>(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchCourseContent(id));
            if (isAuthenticated && !isAdmin && !hasAccess) {
                dispatch(checkCourseAccess(id));
            } else if (isAdmin || hasAccess) {
                console.log(`Access granted for course ${id} (isAdmin: ${isAdmin}, hasAccess: ${hasAccess})`);
            }
        }
        return () => {
            dispatch(resetCourseContent());
        };
    }, [dispatch, id, isAuthenticated, isAdmin, hasAccess]);

    const toggleContent = (index: number) => {
        setActiveContentIndex(activeContentIndex === index ? null : index);
    };

    if (!id) {
        return (
            <div className="container mx-auto p-6">
                <p className="text-center text-red-500">Ошибка: курс не указан</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (status === 'loading') {
        return <div className="container mx-auto p-6">Загрузка...</div>;
    }

    if (status === 'failed') {
        return (
            <div className="container mx-auto p-6">
                <p className="text-center text-red-500">{error || 'Не удалось загрузить курс'}</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="container mx-auto p-6">
                <p className="text-center text-red-500">Курс не найден</p>
            </div>
        );
    }

    console.log(`Access status for ${id}: ${accessStatus}, hasAccess: ${hasAccess}`);

    if (!hasAccess && accessStatus === 'inaccessible' && !isAdmin) {
        return (
            <div className="container mx-auto p-6">
                <p className="text-center text-red-500">У вас нет доступа к этому курсу. Пожалуйста, приобретите курс.</p>
            </div>
        );
    }

    const getViewerUrl = (url: string, contentType: string) => {
        if (
            contentType.includes('presentation') ||
            contentType.includes('ms-powerpoint') ||
            url.endsWith('.ppt') ||
            url.endsWith('.pptx')
        ) {
            return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
        }
        return url;
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {course.cover_image_url && (
                    <img
                        src={course.cover_image_url}
                        alt={course.title}
                        className="w-full h-96 object-cover"
                    />
                )}
                <div className="p-6">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
                    <p className="text-gray-700 text-lg mb-4">{course.description}</p>

                    <h2 className="text-2xl font-semibold mt-6 mb-2">Материалы курса:</h2>
                    {course.contents.length === 0 && (
                        <p className="text-gray-500">Материалы отсутствуют.</p>
                    )}
                    {course.contents.map((content, index) => (
                        <div key={index} className="mb-4">
                            <button
                                onClick={() => toggleContent(index)}
                                className="w-full text-left bg-gray-100 rounded-lg p-4 flex justify-between items-center focus:outline-none hover:bg-gray-200 transition"
                            >
                                <span className="font-semibold">{content.fileName}</span>
                                <span>{activeContentIndex === index ? '-' : '+'}</span>
                            </button>
                            {activeContentIndex === index && (
                                <div className="p-4 bg-gray-50">
                                    {content.contentType.includes('presentation') ||
                                    content.contentType.includes('ms-powerpoint') ||
                                    content.fileName.endsWith('.ppt') ||
                                    content.fileName.endsWith('.pptx') ? (
                                        <iframe
                                            className="w-full h-[600px] mt-2"
                                            src={getViewerUrl(content.contentFileUrl, content.contentType)}
                                            title={content.fileName}
                                            frameBorder="0"
                                            allowFullScreen
                                            sandbox="allow-scripts allow-same-origin"
                                        ></iframe>
                                    ) : (
                                        <p className="text-gray-700">
                                            Этот файл ({content.fileName}) не является презентацией и не может быть отображён.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};