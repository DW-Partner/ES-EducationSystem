	require('./SelectVisitors.css');//引入css文件

$.mainBox.on('click', '#search', ()=>{
	let sub_data = $.form.get({
        error_text: 'placeholder',//存放错误文案的属性名
	});
	// if( !sub_data ){
	// 	return;
	// }

	//sub_data = {"name":"咨询者"}

console.log( sub_data )
 	$.ajaxGetHtml({
 		url: '/pss/goVisitor',
 		data: {
 			page: 0,
 			data: JSON.stringify( sub_data ).replace(/\"/g,"'")
 		}
 	})
})