require('./AddOrEditCourse.css');


//submit_AddOrEditCourse


import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
import cvsDataHandle from '../comp/cvsDataHandle.js';//模板引擎
const tpl = {
	form_tpl: '<li><span class="wide"><i>*</i>分类课程</span>\
				<input type="text" class="short" placeholder="请输入分类课程" value="{course_name}" name="course_name" data-validate="any" data-must="1" />\
				<span class="wide"><i>*</i>有效课时数</span>\
				<input type="text" class="shortest" placeholder="请输入有效课时数" value="{lesson_num}" name="lesson_num" data-validate="number" data-must="1" />\
				<span><i>*</i>课时时长</span>\
				<input type="text" class="shortest no_margin" placeholder="请输入课时时长" value="{standard_time}" name="standard_time" data-validate="number" data-must="1" />分钟\
			</li>\
			<li>\
				<span class="wide"><i>*</i>收费方式</span>\
				<select name="fee_model" data-validate="any">\
					<option value="按课时">按课时</option>\
					<option value="按期">按期</option>\
				</select>\
			</li>\
			<li>\
				<span class="wide"><i>*</i>课程对象</span>\
				<input type="text" placeholder="请输入课程对象" value="{user}" name="user" data-validate="any" data-must="1" />\
			</li>\
			<li>\
				<span class="wide"><i>*</i>课程多维目标</span>\
				<input type="text" class="long" placeholder="请输入课程多维目标" value="{target}" name="target" data-validate="any" data-must="1" />\
			</li>\
			<li>\
				<span class="wide"><i>*</i>课程总体介绍</span>\
				<textarea class="long" placeholder="请输入课程多维目标" name="outline" data-validate="any" data-must="1">{outline}</textarea>\
				<i>*</i>\
			</li>',
	item: '<li>\
				<div class="item"><p><span>{lesson_id}</span></p></div>\
				<div class="item"><p><span>{theme}</span></p></div>\
				<div class="item"><p><span>{status}</span></p></div>\
				<div class="item"><p><span>{outline}</span></p></div>\
				<div class="item"><p><span><a href="JavaScript:;" class="del">删除</a></span></p></div>\
			</li>',
	addLessonForm: '<ul class="pub_form">\
			<li>\
				<span><i>*</i>课程主题</span>\
				<input type="text" placeholder="请输入课程主题" name="theme" data-validate="any" data-must="1" />\
			</li>\
			<li>\
				<span><i>*</i>状态</span>\
				<select name="status" data-validate="any">\
					<option value="正常">正常</option>\
					<option value="推荐">推荐</option>\
				</select>\
			</li>\
			<li>\
				<span><i>*</i>教学大纲</span>\
				<textarea placeholder="请输入教学大纲" name="outline" data-validate="any" data-must="1" />\
			</li>\
		</ul>'
}
const courseid = $('#courseid').val();
if( courseid ){
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getCourseDetail',
	    data: {
	        code: $('#school_code').val(),
	        courseid: courseid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        const html = replaceTemplate( tpl.form_tpl, res.data );
	        $('.pub_form ul').html( html );
	        $('[name=fee_model]').val( res.data.fee_model );
	        const lessons = res.data.lessons;
	        let list="";
	        lessons.map(function(item){
	        	list += replaceTemplate( tpl.item, item );
	        });
	        $('#lessons').html( list );

	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}else{
    const html = replaceTemplate( tpl.form_tpl, {} );
    $('.pub_form ul').html( html );
}

$.mainBox.on('click', '#submit_course', function(){
	const sub_data = $.form.get({
        error_text: 'placeholder',//存放错误文案的属性名
	});
	if( !sub_data ){
		return;
	}
	sub_data.lesson_num = +sub_data.lesson_num;
	sub_data.standard_time = +sub_data.standard_time;

	let lessons = [];
	$('#lessons li').each(function(){
		const span = $(this).find( 'span' );
		let _lesson = {
			lesson_id: span.eq(0).text(),
			theme: span.eq(1).text(),
			status: span.eq(2).text(),
			outline: span.eq(3).text(),
		};
		lessons.push( _lesson );
	});

    if( !lessons.length ){
		$.dialogFull.Tips( "请添加课时！" );
		return;
    }
	sub_data.lessons = lessons;
	console.log(sub_data);
	$.form.submit({
		url: courseid ? '/pss/editCourse' : '/pss/addCourse',
		data: {
			code: $('#school_code').val(),
			courseid: courseid ? courseid : '',
			data: JSON.stringify( sub_data )
		},
		success: (res) => {
			if( res.errcode != 0 ){
         		$.dialogFull.Tips( res.errmsg );
				return;
			}
        	$.dialogFull.Tips( "提交成功！" );
         	$.ajaxGetHtml({
         		url: '/pss/goCourse',
         		// data: {
         		// 	courseid: courseid || res.data.courseid
         		// }
         	})
		},
        error: function(){
        	$.dialogFull.Tips( "网络错误，请稍后重试" );
        }
	});
}).on('click', '#add_lesson', function(){
	$.dialogFull.Pop({
        boxClass: '.dialog_add_lesson',
        title: '添加课时',//弹框标题
        content: tpl.addLessonForm,//弹框内容区
        runDone: function($this, $thisBox, dialogClose) {
    		const sub_data = $.form.get({
	            item: '.dialog_add_lesson .pub_form [data-validate]',//表单项dom
		        error_text: 'placeholder',//存放错误文案的属性名
			});
			if( !sub_data ){
				return;
			}
	        const li = replaceTemplate( tpl.item, sub_data );
	        $('#lessons').append( li );
        	dialogClose();
        }

	});
	$('.dialog_add_lesson [name="outline"]').val( $('[name="outline"]').eq(0).val() );
}).on('click', '#lessons .del', function(){
	$(this).parent().parent().parent().remove();
}).on('change', '.inputFile', function(){
	cvsDataHandle({
		input: this,
		keys:['theme', 'status', 'outline'],
		handle: (data)=>{
			let li = '';
			data.map(function(line, index){
	        	li += replaceTemplate( tpl.item, line );
			});
	        $('#lessons').append( li );
		}
	});
})




