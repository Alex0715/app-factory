/**
 * Typed application errors. Every layer (network, database, billing, ...)
 * should catch technical exceptions and re-throw one of these so the UI can
 * render a consistent, user-friendly state instead of a raw stack trace.
 */
export type AppErrorKind =
  | 'network'
  | 'authentication'
  | 'server'
  | 'database'
  | 'validation'
  | 'notFound'
  | 'unknown';

export class AppError extends Error {
  readonly kind: AppErrorKind;
  readonly cause?: unknown;
  /** Safe to show directly in the UI. Never includes stack traces or internals. */
  readonly userMessage: string;

  constructor(kind: AppErrorKind, userMessage: string, cause?: unknown) {
    super(userMessage);
    this.name = 'AppError';
    this.kind = kind;
    this.userMessage = userMessage;
    this.cause = cause;
  }

  static network(cause?: unknown): AppError {
    return new AppError('network', 'You appear to be offline. Check your connection and try again.', cause);
  }

  static authentication(cause?: unknown): AppError {
    return new AppError('authentication', 'Your session has expired. Please sign in again.', cause);
  }

  static server(cause?: unknown): AppError {
    return new AppError('server', 'Something went wrong on our end. Please try again shortly.', cause);
  }

  static database(cause?: unknown): AppError {
    return new AppError('database', 'We could not read or save your local data.', cause);
  }

  static validation(userMessage: string, cause?: unknown): AppError {
    return new AppError('validation', userMessage, cause);
  }

  static notFound(cause?: unknown): AppError {
    return new AppError('notFound', 'We could not find what you were looking for.', cause);
  }

  static unknown(cause?: unknown): AppError {
    return new AppError('unknown', 'An unexpected error occurred. Please try again.', cause);
  }
}

/**
 * Maps an arbitrary thrown value (fetch errors, JS exceptions, native module
 * errors, ...) into a typed AppError. Use this at the boundary of every
 * repository / network / database call so nothing unmapped reaches the UI.
 */
export function mapToAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof TypeError && /network|fetch/i.test(error.message)) {
    return AppError.network(error);
  }

  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = Number((error as { status: unknown }).status);
    if (status === 401 || status === 403) return AppError.authentication(error);
    if (status === 404) return AppError.notFound(error);
    if (status >= 500) return AppError.server(error);
    if (status >= 400) return AppError.validation('The request was invalid.', error);
  }

  if (error instanceof Error) {
    return AppError.unknown(error);
  }

  return AppError.unknown(error);
}
