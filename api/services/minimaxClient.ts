import axios, { type AxiosInstance } from 'axios';

const DEFAULT_MINIMAX_BASE_URL = 'https://api.minimaxi.com/v1';

export const getMinimaxConfig = () => {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    throw new Error('Missing MINIMAX_API_KEY in environment');
  }

  const baseURLRaw = process.env.MINIMAX_BASE_URL ?? DEFAULT_MINIMAX_BASE_URL;
  const baseURL = baseURLRaw.replace(/\/+$/, '');

  return { apiKey, baseURL };
};

export const minimaxClient = (): AxiosInstance => {
  const { apiKey, baseURL } = getMinimaxConfig();

  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  });
};

