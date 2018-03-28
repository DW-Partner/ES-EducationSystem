require('./SalesDetail.css');

import QRCode from '../kit/qrcode.js';

import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
import tab from '../comp/tab.js';//tab切换

const tpl = {
	base_info: '<p><span>教师姓名：</span><em>{name}</em></p>\
				<p><span>性别：</span><em>{gender}</em></p>\
				<p><span>出生日期：</span><em>{birthday}</em></p>\
				<p><span>入职时间：</span><em>{entry_day}</em></p>\
				<br />\
				<p><span>详细地址：</span><em>{address}</em></p>\
				<p><span>手机号：</span><em>{mobile}</em></p>\
				<br /><p><span>身份证号：</span><em>{id_num}</em></p>\
				<p><span>毕业学历信息：</span><em>{education}</em></p>',
}
//time":"xxx","class_num":"xxx","lesson_num":"xxx","completed_lessons":"xxx","completed_students":"xxx", "renew_students":"xxx","signed_num":"xxx"

const salesid = $('#salesid').val();

//qrcode start 3.29
let run_qrcode = (tips)=>{
	$.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/updateQrcode',
	    data: {
	        code: $('#school_code').val() || $('#zone_code').val(),
	        zoneid: $('#school_zoneid').val() || $('#zone_zoneid').val(),
	        usertype: 'sales',
	        userid: salesid,
	        expired: 180
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        $("#img_box").html('');
			//生成二维码图片start
		    let Teacher_qrcode = new QRCode($("#img_box")[0], {
			  text: 'your content',
			  width: 256,
			  height: 256,
			  colorDark : '#000000',
			  colorLight : '#ffffff',
		    });
		    Teacher_qrcode.makeCode(res.data.qrcode);

            tips && $.dialogFull.Tips( '更新成功！' );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
//qrcode end

//获取教师信息 start 3.24
let getSalesDetail = ()=>{
	$.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getTeacherDetail',
	    data: {
	        code: $('#school_code').val() || $('#zone_code').val(),
	        salesid: salesid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        const html = replaceTemplate( tpl.base_info, res.data );
	        $('.TeacherDetail .center').html( html );
			run_qrcode();
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
getSalesDetail();
//获取教师信息 end


$.mainBox.on('click', '#t_qrcode', function(){
	run_qrcode(true);
})
