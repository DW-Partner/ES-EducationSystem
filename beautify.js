const fs = require('fs');
const beautify_html = require('js-beautify').html;
const _config = JSON.parse(fs.readFileSync('./config.json'));

let run_beautify_html = (filePath, index)=>{
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            //throw err;
        }
        fs.writeFile(filePath, beautify_html(data, { indent_size: 4 }), (err) => {
            if (err) {
                return console.log(err);
            }
            // console.log('-# ' + (index+1) + '、beautify完毕：' + filePath + ' #-');
            console.log('-#beautify完成：' + filePath + ' #-');

        });
    });
}

//启动时，自动打包sass文件至dist目录
let fn_beautify_html = (path) => {
    let files = fs.readdirSync(path);
    files.forEach((item, index) => {
        const stat = fs.statSync(path + item);
        if (!stat.isDirectory()) {
            run_beautify_html(path + item, index);
        }
    })
}
fn_beautify_html( _config.build_path );

//监听static文件夹
// let fsWatcher = fs.watch('./static/', (event, filename) => {
//     console.log(event);
// });
// fsWatcher.on('change', (event, filename) => {
//     console.log(event);
//     if (event === 'rename') {
//         if (fs.existsSync('./static/' + filename)) {
//             run_beautify_html( './static/' + filename );
//         }
//     } else {
//         run_beautify_html( './static/' + filename );
//     }
// });