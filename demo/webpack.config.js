/**
 * Created by YS on 2016/8/26.
 */
"use strict";
const path=require('path');
path.isAbsolute = require('path-is-absolute');
require('es6-promise').polyfill();

const webpack = require("webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')


let NODE_ENV = process.env.NODE_ENV;

const config = {
    entry: {
        "main":[`./demo/example-antd.tsx`]
    },
    output: {
        path:  __dirname +"/demo",
        publicPath: "/",
        filename: NODE_ENV === 'production' ? "[name].[chunkHash].js" : "[name].js",
        chunkFilename: NODE_ENV==='development' ? '[name].[chunkHash].js' : '[name].js'
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
            template: './demo/index.html',
            inject: 'body'
        }),
        new CopyWebpackPlugin([
            {
                from:"./demo/options.json",
                to:"options.json"
            }
        ])
    ],
    devServer:{
        contentBase: '.',
        stats:'minimal'
    },
    resolve:{
        extensions: ['', '.js', '.ts', '.jsx', '.tsx', '.css', '.html'],
        modulesDirectories:['node_modules'],
        alias: {
            react: path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
            'redux-form': path.resolve('./node_modules/redux-form'),
            "redux":path.resolve('./node_modules/redux'),
            "immutable":path.resolve('./node_modules/immutable'),
            "react-redux":path.resolve('./node_modules/react-redux')
        },
    }
};

config.plugins.push(
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': NODE_ENV==='development'?"'development'":"'produdction'"
    })
);

switch(NODE_ENV){
    case "development": {
        config.devtools = 'inline-source-map';
        break;
    }
    case "production": {
        config.plugins.push(new webpack.optimize.UglifyJsPlugin());
        config.devtools = 'source-map';
        break;
    }
}

module.exports = config;