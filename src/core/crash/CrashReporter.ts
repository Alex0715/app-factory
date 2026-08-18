/**
 * Crash / error reporting abstraction. Defaults to a no-op so the app never
 * requires Firebase (or any provider) for local development. To wire up a
 * real provider (Sentry, Firebase Crashlytics, Bugsnag...), implement this
 * interface and swap the instance in index.ts.
 */
export interface CrashReporter {
  recordError(error: unknown, context?: Record<string, unknown>): void;
  log(message: string): void;
  setUserId(userId: string | null): void;
}

export class NoopCrashReporter implements CrashReporter {
  recordError(): void {}
  log(): void {}
  setUserId(): void {}
}

/** Logs to the console. Good enough default for development builds. */
export class ConsoleCrashReporter implements CrashReporter {
  recordError(error: unknown, context?: Record<string, unknown>): void {
    console.error('[crash]', error, context ?? {});
  }

  log(message: string): void {
    console.log('[crash-log]', message);
  }

  setUserId(): void {}
}
