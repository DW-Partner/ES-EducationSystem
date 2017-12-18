require('./EditClass.css');//引入css文件
require('../comp/laydate/laydate.css');//引入css文件

import changeFormat from '../kit/changeFormat.js';//模板引擎

// window.laydate = laydate;

// console.log(laydate);


//常规用法
$.laydate.render({
  elem: '#day_times',
  type: 'time'
});

$.laydate.render({
  elem: '#day_times_month',
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

	sub_data.lessons = [];

	const start_time = $('[name=start_time]').val();

	let _times = start_time + ' ' + $('#day_times').val();

	for( let t=0; t<15; t++ ){
		const getTime = new Date( _times ).getTime() + (24*60*60*1000 * t);
		const getDate = changeFormat( getTime, 'YYYY-MM-DD hh:mm:ss' );

		sub_data.lessons.push( {lesson: getDate} );
	}

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
}).on('change', '.timeType', function(){
	const type = $(this).val();
	run_time[ type ]();
});