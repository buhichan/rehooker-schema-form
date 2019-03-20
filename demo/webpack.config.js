/**
 * Created by YS on 2016/8/26.
 */
"use strict";
const path=require('path');

const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')


let NODE_ENV = "development";

module.exports = {
    entry: {
        "main":[__dirname+`/example-antd.tsx`]
    },
    mode:NODE_ENV,
    output: {
        path:  __dirname +"/build/",
        publicPath: "/rehooker-schema-form/demo/build/",
        filename: NODE_ENV === 'production' ? "[name].[chunkHash].js" : "[name].js",
        chunkFilename: NODE_ENV==='development' ? '[name].[chunkHash].js' : '[name].js'
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: "awesome-typescript-loader",
        },{
            test: /\.css$/,
            use: ["style-loader","css-loader"],
        },{
            test: /\.html$/,
            use: 'raw-loader'
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname+'/index.html',
            inject: 'body'
        }),
        new CopyWebpackPlugin([
            {
                from:__dirname+"/options.json",
                to:"options.json"
            }
        ]),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': NODE_ENV==='development'?"'development'":"'produdction'"
        })
    ],
    devServer:{
        contentBase: '.',
        stats:'minimal'
    },
    resolve:{
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.html']
    }
}