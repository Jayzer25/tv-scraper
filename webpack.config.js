const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './index.js', // The entry point of your application
  target: 'node', // Since it's a Node.js app
  externals: [nodeExternals()], // To avoid bundling node_modules
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js' // Output file name
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply this rule to JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Use Babel to transpile JavaScript
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
