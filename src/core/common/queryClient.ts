import { QueryClient } from '@tanstack/react-query';

/**
 * Shared TanStack Query client. Repositories/hooks are expected to throw
 * `AppError` (see @core/errors) so `error` in query results is always typed
 * consistently for AsyncContent / ErrorView to render.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});
