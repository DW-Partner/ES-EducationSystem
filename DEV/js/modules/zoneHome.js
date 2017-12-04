	require('./zoneHome.css');//引入css文件
	import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
	import changeFormat from '../kit/changeFormat.js';//时间轴转换
	// import changeFormat from '../kit/changeFormat.js';//时间轴转换

	const tpl = {
		li: '<li class="item"><a href="javascript:;" data-href="/pss/goLessonOperate?classid={class_id}&lessonid={lesson_id}#goZoneClassManage">\
		<h6>{course_name}-课时{lesson_id}</h6><p>{teacher_name}</p> <span class="mark">❤</span></a></li>',
		info: '<span>今日开课班级 {classes}个</span> <span>今日授课教师 {teachers}个</span> <span>今日正式学员 {students}人</span> <span>今日试听学员 {audits}人</span>'
	};

	//classes":"xxx","teachers":"xxx","students":"xxx","audits":"x
	//{"course_id":2,"start_time":"2017-11-17 10:23:19","teacher_name":"赵正","course_name":"中级绘画","teacher_id":1,"class_id":2,"lesson_time":60,"class_name":"中级","lesson_id":3}
//
                // <ul class="item_box">
                // </ul>


let getZoneDayLessons = (date,type)=>{
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getZoneDayLessons',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        date: date
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        let newData = {};
	        res.data.map(function(item,index){
	        	let id = item[type];
	        	if( newData[ id ] ){
	        		newData[ id ].push( item );
	        	}else{
	        		newData[ id ] = [];
	        		newData[ id ].push( item );
	        	}
	        });
	        console.log(newData);
	        let $box = $('<div />');
	        for( let t in newData ){
	        	let $ul = $('<ul />');
	        	$ul.addClass('item_box');
	        	newData[ t ].map(function(li){
			        const html = replaceTemplate( tpl.li, li );

			        const time = li.start_time.split(' ')[1] || '8:00:00';

					const num = +time.split(':').join('');

					const left = (num - 80000) / 140000;
					const marginLeft = left > 0.16 ? 16 : 0;
					let $li = $(html);
					$li.css({
						left: left * 100 + '%',
						marginLeft: -marginLeft
					});
	        		$ul.append($li)
	        	})
	        	$box.append($ul)
	        }
	        const html = $box.html();


	        // $('.item_box').remove();
	        // $('.class_show').prepend('<div class="list_box"></div>');


	        $('.list_box').html( html );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}

$('.page_head .run').val( changeFormat(false,'YYYY-MM-DD') );
getZoneDayLessons($('.page_head .run').val(),'teacher_id');






let getZoneSummary = ()=>{

    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getZoneSummary',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val()
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        const html = replaceTemplate( tpl.info, res.data );
	        $('.class_info').html( html );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
getZoneSummary();


$.mainBox.on('change', '[type=date]',function(){
	const date = $(this).val();
	getZoneSummary({
		date: date
	})
}).on('change', '.page_head [type=date]', function(){
	const date = $(this).val();
	getZoneDayLessons(date,'teacher_id');
})