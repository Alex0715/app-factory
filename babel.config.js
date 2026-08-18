module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': './src',
            '@core': './src/core',
            '@domain': './src/domain',
            '@features': './src/features',
            '@product-config': './product.config.ts',
          },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],
      // react-native-reanimated/plugin must be listed last.
      'react-native-reanimated/plugin',
    ],
  };
};
