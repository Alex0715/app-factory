import { AppError, mapToAppError } from '../AppError';

describe('AppError', () => {
  it('creates typed errors with user-friendly messages', () => {
    expect(AppError.network().kind).toBe('network');
    expect(AppError.authentication().kind).toBe('authentication');
    expect(AppError.server().kind).toBe('server');
    expect(AppError.database().kind).toBe('database');
    expect(AppError.notFound().kind).toBe('notFound');
    expect(AppError.unknown().kind).toBe('unknown');
  });

  it('never exposes raw messages via userMessage for generic errors', () => {
    const error = AppError.unknown(new Error('some internal stack trace detail'));
    expect(error.userMessage).not.toContain('stack trace');
  });
});

describe('mapToAppError', () => {
  it('passes through an existing AppError unchanged', () => {
    const original = AppError.validation('Invalid input');
    expect(mapToAppError(original)).toBe(original);
  });

  it('maps a TypeError mentioning network/fetch to a network error', () => {
    const mapped = mapToAppError(new TypeError('Network request failed'));
    expect(mapped.kind).toBe('network');
  });

  it('maps HTTP-like status objects to the right kind', () => {
    expect(mapToAppError({ status: 401 }).kind).toBe('authentication');
    expect(mapToAppError({ status: 403 }).kind).toBe('authentication');
    expect(mapToAppError({ status: 404 }).kind).toBe('notFound');
    expect(mapToAppError({ status: 500 }).kind).toBe('server');
    expect(mapToAppError({ status: 422 }).kind).toBe('validation');
  });

  it('maps a plain Error to unknown', () => {
    expect(mapToAppError(new Error('boom')).kind).toBe('unknown');
  });

  it('maps a non-error value to unknown', () => {
    expect(mapToAppError('just a string').kind).toBe('unknown');
  });
});
