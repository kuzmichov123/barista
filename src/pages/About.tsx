import React from 'react'

export const About: React.FC = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
                О нас
            </h1>
            {/* Фотография вверху */}
            <div className="mb-6">
                <img
                    src="/boris.jpg" // Замените на путь к вашей фотографии
                    alt="О нас"
                    className="w-full h-auto rounded-lg shadow-lg"
                />
            </div>
            {/* Текст в два столбца */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4  rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-2">Наша Миссия</h2>
                    <p>
                        Мы стремимся обучать людей искусству приготовления кофе и создать сообщество, где каждый сможет стать настоящим бариста.
                    </p>
                </div>
                <div className="p-4  rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-2">Наши Ценности</h2>
                    <p>
                        Мы ценим качество, инновации и стремление к совершенству, обучая своих студентов основам приготовления кофе.
                    </p>
                </div>
            </div>
        </div>
    )
}
