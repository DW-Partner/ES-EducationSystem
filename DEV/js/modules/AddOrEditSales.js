require('./AddOrEditSales.css');

import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
const form_tpl = '<li>\
					<span><i>*</i>顾问姓名</span>\
					<input type="text" class="normal" placeholder="请输入顾问姓名" value="{name}" name="name" data-validate="any" data-must="1" />\
					<span><i>*</i>教师性别</span>\
					<select name="gender" data-validate="any" placeholder="请选择顾问性别" data-must="1">\
						<option value="">请选择</option>\
						<option value="男">男</option>\
						<option value="女">女</option>\
					</select>\
				</li>\
				<li>\
					<span>出生年月</span>\
					<input type="text" id="birthday" class="normal" placeholder="请输入出生年月" value="{birthday}" name="birthday" data-validate="any" />\
					<span>籍贯</span>\
					<input type="text" class="short" placeholder="请输入籍贯" value="{native_place}" name="native_place" data-validate="any" />\
				</li>\
				<li>\
					<span>身份证号</span>\
					<input type="text" class="normal" placeholder="请输入身份证号" value="{id_num}" name="id_num" data-validate="IDnumber" />\
				</li>\
				<li>\
					<span><i>*</i>手机号</span>\
					<input type="text" class="normal" placeholder="请输入手机号" value="{mobile}" name="mobile" data-validate="any" data-must="1" />\
				</li>\
				<li>\
					<span>当前住址</span>\
					<input type="text" class="long" placeholder="请输入当前住址" value="{address}" name="address" data-validate="any" />\
				</li>\
				<li>\
					<span>入职时间</span>\
					<input type="text" id="entry_day" class="normal" placeholder="请输入入职时间" value="{entry_day}" name="entry_day" data-validate="any" />\
				</li>\
				<li>\
					<span class="wide">毕业学历信息</span>\
					<input type="text" class="long" placeholder="请输入“毕业院校”、“毕业时间”、“学历”3项信息，输入格式：毕业院校/毕业时间/学历" value="{education}" name="education" data-validate="any" />\
				</li>\
				<li>\
					<span>其他信息</span>\
					<input type="text" class="long" placeholder="请输入" value="{other_info}" name="other_info" data-validate="any" />\
				</li>';

const salesid = $('#salesid').val();

let getSalesDetail = ()=>{
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getSalesDetail',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        salesid: salesid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        const html = replaceTemplate( form_tpl, res.data );
	        $('.pub_form ul').html( html );
			$('[name="gender"]').val( res.data.gender );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}


if( salesid ){
	getSalesDetail();
	$( '.btn_dis' ).data( 'href', '/pss/goSales?salesid=' + salesid );
}else{
    const html = replaceTemplate( form_tpl, {} );
    $('.pub_form ul').html( html );
}

$.mainBox.on('click', '#submit_AddOrEdit', function(){
	const sub_data = $.form.get({
        error_text: 'placeholder',//存放错误文案的属性名
	});
	if( !sub_data ){
		return;
	}

    let ajaxData = {
        code: $('#school_code').val() || $('#zone_code').val(),
	zoneid = $('#school_zoneid').val() || $('#zone_zoneid').val(),
        salesid: salesid,
		data: JSON.stringify( sub_data )
    }
    !ajaxData.salesid && delete ajaxData.salesid;

	$.form.submit({
		url: salesid ? '/pss/editSales' : '/pss/addSales',
		data: ajaxData,
		success: (res) => {
			if( res.errcode != 0 ){
         		$.dialogFull.Tips( res.errmsg );
				return;
			}
        	$.dialogFull.Tips( "提交成功！" );
         	$.ajaxGetHtml({
         		url: '/pss/goSales',
         		data: {
         			salesid: salesid || res.data.salesid
         		}
         	})
		},
        error: function(){
        	$.dialogFull.Tips( "网络错误，请稍后重试" );
        }
	});
})
