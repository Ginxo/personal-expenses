import type { AxiosInstance } from 'axios';
import axios, { InternalAxiosRequestConfig, RawAxiosRequestConfig } from 'axios';

const getBaseUrl = () =>
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/v1` : 'http://localhost:3000/api/v1';

const AuthInterceptor = (client: AxiosInstance, accessToken: string): AxiosInstance => {
  client.interceptors.request.use(async (cfg) => {
    const BASE_URL = getBaseUrl();
    const updatedCfg: RawAxiosRequestConfig = {
      ...cfg,
      url: `${BASE_URL}${cfg.url}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    return updatedCfg as InternalAxiosRequestConfig;
  });
  return client;
};

const apiRequest = (accessToken: string) => AuthInterceptor(axios.create(), accessToken);

export type APIRequest = typeof apiRequest;
export { apiRequest };
