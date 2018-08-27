require('./PlanDetail.css');


import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
const tpl = '<div>\
				<p><span>课程分类名：</span><em>{course_name}</em></p>\
				<p><span>课时主题：</span><em>{lesson_theme}</em></p>\
				<p><span>课时编号：</span><em>{lesson_id}</em></p>\
			</div>\
			<div>\
				<p><span>提交人：</span><em>{contributor}</em></p>\
			</div>\
			<div>\
				<p><span>地点：</span><i>{location}</i></p>\
			</div>\
			<div>\
				<p><span>我的简易教案：</span><i>{content}</i></p>\
			</div>';

//{"data":{"contributor":"赵赵","course_name":"绘画","lesson_theme":"概念介绍","location":"baiziwan","lesson_id":1,"content":"fweafewfewfwaef"},"errcode":"0","errmsg":"success"}


    // <input type="hidden" id="courseid" value="${courseid}">
    // <input type="hidden" id="lessonid" value="${lessonid}">
    // <input type="hidden" id="planid" value="${planid}">
    //获取教学教研详情 3.22
let getPlanDetail = ()=>{

    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getPlanDetail',
	    data: {
	        code: $('#school_code').val() || $('#zone_code').val(),
	        courseid: $('#courseid').val(),
	        lessonid: $('#lessonid').val(),
	        planid: $('#planid').val(),
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        const html = replaceTemplate( tpl, res.data );
	        $('.classLi').html( html );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
getPlanDetail();