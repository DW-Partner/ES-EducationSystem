require('./ZoneAddClass.css');//引入css文件
require('../comp/laydate/laydate.css');//引入css文件


const _item = '<div class="item">\
					<select class="timeType">\
						<option value="day">每日</option>\
						<option value="week">每周</option>\
						<option value="month">每月</option>\
					</select>\
					<select class="week none">\
						<option value="2">星期一</option><option value="3">星期二</option><option value="4">星期三</option>\
						<option value="5">星期四</option><option value="6">星期五</option><option value="7">星期六</option>\
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
				</div>';

const baseId = 'i' + parseInt( Math.random() * 1000000 ).toString();
let item_i = 0;
let _before = baseId + item_i;
$('.timeList input').eq(0).attr('id',baseId + item_i++);
$.laydate.render({
	elem: '#' + _before,
	type: 'time',
	format: 'HH:mm',
	min: '08:00:00',
	max: '22:00:00'
});

let start_time = $.laydate.render({
	elem: '#start_time',
		type: 'date',
		min: 1,
		ready: function(){
			start_time.hint('开班时间必须大于当前日期');
		}
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
			$('[name=teacher_id]').html(options);

	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
getZoneTeacherList();



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
			getCourseDetail( $('[name=course_id]').val() );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
getCourseList();


let run_time = {
	day: ()=>{
		$('.box_day').addClass('item').siblings('div').removeClass('item');

	},
	week: ()=>{
		$('.box_week').addClass('item').siblings('div').removeClass('item');

	},
	month: ()=>{
		$('.box_month').addClass('item').siblings('div').removeClass('item');

	}
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




$.mainBox.on('click', '#submit_add', ()=>{
	const sub_data = $.form.get({
        error_text: 'placeholder',//存放错误文案的属性名
	});
	if( !sub_data ){
		return;
	}
	sub_data.course_id = +sub_data.course_id;
	sub_data.teacher_id = +sub_data.teacher_id;
	sub_data.reserve_num = +sub_data.reserve_num;

	//sub_data.lessons = [];

	const start_time = $('[name=start_time]').val();

	// let _times = start_time + ' ' + $('#day_times').val();
	// for( let t=0; t<15; t++ ){
	// 	const getTime = new Date( _times ).getTime() + (24*60*60*1000 * t);
	// 	const getDate = changeFormat( getTime, 'YYYY-MM-DD hh:mm:ss' );
	// 	sub_data.lessons.push( {lesson: getDate} );
	// }

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




    let ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val(),
		data: JSON.stringify( sub_data ),
    }


	$.form.submit({
		url: '/pss/addClass',
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
	let item = $(_item);

	_before = baseId + item_i;
	item.find('input').eq(0).attr('id',baseId + item_i++);

	$('.timeList').append( item );
	$.laydate.render({
		elem: '#' + _before,
  		type: 'time',
		format: 'HH:mm',
		min: '08:00:00',
		max: '22:00:00'
	});
}).on('click', '.run_item_del', function(){
	$(this).parent().remove();
})
