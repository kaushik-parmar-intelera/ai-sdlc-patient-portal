import axios from "axios";

// Docker backend – ASP.NET Core on port 8080.
// For emulator/simulator use localhost; for physical device use your machine's LAN IP.
const BASE_URL = "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000,
});

// Attach Bearer token from the auth store when present.
apiClient.interceptors.request.use((config) => {
  // Token is injected by callers via config.headers.Authorization when needed.
  return config;
});

// Normalise errors so callers only deal with a simple message string.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message: string =
      error?.response?.data?.message ??
      error?.response?.data?.title ??
      error?.message ??
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  },
);
