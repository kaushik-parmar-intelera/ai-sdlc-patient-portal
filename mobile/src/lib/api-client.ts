import axios from "axios";

// Docker backend – ASP.NET Core on port 8080.
// For emulator/simulator use localhost; for physical device use your machine's LAN IP.
const BASE_URL = "http://localhost:8080/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000,
});

let _accessToken: string | null = null;

export function setAuthToken(token: string | null) {
  _accessToken = token;
}

apiClient.interceptors.request.use((config) => {
  if (_accessToken) {
    config.headers.Authorization = `Bearer ${_accessToken}`;
  }
  return config;
});

// Normalise errors — unwrap the ApiResponse envelope first.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message: string =
      error?.response?.data?.error?.message ??
      error?.response?.data?.message ??
      error?.response?.data?.title ??
      error?.message ??
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  },
);
