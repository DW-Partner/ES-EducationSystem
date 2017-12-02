require('./AccountSet.css');

import hex_md5 from '../kit/md5.js';
import QRCode from '../kit/qrcode.js';


const tpl = {
	list: '<li><span>{name}</span><a href="JavaScript:;" class="btn" data-href="/pss/goZoneQrcode?zoneid={id}">生成登录二维码</a><a href="JavaScript:;" class="{btn} zoneAction" data-zoneid="{id}" data-isfrozen="{isfrozen}">{frozen_word}</a></li>'
}

//qrcode start 3.29
let run_qrcode = (tips)=>{
	$.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/updateQrcode',
	    data: {
	        code: $('#school_code').val(),
	        zoneid: 0,
	        usertype: 'school',
	        userid: $('#school_code').val(),
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






//校区列表 start 3.9
$.jsonPage({
    listBox: '.set_bottom ul',//列表容器
    ajaxUrl: '/pss/getZoneList',
    ajaxType: 'post',
    ajaxData: {
        code: $('#school_code').val()
    },//上行参数
    template: tpl.list,//列表模板
    listKey: ['data'],//下行结构
    pageBar: false,//是否启用分页
    eachDataHandle: function(msg,pageNum,pageSize){
    	const isfrozen = msg.isfrozen == 'true';
    	msg.frozen_word = isfrozen ? '解除校区登录冻结' : '冻结校区登录';
    	msg.btn = isfrozen ? 'btn_dis' : 'btn';
    	msg.isfrozen = isfrozen ? 1 : 0;
        return msg;
    },
    eachTemplateHandle: false,//Function : function(msg,pageNum,pageSize){ return msg }
    noData: false,//Function : function( $listBox, $pageBox ){}
    codeKeyName: 'errcode',//状态标示key名
    codeSuccess: 0,//状态标示值
    successRunAfter: function(data, pageNum, pageSize, $listBox, $pageBox) {

    },//function(msg) {  }
    ajaxCodeError: function( res ){
        $.dialogFull.Tips( res.errmsg );
    },
    ajaxError: function(XMLHttpRequest, textStatus, errorThrown, text) {
        $.dialogFull.Tips( "网络错误，请稍后重试" );
    }
});
//校区列表 end





$.mainBox.on('click', '#submit_pass', function(){
	const sub_data = $.form.get({
		item: '.passwordBox [data-validate]',
        error_text: 'placeholder',//存放错误文案的属性名
	});
	if( !sub_data ){
		return;
	}
	if( sub_data.oldpass === sub_data.newpass ){
		$.dialogFull.Tips('新密码与旧密码一致，请重新输入');
		return;
	}else if( sub_data.newpass != sub_data.newpass_check ){
		$.dialogFull.Tips('两次新输入密码不一致，请重新输入！');
		return;
	}
	sub_data.oldpass = hex_md5( sub_data.oldpass );
	sub_data.newpass = hex_md5( sub_data.newpass );
	sub_data.code = $('#school_code').val();
	delete sub_data.newpass_check;
	$.form.submit({
		url: '/pss/updateSchoolPasword',
		data: sub_data,
		success: (res) => {
			if( res.errcode != 0 ){
         		$.dialogFull.Tips( res.errmsg );
         		$('.passwordBox [data-validate]').val('');
				return;
			}
         	$.dialogFull.Tips('密码修改成功！');
		},
        error: function(){
        	$.dialogFull.Tips( "网络错误，请稍后重试" );
        }
	});
}).on('click', '#re_qrcode', function(){
	run_qrcode(true);
}).on('click', '.zoneAction', function(){
	const self = $(this);
	const zoneid = self.data('zoneid');
	const isfrozen = self.data('isfrozen');
	const action = isfrozen == 1 ? 'start' : 'stop';
	const target_val = isfrozen == 1 ? 0 : 1;
	const target_words = self.text() == '冻结校区登录' ? '解除校区登录冻结' : '冻结校区登录';

	$.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/controlZoneLogin',
	    data: {
	        code: $('#school_code').val(),
	        zoneid: zoneid,
	        action: action
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        $.dialogFull.Tips( "操作成功！" );
	        self.data('isfrozen', target_val).text( target_words ).removeClass( target_val==0 ? 'btn_dis' : 'btn' ).addClass( target_val==1 ? 'btn_dis' : 'btn' );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	});
})