export interface ApiError {
  code: string;
  message: string;
  recoverable: boolean;
  context: {
    operation: string;
    requestId: string;
  };
}

interface RequestOptions extends RequestInit {
  authRequired?: boolean;
  operation?: string;
}

const getRequestId = () => crypto.randomUUID();

const toApiError = (error: unknown, operation: string, requestId: string): ApiError => ({
  code: "API_REQUEST_FAILED",
  message: error instanceof Error ? error.message : "Unknown API failure",
  recoverable: true,
  context: { operation, requestId },
});

export const requestJson = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const requestId = getRequestId();
  const operation = options.operation || `${options.method || "GET"} ${path}`;

  try {
    const response = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.authRequired ? { Authorization: "Bearer mock-token" } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    throw toApiError(error, operation, requestId);
  }
};
