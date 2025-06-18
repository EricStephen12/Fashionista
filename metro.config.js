const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Override the Metro configuration
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];
config.transformer.babelTransformerPath = require.resolve('metro-react-native-babel-transformer');

module.exports = config; 