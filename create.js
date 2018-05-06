var fs = require('fs');
const _config = JSON.parse(fs.readFileSync('./config.json'));
const args = process.argv;
const fileName = args[2];

if( !fileName ){
    console.log('\x1B[33m%s\x1b[0m','请输入文件名...\n');
    return;    
}
console.log('\x1B[33m%s\x1b[0m',`正在创建${fileName}...\n`);
const filePath = _config.dev_path + 'js/modules/'

//读取文件
let readFile = (readTarget, writeTarget, callBack) => {
    const data = fs.readFileSync(readTarget, 'utf-8');
    callBack && callBack(writeTarget, data.toString('utf-8'));
}

let writeFile = (fileTarget, data)=>{
    fs.writeFile(fileTarget, data, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('\x1B[32m%s\x1B[39m',`创建完成：${fileTarget}\n`);
        }
    });   
}

writeFile( `${filePath}${fileName}.js`, `require('./${fileName}.css')` );
writeFile( `${filePath}${fileName}.css`, `` );
readFile(`${_config.dev_path}demo.html`, `${_config.dev_path}${fileName}.html`, writeFile );
//https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001434501497361a4e77c055f5c4a8da2d5a1868df36ad1000