const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let conf = {
    entry: {
        app: ['babel-polyfill', path.resolve(__dirname, 'src', 'index.js')],
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
        // minimizer: [
        //     new UglifyJsPlugin({
        //         test: /\.js($|\?)/i,
        //         cache: true,
        //         parallel: true,
        //         uglifyOptions: {
        //             compress: false,
        //             ecma: 6,
        //             mangle: true
        //         },
        //         sourceMap: true // set to true if you want JS source maps
        //     }),
        //     new OptimizeCSSAssetsPlugin({})
        // ],
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ecma: 6,
                    warnings: false,
                    parse: {},
                    compress: {},
                    mangle: true, // Note `mangle.properties` is `false` by default.
                    module: false,
                    output: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: undefined,
                    keep_fnames: false,
                    safari10: false,
                },
                parallel: true,
                parallel: 4,
                sourceMap: true,
            }),
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
        // new HtmlWebpackPlugin({
        //     title: 'Custom template',
        //     // Load a custom template (lodash by default see the FAQ for details)
        //     template: 'indexTemplate.html'
        // }),
        new MiniCssExtractPlugin({
            filename: "./css/[name].css",
            chunkFilename: "./css/[id].css"
        }),
        new CopyWebpackPlugin([
            {from:path.resolve(__dirname,'src', 'assets'), to:path.resolve(__dirname, 'dist', 'assets')},
            {from:path.resolve(__dirname,'src', 'Shaders'), to:path.resolve(__dirname, 'dist', 'src', 'Shaders')}
        ]),
        // new webpack.DefinePlugin({
        //     'CANVAS_RENDERER': JSON.stringify(true),
        //     'WEBGL_RENDERER': JSON.stringify(true)
        // }),
        // new webpack.HashedModuleIdsPlugin(),
        // new BundleAnalyzerPlugin(),
    ]
};

module.exports = conf;