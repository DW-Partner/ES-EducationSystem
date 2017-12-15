require('./StudentPayment.css');

const sid = $('#sid').val();

//获取校区列表 start
let getStudentPaySum = (zone_id)=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getStudentPaySum',
        data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        sid: sid
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                return;
            }
            $('.paysum').html( res.data.paysum ? res.data.paysum + '元' : 0 + '元' );
            $('.remain_lessons').html( res.data.remain_lessons ? res.data.remain_lessons + '节' : 0 + '节' );
        },
        error: ()=>{

        }
    });
}

getStudentPaySum();


$.mainBox.on('click', '#submit', function(){
	const sub_data = $.form.get({
        error_text: 'placeholder',//存放错误文案的属性名
	});
	if( !sub_data ){
		return;
	}

    let ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val(),
        sid: sid,
		money: +sub_data.money,
		lessons: +sub_data.lessons
    }

	$.form.submit({
		url: '/pss/studentPayment',
		data: ajaxData,
		success: (res) => {
			if( res.errcode != 0 ){
         		$.dialogFull.Tips( res.errmsg );
				return;
			}
        	$.dialogFull.Tips( "提交成功！" );
         	$.ajaxGetHtml({
         		url: res.data.url
         	})
		},
        error: function(){
        	$.dialogFull.Tips( "网络错误，请稍后重试" );
        }
	});
})
