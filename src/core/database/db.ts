import * as SQLite from 'expo-sqlite';
import { AppError } from '@core/errors';

const DB_NAME = 'app.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Structured local persistence (Room-equivalent) backed by expo-sqlite.
 * Use this for data that needs querying/filtering; use preferencesStore for
 * simple key-value settings instead.
 */
function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
}

/** Runs all migrations idempotently. Call once at app startup. */
export async function initDatabase(): Promise<void> {
  try {
    const db = await openDatabase();
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS feature_flag_overrides (
        key TEXT PRIMARY KEY NOT NULL,
        enabled INTEGER NOT NULL
      );
    `);
  } catch (cause) {
    throw AppError.database(cause);
  }
}

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  try {
    return await openDatabase();
  } catch (cause) {
    throw AppError.database(cause);
  }
}
