/**
 * @fileoverview node本地http代理，webpack实时打包
 * @author  weijialu | 525296*** | weijialu@***.com
 * @version 2.1 | 2017-09-20
 * @tips 需要安装模块：
 * @param node server 端口号
 * @example node server 8080 || node server
 */

const $exec=require('child_process').exec;

//启动webpack-dev-server
var startWebpackDev=()=>{
        console.log('启动webpack-dev-server...');
        let command=$exec('webpack-dev-server',{
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
                process.stdout.write(new Date+':成功刷新，\n');
            }else if(d.indexOf('maxBuffer exceeded')>-1){
                command.kill();
                startWebpackDev();
            }else{
            }           
        });
    // }
};

startWebpackDev();


//启动webpack动态监听
var startWebpack=()=>{
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




