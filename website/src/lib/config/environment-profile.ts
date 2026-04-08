export type EnvironmentName = "local" | "staging" | "production";

export interface EnvironmentProfile {
  name: EnvironmentName;
  appBaseUrl: string;
  apiBaseUrl: string;
  enableMockMode: boolean;
  enableTelemetry: boolean;
  featureFlags: Record<string, boolean>;
}

const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value == null) {
    return fallback;
  }
  return value.toLowerCase() === "true";
};

const deriveEnvironmentName = (): EnvironmentName => {
  const explicit = process.env.NEXT_PUBLIC_ENV_NAME?.toLowerCase();
  if (explicit === "local" || explicit === "staging" || explicit === "production") {
    return explicit;
  }
  return process.env.NODE_ENV === "production" ? "production" : "local";
};

const requireUrl = (
  value: string | undefined,
  fallback: string,
  envName: EnvironmentName,
  label: string,
): string => {
  const candidate = (value || fallback).trim();
  if (!candidate) {
    throw new Error(`Missing required environment variable for ${label}`);
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error(`Invalid URL value for ${label}`);
  }

  const isLocalHost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  const isHttps = parsed.protocol === "https:";
  if (envName !== "local" && !isHttps) {
    throw new Error(`${label} must use HTTPS for ${envName} environment`);
  }
  if (envName === "local" && !isHttps && !isLocalHost) {
    throw new Error(`${label} must be localhost or HTTPS in local environment`);
  }

  return parsed.toString().replace(/\/$/, "");
};

export const getEnvironmentProfile = (): EnvironmentProfile => {
  const envName = deriveEnvironmentName();
  const appBaseUrl = requireUrl(
    process.env.NEXT_PUBLIC_APP_BASE_URL,
    "http://localhost:3000",
    envName,
    "NEXT_PUBLIC_APP_BASE_URL",
  );
  const apiBaseUrl = requireUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL,
    "http://localhost:4000",
    envName,
    "NEXT_PUBLIC_API_BASE_URL",
  );
  const enableMockMode = parseBoolean(process.env.NEXT_PUBLIC_ENABLE_MOCK_MODE, envName === "local");
  if (envName === "production" && enableMockMode) {
    throw new Error("NEXT_PUBLIC_ENABLE_MOCK_MODE must be false in production");
  }

  return {
    name: envName,
    appBaseUrl,
    apiBaseUrl,
    enableMockMode,
    enableTelemetry: parseBoolean(process.env.NEXT_PUBLIC_ENABLE_TELEMETRY, false),
    featureFlags: {
      privateRoutes: parseBoolean(process.env.NEXT_PUBLIC_FEATURE_FLAG_PRIVATE_ROUTES, true),
    },
  };
};
