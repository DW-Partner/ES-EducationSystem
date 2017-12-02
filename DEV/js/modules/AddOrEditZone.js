require('./AddOrEditZone.css');

import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
const form_tpl = '<li><span><i>*</i>校区名称</span>\
					<input type="text" class="long" placeholder="请输入校区名称" value="{name}" name="zone_name" data-validate="any" data-must="1" />\
				</li><li><span><i>*</i>负责人</span>\
					<input type="text" class="short" placeholder="请输入负责人姓名" value="{official}" name="official" data-validate="any" data-must="1" />\
				</li><li><span><i>*</i>手机</span>\
					<input type="text" class="short" placeholder="请输入手机号码" value="{mobile}" name="mobile" data-validate="mobile" data-must="1" />\
				</li><li><span>固定电话</span>\
					<input type="text" class="short" placeholder="请输入固定电话号码" value="{telephone}" name="telephone" data-validate="number" />\
				</li><li><span><i>*</i>地址</span>\
					<input type="text" class="long" placeholder="请输入地址" value="{address}" name="address" data-validate="any" data-must="1" />\
				</li><li><span><i>*</i>校区类型</span>\
					<p class="raioBox1">\
						<label><input type="radio" value="0" name="type_1" checked>直营</label>\
						<label><input type="radio" value="1" name="type_1">合作</label>\
					</p><p class="raioBox2">\
						<label><input type="radio" value="0" name="type_2" checked>商场</label>\
						<label><input type="radio" value="1" name="type_2">社区</label>\
					</p></li><li><span><i>*</i>主营项目</span>\
					<input type="text" class="long" placeholder="请输入主营项目" value="{coreContent}" name="core_content" data-validate="any" data-must="1" />\
				</li>';

const zoneid = $('#zoneid').val();
if( zoneid ){
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getZoneInfo',
	    data: {
	        code: $('#school_code').val(),
	        zoneid: zoneid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        const html = replaceTemplate( form_tpl, res.data );
	        $('.pub_form ul').html( html );
	        $('[name=type_1]').eq( +res.data.type.split('')[0] ).prop('checked', true);
	        $('[name=type_2]').eq( +res.data.type.split('')[1] ).prop('checked', true);
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}else{
    const html = replaceTemplate( form_tpl, {} );
    $('.pub_form ul').html( html );
}

$.mainBox.on('click', '#submit_AddOrEditZone', function(){
	const sub_data = $.form.get({
        error_text: 'placeholder',//存放错误文案的属性名
	});
	if( !sub_data ){
		return;
	}

	sub_data.type = $('[name="type_1"]:checked').val() + $('[name="type_2"]:checked').val();

	$.form.submit({
		url: zoneid ? '/pss/editZone' : '/pss/addZone',
		data: {
			code: $('#school_code').val(),
			zoneid: zoneid ? zoneid : '',
			data: JSON.stringify( sub_data )
		},
		success: (res) => {
			if( res.errcode != 0 ){
         		$.dialogFull.Tips( res.errmsg );
				return;
			}
        	$.dialogFull.Tips( "提交成功！" );
         	$.ajaxGetHtml({
         		url: '/pss/goZoneDetail',
         		data: {
         			zoneid: zoneid || res.data.zoneid
         		}
         	})
		},
        error: function(){
        	$.dialogFull.Tips( "网络错误，请稍后重试" );
        }
	});
})