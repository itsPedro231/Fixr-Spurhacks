// src/services/authService.ts
import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5012';

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
    console.log('Attempting to register with:', `${API_URL}/api/auth/register`);
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      name,
      email,
      password,
    });
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
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
    console.log('Attempting to login with:', `${API_URL}/api/auth/login`);
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password,
    });
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Network error, please try again');
  }
};