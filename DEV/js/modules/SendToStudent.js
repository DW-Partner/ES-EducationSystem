	require('./SendToStudent.css');//引入css文件



let sentMessageToStudent = ()=>{
	const sub_data = $.form.get({
        error_text: 'placeholder',//存放错误文案的属性名
	});
	if( !sub_data ){
		return;
	}else if( sub_data.notice.length > 100 ){
        $.dialogFull.Alert( "最多允许输入100字，请重新编辑！" );
		return;
	}
	$.form.submit({
		url: '/pss/sentMessageToStudent',
		data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        sid: $('#sid').val(),
	        page: +$('#page').val() || 0,
			data: JSON.stringify( sub_data ),
		},
		success: (res) => {
			if( res.errcode != 0 ){
         		$.dialogFull.Tips( res.errmsg );
				return;
			}
        	$.dialogFull.Tips( "提交成功！" );
         	$.ajaxGetHtml({
         		url: res.data.url,
         	})
		},
        error: function(){
        	$.dialogFull.Tips( "网络错误，请稍后重试" );
        }
	});
}
$.mainBox.on('click', '#submit_send', ()=>{
	sentMessageToStudent();
})

