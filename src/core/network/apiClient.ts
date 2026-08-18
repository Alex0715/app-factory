import { env } from '@core/config/env';
import { AppError, mapToAppError } from '@core/errors';
import { secureStorage, SecureStorageKeys } from '@core/storage/secureStorage';

export interface ApiClientConfig {
  baseUrl: string;
  timeoutMs: number;
  retries: number;
  /** When false (release builds), request/response logging is skipped entirely. */
  loggingEnabled: boolean;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
  /** Skip attaching the stored auth token (e.g. for public endpoints). */
  skipAuth?: boolean;
  /** Override the client-level retry count for this call. */
  retries?: number;
  signal?: AbortSignal;
}

const defaultConfig: ApiClientConfig = {
  baseUrl: env.apiBaseUrl,
  timeoutMs: 15_000,
  retries: 2,
  loggingEnabled: env.isDev,
};

function log(config: ApiClientConfig, ...args: unknown[]) {
  if (config.loggingEnabled) {
    console.log('[api]', ...args);
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Minimal, dependency-free fetch wrapper providing: configurable base URL,
 * timeout, retry-with-backoff on network/5xx failures, auth header
 * injection, and mapping every failure into a typed AppError. Swap the
 * implementation for Retrofit/Ktor-equivalent (e.g. a generated OpenAPI
 * client) without touching call sites, since they only depend on `request`.
 */
export function createApiClient(overrides: Partial<ApiClientConfig> = {}) {
  const config: ApiClientConfig = { ...defaultConfig, ...overrides };

  async function request<T>(options: RequestOptions): Promise<T> {
    const { method = 'GET', path, body, headers = {}, skipAuth = false } = options;
    const maxRetries = options.retries ?? config.retries;
    const url = `${config.baseUrl}${path}`;

    let attempt = 0;
    let lastError: unknown;

    while (attempt <= maxRetries) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

      try {
        const authHeaders: Record<string, string> = {};
        if (!skipAuth) {
          const token = await secureStorage.getItem(SecureStorageKeys.authToken);
          if (token) authHeaders.Authorization = `Bearer ${token}`;
        }

        log(config, method, url, attempt > 0 ? `(retry ${attempt})` : '');

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
            ...headers,
          },
          body: body !== undefined ? JSON.stringify(body) : undefined,
          signal: options.signal ?? controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const isRetryable = response.status >= 500 && attempt < maxRetries;
          if (isRetryable) {
            attempt += 1;
            await delay(2 ** attempt * 250);
            continue;
          }
          throw { status: response.status, statusText: response.statusText };
        }

        if (response.status === 204) {
          return undefined as T;
        }

        return (await response.json()) as T;
      } catch (error) {
        clearTimeout(timeout);
        lastError = error;

        const isAbort = error instanceof Error && error.name === 'AbortError';
        const isNetworkFailure = error instanceof TypeError || isAbort;

        if (isNetworkFailure && attempt < maxRetries) {
          attempt += 1;
          await delay(2 ** attempt * 250);
          continue;
        }

        log(config, 'request failed', url, error);
        throw isNetworkFailure ? AppError.network(error) : mapToAppError(error);
      }
    }

    throw mapToAppError(lastError);
  }

  return { request, config };
}

export const apiClient = createApiClient();
