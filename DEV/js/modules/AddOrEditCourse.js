require('./AddOrEditCourse.css');


//submit_AddOrEditCourse


import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
import cvsDataHandle from '../comp/cvsDataHandle.js';//模板引擎
const tpl = {
	form_tpl: '<li><span class="wide"><i>*</i>分类课程</span>\
				<input type="text" class="short" placeholder="请输入分类课程" value="{course_name}" name="course_name" data-validate="any" data-must="1" />\
				<span class="wide"><i>*</i>有效课时数</span>\
				<input type="text" class="shortest" placeholder="请输入有效课时数" disabled="disabled" value="{lesson_num}" name="lesson_num" data-validate="number" data-must="1" />\
				<span><i>*</i>课时时长</span>\
				<input type="text" class="shortest no_margin" placeholder="请输入课时时长" value="{standard_time}" name="standard_time" data-validate="number" data-must="1" />分钟\
			</li>\
			<li>\
				<span class="wide"><i>*</i>收费方式</span>\
				<select name="fee_model" data-validate="any">\
					<option value="按课时">按课时</option>\
				</select>\
			</li>\
			<li>\
				<span class="wide"><i>*</i>课程对象</span>\
				<input type="text" placeholder="请输入课程对象" value="{user}" name="user" data-validate="any" data-must="1" />\
			</li>\
			<li id="target">\
				<div><span class="wide"><i>*</i>班级多维目标</span>\
				<input type="text" class="long target_item" placeholder="请输入课程多维目标" /></div>\
				<div><span class="wide"></span>\
				<input type="text" class="long target_item" placeholder="请输入班级多维目标" /></div>\
				<div><span class="wide"></span>\
				<input type="text" class="long target_item" placeholder="请输入班级多维目标" /></div>\
			</li>\
			<li>\
				<span class="wide"><i>*</i>课程总体介绍</span>\
				<textarea class="long" placeholder="请输入课程总体介绍" name="outline" data-validate="any" data-must="1">{outline}</textarea>\
			</li>\
			<li>\
				<span class="wide"><i>*</i>下一阶段课程</span>\
				<select name="next_courseid" data-validate="any">\
					<option value="0">无</option>\
				</select>\
			</li>',
	item: '<li>\
				<div class="item"><p><span data-lessonid="{lesson_id}"></span></p></div>\
				<div class="item"><p><span>{theme}</span></p></div>\
				<div class="item"><p><span>{status}</span></p></div>\
				<div class="item"><p><span class="line20px">{outline}</span></p></div>\
				<div class="item"><p><span>\
				<a href="JavaScript:;" class="edit">编辑</a>\
				<a href="JavaScript:;" class="del none{show}">删除</a></span></p></div>\
			</li>',
	addLessonForm: '<ul class="pub_form">\
			<li>\
				<span><i>*</i>课时主题</span>\
				<input type="text" placeholder="请输入课时主题名" name="theme" data-validate="any" data-must="1" />\
			</li>\
			<li>\
				<span><i>*</i>状态</span>\
				<select name="status" data-validate="any">\
					<option value="正常">正常</option>\
					<option value="研发中">研发中</option>\
					<option value="停止">停止</option>\
				</select>\
			</li>\
			<li>\
				<span><i>*</i>教学大纲</span>\
				<textarea placeholder="请输入教学大纲" name="outline" data-validate="any" data-must="1" />\
			</li>\
		</ul>'
}

// <textarea class="long" placeholder="请输入课程多维目标" name="target" data-validate="any" data-must="1">{target}</textarea>\


let numberHandle = ()=>{
	$('#lessons li').each(function(i){
		$(this).find('span').eq(0).html(i+1)
	})
}

let isObjectEqual = function(a, b) {
    // Of course, we can do it use for in 
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a || {});
    var bProps = Object.getOwnPropertyNames(b || {});
 
    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }
 
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
 
        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
 
    // If we made it this far, objects
    // are considered equivalent
    return true;
}
 



const courseid = $('#courseid').val();

let next_courseid = 0;

let getCourses = ()=>{
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getCourses',
	    data: {
        	code: $('#school_code').val()
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        let options = "";
			res.data.map(function(item){
			    options += '<option value="' + item.id + '">' + item.name + '</option>'
			});
			$('[name=next_courseid]').prepend(options);
			$('[name=next_courseid]').val( next_courseid );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}

let lastLessonsObj = {}; 

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
	        const split = res.data.target.split('\n');
	        split.map(function(_item,_index){
				$('.target_item').eq( _index ).val(_item)
	        })

	        $('[name=fee_model]').val( res.data.fee_model );
	        const lessons = res.data.lessons;
	        let list="";
	        lessons.map(function(item){
	        	list += replaceTemplate( tpl.item, item );
	        	delete item.lessonTime;
	        	lastLessonsObj[ item.lesson_id ] = item;
	        });
	        console.log(lastLessonsObj);
	        console.log(2222);

	        $('#lessons').html( list );
    		next_courseid = res.data.next_courseid;
	        getCourses();
	        numberHandle();

	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}else{
    const html = replaceTemplate( tpl.form_tpl, {} );
    $('.pub_form ul').html( html );
    $('[name=lesson_num]').val(0);
	getCourses();
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
			// lesson_id: span.eq(0).text(),
			lesson_id: span.eq(0).data('lessonid'),
			theme: span.eq(1).text(),
			status: span.eq(2).text(),
			outline: span.eq(3).text(),
		};
		// if( _lesson.lesson_id && !isObjectEqual( _lesson, lastLessonsObj.[ _lesson.lesson_id ] ) ){
		// 	lessons.push( _lesson );
		// }else{
		// 	delete _lesson.lesson_id;
		// 	lessons.push( _lesson );
		// }

		if( !isObjectEqual( _lesson, lastLessonsObj[ _lesson.lesson_id ] || {} ) ){
			lessons.push( _lesson );
		}

	});

	sub_data.target = '';

	$('.target_item').each(function(){
		const val = $(this).val();
		sub_data.target += val ? val + '\n' : ''
	})
	if( !sub_data.target ){
		$.dialogFull.Tips( "请输入课程多维目标" );
		return;
	}

    if( !lessons.length && !$('#lessons li').length ){
		$.dialogFull.Tips( "请添加课时！" );
		return;
    }
	sub_data.lessons = lessons;

	sub_data.next_courseid = +sub_data.next_courseid
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
			sub_data.show = 1;
	        const li = replaceTemplate( tpl.item, sub_data );
	        $('#lessons').append( li );
        	dialogClose();
    		$('[name=lesson_num]').val( $('#lessons li').length );
    		numberHandle();
        }

	});
	$('.dialog_add_lesson [name="outline"]').val( $('[name="outline"]').eq(0).val() );
})
.on('click', '#lessons .edit', function(){

	let _item = $(this).parent().parent().parent().parent();

	const theme = _item.find('span').eq(1).text();
	const status = _item.find('span').eq(2).text();
	const outline = _item.find('span').eq(3).text();

	$.dialogFull.Pop({
        boxClass: '.dialog_add_lesson',
        title: '编辑课时',//弹框标题
        content: tpl.addLessonForm,//弹框内容区
        showCallback: function($thisBox, $contentBox){
        	$thisBox.find('input').val(theme);
        	$thisBox.find('select').val(status);
        	$thisBox.find('textarea').val(outline);
        },
        runDone: function($this, $thisBox, dialogClose) {
    		const sub_data = $.form.get({
	            item: '.dialog_add_lesson .pub_form [data-validate]',//表单项dom
		        error_text: 'placeholder',//存放错误文案的属性名
			});
			if( !sub_data ){
				return;
			}
			_item.find('span').eq(1).text( sub_data.theme );
			_item.find('span').eq(2).text( sub_data.status );
			_item.find('span').eq(3).text( sub_data.outline );
        	dialogClose();
        }

	});

}).on('click', '#lessons .del', function(){
	$(this).parent().parent().parent().parent().remove();
	$('[name=lesson_num]').val( $('#lessons li').length );
	numberHandle();
}).on('change', '.inputFile', function(){
	cvsDataHandle({
		input: this,
		keys:['theme', 'status', 'outline'],
		handle: (data)=>{
			let li = '';
			data.map(function(line, index){
			line.show = 1;
	        	li += replaceTemplate( tpl.item, line );
			});
	        $('#lessons').append( li );
    		$('[name=lesson_num]').val( $('#lessons li').length );
    		numberHandle();
		}
	});
}).on('blur', '[name="course_name"]', function(){
	if( courseid ){
		return;
	}
	$('[value="-1"]').remove();
	const val = $(this).val();
	$('[name="next_courseid"]').append('<option value="-1">' + val + '</option>')
})
