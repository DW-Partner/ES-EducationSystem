// module.exports = {
//   devtool: 'eval-source-map',

//   entry:  __dirname + "/app/main.js",
//   output: {
//     path: __dirname + "/dist",
//     filename: "index.js"
//   },

//   devServer: {
//   	port: 8080;
//     contentBase: "./dist",//本地服务器所加载的页面所在的目录
//     historyApiFallback: true,//不跳转
//     inline: true//实时刷新
//   } 
// }

var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


const extractCSS = new ExtractTextPlugin('/css/[name].css');
const extractSCSS = new ExtractTextPlugin('/css/[name].css');



module.exports = {
    entry: __dirname + "/app/main.js",//已多次提及的唯一入口文件
    output: {
        path: __dirname + "/dist",//打包后的文件存放的地方
        filename: "index.js"//打包后输出文件的文件名
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: "./dist",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true,//实时刷新
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
                test: /\.css$/,
                use: extractCSS.extract([ 'css-loader', 'postcss-loader' ])
                // use: [
                //     {
                //         loader: "style-loader"
                //     }, {
                //         loader: "css-loader",
                //         options: {
                //             modules: true
                //         }
                //     }, {
                //         loader: "postcss-loader"
                //     }
                // ]
            },
            // {
            //     test: /\.scss$/i,
            //     use: extractSCSS.extract([ 'css-loader', 'scss-loader' ])
            // },




            {
                test: /\.scss$/,
                //loaders:'style-loader!css-loader!sass-loader'
                use: extractSCSS.extract("css!sass")
                //    extractSCSS.extract(['css-loader','sass-loader'])
                //use: extractSCSS.extract(['css-loader', 'sass-loader']) //这里用了样式分离出来的插件，如果不想分离出来，可以直接这样写 loader:'style!css!sass'
                
            }





        ]
    },
    externals:{
        'jquery':'window.jQuery'
    },


    plugins: [extractCSS],

};