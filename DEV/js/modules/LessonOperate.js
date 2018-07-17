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
}else if( $('#status').val() == 3 ){
	$('.page_head h3').text( '补课安排' );
	$('.pub_form .wide').eq(0).text( '补课时间' );
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



let getZoneStudentList = ()=>{
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getZoneStudentList',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        let $div = $( '<div>' );
	        let classArr = {};
	        let select = '<div class="selectBox"><select id="classSelect">';
	        res.data.forEach((item,index)=>{
	        	if( !classArr[ item.class_id ] ){
		        	classArr[ item.class_id ] = true;
		        	item.class_name = item.class_name || '其它';
		        	select += `<option value="${item.class_id}">${item.class_name}</option>`;
		        	$div.append( `<p class="classItem class_${item.class_id}"><span>${item.class_name}：</span></p>` )
	        	}
				$div.find( 'p:last' ).append( `<span class="student" data-sid="${item.student_id}">${item.student_name}</sapn>` );
	        })
	        select += '</select></div>';
	        $div.prepend( select );
	        $( '.dialogPopBox .content' ).html( $div.html() );
	        $( '.dialogPopBox .content p' ).eq(0).show();
	        getClassLessonStudentList();
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}




let getClassLessonStudentList = ()=>{
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getClassLessonStudentList',
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
	        res.data.forEach((item)=>{
	        	$(`[data-sid=${item.sid}]`).addClass('checked');
	        	studentChecked.push( item.sid );
	        })
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}


let studentChecked = [];
let _dialogClose = ()=>{};
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
}).on('click', '#student_select', function(){

    $.dialogFull.Pop({
        boxClass: '.getZoneStudentList',
        width: 700,
        height: 'auto',
        cacheId: 'getZoneStudentListCachId002', //开启必须使用唯一标示！！！
        title: '学员列表',//弹框标题
        content: '',//弹框内容区
        showCallback: function($thisBox, $contentBox){
        	getZoneStudentList();
        },
        runDone: function($this, $thisBox, dialogClose) {
        	let studentCheckedObj = studentChecked.map((item)=>{
        		return {sid: item};
        	});
        	if( !studentChecked.length ){
	            $.dialogFull.Tips( "请选择学员" );
        		return;
        	}
    	    $.ajax({
		        type: "post",
		        dataType: "json",
		        url: '/pss/adjustClassLessonStudents',
		        data: {
		            code: $('#zone_code').val(),
		            zoneid: $('#zone_zoneid').val(),
			        classid: class_id,
			        lessonid: lesson_id,
		            data: JSON.stringify( studentCheckedObj )
		        },
		        success: (res)=>{
		            if( res.errcode != 0 ){
		                $.dialogFull.Tips( res.errmsg );
		                 return;
		            }
		            $.dialogFull.Tips( "提交成功！" );
		        },
		        error: ()=>{
		            $.dialogFull.Tips( "网络错误，请稍后重试！" );
		        }
		    })
        	_dialogClose = dialogClose;
            dialogClose();
        }
    });	
});


$(document).off('click', '.student').on('click', '.student', function(){
	let self = $( this );
	const sid = self.data( 'sid' );
	if( self.hasClass( 'checked' ) ){
		studentChecked.splice( studentChecked.indexOf( sid ), 1 );
		self.removeClass( 'checked' );
	}else{
		studentChecked.push( sid );
		self.addClass( 'checked' );
	}
}).off('change', '#classSelect').on('change', '#classSelect', function(){
	const class_id = $( this ).val();
	$( `.class_${class_id}` ).show().siblings().hide();
});


$.distory = ()=>{
    _dialogClose(1);

};
