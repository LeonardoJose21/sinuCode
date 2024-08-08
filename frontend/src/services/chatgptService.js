// src/services/chatgptService.js
import axios from 'axios';

const chatgptApi = axios.create({
    baseURL: 'http://localhost:8000/playground/api/chatgpt', // Adjust the URL as needed
});

export const getChatGptResponse = async (input) => {
    try {
        const response = await chatgptApi.post('/', { input });
        return response.data;
    } catch (error) {
        console.error('Error communicating with ChatGPT API:', error);
        throw error;
    }
};
