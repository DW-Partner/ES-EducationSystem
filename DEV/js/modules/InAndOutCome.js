require('./InAndOutCome.css');//引入css文件
$.laydate.render({
	elem: '#InAndOutCome_date',
	type: 'date'
});
$.mainBox.on('click', '#submitInAndOutCome', ()=>{
		const sub_data = $.form.get();
		if( !sub_data ){
			return;
		}

	    sub_data.code= $('#zone_code').val();
	    sub_data.zoneid= $('#zone_zoneid').val();
	    sub_data.income= +sub_data.income;
	    sub_data.outcome= +sub_data.outcome;

		$.form.submit({
			url: '/pss/submitInAndOutCome',
			data: sub_data,
			success: (res) => {
				if( res.errcode != 0 ){
             		$.dialogFull.Tips( res.errmsg );
					return;
				}
             	$.dialogFull.Tips('操作成功！');
	            $.ajaxGetHtml({
	         		url: res.data.url,
	         	})
			},
            error: function(){
            	$.dialogFull.Tips( "网络错误，请稍后重试" );
            }
		});
})
