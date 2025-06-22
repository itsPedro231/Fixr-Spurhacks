// src/services/apiService.ts
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Types
export interface Message {
  threadID: string;
  content: string;
}

export interface ChatResponse {
  threadID: string;
  message2: string;
}

export interface ImageAnalysisResponse {
  analysis: string;
  gemini_result: ChatResponse;
}

export interface ProblemFormData {
  description: string;
  category: string;
  urgency: 'low' | 'medium' | 'high';
  location: string;
  image?: string | null;
  timestamp: string;
  aiAnalysis?: string | null;
}

// API Service class
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Send message to GPT
  async sendMessage(message: Message): Promise<ChatResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/send-message-gpt`, message);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to send message');
      }
      throw new Error('Network error, please try again');
    }
  }

  // Analyze image with AI
  async analyzeImage(imageUri: string, message: Message): Promise<ImageAnalysisResponse> {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any);
      formData.append('message', JSON.stringify(message));

      const response = await axios.post(`${this.baseURL}/analyze-image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to analyze image');
      }
      throw new Error('Network error, please try again');
    }
  }

  // Test OpenAI + Gemini integration
  async testOpenAIGemini(imageUri: string): Promise<{ openai_response: string }> {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: 'test-image.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await axios.post(`${this.baseURL}/test-openai-gemini/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to test integration');
      }
      throw new Error('Network error, please try again');
    }
  }

  // Submit problem with optional AI analysis
  async submitProblem(problemData: ProblemFormData): Promise<any> {
    try {
      // If there's an image, analyze it first
      if (problemData.image) {
        try {
          const analysisResponse = await this.analyzeImage(problemData.image, {
            threadID: "",
            content: `Problem description: ${problemData.description}. Category: ${problemData.category}. Urgency: ${problemData.urgency}. Please analyze this image and provide diagnosis.`
          });
          problemData.aiAnalysis = analysisResponse.gemini_result?.message2 || analysisResponse.analysis;
        } catch (error) {
          console.error('Error analyzing image:', error);
          // Continue without AI analysis if image analysis fails
        }
      }

      // Here you would typically send the problem data to your backend
      // For now, we'll just return the processed data
      return problemData;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to submit problem');
      }
      throw new Error('Network error, please try again');
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService; 