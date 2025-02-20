import axios from 'axios';

export const Instance = axios.create({
  baseURL: 'https://ricedeal.onrender.com/api',
});

