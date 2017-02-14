/**
 * Created by YS on 2016/8/26.
 */
"use strict";

require("path").isAbsolute = require('path-is-absolute');
require('es6-promise').polyfill();

const webpack = require("webpack");
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ENV = process.env.npm_lifecycle_event;

const config = {
    entry: {
        "main":["./src/index.tsx"]
    },
    output: {
        path:  __dirname +"/build",
        publicPath: "/",
        filename: ENV == 'build' ? "[name].min.js" : "[name].js",
        chunkFilename: ENV=='dev' ? '[name].[hash].js' : '[name].js'
    },
    module: {
        loaders: [{
            test: /\.tsx?$/,
            loader: "awesome-typescript-loader",
            exclude: /node_modules/
        },{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style', 'css?sourceMap&-url!postcss')
        },{
            test: /\.html$/,
            loader: 'raw'
        }]
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new ExtractTextPlugin('[name].css'),
        new HtmlWebpackPlugin({
            template: './example/index.html',
            inject: 'body'
        })
    ],
    devServer:{
        contentBase: '.',
        stats:'minimal'
    },
    resolve:{
        extensions: ['', '.js', '.ts', '.jsx', '.tsx', '.css', '.html'],
        modulesDirectories:['node_modules']
    },
    externals:{
        react:"React",
        "react-dom":"ReactDOM"
    }

};

config.plugins.push(
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': /dev/.test(ENV)?"'dev'":"'prod'"
    })
);

switch(ENV){
    case "dev": {
        config.devtools = 'inline-source-map';
        config.entry.main=['./example/example.tsx'];
        break;
    }
    case "build": {
        config.plugins.push(new webpack.optimize.UglifyJsPlugin());
        config.devtools = 'source-map';
        break;
    }
}

module.exports = config;