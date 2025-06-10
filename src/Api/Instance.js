import axios from 'axios';

export const Instance = axios.create({
  baseURL: 'https://ricedeal.onrender.com/api',
  // baseURL: 'http://192.168.189.181:4000/api',
});