import axios from 'axios';

// Конфигурация API
const API_KEY = process.env.OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1';

// Интерфейсы
interface ModelGenerationRequest {
  description: string;
  style?: string;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
}

interface AdviceRequest {
  context: string;
  type?: 'design' | 'material' | 'layout' | 'general';
}

// Функция для генерации 3D моделей
export const generateModel = async (request: ModelGenerationRequest) => {
  try {
    const response = await axios.post(
      `${API_URL}/images/generations`,
      {
        prompt: `Create a detailed 3D model of ${request.description}${
          request.style ? ` in ${request.style} style` : ''
        }${
          request.dimensions
            ? ` with dimensions ${request.dimensions.width}x${request.dimensions.height}x${request.dimensions.depth}`
            : ''
        }`,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error generating model:', error);
    throw error;
  }
};

// Функция для генерации советов
export const generateAdvice = async (request: AdviceRequest) => {
  try {
    const response = await axios.post(
      `${API_URL}/chat/completions`,
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert furniture designer and interior decorator. Provide detailed advice about ${
              request.type || 'general'
            } aspects of furniture design and interior decoration.`,
          },
          {
            role: 'user',
            content: request.context,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating advice:', error);
    throw error;
  }
};

// Функция для поиска информации
export const searchInformation = async (query: string) => {
  try {
    const response = await axios.get(
      `https://api.bing.com/v7.0/search`,
      {
        params: {
          q: query,
          count: 5,
          responseFilter: 'Webpages',
          freshness: 'Month',
        },
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.BING_API_KEY,
        },
      }
    );

    return response.data.webPages.value.map((result: any) => ({
      title: result.name,
      link: result.url,
      snippet: result.snippet,
    }));
  } catch (error) {
    console.error('Error searching information:', error);
    throw error;
  }
};

// Функция для анализа дизайна
export const analyzeDesign = async (designData: any) => {
  try {
    const response = await axios.post(
      `${API_URL}/chat/completions`,
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert furniture designer. Analyze the provided design and give detailed feedback.',
          },
          {
            role: 'user',
            content: JSON.stringify(designData),
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing design:', error);
    throw error;
  }
}; 