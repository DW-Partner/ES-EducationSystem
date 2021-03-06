	require('./ClassInfo.css');//引入css文件
import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
const tpl = {
	//{"errcode":0,"errmsg":"success","data":{"class_name":"xxx","teacher":"xxx","start_time":"xxx","reserve_num":"xxx","students_num":"xxx","students":[{"sid":"xxx","name":"xxx"},...]}
	info: '<div class="data_line">\
			<span>班级名称</span>\
			<strong>{class_name}</strong>\
			<span>任课老师</span>\
			<strong>{teacher}</strong>\
			<span>开班时间</span>\
			<strong>{start_time}</strong>\
			<span>预招人数</span>\
			<strong>{reserve_num}</strong>\
			<span>学员人数</span>\
			<strong>{students_num}</strong>\
		</div>',
	// <span>上课时间<em>{start_time}</em></span><span>预招人数<em>{reserve_num}</em></span><span>实际学员人数<em>{students_num}</em></span><span>讲师<em>{teacher}</em></span>',
	//{"lesson_id":"xxx","theme":"xxx","lesson_status":"xxx"}
	list: '<li>\
			<div class="info status_{lesson_status}" data-status="{lesson_status}" data-lessonid="{lesson_id}">\
			<a href="javascript:;" data-{href}="/pss/goLessonOperate?classid={class_id}&lessonid={lesson_id}&sid={sid}&status={lesson_status}">\
			<h6>{theme}</h6>\
			<p>{lesson_time}</p>\
			<strong data-lessonid="{lesson_id}">{del}</strong></a>\
			</div>\
			<div class="arrow"></div>\
			</li>',
	span: '<span>{student_name}</span>',//{sid}:
    addClassLesson: '<ul class="pub_form">\
			<li>\
				<span class="wide"><i>*</i>日期和时间</span>\
				<input type="text" class="short" id="plan_time" placeholder="请输入日期和时间" name="plan_time" data-validate="any" data-must="1"/>\
			</li>\
			<li>\
				<span class="wide"><i>*</i>教师</span>\
				<select id="tid" name="tid" data-validate="any" data-must="1" placeholder="请选择教师">\
				</select>\
			</li>\
			<li>\
				<span class="wide"><i>*</i>课程</span>\
				<select id="course_id" name="course_id" data-validate="any" data-must="1" placeholder="请选择课程">\
				</select>\
			</li>\
			<li>\
				<span class="wide"><i>*</i>课时</span>\
				<select id="lesson_id" name="lesson_id" data-validate="any" data-must="1" placeholder="请选择课时">\
				</select>\
			</li>\
			<li><span class="wide">课表自动重排</span><input type="checkbox" id="auto" class="m-checkbox" value="1"><label for="auto"></label></li>\
        </ul>',
};
const classid = $('#classid').val();
const sid = $('#sid').val();

let getClassLessonsList = (sid, title_info)=>{
	// start 3.21
	$.jsonPage({
	    listBox: '.class_list',//列表容器
	    ajaxUrl: '/pss/getClassLessonsList',
	    ajaxType: 'post',
	    ajaxData: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        classid: classid,
	        sid: sid || undefined
	    },//上行参数
	    template: tpl.list,//列表模板
	    listKey: ['data'],//下行结构
	    pageBar: false,//是否启用分页
	    eachDataHandle: function(msg,pageNum,pageSize){
	        // const words = {
	        //     '0': '已经上过',
	        //     '1': '马上要上',
	        //     '2': '以后上',
	        //     '3': '缺课',
	        // }
	        // msg.words = words[msg.lesson_status];
			msg.class_id = classid;
			msg.href = msg.lesson_status == 0 && sid ? 'null' : 'href';
			// msg.href = 'href';

			//msg.del = msg.lesson_status == 0 ? '' : '删除'

			msg.sid = sid;

			msg.lesson_time = msg.lesson_time.substr(0,16).replace(/\s/g, '<br />');

	        return msg;
	    },
	    eachTemplateHandle: false,//Function : function(msg,pageNum,pageSize){ return msg }
	    noData: false,//Function : function( $listBox, $pageBox ){}
	    codeKeyName: 'errcode',//状态标示key名
	    codeSuccess: 0,//状态标示值
		successRunBefore: function(msg, pageNum, pageSize, $listBox, $pageBox) {
//{"data":[{"lesson_time":"2017-12-12 14:23:43","theme":null,"lesson_status":0,"lesson_id":50},{"lesson_time":"2017-12-15 00:00:00","theme":null,"lesson_status":0,"lesson_id":51}],"errcode":"0","errmsg":"success"}
			let _sortList = [];
			let time_obj = {};
			let time_arr = msg.data.map(function(_item){
				const key = +_item.lesson_time.replace(/[^\d]/g,'');
				time_obj[ key ] = _item;
				return key;
			});
			time_arr.sort(function(a,b){return a-b});

			time_arr.forEach(function(_arr){
				_sortList.push( time_obj[ _arr ] );
			});
			msg.data = _sortList;
			return msg
		},
	    successRunAfter: function(msg, pageNum, pageSize, $listBox, $pageBox) {
		    $('.page_head h3').text( '班级信息——' + (title_info || '班级课程表'));
	    },//function(msg) {  }
	    ajaxCodeError: function( res ){
	        $.dialogFull.Tips( res.errmsg );
	    },
	    ajaxError: function(XMLHttpRequest, textStatus, errorThrown, text) {
	        $.dialogFull.Tips( "网络错误，请稍后重试" );
	    }
	});
	//获取教案列表 end
}


let getZoneSummary = ()=>{

    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getClassSummary',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        classid: classid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
			let select = '进入学员课表：<select id="students"><option value="">所有</option>';
			res.data.students.map(function(item){
			    select += '<option value="' + item.sid + '">' + item.name + '</option>'
			});
			select += '</select>';
	        const html = replaceTemplate( tpl.info, res.data );
	        $('.dataBox').html( html );
	        $('.run').append( select );
	        $('#students').val( sid || '' );
		    const title_info = sid ? $('#students').find('option:selected').text() + '的课程表' : '';
		    if( sid ){
		    	$('.dataBox').hide();
		    }else{
		    	$('.dataBox').show();
		    }
	        getClassLessonsList( sid || '', title_info );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
getZoneSummary();

let getLessonAbsenceAndAudits = (that,lessonid)=>{
	let list = that.find( '.list' );
	if(list.length){
		list.show();
		return;
	}
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getLessonAbsenceAndAudits',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        classid: classid,
	        lessonid: lessonid,
            // sid: sid || undefined
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        let dom = '<div class="list"><p class="student"><span>请假学员：</span></p><p class="visitor"><span>试听学员：</span></p></div>';
	        let $dom = $(dom);
	        res.data.forEach(function(item){
	        	$dom.find( '.' + item.type ).append( '<span>' + item.sname + '、</span>' )
	        });
	        if( $dom.find( '.student' ).find('span').length==1 ){
	        	$dom.find( '.student' ).append('<span>无</span>');
	        }
	        if( $dom.find( '.visitor' ).find('span').length==1 ){
	        	$dom.find( '.visitor' ).append('<span>无</span>');
	        }
	        let last_student = $dom.find( '.student' ).find('span').eq(-1);
	        last_student.text( last_student.text().replace('、','') );

	        let last_visitor = $dom.find( '.visitor' ).find('span').eq(-1);
	        last_visitor.text( last_student.text().replace('、','') );

	        that.append( $dom );
	        that.find('.list').show();
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}

let getLessonsMissList = (that,lessonid)=>{
	let list = that.find( '.list' );
	if(list.length){
		list.show();
		return;
	}
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getLessonsMissList',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        classid: classid,
	        lessonid: lessonid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        let dom = '<div class="list"><p><span>提交照片数：</span></p><p><span>提交视频数：</span></p></div>';
	        let $dom = $(dom);
	  //       let span = res.data.map(function(item){
	  //       	return replaceTemplate( tpl.span, item );
			// });
	  //       $dom.find('p').eq(0).append(span.join('、') || '<span>无</span>');
	        let status_arr = [];
	        let _p = res.data.map(function(item){
	        	const _status = item.status;
	        	const push = status_arr.indexOf( _status ) == -1 ?  status_arr.push( _status ) : '';
	        	return push ? `<p><span>${_status}：</span></p>` : '';
			});
			$dom.prepend( _p.join('') );

	        let span = res.data.map(function(item){
	        	const _status = item.status;
	        	const index = status_arr.indexOf( _status );
	        	$dom.find('p').eq( index ).append( replaceTemplate( tpl.span, item ) + '、' );
			});
			$dom.find('p').each(function(){
				const html = $(this).html().substring(0, $(this).html().length - 1);;
				console.log( html );
				$(this).html( html );
			})


			getLessonsFileCounts( that,lessonid,$dom  );

	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})	
}
let getLessonsFileCounts = (that,lessonid,$dom)=>{
	let list = that.find( '.list' );
	if(list.length){
		list.show();
		return;
	}
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getLessonsFileCounts',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        classid: classid,
	        lessonid: lessonid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
			$dom.find('p').eq(-2).append( res.data.pics );
			$dom.find('p').eq(-1).append( res.data.videos );

	        that.append( $dom );
	        that.find('.list').show();
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})	
}

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
	        let options = '';
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

let getCourseList = ()=>{
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getCourseList',
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
			    options += '<option value="' + item.course_id + '">' + item.course_name + '</option>'
			});
			$('[name=course_id]').html(options);
			getLessons( $('[name=course_id]').val() );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}

let getLessons = ( courseid )=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getCourseDetail',
        data: {
            code: $('#school_code').val() || $('#zone_code').val(),
            courseid: courseid
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                 return;
            }
            const lessons = res.data.lessons;
            let options = "";
            lessons.map(function(item, i){
			    options += '<option value="' + item.lesson_id + '">' + item.theme + '</option>'
            });
            $('#lesson_id').html( options );
        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
}

let submit_add = ()=>{
	const sub_data = $.form.get({
		item: ' .addClassLesson [data-validate] ',
        error_text: 'placeholder',//存放错误文案的属性名
	});
	if( !sub_data ){
		return;
	}
	sub_data.course_id = +sub_data.course_id;
	sub_data.tid = +sub_data.tid;
	sub_data.lesson_id = +sub_data.lesson_id;
	sub_data.auto = $('#auto:checked').val() ? 'true' : 'false';
	const start_time = $('#plan_time').val();
	if( start_time.indexOf('00:00') == 0 ){
     	$.dialogFull.Tips( '请选择合理上课时间段！' );
     	return;
	}
    let ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val(),
        classid: classid,
		data: JSON.stringify( sub_data ),
    }
	$.form.submit({
		url: '/pss/addClassLesson',
		data: ajaxData,
		success: (res) => {
			if( res.errcode != 0 ){
         		$.dialogFull.Tips( res.errmsg );
				return;
			}
			_dialogClose(1);
        	$.dialogFull.Tips( "提交成功！" );
        	getClassLessonsList();
		},
        error: function(){
        	$.dialogFull.Tips( "网络错误，请稍后重试" );
        }
	});
}

sid && $('.dataBox, .addLessonBtn').hide();

let _dialogClose = ()=>{};
$.mainBox.on('change', '#students', function(){
	const sid = $(this).val();
    const title_info = sid ? $(this).find('option:selected').text() + '的课程表' : '';
    getClassLessonsList(sid, title_info);
    if( sid ){
    	$('.dataBox, .addLessonBtn').hide();
    }else{
    	$('.dataBox, .addLessonBtn').show();
    }
}).on('click', '.status_0xx, .status_3xx', function(){
	const lessonid = $(this).data('lessonid');
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getLessonsMissList',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        classid: classid,
	        lessonid: lessonid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        let span = '';
			res.data.map(function(item){
	        	span += replaceTemplate( tpl.span, item );

			});
	        $.dialogFull.Alert({
                title: '缺课人员',//弹框标题
                content: span || '无缺课学生',//弹框内容区
	        });

	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}).on('click', '.class_list li strong', function(e){
    if ( e && e.stopPropagation ){
        e.stopPropagation(); 
    }
    else{
        window.event.cancelBubble = true; 
    }
	const lessonid = $(this).data('lessonid');
	const self = $(this);
	$.dialogFull.Pop({
        title: '提示',//弹框标题
        content: '确认删除该课时？',//弹框内容区
        runDone: function($this, $thisBox, dialogClose) {
			// /pss/cancelLesson?code=x&zoneid=x&classid=x&lessonid=x&sid=x
		    $.ajax({
			    type: "post",
			    dataType: "json",
			    url: '/pss/cancelLesson',
			    data: {
			        code: $('#zone_code').val(),
			        zoneid: $('#zone_zoneid').val(),
			        classid: classid,
			        lessonid: lessonid,
			        sid: $( '#students' ).val() || undefined
			    },
			    success: (res)=>{
			        if( res.errcode != 0 ){
			            $.dialogFull.Tips( res.errmsg );
			             return;
			        }
		            $.dialogFull.Tips( '删除成功！' );
		            self.parent().parent().parent().remove();
		        	dialogClose();
			    },
			    error: ()=>{
			        $.dialogFull.Tips( "网络错误，请稍后重试！" );
			    }
			})
        }
	});
}).on('mouseenter', '.class_list .info', function(e){
	let self = $(this);
	if( $('#students').val() ){
		const _status = self.data('status');
		if( _status == 3 ){
			self.attr( 'title', '点击安排补课事宜' );
		}
		return;
	}
	self.data('req', 1);
	setTimeout(function(){
		if( self.data('req') == 0 ){
			return;
		}
		const lessonid = self.data('lessonid');
		const status = self.data('status');
		if( status == 1 || status == 2 ){
			getLessonAbsenceAndAudits( self, lessonid );
		}else{
			getLessonsMissList( self, lessonid );
		}
	},500)
}).on('mouseleave', '.class_list .info', function(e){
	if( $('#students').val() ){
		return;
	}
	$(this).data('req', 0).find( '.list' ).hide();
}).on('click', '.addLessonBtn', function(){
    $.dialogFull.Pop({
        boxClass: '.addClassLesson',
        title: '添加课时',//弹框标题
        content: tpl.addClassLesson,//弹框内容区
        showCallback: function($thisBox, $contentBox){
			getZoneTeacherList();
			getCourseList();
			//常规用法
			let start_time = $.laydate.render({
				elem: '#plan_time',
				type: 'datetime',
				min: 1,
				ready: function(){
					start_time.hint('开班时间必须大于当前日期');
				}
			});
        },
        runDone: function($this, $thisBox, dialogClose) {
			_dialogClose = dialogClose;
			submit_add();
        }
    });
})

$(document).on('change', '#course_id', function(){
	getLessons( $(this).val() );
});
$.distory = ()=>{
	$(document).off('change', '#course_id');
    _dialogClose(1);
};