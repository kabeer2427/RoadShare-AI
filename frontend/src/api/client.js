import axios from 'axios';
import { supabase } from '../config/supabase';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://roadshare-ai-2.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add auth token securely via Supabase
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
}, error => Promise.reject(error));
