	require('./SelectVisitors.css');//引入css文件


$.mainBox.on('click', '#search', ()=>{
	const sub_data = $.form.get({
        error_text: 'placeholder',//存放错误文案的属性名
	});
	// if( !sub_data ){
	// 	return;
	// }

console.log( sub_data )
 	$.ajaxGetHtml({
 		url: '/pss/goVisitor',
 		data: sub_data
 	})
})