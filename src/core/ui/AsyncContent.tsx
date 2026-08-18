import React from 'react';
import { LoadingView } from './LoadingView';
import { ErrorView } from './ErrorView';
import { EmptyView } from './EmptyView';
import { AppError } from '@core/errors';

export interface AsyncContentProps<T> {
  isLoading: boolean;
  error?: unknown;
  data: T | undefined | null;
  onRetry?: () => void;
  /** Returns true when `data` should be treated as "no results" (defaults to array-empty / falsy check). */
  isEmpty?: (data: T) => boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  children: (data: T) => React.ReactNode;
}

function defaultIsEmpty(data: unknown): boolean {
  if (Array.isArray(data)) return data.length === 0;
  return data === undefined || data === null;
}

/**
 * Generic reconciler for the four states every data-driven screen needs:
 * loading / error / empty / content. Pairs with TanStack Query's
 * `{ data, isLoading, error, refetch }`.
 */
export function AsyncContent<T>({
  isLoading,
  error,
  data,
  onRetry,
  isEmpty = defaultIsEmpty,
  emptyTitle = 'Nothing here yet',
  emptyMessage,
  loadingMessage,
  children,
}: AsyncContentProps<T>) {
  if (isLoading) {
    return <LoadingView message={loadingMessage} />;
  }

  if (error) {
    const message = error instanceof AppError ? error.userMessage : 'Please try again.';
    return <ErrorView message={message} onRetry={onRetry} />;
  }

  if (data === undefined || data === null || isEmpty(data)) {
    return <EmptyView title={emptyTitle} message={emptyMessage} />;
  }

  return <>{children(data)}</>;
}
