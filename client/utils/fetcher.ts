import axios, { AxiosResponse } from "axios";

export type QueryResponse<T> = [error: string | null, data: T | null];

export const refreshTokens = async () => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}auth/refresh`,
    null,
    {
      withCredentials: true,
    },
  );
};

const handleRequest = async (
  request: () => Promise<AxiosResponse>,
): Promise<AxiosResponse> => {
  try {
    return await request();
  } catch (error: any) {
    if (error?.response?.status === 401) {
      try {
        await refreshTokens();
        return await request();
      } catch (err) {
        console.log(err);
        throw err;
      }
    }

    return error.response.data;
  }
};

export const fetcher = async <T>(url: string): Promise<QueryResponse<T>> => {
  try {
    const request = () => axios.get(url, { withCredentials: true });
    const { data } = await handleRequest(request);
    return [null, data];
  } catch (error: any) {
    return [error, null];
  }
};

export const poster = async <T>(
  url: string,
  payload?: unknown,
): Promise<QueryResponse<T>> => {
  try {
    const request = () => axios.post(url, payload, { withCredentials: true });
    const { data } = await handleRequest(request);
    return [null, data];
  } catch (error: any) {
    return [error, null];
  }
};
