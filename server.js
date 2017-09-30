/**
 * @fileoverview node本地http代理，webpack实时打包
 * @author  weijialu | 525296*** | weijialu@***.com
 * @version 2.1 | 2017-09-20
 * @tips 需要安装模块：
 * @param node server 端口号
 * @example node server 8080 || node server
 */
const http = require('http');
const url = require('url');
const fs = require('fs');
// const sass = require('node-sass');
const path = require('path');
const $exec=require('child_process').exec;
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
const args = process.argv.join(' ') + ' ';
// let bind = (/\sbind\s/).test(args) ? true : false;
let PORT = (/\s[1-9]\d*\s/).test(args) ? args.match(/\s[1-9]\d+\s/).join('').match(/\d+/g).join('') : 80;
let LOCAL_PATH = (/\s\.{1,2}\/\S*\s/).test(args) ? args.match(/\s\.{1,2}\/\S*\s/).join('').replace(/(^\s*)|(\s*$)/g, '') : './build';
//let LOCAL_PATH = (/\s\.{1,2}\/[\w-]+[\/\w-]*\s/).test( args ) ? args.match(/\s\.\/\w+\s/).join('').match(/\.\/\w+/).join('') : './';

// let watch_path = LOCAL_PATH + '/sass/';//develop目录路径，暂时只支持监听子集层
// let dist_path = LOCAL_PATH + '/css/';//distribution目录路径

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
    // 获取文件夹下的所有文件
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
            let list = getFiles.getFileList(LOCAL_PATH + directory);
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

//写入文件
// let writeFile = (filePath, content, callBack) => {
//     fs.writeFile(filePath, content, (err) => {
//         if (err) {
//             return console.log(err);
//         }
//         callBack && callBack();
//     });
// }
//读取文件
// let readFile = (filePath, callBack) => {
//     fs.readFile(filePath, (err, data) => {
//         if (err) {
//             return console.log(err);
//         }
//         callBack & callBack(data.toString('utf-8'));
//     });
// }
//执行sass打包
// let run_sass = (cssFilePath, filename) => {
//     let css = sass.renderSync({
//         file: cssFilePath,
//         includePaths: ['./css']
//     });
//     let content = css.css.toString('utf-8');
//     writeFile(dist_path + filename, content, () => {
//         console.log('\n# sass打包：' + cssFilePath + '  ——>  ' + dist_path + filename);
//     });
// }
//启动时，自动打包sass文件至dist目录
// let auto_run_sass = (path) => {
//     let files = fs.readdirSync(path);
//     files.forEach((item, index) => {
//         const stat = fs.statSync(path + item);
//         if (!stat.isDirectory()) {
//             run_sass(path + item, item);
//         }
//     })
// }
// bind && auto_run_sass(watch_path);

//watch目录和dist目录文件对照，缺少文件，自动抽取watch目录文件复制到dist目录
// let auto_add_sass = (path) => {
//     let files = fs.readdirSync(path);
//     files.forEach((item, index) => {
//         const stat = fs.statSync(path + item);
//         const sass_exist = fs.existsSync(watch_path + item);
//         if (!stat.isDirectory() && !sass_exist) {
//             readFile(dist_path + item, (content) => {
//                 writeFile(watch_path + item, content);
//                 console.log('\n# css回溯：' + path + item + '  ——>  ' + watch_path + item);
//             })
//         }
//     })
// }
// true && auto_add_sass(dist_path);

// 对文件或目录进行监视，并且在监视到修改时执行处理；
// fs.watch返回一个fs.FSWatcher对象，拥有一个close方法，用于停止watch操作；
// 当fs.watch有文件变化时，会触发fs.FSWatcher对象的change(err, filename)事件，err错误对象，filename发生变化的文件名
// fs.watch(filename, [options], [listener]);
/**
 * filename, 完整路径及文件名或目录名；
 * [listener(event, filename], 监听器事件，有两个参数：event 为rename表示指定的文件或目录中有重命名、删除或移动操作或change表示有修改，filename表示发生变化的文件路径
 */
// let fsWatcher = fs.watch(watch_path, (event, filename) => {});
// fsWatcher.on('change', (event, filename) => {
//     if (event === 'rename') {
//         if (fs.existsSync(watch_path + filename)) {
//             console.log('\n# create:' + watch_path + filename);
//             run_sass(watch_path + filename, filename);
//         } else {
//             console.log('\n# remove:' + watch_path + filename); // 文件都不存在了，也调用不了fs.statSync了
//             if (fs.existsSync(dist_path + filename)) {
//                 fs.unlinkSync(dist_path + filename);
//             }
//         }
//     } else {
//         run_sass(watch_path + filename, filename);
//     }
// });


//启动webpack动态监听
var startWebpack=()=>{
    //先删除现有build内容
    // $fs.existsSync(conf.root+'/build/js/modules') && rmdir(conf.root+'/build/js/modules');

    // if(DEV_MODE){
        console.log('启动webpack --watch监听...');
        let command=$exec('webpack --watch',{
            encoding: 'utf8',
            timeout: 0,
            maxBuffer: 5000 * 1024, // 默认 200 * 1024
            killSignal: 'SIGTERM'
        },(e,stdout)=>{
            if(e){
                return console.log(e);
            }       
        });
        command.stdout.on('data',(d)=>{
            if(d.indexOf('Time:')>-1){
                process.stdout.write(new Date+':编译完成，\n');
            }else if(d.indexOf('maxBuffer exceeded')>-1){
                command.kill();
                startWebpack();
            }else{
            }           
        });
    // }
};

startWebpack();