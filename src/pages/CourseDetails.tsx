import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const courses = [
    {
        id: '1',
        title: "Стандарт сервиса",
        description: "Учитесь варить кофе, как профессионал.",
        imageUrl: "/barista.jpg",
        details: "Курс охватывает все аспекты приготовления кофе.",
        lessons: [
            {
                title: "Урок 1: История кофе",
                content: "Здесь вы узнаете о происхождении кофе и его развитии.",
                presentationUrl: "https://docs.google.com/presentation/d/1egC11YdWKj6vJPjnKgNt34ZU2WctZp41/embed?start=false&loop=false&delayms=3000"
            },

        ],
        instructor: {
            name: "Иван Иванов",
            bio: "Опытный бариста с 10-летним стажем."
        },

    },
]

export const CourseDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const course = courses.find(course => course.id === id)

    const [activeLessonIndex, setActiveLessonIndex] = useState<number | null>(null)

    if (!course) {
        return <div className="container mx-auto p-4">Курс не найден</div>
    }

    const toggleLesson = (index: number) => {
        setActiveLessonIndex(activeLessonIndex === index ? null : index)
    }

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-64 object-cover"
                />
                <div className="p-6">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
                    <p className="text-gray-700 text-lg mb-4">{course.details}</p>

                    <h2 className="text-2xl font-semibold mt-6 mb-2">Материалы курса:</h2>
                    {course.lessons.map((lesson, index) => (
                        <div key={index} className="mb-4">
                            <button
                                onClick={() => toggleLesson(index)}
                                className="w-full text-left bg-gray-100 rounded-lg p-4 flex justify-between items-center focus:outline-none">
                                <span className="font-semibold">{lesson.title}</span>
                                <span>{activeLessonIndex === index ? '-' : '+'}</span>
                            </button>
                            {activeLessonIndex === index && (
                                <div className="p-4 bg-gray-50">
                                    <p className="text-gray-700">{lesson.content}</p>
                                    <iframe
                                        className="w-full h-[600px] mt-2"
                                        src={lesson.presentationUrl}
                                        title={lesson.title}
                                        frameBorder="0"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}
                        </div>
                    ))}
                    <h2 className="text-2xl font-semibold mt-6 mb-2">Информация о преподавателе:</h2>
                    <p className="text-gray-700">{course.instructor.name}</p>
                    <p className="text-gray-500">{course.instructor.bio}</p>
                </div>
            </div>
        </div>
    )
}
