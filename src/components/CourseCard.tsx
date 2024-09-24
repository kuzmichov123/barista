import React from 'react'

interface CourseCardProps {
    id: string
    title: string
    description: string
    imageUrl?: string
}

export const CourseCard: React.FC<CourseCardProps> = ({ id, title, description, imageUrl }) => {
    return (
        <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
            {imageUrl && (
                <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-700 mb-4">{description}</p>
                <a
                    href={`/courses/${id}`}
                    className="inline-block bg-gradient-to-r from-purple-400 to-pink-500 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                    Подробнее
                </a>
            </div>
        </div>
    )
}
