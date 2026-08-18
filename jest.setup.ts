/* eslint-disable @typescript-eslint/no-require-imports -- jest.mock factories must be synchronous, so a
   top-level `require` (not `import`) is required here; babel-plugin-jest-hoist would otherwise disallow
   referencing an imported binding from inside the factory. */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
/* eslint-enable @typescript-eslint/no-require-imports */

// expo-secure-store has no official jest mock; back it with an in-memory map
// so tests exercise real read/write/delete behavior without touching Keychain/Keystore.
// Exposes `__reset()` so individual tests can start from a clean store.
jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>();
  return {
    getItemAsync: jest.fn(async (key: string) => store.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      store.delete(key);
    }),
    __reset: () => store.clear(),
  };
});
