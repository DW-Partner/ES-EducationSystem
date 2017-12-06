	require('./AddAudit.css');//引入css文件

import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎

const tpl = {
	class_option: '<option value="{class_id}">{class_name}</option>',
	lesson_option: '<option value="{lesson_id}">{theme}</option>'
}

const sid = $('#sid').val();
const page = $('#page').val();

// /pss/getAuditLessonList?code=x&zoneid=x

//{"class_id":1,"class_name":"初级绘画班","lessons":[{"lesson_id":1,"theme":"主题1"}]}
let option_data;
let getAuditLessonList = ()=>{
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getAuditLessonList',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val()
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        option_data = res.data;

	        let option_1 = '';
	        option_data.map(function(_class){
		        option_1 += replaceTemplate( tpl.class_option, _class );
	        })

	        $('[name=class_id]').html( option_1 );

			if( !option_data[0] || !option_data[0].lessons ){
				return;
			}

			let option_2 = ''
	        option_data[0].lessons.map(function( lesson ){
	        	option_2 += replaceTemplate( tpl.lesson_option, lesson );
	        })

	        $('[name=lesson_id]').html( option_2 );

	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})

}
getAuditLessonList();



let getVisitorDetail = ()=>{
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
	        $('.pub_form ul em').html( res.data.name );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})	
}
getVisitorDetail();


$.mainBox.on('change', '[name=class_id]', function(){
	const val = $(this).val();
	option_data.map(function( item ){
		if( val === item.class_id ){
			let option_2 = ''
	        item.lessons.map(function( lesson ){
	        	option_2 += replaceTemplate( tpl.lesson_option, lesson );
	        })
	        $('[name=lesson_id]').html( option_2 );
		}
	})
}).on('click', '#submit', function(){
	const sub_data = $.form.get();
	if( !sub_data ){
		return;
	}
    let ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val(),
		data: JSON.stringify( sub_data ),
		sid: sid,
		page: page ? page : 0
    }
	$.form.submit({
		url: '/pss/addAudit',
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
