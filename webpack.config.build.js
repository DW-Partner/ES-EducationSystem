const webpack = require('webpack');

const fs = require('fs');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractCSS = new ExtractTextPlugin('res/css/[name].css');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const dev_path = './DEV/';//develop目录路径，暂时只支持监听子集层
const build_path = './build/';//distribution目录路径
const static_path = './MVP_static/';//distribution目录路径

let pluginsList = [];
let htmlPluginsList = (path) => {
    let files = fs.readdirSync(path);
    files.forEach((item, index) => {
        //let stat = fs.statSync(path + item);
        let arr = []; //定义一个对象存放文件的路径和名字
        if( (/(\.html)$/).test(item) ){
            //'modules/'+item.match(/(.[^\.]+)\.html/)[1]
            let pageJs = item.match(/(.[^\.]+)\.html/).length ? 'modules/' + item.match(/(.[^\.]+)\.html/)[1] : '';
            //console.log('9899'+pageJs);
            let htmlItem = new HtmlWebpackPlugin({
                    //template: './DEV/' + item,
                    template: 'html-withimg-loader!' + './DEV/' + item,
                    filename: './' + item,
                    inject: 'body',
                    chunks: ['CMD', pageJs],//'modules/'+item.match(/(.[^\.]+)\.html/)[1]
                    chunksSortMode: "manual",
                    minify: false
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
//    extensions: ['', '.js', '.json', '.css', 'scss', '.less'],
    output: {
        path: __dirname + "/MVP_static/",//打包后的文件存放的地方
        publicPath:"/",// 文件的引用
        filename: "res/js/[name].js"//打包后输出文件的文件名
    },
    //http://blog.csdn.net/misttt/article/details/73616324
    // devtool: 'eval-source-map',
    // devServer: {
    //     contentBase: "./build",//本地服务器所加载的页面所在的目录
    //     historyApiFallback: true,//不跳转
    //     inline: true,//实时刷新
    //     port:8080
    // },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "es2015"
                        ]
                    }
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
　　　　　　    use: 'url-loader?limit=819&name=res/images/[name]_[hash:8].[ext]'
                    //图片文件使用 url-loader 来处理，小于8kb的直接转为base64
    　　　　 },
            {
    　　　　　　test: /\.Bhtml$/,
    　　　　　　use: 'html-withimg-loader'
　　　　　　  }
        ]
    },
    externals:{
        // 'jquery':'window.jQuery'
    },
    plugins: pluginsList,
};