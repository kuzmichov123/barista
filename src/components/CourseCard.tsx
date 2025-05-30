import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../redux/store";
import {checkCourseAccess, purchaseCourse, selectAccessError, selectAccessStatus} from "../redux/slices/coursesSlice";

interface CourseCardProps {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ id, title, description, imageUrl, isAuthenticated, isAdmin }) => {
    const dispatch = useDispatch<AppDispatch>();
    const accessStatus = useSelector(selectAccessStatus);
    const accessError = useSelector(selectAccessError);

    useEffect(() => {
        if (isAuthenticated && !isAdmin) {
            dispatch(checkCourseAccess(id));
        }
    }, [dispatch, id, isAuthenticated, isAdmin]);

    const handlePurchase = () => {
        if (isAuthenticated) {
            dispatch(purchaseCourse(id));
        } else {
            alert('Пожалуйста, войдите в систему, чтобы приобрести курс.');
        }
    };

    const canAccessCourse = isAdmin || (isAuthenticated && accessStatus === 'accessible');

    return (
        <div className="w-full flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-2xl transition duration-300 transform" style={{ minHeight: '300px' }}>
            {imageUrl && (
                <div className="md:w-1/3 w-full">
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                </div>
            )}
            <div className="p-6 flex flex-col justify-between md:w-2/3 w-full font-highSansSerif">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
                    <p className="text-gray-700 mb-6">{description}</p>
                </div>
                <div className="flex justify-end">
                    {canAccessCourse ? (
                        <a
                            href={`/courses/${id}`}
                            className="inline-block relative text-white py-3 px-6 rounded-lg shadow-md text-lg transform transition-transform duration-300 hover:scale-105 hover:-translate-y-1"
                            style={{
                                background: 'linear-gradient(to right, #7B5B30, #C8B09D)',
                                overflow: 'hidden',
                            }}
                        >
                            <span className="relative z-10">Подробнее</span>
                            <span
                                className="absolute inset-0 opacity-30"
                                style={{
                                    background: 'linear-gradient(to right, #ffffff, #ffffff)',
                                    width: '200%',
                                    height: '100%',
                                    animation: 'shine 4s linear infinite',
                                    transform: 'translateX(-50%)',
                                    zIndex: 0,
                                }}
                            />
                        </a>
                    ) : (
                        <button
                            onClick={handlePurchase}
                            className="inline-block relative text-white py-3 px-6 rounded-lg shadow-md text-lg transform transition-transform duration-300 hover:scale-105 hover:-translate-y-1"
                            style={{
                                background: 'linear-gradient(to right, #7B5B30, #C8B09D)',
                                overflow: 'hidden',
                            }}
                        >
                            <span className="relative z-10">Купить курс</span>
                            <span
                                className="absolute inset-0 opacity-30"
                                style={{
                                    background: 'linear-gradient(to right, #ffffff, #ffffff)',
                                    width: '200%',
                                    height: '100%',
                                    animation: 'shine 4s linear infinite',
                                    transform: 'translateX(-50%)',
                                    zIndex: 0,
                                }}
                            />
                        </button>
                    )}
                    {accessError && (
                        <p className="text-red-500 text-sm mt-2">{accessError}</p>
                    )}
                </div>
                <style>
                    {`
            @keyframes shine {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
          `}
                </style>
            </div>
        </div>
    );
};
