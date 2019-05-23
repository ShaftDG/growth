let path = require('path')

let conf = {
    entry: './src/index.js',
    devServer: {
        host: '192.168.1.55',
        port: 8080,
        hotOnly: true
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};

module.exports = conf;