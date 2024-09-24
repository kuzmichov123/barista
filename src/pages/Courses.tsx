import React from 'react'
import { CourseCard } from '../components/CourseCard'

const courses = [
    {
        id: '1',
        title: "Основы бариста",
        description: "Учитесь варить кофе, как профессионал.",
        imageUrl: "/barista.jpg"
    },
    {
        id: '2',
        title: "Продвинутые техники",
        description: "Различные способы приготовления кофе.",
        imageUrl: "/tumblr_na9xwrti291qcvimoo1_1280.jpg"
    }
]

export const Courses: React.FC = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                Наши курсы
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
    )
}
