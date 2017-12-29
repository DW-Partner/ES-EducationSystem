require('./ZoneAddOrEditClass.css');//引入css文件
require('../comp/laydate/laydate.css');//引入css文件

import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎

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

let teacher_id;

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

let getCourseDetail = (courseid)=>{
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
	        $('.tips').html( '*本课程共有' + res.data.lesson_num +'个课时，每个课时的推荐时长为' + res.data.standard_time + '分钟' )

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
	        teacher_id = classInfo.teacher_id;
	        getZoneTeacherList();
			getCourseDetail( classInfo.course_id );

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
					format: 'HH:mm',
					min: '08:00:00',
					max: '22:00:00'
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
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
classid && getClassInfo();

$.mainBox.on('click', '#submit_addOrEdit', ()=>{
	let sub_data = $.form.get({
        error_text: 'placeholder',//存放错误文案的属性名
	});
	if( !sub_data ){
		return;
	}

	sub_data.teacher_id = +sub_data.teacher_id;
	sub_data.reserve_num = +sub_data.reserve_num;

	for(let key in sub_data){
		if( sub_data[ key ] == classInfo[ key ] ){
			delete sub_data[ key ];
		}
	}

	sub_data.time_regular = [];

	$( '.timeList .item' ).each(function(){
		const val = $(this).find('input').eq(0).val();
		let _item = {}
		if(val){
			_item.type = $(this).find('select').eq(0).val();
			_item.day = +$(this).find('select:visible').eq(-1).val() || 0;
			_item.time = val;
			sub_data.time_regular.push( _item );
		}
	})

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
}).on('change', '[name=course_id]', function(){
	getCourseDetail( $(this).val() );
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
		format: 'HH:mm',
		min: '08:00:00',
		max: '22:00:00'
	  // type: 'time'
	});
}).on('click', '.run_item_del', function(){
	$(this).parent().remove();
})
