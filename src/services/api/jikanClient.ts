import axios from 'axios';
import { JikanResponse } from '../../types/jikan';

const JIKAN_API_BASE = 'https://api.jikan.moe/v4';
const client = axios.create({
  baseURL: JIKAN_API_BASE,
  timeout: 10000,
});

export async function fetchFromJikan<T>(endpoint: string, params?: Record<string, any>): Promise<JikanResponse<T>> {
  try {
    const response = await client.get<JikanResponse<T>>(endpoint, { params });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Jikan API request failed: ${error.message}`);
    }
    throw error;
  }
}