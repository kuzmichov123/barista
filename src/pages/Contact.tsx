import React from 'react'

export const Contact: React.FC = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                Свяжитесь с нами
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white shadow-md rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Отправить сообщение</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Ваше имя</label>
                            <input
                                type="text"
                                className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Введите ваше имя"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Введите ваш email"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Сообщение</label>
                            <textarea
                                className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Введите ваше сообщение"
                                rows={5}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            Отправить
                        </button>
                    </form>
                </div>

                <div className="bg-gray-100 p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Наши контакты</h2>
                    <p className="text-gray-700 mb-6">
                        Если у вас есть вопросы или вы хотите узнать больше о наших курсах, вы можете связаться с нами по телефону или электронной почте.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center">
                            <span className="text-gray-700">Email: info@baristakursy.com</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700">Телефон: +7 (123) 456-78-90</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700">Адрес: Москва, ул. Примерная, 15</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
