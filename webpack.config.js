const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require('path');

module.exports = {
    ...defaultConfig,
    entry: {
        'test': './src/test.js',
    },
    output: {
        path: path.join(__dirname, '/build'),
        filename: '[name].js',
    }
}