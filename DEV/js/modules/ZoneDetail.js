require('./ZoneDetail.css');

import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
const tpl = {
	base_info: '<p><span>校区名称：</span><em>{name}</em></p>\
		<p><span>负责人：</span><em>{official}</em></p>\
		<p><span>手机号：</span><em>{mobile}</em></p>\
		<p><span>固定电话：</span><em>{telephone}</em></p>\
		<br />\
		<p><span>详细地址：</span><em>{address}</em></p>',
	extInfo_info: '<div class="data data1"><span>班级数</span><p>{class_num}</p></div>\
		<div class="data data2"><span>学员数</span><p>{student_num}</p></div>\
		<div class="data data3"><span>学员总数</span><p>{his_student_num}</p></div>\
		<div class="data data4"><span>咨询登记数</span><p>{visitor_num}</p></div>',
    classList: '<li>\
            <div class="item"><p><span>{class_name}</span></p></div>\
            <div class="item"><p><span>{course_name}</span></p></div>\
            <div class="item"><p><span>{start_time}</span></p></div>\
            <div class="item"><p><span>{teacher_name}</span></p></div>\
            <div class="item"><p><span>{student_num}</span></p></div>\
        </li>',
}
//<div class="item"><p><span>{current_lesson}</span></p></div>\

//获取校区信息 start 3.12
let getZoneInfo = ()=>{
	$.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getZoneInfo',
	    data: {
	        code: $('#school_code').val(),
	        zoneid: $('#zoneid').val()
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        const html = replaceTemplate( tpl.base_info, res.data );
	        $('.ZoneDetail .info').html( html );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
getZoneInfo();
//获取校区信息 end


//获取校区附加信息 start 3.15
let getZoneExtInfo = ()=>{
	$.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getZoneExtInfo',
	    data: {
	        code: $('#school_code').val(),
	        zoneid: $('#zoneid').val()
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        const html = replaceTemplate( tpl.extInfo_info, res.data );
	        $('.ZoneDetail .content_middle').html( html );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
getZoneExtInfo();
//获取校区附加信息 end 3.15


//班级列表 start 3.16
$.jsonPage({
    listBox: 'ul.body',//列表容器
    ajaxUrl: 'getZoneClasses',
    ajaxType: 'post',
    ajaxData: {
        code: $('#school_code').val(),
        zoneid: $('#zoneid').val()
    },//上行参数
    template: tpl.classList,//列表模板
    listKey: ['data'],//下行结构
    pageBar: false,//是否启用分页
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
//班级列表 end
