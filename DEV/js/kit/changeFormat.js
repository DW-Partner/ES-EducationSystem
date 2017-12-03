/**
*
* Base64 encode / decode
*
* @author haitao.tu
* @date 2016-04-26
* @email tuhaitao@foxmail.com
*
*/
//时间转化start
let changeFormat = (num, _format)=>{
    let format = _format ? _format : 'YYYY-MM-DD';
    const t = num ? new Date(num) : new Date();
    let tf = function(i) {
        return (i < 10 ? '0' : '') + i
    };
    return format.replace(/YYYY|MM|DD|hh|mm|ss/g, function(a) {
        switch (a) {
            case 'YYYY':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'DD':
                return tf(t.getDate());
                break;
            case 'hh':
                return tf(t.getHours());
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
};
//时间转化end

    export default changeFormat;