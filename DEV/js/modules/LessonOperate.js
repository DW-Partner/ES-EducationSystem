require('./LessonOperate.css');//引入css文件

import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎

const class_id = $('#classid').val();
const lesson_id = $('#lessonid').val();
const sid =  $('#sid').val();
//teacher_name
//plan_time
const tpl = {
	info: '<p>原定上课时间：{old_plan_time}</p>\
			<p>原任课教师：{old_teacher_name}</p>\
			<p>课时主题：{theme}</p>\
			<p>课时教学大纲：{outline}</p>'

	//'{"plan_time":"xxx","tid":"xxx","teacher_name":"xxx","outline":"xxx"}}'
}


// import laydate from '../comp/laydate/laydate.js';//模板引擎

// window.laydate = laydate;

//常规用法
$.laydate.render({
	elem: '#plan_time',
	type: 'datetime',
	btns: ['confirm']
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
			getLessonsDetail();

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
	        lessonid: lesson_id,
            sid: sid || undefined
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        const html = replaceTemplate( tpl.info, res.data );
	        $('.info').html( html );
	        $('#plan_time').val( res.data.plan_time );
	        $('[name=tid]').val( res.data.tid );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}

if( !sid ){
	$('.pub_form ul').append('<li><span class="wide">课表自动重排</span><input type="checkbox" id="auto" class="m-checkbox" value="1"><label for="auto"></label></li>');	
}


let getLessonAbsenceAndAudits = ()=>{
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getLessonAbsenceAndAudits',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        classid: class_id,
	        lessonid: lesson_id,
            // sid: sid || undefined
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        let dom = '<div class="list"><h5>缺勤学员</h5><p class="student"></p><h5>试听学员</h5><p class="visitor"></p></div>';
	        let $dom = $(dom);
	        res.data.forEach(function(item){
	        	$dom.find( '.' + item.type ).append( '<span>' + item.sname + '</span>' )
	        })
	        $( '.period_edit' ).append( $dom );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
//getLessonAbsenceAndAudits();

$.mainBox.on('click', '#submit_edit', ()=>{
	const sub_data = $.form.get({
        error_text: 'placeholder',//存放错误文案的属性名
	});
	if( !sub_data ){
		return;
	}

	if( $('#plan_time').val().indexOf(' 00:00') > -1 ){
     	$.dialogFull.Tips( '请选择合理上课时间段！' );
     	return;
	}

	sub_data.tid = +sub_data.tid;
	if( $('#auto').length ){
		sub_data.auto = $('#auto:checked').val() ? true : false;
	}

    let ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val(),
        classid: class_id,
        lessonid: lesson_id,
        sid: sid || undefined,
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
         		url: res.data.url + '&sid=' + (sid || '')
         	});
		},
        error: function(){
        	$.dialogFull.Tips( "网络错误，请稍后重试" );
        }
	});

}).on('click', '#cancel', function(){
	window.location.reload();
});
