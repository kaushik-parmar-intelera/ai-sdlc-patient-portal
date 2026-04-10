import axios from "axios";
import { Platform } from "react-native";

// Android emulator routes "localhost" to itself, not the host machine.
// 10.0.2.2 is the special alias that points back to the host from the Android emulator.
// For physical devices, replace with your machine's LAN IP.
const BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080/api/v1"
    : "http://localhost:8080/api/v1";

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
// When the backend returns validation details, surface the first field reason
// so the user sees something actionable instead of the generic envelope message.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = error?.response?.data?.error;
    const details: { field: string; reason: string }[] | undefined = apiError?.details;
    const message: string =
      (details && details.length > 0 ? details[0].reason : null) ??
      apiError?.message ??
      error?.response?.data?.message ??
      error?.response?.data?.title ??
      error?.message ??
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  },
);
