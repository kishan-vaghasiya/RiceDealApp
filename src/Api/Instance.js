import axios from 'axios';

export const Instance = axios.create({
  baseURL: 'https://ricedeal.onrender.com/api',
  // baseURL: 'http://192.168.0.108:4000/api',
});