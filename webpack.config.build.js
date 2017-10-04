const webpack = require('webpack');

const fs = require('fs');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractCSS = new ExtractTextPlugin('/css/[name].css');

const HtmlWebpackPlugin = require('html-webpack-plugin');

let pluginsList = [];
let htmlPluginsList = (path) => {
    let files = fs.readdirSync(path);
    files.forEach((item, index) => {
        //let stat = fs.statSync(path + item);
        let arr = []; //定义一个对象存放文件的路径和名字
        if( (/(\.html)$/).test(item) ){
            let htmlItem = new HtmlWebpackPlugin({
                    template: './DEV/' + item,
                    filename: './' + item,
                    inject: false
                })
            console.log(item);
            pluginsList.push(htmlItem);
        }
    })
}

htmlPluginsList( __dirname + '/DEV' );
pluginsList.push(extractCSS);

let entryList = {};
let getEntryList = (path) => {
    let files = fs.readdirSync(path);
    files.forEach((item, index) => {
        let stat = fs.statSync(path + item);
        if (stat.isDirectory()) {
            //递归读取文件
            getEntryList(path + item + "/")
        } else if( (/(\.js)$/).test(item) ){

            entryList[ 'modules/' + item ]
            let key = path.split(__dirname+'/DEV/js/')[1] + item.split('.js')[0]
            entryList[ key ] = path + item;


        }
    })
}
getEntryList( __dirname + '/DEV/js/modules/' );

entryList['CMD'] = './DEV/js/CMD.js';


module.exports = {
    entry: entryList,

    output: {
        path: __dirname + "/static",//打包后的文件存放的地方
        filename: "js/[name].js"//打包后输出文件的文件名
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
            },
            {
                test: /\.cass$/,
                use: extractCSS.extract([ 'css-loader', 'postcss-loader' ])
            },
            {
                test: /\.(scss|css)$/i,
                use: extractCSS.extract([ 'css-loader', 'postcss-loader', 'sass-loader' ])
            },
    　　　　{
    　　　　　　test: /\.(png|jpg|gif)$/,
　　　　　　    use: 'url-loader?limit=8192&name=images/[name]_[hash:8].[ext]'
    　　　　}
        ]
    },
    externals:{
        // 'jquery':'window.jQuery'
    },
    plugins: pluginsList,
};