require('./ZoneAddOrEditClass.css');//引入css文件

import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
import DDsort from '../comp/DDsort.js';//拖动插件

const classid = $('#classid').val();

const tpl = {
	edit: '<li>\
			<span class="wide"><i>*</i>班级名称</span>\
			<input type="text" class="short" placeholder="请输入班级名称" value="{class_name}" name="class_name" data-validate="any" data-must="1" />\
		</li>\
		<li>\
			<span class="wide"><i>*</i>分类课程</span>\
			<em>{course_name} </em>\
			<em class="tips"></em>\
			<a href="JavaScript:;" class="btn selected_lessons">更改分类课程</a>\
		</li>\
		<li>\
			<span class="wide"><i>*</i>预招人数</span>\
			<input type="text" class="short" placeholder="请输入预招人数" value="{reserve_num}" name="reserve_num" data-validate="number" data-must="1" />\
			<span class="wide"><i>*</i>选择教师</span>\
			<select name="teacher_id" data-validate="any" data-must="1">\
			</select>\
		</li>\
		<li>\
			<span class="wide"><i>*</i>开班时间</span>\
			<input type="text" value="{start_time}" id="start_time" class="short" name="start_time" data-validate="any" data-must="1"/>\
		</li>\
		<li>\
			<span class="wide"><i>*</i>开班地点</span>\
			<input type="text" id="classroom" class="short" name="classroom" data-validate="any" data-must="1"/>\
		</li>\
		<li>\
			<span class="wide">设置为试听班级</span>\
			<input type="checkbox" id="set_audit" class="m-checkbox" value="1"><label for="set_audit"></label>\
		</li>\
		<li>\
		<span class="wide"><i>*</i>上课时段</span>\
			<div class="timeList">\
			</div>\
		</li>',
	_item : '<div class="item">\
					<select class="timeType">\
						<option value="day">每日</option>\
						<option value="week">每周</option>\
						<option value="month">每月</option>\
					</select>\
					<select class="week none">\
						<option value="2">星期一</option>\
						<option value="3">星期二</option>\
						<option value="4">星期三</option>\
						<option value="5">星期四</option>\
						<option value="6">星期五</option>\
						<option value="7">星期六</option>\
						<option value="1">星期日</option>\
					</select>\
					<select class="month none">\
						<option value="1">1日</option><option value="2">2日</option>\
						<option value="3">3日</option><option value="4">4日</option>\
						<option value="5">5日</option><option value="6">6日</option>\
						<option value="7">7日</option><option value="8">8日</option>\
						<option value="9">9日</option><option value="10">10日</option>\
						<option value="11">11日</option><option value="12">12日</option>\
						<option value="13">13日</option><option value="14">14日</option>\
						<option value="15">15日</option><option value="16">16日</option>\
						<option value="17">17日</option><option value="18">18日</option>\
						<option value="19">19日</option><option value="20">20日</option>\
						<option value="21">21日</option><option value="22">22日</option>\
						<option value="23">23日</option><option value="24">24日</option>\
						<option value="25">25日</option><option value="26">26日</option>\
						<option value="27">27日</option><option value="28">28日</option>\
						<option value="29">29日</option><option value="30">30日</option>\
						<option value="31">31日</option>\
					</select>\
					<input type="text" class="short" placeholder="请输入上课时段" />\
					<a href="JavaScript:;" class="btn_dis run_item_del">删除</a>\
				</div>'
}


const _li = '<li>\
        <div class="item"><p><span>{snum}</span></p></div>\
        <div class="item"><p><span>{theme}</span></p></div>\
        <div class="item"><p><span>{status}</span></p></div>\
        <div class="item"><p><span class="line20px">{outline}</span></p></div>\
        <div class="item"><p><span>\
        <input type="checkbox" value="{lesson_id}" {disabled} />\
        </span></p></div>\
    </li>';

let teacher_id;


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
	        let select = '<select name="course_id" data-validate="any" data-must="1">';
	        let course_id;
			res.data.map(function(item,index){
				if( index === 0 ){
					course_id = item.course_id
				}
			    select += '<option value="' + item.course_id + '">' + item.course_name + '</option>'
			});
			select += '</select>';
			//$('[name=course_id]').html(select);
			console.log( select );
			getCourseDetail( course_id, select );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}



let dataMap = {};
let dataMapSelect = {};
let dataCourse = [];
let selectOn = 'x';

let getCourseDetail = (courseid, select, change)=>{
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getCourseDetail',
	    data: {
	        code: $('#zone_code').val(),
	        courseid: courseid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        // $('.tips').html( '*本课程共有' + res.data.lesson_num +'个课时，每个课时的推荐时长为' + res.data.standard_time + '分钟' );
	        dataCourse = res.data.lessons;
	        selectOn = res.data.course_id;
			dataMap[ 'course_' + selectOn ] = {};
			if( dataMapSelect[ 'course_' + selectOn ] && dataMapSelect[ 'course_' + selectOn ].length ){
				$( '.selected_lessons' ).text( '挑选课时(' + dataMapSelect[ 'course_' + selectOn ].length + ')' );
			}else{
				$( '.selected_lessons' ).text( '挑选课时' );
			}
			select_list( select || '', change )
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
let popContentHtml = '';
let select_list = (select, change)=>{
	if( !change ){
		popContentHtml = select + '<div class="head"><span>课时序号</span><span>课时主题名</span><span>当前状态</span><span>教学大纲</span><span>全选 <input type="checkbox" id="checkall"></span></div><ul class="body">';
		console.log( popContentHtml );
		dataCourse.forEach((item,index)=>{

			dataMap[ 'course_' + selectOn ][ item.lesson_id ] = item;

			item.disabled = item.status === '正常' ? 'class="input_item"' : 'disabled="disabled"';
	        popContentHtml += replaceTemplate( _li, item );
		});
		popContentHtml += '</ul>';
	}else{
		popContentHtml = '';
		dataCourse.forEach((item,index)=>{

			dataMap[ 'course_' + selectOn ][ item.lesson_id ] = item;

			item.disabled = item.status === '正常' ? 'class="input_item"' : 'disabled="disabled"';
	        popContentHtml += replaceTemplate( _li, item );
		});
		$( '.dialogPopBox .body' ).html( popContentHtml );



    	if( dataMapSelect[ 'course_' + selectOn ] && dataMapSelect[ 'course_' + selectOn ].length ){
    		dataMapSelect[ 'course_' + selectOn ].forEach((lesson,index)=>{
    			$( '[value=' + lesson.lesson_id + ']' ).attr("checked","true"); 
    		});
        	if( dataMapSelect[ 'course_' + selectOn ].length === $(".pub_list .body input.input_item").length ){
        		$("#checkall").prop("checked", true);
        	}else{
        		$("#checkall").prop("checked", false);
        	}
    	}else{
        	$("#checkall").prop("checked", false);
        }


	}

	console.log( popContentHtml );

}
getCourseList();

let selectAll = ()=>{
    if ($("#checkall").prop("checked")) {
    	$(".pub_list .body input.input_item").prop("checked",true);//全选
    } else { 
        $(".pub_list .body input.input_item").prop("checked",false);  //取消全选     
    }  
} 


//getCourseList();

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
			$('[name=teacher_id]').html(options).val( teacher_id );

	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}

let classInfo = {};
const baseId = 'i' + parseInt( Math.random() * 1000000 ).toString();
let item_i = 0;
let _before = baseId + item_i;

let getClassInfo = ()=>{

    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getClassInfo',
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
	        classInfo = res.data;
	        let html = replaceTemplate( tpl.edit, classInfo );
	        $('.pub_form ul').html( html );

			if(res.data.audit == 'true' ){
				$('#set_audit').prop('checked', true);
			}

	        teacher_id = classInfo.teacher_id;
	        getZoneTeacherList();
			//getCourseDetail( classInfo.course_id );

			classInfo.time_regular = classInfo.time_regular && classInfo.time_regular.length ? classInfo.time_regular : [{
				type:'day',
				day:0,
				time:''
			}];

			JSON.parse(classInfo.time_regular).map(function(item, index){
				$('.timeList').append( tpl._item );

				$('.timeList .item').eq( index ).find('select').eq(0).val( item.type );
				if( item.type == 'week' ){
					$('.timeList .item').eq( index ).find('select').eq(1).val( item.day ).show();
				}else if( item.type == 'month' ){
					$('.timeList .item').eq( index ).find('select').eq(2).val( item.day ).show();
				}
				_before = baseId + item_i;
				$('.timeList .item').eq( index ).find('input').val( item.time ).attr('id',baseId + item_i++);

				$.laydate.render({
					elem: '#' + _before,
			  		type: 'time',
					min: '08:00:00',
					max: '22:00:00',
					btns: ['confirm']
				});
				if( index === 0 ){
					$('.timeList .item').eq( 0 ).find('a').remove();
					$('.timeList .item').eq( 0 ).append('<a href="JavaScript:;" class="btn run_item_add">添加</a>');
				}
			})
			if( classInfo.isStarted == 'true' ){
				$('#start_time').attr('disabled','disabled').addClass('disabled');
			}else{
				let start_time = $.laydate.render({
					elem: '#start_time',
			  		type: 'date',
			  		value: classInfo.start_time,
			  		min: 1,
					ready: function(){
	    				start_time.hint('开班时间必须大于当前日期');
	    			}
				});
			}

	        $('.tips').html( '*本课程剩余' + res.data.remain_lessons +'个课时' ); //，每个课时的推荐时长为' + res.data.standard_time + '分钟' )
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
classid && getClassInfo();

$('.timeList .item').length >= 6 && $( '.timeList .run_item_add' ).hide();

$.mainBox.on('click', '#submit_addOrEdit', ()=>{
	let sub_data = $.form.get({
        error_text: 'placeholder',//存放错误文案的属性名
	});
	if( !sub_data ){
		return;
	}

	sub_data.teacher_id = +sub_data.teacher_id;
	sub_data.reserve_num = +sub_data.reserve_num;
	sub_data.audit = $('#set_audit:checked').val() ? 'true' : 'false';
	for(let key in sub_data){
		if( sub_data[ key ] == classInfo[ key ] ){
			delete sub_data[ key ];
		}
	}

	sub_data.time_regular = [];
	let _sub = true;
	$( '.timeList .item' ).each(function(){
		const val = $(this).find('input').eq(0).val();
		if( val.indexOf('00:00') == 0 ){
         	_sub = false;
         	return;
		}
		let _item = {}
		if(val){
			_item.type = $(this).find('select').eq(0).val();
			_item.day = +$(this).find('select:visible').eq(-1).val() || 0;
			_item.time = val;
			sub_data.time_regular.push( _item );
		}
	})
	if( !_sub ){
     	$.dialogFull.Tips( '请选择合理上课时间段！' );
		return;
	}
	if( !sub_data.time_regular.length ){
        $.dialogFull.Tips( "请添加上课时段！" );
        return;
	}

	if( JSON.stringify( sub_data.time_regular ) == JSON.stringify( JSON.parse(classInfo.time_regular) ) ){
		delete sub_data.time_regular
	}
	if( JSON.stringify(sub_data) == '{}' ){
        $.dialogFull.Tips( "您没有做任何修改！" );
        return;
	}

	//sub_data.start_time =  sub_data.start_time || classInfo.start_time;

    let ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val(),
		classid: classid,
		data: JSON.stringify( sub_data ),
    }
	$.form.submit({
		url: '/pss/editClass',
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
}).on('change', '.timeType', function(){
	const type = $(this).val();
	if( type == 'week' ){
		$(this).siblings('.week').show();
		$(this).siblings('.month').hide();
	}else if( type == 'month' ){
		$(this).siblings('.month').show();
		$(this).siblings('.week').hide();
	}else{
		$(this).siblings('.week, .month').hide();
	}
}).on('click', '.run_item_add', function(){
	let item = $(tpl._item);
	_before = baseId + item_i;
	item.find('input').eq(0).attr('id',baseId + item_i++);
	$('.timeList').append( item );
	$.laydate.render({
		elem: '#' + _before,
  		type: 'time',
		min: '08:00:00',
		max: '22:00:00',
		btns: ['confirm']
	  // type: 'time'
	});
	$('.timeList .item').length >= 6 && $( this ).hide();
}).on('click', '.run_item_del', function(){
	$(this).parent().remove();
	$( '.timeList .run_item_add' ).show();
}).on('click', '.btn_editClass', function(){



    $.dialogFull.Pop({
        boxClass: '.pub_list',
        width: 700,
        height: 'auto',
        title: '更改分类课程',//弹框标题
        content: select_list(),//弹框内容区
        showCallback: function($thisBox, $contentBox){
        },
        runDone: function($this, $thisBox, dialogClose) {
            dialogClose();
        }

	})

}).on('click', '.selected_lessons', function(){

    $.dialogFull.Pop({
        boxClass: '.pub_list',
        width: 700,
        height: 'auto',
        cacheId: 'popCachId002', //开启必须使用唯一标示！！！
        title: '挑选课时',//弹框标题
        content: popContentHtml ,//select_list(),//弹框内容区
        showCallback: function($thisBox, $contentBox){
        	if( dataMapSelect[ 'course_' + selectOn ] && dataMapSelect[ 'course_' + selectOn ].length ){
        		dataMapSelect[ 'course_' + selectOn ].forEach((lesson,index)=>{
        			$( '[value=' + lesson.lesson_id + ']' ).attr("checked","true"); 
        		});
	        	if( dataMapSelect[ 'course_' + selectOn ].length === $(".pub_list .body input.input_item").length ){
	        		$("#checkall").prop("checked", true);
	        	}else{
	        		$("#checkall").prop("checked", false);
	        	}
        	}else{
	        	$("#checkall").prop("checked", false);
	        }
        	if( !$('[name="course_id"]').length ){
        		return;
        	}
        	$( '.pub_list ul' ).DDSort({
			    target: 'li',
			    up: function(){
			        //numberHandle();
			    }
			});
        },
        runDone: function($this, $thisBox, dialogClose) {
			let checkedArr = [];
			let submitArr = [];
			$(".pub_list .body input:checkbox:checked").each(function(){ 
				checkedArr.push( $(this).val() );
			});
			checkedArr.forEach((lesson_id,index)=>{
				// submitArr.push( dataMap[ 'course_' + selectOn ][ lesson_id ] );
				submitArr.push( {lesson_id: lesson_id} );//todp只传lesson_id
			});
			dataMapSelect[ 'course_' + selectOn ] = submitArr;
			submitArr.length && $( '.selected_lessons' ).text( '挑选课时(' + submitArr.length + ')' );

            dialogClose();
        }

    });
})




$(document).on('change', '#checkall', selectAll).on('change', 'input.input_item', function(){
	if( $(".pub_list .body input.input_item:checked").length === $(".pub_list .body input.input_item").length ){
		$("#checkall").prop("checked", true);
	}else{
		$("#checkall").prop("checked", false);
	}
}).on('change', '[name=course_id]', function(){
	console.log(12321);
	getCourseDetail( $(this).val(), '', 'change' );
});
$.distory = ()=>{
	$(document).off('change', '#checkall').off('change', 'input.input_item')
};

