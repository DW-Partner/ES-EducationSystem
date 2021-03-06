require('./InAndOutCome.css');//引入css文件
// require('../comp/laydate/laydate.css');//引入css文件
// $.laydate.render({
// 	elem: '#date',
// 	type: 'date'
// });


let submitMsgFromSchool = ()=>{
	const msgid = $('#msgid').val();
	$.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/submitMsgFromSchool',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        msgid: msgid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            //$.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        //$.dialogFull.Tips( "操作成功！" );
	    },
	    error: ()=>{
			$(this).removeAttr('disabled');
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})	
}

$.mainBox.on('click', '#submitInAndOutCome', ()=>{
	const input_data = $.form.get();
	if( !input_data ){
		return;
	}
	let sub_data = {};
    sub_data.code= $('#zone_code').val();
    sub_data.zoneid= $('#zone_zoneid').val();
    sub_data.date = input_data.date;
	sub_data.data = {};
    sub_data.data.income = +input_data.income;
    sub_data.data.outcome = +input_data.outcome;
    sub_data.data = JSON.stringify(sub_data.data);

	$.form.submit({
		url: '/pss/submitInAndOutCome',
		data: sub_data,
		success: (res) => {
			if( res.errcode != 0 ){
         		$.dialogFull.Tips( res.errmsg );
				return;
			}
			submitMsgFromSchool();
         	$.dialogFull.Tips('操作成功！');
         	setTimeout(()=>{
	            $.ajaxGetHtml({
	         		//url: res.data.url,
	         		url: '/pss/goMsgFromSchool',
	         		data: {
	         			page: $('#page').val()
	         		}
	         	});
         	},500);
		},
        error: function(){
        	$.dialogFull.Tips( "网络错误，请稍后重试" );
        }
	});
})
