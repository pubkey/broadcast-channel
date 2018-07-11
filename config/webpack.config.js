
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './dist/es/browserify.index.js',
    optimization: {
        minimizer: [
            new UglifyJsPlugin()
        ]
    },
    plugins: [],
    output: {
        path: path.resolve(__dirname, '../test_tmp'),
        filename: 'webpack.bundle.js'
    }
};
