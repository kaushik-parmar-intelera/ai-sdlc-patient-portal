import { apiClient } from "../lib/api-client";
import type { ApiResponse, LoginResponse, RegisterResponse } from "../types/auth";

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await apiClient.post<ApiResponse<LoginResponse>>("/auth/login", { email, password });
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.error?.message ?? "Login failed.");
  }
  return res.data.data;
}

export async function apiRegister(
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
): Promise<RegisterResponse> {
  const res = await apiClient.post<ApiResponse<RegisterResponse>>("/auth/register", {
    fullName,
    email,
    password,
    confirmPassword,
  });
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.error?.message ?? "Registration failed.");
  }
  return res.data.data;
}

export async function apiRefreshToken(refreshToken: string): Promise<LoginResponse> {
  const res = await apiClient.post<ApiResponse<LoginResponse>>("/auth/refresh", { refreshToken });
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.error?.message ?? "Session expired.");
  }
  return res.data.data;
}

export async function apiGetMe(): Promise<LoginResponse["user"]> {
  const res = await apiClient.get<ApiResponse<LoginResponse["user"]>>("/users/me");
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.error?.message ?? "Could not fetch user.");
  }
  return res.data.data;
}
