
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './dist/es/browserify.index.js',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    },
    plugins: [],
    output: {
        path: path.resolve(__dirname, '../test_tmp'),
        filename: 'webpack.bundle.js'
    }
};
