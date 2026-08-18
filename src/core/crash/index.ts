import { env } from '@core/config/env';
import { ConsoleCrashReporter, CrashReporter, NoopCrashReporter } from './CrashReporter';

export * from './CrashReporter';

export const crashReporter: CrashReporter = env.isDev ? new ConsoleCrashReporter() : new NoopCrashReporter();
