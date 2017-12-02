	require('./ZoneQrcode.css');//引入css文件

import QRCode from '../kit/qrcode.js';

//zoneid


//qrcode start 3.29
let run_qrcode = (tips)=>{
	$.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/updateQrcode',
	    data: {
	        code: $('#school_code').val(),
	        zoneid: $('#zoneid').val(),
	        usertype: 'zone',
	        userid: $('#zoneid').val(),
	        expired: 30
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

run_qrcode();
