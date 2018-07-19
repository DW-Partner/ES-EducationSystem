/**
 * @fileoverview node本地http代理，webpack实时打包
 * @author  weijialu | 525296*** | weijialu@***.com
 * @version 2.1 | 2017-09-20
 * @tips 需要安装模块：
 * @param node start 端口号
 * @example node start 9090 || node server
 */

const $exec=require('child_process').exec;
const fs = require('fs');
const _config = JSON.parse(fs.readFileSync('./config.json'));

//启动webpack动态监听
var startWebpack=()=>{
        console.log('\x1B[33m%s\x1b[0m','正在启动webpack --watch监听...');
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
                // process.stdout.write(new Date+':编译完成，\n');
                console.log('\x1B[32m%s\x1B[39m', new Date+'：watch初始化完成\n');
            }else if(d.indexOf('maxBuffer exceeded')>-1){
                command.kill();
                startWebpack();
            }else{
            }           
        });
};

//启动webpack-dev-server
var startWebpackDev=()=>{
        console.log('\x1B[33m%s\x1b[0m','正在启动webpack-dev-server...');
        let command=$exec('webpack-dev-server --inline',{
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
                // process.stdout.write(new Date+':成功刷新，\n');
                console.log('\x1B[32m%s\x1B[39m', new Date+'：server初始化完成，端口：' + _config.port + '\n');
                // $exec('open http://127.0.0.1:' + _config.port + '/DEMO.html' );
            }else if(d.indexOf('maxBuffer exceeded')>-1){
                command.kill();
                startWebpackDev();
            }else{
            }           
        });
};
startWebpackDev();
startWebpack();