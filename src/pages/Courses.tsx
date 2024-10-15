import React from 'react';
import { CourseCard } from '../components/CourseCard';

const courses = [
    {
        id: '1',
        title: "Основы бариста",
        description: "Учитесь варить кофе, как профессионал.",
        imageUrl: "/boris.jpg"
    },
    {
        id: '2',
        title: "Продвинутые техники",
        description: "Различные способы приготовления кофе.",
        imageUrl: "/boris.jpg"
    }
];


export const Courses: React.FC = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center font-brightSunkiss">
                Наши курсы
            </h1>
            <div className="flex flex-col gap-8">
                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        description={course.description}
                        imageUrl={course.imageUrl}
                    />
                ))}
            </div>
        </div>
    );
};
