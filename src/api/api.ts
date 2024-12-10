import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8095/swagger/v1/swagger.json', // Замените на URL вашего бэкенда
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = async (email: string, password: string) => {
    console.log('Sending request to API...');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        console.error('API response error:', response);
        throw new Error('Ошибка авторизации');
    }

    console.log('API response received:', response);
    return await response.json();
};

