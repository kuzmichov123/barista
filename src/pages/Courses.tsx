import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, selectCourses, selectCoursesStatus, selectCoursesError } from '../redux/slices/coursesSlice';
import { CourseCard } from '../components/CourseCard';
import {AppDispatch, RootState} from '../redux/store'

export const Courses: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const courses = useSelector(selectCourses);
    const status = useSelector(selectCoursesStatus);
    const error = useSelector(selectCoursesError);
    const isAuthenticated = useSelector((state: RootState) => !!state.auth.accessToken);
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCourses());
        }
    }, [status, dispatch]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center font-brightSunkiss">
                Наши курсы
            </h1>
            {status === 'loading' && <p className="text-center">Загрузка...</p>}
            {status === 'failed' && (
                <p className="text-center text-red-500">
                    {error || 'Не удалось загрузить курсы. Попробуйте позже.'}
                </p>
            )}
            {status === 'succeeded' && courses.length === 0 && (
                <p className="text-center text-gray-500">Пока нет доступных курсов.</p>
            )}
            {status === 'succeeded' && courses.length > 0 && (
                <div className="flex flex-col gap-8">
                    {courses.map((course) => (
                        <CourseCard
                            key={course.slug}
                            id={course.slug}
                            title={course.title}
                            description={course.description}
                            imageUrl={course.cover_image_url}
                            isAuthenticated={isAuthenticated}
                            isAdmin={userRole === 'Admin'}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};