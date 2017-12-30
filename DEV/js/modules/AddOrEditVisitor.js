require('./AddOrEditVisitor.css');//引入css文件


import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
const form_tpl = '<li>\
				<span><i>*</i>姓名</span>\
				<input type="text" class="short" value="{name}" placeholder="请输入姓名" name="name" data-validate="any" data-must="1" />\
			</li>\
			<li>\
				<span><i>*</i>年龄</span>\
				<input type="text" class="short" value="{age}" placeholder="请输入年龄" name="age" data-validate="number" data-must="1" />\
			</li>\
			<li>\
				<span><i>*</i>性别</span>\
				<select name="gender" data-validate="any" data-must="1" placeholder="请选择性别">\
					<option value="">请选择</option>\
					<option value="男">男</option>\
					<option value="女">女</option>\
				</select>\
			</li>\
			<li>\
				<span><i>*</i>住址</span>\
				<input type="text" class="long" value="{address}" placeholder="请输入住址" name="address" data-validate="any" data-must="1" />\
			</li>\
			<li>\
				<span><i>*</i>手机号</span>\
				<input type="text" class="short" value="{mobile}" placeholder="请输入手机号" name="mobile" data-validate="mobile" data-must="1" />\
			</li>\
			<li>\
				<span><i>*</i>家长姓名</span>\
				<input type="text" class="short" value="{official}" placeholder="请输入家长姓名" name="official" data-validate="any" data-must="1" />\
			</li>\
			<li>\
				<span class="wide"><i>*</i>与学员关系</span>\
				<input type="text" class="short" value="{relation}" placeholder="请输入与学员关系" name="relation" data-validate="any" data-must="1"/>\
			</li>\
			<li>\
				<span><i>*</i>来源</span>\
				<select name="origin" data-validate="any" data-must="1" placeholder="请输入来源">\
					<option value="">请选择</option>\
			        <option value="市场活动">市场活动</option>\
			        <option value="主动咨询">主动咨询</option>\
			        <option value="熟人介绍">熟人介绍</option>\
			        <option value="其他途径">其他途径</option>\
				</select>\
			</li>\
			<li>\
				<span><i>*</i>咨询内容</span>\
				<input type="text" class="long" value="{visitorContent}" placeholder="请输入咨询内容" name="visitor_content" data-validate="any" data-must="1" />\
			</li>';

const sid = $('#sid').val();
const page = $('#page').val();
if( sid ){
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getVisitorDetail',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        sid: sid,
	        page: +$('#page').val() || 0
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        const html = replaceTemplate( form_tpl, res.data );
	        $('.pub_form ul').html( html );
	        $('[name=origin]').val( res.data.origin || '' );
	        $('[name=gender]').val( res.data.gender || '' );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}else{
    const html = replaceTemplate( form_tpl, {} );
    $('.pub_form ul').html( html );
}



$.mainBox.on('click', '#submit_AddOrEdit', ()=>{
	const sub_data = $.form.get({
        error_text: 'placeholder',//存放错误文案的属性名
	});
	if( !sub_data ){
		return;
	}
	sub_data.age = +sub_data.age;
    let ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val(),
		data: JSON.stringify( sub_data ),
		sid: sid,
		page: page ? page : 0
    }

	!ajaxData.sid && delete ajaxData.sid;

	$.form.submit({
		url: sid ? '/pss/editVisitor' : '/pss/addVisitor',
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
