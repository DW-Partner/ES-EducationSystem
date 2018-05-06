/**
 * @fileoverview node本地http代理，webpack实时打包
 * @author  weijialu | 525296*** | weijialu@***.com
 * @version 2.1 | 2017-09-20
 * @tips 需要安装模块：
 * @param node server 端口号
 * @example node server 8080 || node server
 */

const $exec=require('child_process').exec;


//执行beautify
var beautify=()=>{
    console.log('\x1B[33m%s\x1b[0m','正在执行beautify...\n');
    let command=$exec('node beautify',{
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
        // console.log('\x1B[33m%s\x1b[0m', d);
        console.log('\x1B[32m%s\x1B[39m', d);
        //process.stdout.write(new Date+':执行beautify完成\n');
        if(d.indexOf('Time:')>-1){
        }else if(d.indexOf('maxBuffer exceeded')>-1){
            command.kill();
        }else{
        }           
    });
};
//启动webpack压缩打包
var webpackBuild=()=>{
    console.log('\x1B[33m%s\x1b[0m','正在执行webpack -p...');
    let command=$exec('webpack --config webpack.config.build.js -p',{
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
        console.log('\x1B[33m%s\x1b[0m',d);
        if(d.indexOf('Time:')>-1){
            // process.stdout.write(new Date+':执行webpack -p完成\n');

            //console.log('\x1B[32m%s\x1B[39m', new Date+':执行webpack -p完成\n');
            //beautify();
        }else if(d.indexOf('maxBuffer exceeded')>-1){
            command.kill();
        }else{
        }           
    });
    // }
};

webpackBuild();

