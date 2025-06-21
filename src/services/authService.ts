// src/services/authService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5012/api/auth';

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export const register = async (
  name: string, 
  email: string, 
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('Network error, please try again');
  }
};

export const login = async (
  email: string, 
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Network error, please try again');
  }
};