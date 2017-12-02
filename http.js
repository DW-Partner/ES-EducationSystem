/**
 * @fileoverview node本地http代理，支持sass实时打包生成css文件
 * @author  weijialu | 525296*** | weijialu@***.com
 * @version 2.1 | 2017-07-28
 * @tips 需要安装模块：node-sass
 * @param node http 端口号 bind 项目相对路径
 * @example node http 8080 bind ./project/ || node http
 */
const http = require('http');
const url = require('url');
const fs = require('fs');
const sass = require('node-sass');
const path = require('path');
//const image = require("imageinfo"); //引用imageinfo模块
const mine = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};
let watch_path = './ttg-static/sass/';//develop目录路径，暂时只支持监听子集层
let dist_path = './ttg-static/css/';//distribution目录路径
const args = process.argv.join(' ') + ' ';
let bind = false;//(/\sbind\s/).test(args) ? true : false;
let PORT = 9090;//(/\s[1-9]\d*\s/).test(args) ? args.match(/\s[1-9]\d+\s/).join('').match(/\d+/g).join('') : 80;
let LOCAL_PATH = './MVP_static';//(/\s\.{1,2}\/\S*\s/).test(args) ? args.match(/\s\.{1,2}\/\S*\s/).join('').replace(/(^\s*)|(\s*$)/g, '') : './';
//let LOCAL_PATH = (/\s\.{1,2}\/[\w-]+[\/\w-]*\s/).test( args ) ? args.match(/\s\.\/\w+\s/).join('').match(/\.\/\w+/).join('') : './';
console.log('\n本地路径：' + LOCAL_PATH);

let readFileList = (path, filesList) => {
    let files = fs.readdirSync(path);
    files.forEach((item, index) => {
        let stat = fs.statSync(path + item);
        let obj = {}; //定义一个对象存放文件的路径和名字
        obj.href = path.split(LOCAL_PATH)[1] + item; //路径
        obj.filename = item //名字
        filesList.push(obj);
        return;
        if (stat.isDirectory()) {
            //递归读取文件
            //readFileList(path + item + "/", filesList)
        } else {
            let obj = {}; //定义一个对象存放文件的路径和名字
            obj.path = path; //路径
            obj.filename = item //名字
            filesList.push(obj);
        }
    })
}
let getFiles = {
    //获取文件夹下的所有文件
    getFileList: (path) => {
        const filesList = [];
        readFileList(path, filesList);
        console.log(filesList);
        return filesList;
    },
    //获取文件夹下的所有图片
    // getImageFiles: function (path) {
    //     var imageList = [];

    //     this.getFileList(path).forEach((item) => {
    //         var ms = image(fs.readFileSync(item.path + item.filename));
    //         ms.mimeType && (imageList.push(item.filename))
    //     });
    //     return imageList;
    // }
};

//启动http sever
let server = http.createServer((request, response) => {
    let pathname = url.parse(request.url).pathname;
    const path_split = pathname.split('/');
    let directory = false;
    if (pathname.charAt(pathname.length - 1) == '/') {
        directory = pathname;//如果访问目录
        pathname += "index.html"; //指定为默认网页
    } else if ((path_split[path_split.length - 1]).indexOf('.') == -1) {
        directory = pathname + '/';//如果访问目录不带“/”
        pathname += "/index.html"; //指定为默认网页
    }
    const realPath = path.join(LOCAL_PATH, pathname);
    let ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, (exists) => {
        if (!exists && directory) {
            //let list = getFiles.getFileList(LOCAL_PATH + directory);
            let li = ''
            list.forEach((item, index) => {
                li += '<li><a href="' + item.href + '" target="_blank">' + item.filename + '</a></li>';
            });
            const contentType = mine[ext] || "text/plain";
            response.writeHead(200, {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
            const title = list[0].href.split('/')[list[0].href.split('/').length - 2];
            const head = '<!DOCTYPE html><html><head><meta charset="utf-8" ><title>' + title + '</title></head><body><ul>';
            const end = '</ul></body></html>';
            response.write(head + li + end, "binary");
            response.end();
        } else if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write('[404] This request URL [' + pathname + ']' + '  was not found on this server. [404]');
            response.end();
        } else {
            fs.readFile(realPath, "binary", (err, file) => {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    const contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType,
                        'Access-Control-Allow-Origin': '*'
                    });
                    response.write(file, "binary");
                    response.end();
                    console.log('浏览器请求：' + pathname);
                }
            });
        }
    });
});
server.listen(PORT);
//console.log("\nServer runing at port: " + PORT + ".");
console.log("\nHttp Server 已启动，端口：" + PORT + ".");