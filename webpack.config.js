const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add rule at the beginning to ignore binary files in paths-js
  config.module.rules.unshift({
    test: /node_modules[\\/]paths-js[\\/]pie\.js$/,
    use: 'null-loader'
  });
  
  // Add resolver for react-native-chart-kit
  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }
  
  // Create an alias for react-native-chart-kit
  config.resolve.alias['react-native-chart-kit'] = path.resolve(__dirname, './empty-module.js');
  
  return config;
}; 