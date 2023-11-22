const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require('path');

module.exports = {
    ...defaultConfig,
    entry: {
        'admin': './src/admin.js',
        'public': './src/public.js',
        'countyCard': './src/countyCard.js',
        'again': './src/again.js',
        'admin-alt': './src/admin-alt.js',
        'main': './src/main.js',
    },
    output: {
        path: path.join(__dirname, '/build'),
        filename: '[name].js',
    }
}