import React from 'react';
import { Link } from 'react-router-dom';

interface CourseCardProps {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    price?: number;
    isAuthenticated: boolean;
    isAdmin: boolean;
    onPurchaseClick?: (id: string) => void;
    isPurchased?: boolean;
    hasAccess?: boolean; // Новый проп для явного указания доступа
}

export const CourseCard: React.FC<CourseCardProps> = ({ id, title, description, imageUrl, price, isAuthenticated, isAdmin, onPurchaseClick, isPurchased = false, hasAccess = false }) => {
    const handlePurchase = () => {
        if (onPurchaseClick) {
            onPurchaseClick(id);
        }
    };

    console.log(`CourseCard: Rendering card with id=${id}, isPurchased=${isPurchased}, hasAccess=${hasAccess}`);

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
                    <p className="text-gray-700 mb-4">{description}</p>
                    {!isPurchased && price !== undefined && (
                        <p className="text-gray-900 font-bold text-lg mb-6">
                            Цена: {price.toFixed(2)} ₽
                        </p>
                    )}
                </div>
                <div className="flex justify-end">
                    {isPurchased ? (
                        <Link
                            to={`/course/${id}`}
                            state={{ hasAccess }} // Передаем hasAccess через state
                            className="inline-block relative text-white py-3 px-6 rounded-lg shadow-md text-lg transform transition-transform duration-300 hover:scale-105 hover:-translate-y-1"
                            style={{
                                background: 'linear-gradient(to right, #7B5B30, #C8B09D)',
                                overflow: 'hidden',
                            }}
                            onClick={() => console.log(`Navigating to /course/${id}`)}
                        >
                            <span className="relative z-10">Посмотреть курс</span>
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
                        </Link>
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