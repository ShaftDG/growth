const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let conf = {
    entry: {
        app: ['babel-polyfill', path.resolve(__dirname, 'src', 'index.js')],
        // vendor: ['phaser']
    },
    devtool: 'none',
    output: {
        filename: './js/bundle.[chunkhash:8].js',
        publicPath: ''
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            { test: [/\.vert$/, /\.frag$/], use: 'raw-loader' },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
        ],
    },
    optimization: {
        nodeEnv: 'production',
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            // name: 'vendor'
            chunks: 'all',
            //     minSize: 200000,
            //     maxSize: 0,
            //     minChunks: 2,
            //     maxAsyncRequests: 5,
            //     maxInitialRequests: 3
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({}),
        new MiniCssExtractPlugin({
            filename: "./css/[name].css",
            chunkFilename: "./css/[id].css"
        }),
        new CopyWebpackPlugin([
            {from:path.resolve(__dirname,'src', 'assets'), to:path.resolve(__dirname, 'dist', 'assets')}
        ]),
        // new webpack.DefinePlugin({
        //     'CANVAS_RENDERER': JSON.stringify(true),
        //     'WEBGL_RENDERER': JSON.stringify(true)
        // }),
        // new webpack.HashedModuleIdsPlugin(),
        new BundleAnalyzerPlugin(),
    ]
};

module.exports = conf;