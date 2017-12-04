require('./LessonOperate.css');//引入css文件
require('../comp/laydate/laydate.css');//引入css文件

import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎

const class_id = $('classid').val();
const lesson_id = $('lessonid').val();


const tpl = {
	info: '<p>原定上课时间：{plan_time}</p>\
			<p>原任课教师：{teacher_name}</p>\
			<p>课时主题：{outline}</p>\
			<p>课时教学大纲：{outline}</p>'

	//'{"plan_time":"xxx","tid":"xxx","teacher_name":"xxx","outline":"xxx"}}'
}


import laydate from '../comp/laydate/laydate.js';//模板引擎

// window.laydate = laydate;

//常规用法
laydate.render({
  elem: '#plan_time',
  type: 'datetime'
});


let getZoneTeacherList = ()=>{
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getZoneTeacherList',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        let options = "";
			res.data.map(function(item){
			    options += '<option value="' + item.tid + '">' + item.teacher_name + '</option>'
			});
			$('[name=tid]').html(options);

	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
getZoneTeacherList();



let getLessonsDetail = ()=>{

    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getLessonsDetail',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        classid: class_id,
	        lessonid: lesson_id
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        const html = replaceTemplate( tpl.info, res.data );
	        $('.info').html( html );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
getLessonsDetail();



$.mainBox.on('click', '#submit_edit', ()=>{
	const sub_data = $.form.get({
        error_text: 'placeholder',//存放错误文案的属性名
	});
	if( !sub_data ){
		return;
	}
	sub_data.tid = +sub_data.tid;

    let ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val(),
		data: JSON.stringify( sub_data ),
    }

	$.form.submit({
		url: '/pss/submitLessonOperate',
		data: ajaxData,
		success: (res) => {
			if( res.errcode != 0 ){
         		$.dialogFull.Tips( res.errmsg );
				return;
			}
        	$.dialogFull.Tips( "提交成功！" );
         	$.ajaxGetHtml({
         		url: res.data.url
         	});
		},
        error: function(){
        	$.dialogFull.Tips( "网络错误，请稍后重试" );
        }
	});

}).on('click', '#cancel', function(){
	window.location.reload();
})
