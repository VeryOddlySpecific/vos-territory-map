const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require('path');

module.exports = {
    ...defaultConfig,
    entry: {
        'admin': './src/admin.js',
        'public': './src/public.js',
        'test': './src/test.js',
    },
    output: {
        path: path.join(__dirname, '/build'),
        filename: '[name].js',
    }
}