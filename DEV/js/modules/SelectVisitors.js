	require('./SelectVisitors.css');//引入css文件

const form = $('#form').val();

$.mainBox.on('click', '#search', ()=>{
	let sub_data = $.form.get({
        error_text: 'placeholder',//存放错误文案的属性名
        value_true_out: true
	});
	// if( !sub_data ){
	// 	return;
	// }

	//sub_data = {"name":"咨询者"}
 	$.ajaxGetHtml({
 		url: form == 1 ? '/pss/goVisitor#goVisitor' : '/pss/goStudentManage#goStudentManage',
 		data: {
 			page: 0,
 			data: JSON.stringify( sub_data ).replace(/\"/g,"'")
 		}
 	})
})