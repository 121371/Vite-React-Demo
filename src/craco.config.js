const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        include: path.resolve(__dirname, 'node_modules/your-vite-module-name'), // Adjust with your module's path
        loader: 'babel-loader',
      });
      return webpackConfig;
    },
  },
};