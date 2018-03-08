	require('./zoneHome.css');//引入css文件

	var echarts = require('echarts');
	const flagship = $( '#flagship' ).val() == 1 ? true : false;

	import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
	import changeFormat from '../kit/changeFormat.js';//时间轴转换
	// import changeFormat from '../kit/changeFormat.js';//时间轴转换
	//{course_name}-课时{lesson_id}
	//data-href="/pss/goLessonOperate?classid={class_id}&lessonid={lesson_id}
	const tpl = {
		li: '<li class="item" title="{start_time} ~ {end_time}"><a href="javascript:;" data-href="/pss/goClassInfo?classid={class_id}#goZoneClassManage">\
		<h6>{class_name}</h6><p>{teacher_name}</p> <span class="mark none">❤</span></a></li>',
		info: '<span>开课班级 {classes}个</span> <span>授课教师 {teachers}个</span> <span>正式学员 {students}人</span> <span>试听学员 {audits}人</span>'
	};

	var myChart1 = echarts.init(document.getElementById('echart1'));

	// 绘制图表
	let option_1 = {
	    title: { text: '校区经营数据详情' },
	    tooltip: {
	        enterable:true,
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    xAxis: {
	        data: ["网络错误，请稍后重试"]
	    },
	    yAxis: {},
	    series: [{
	        name: '',
	        type: 'bar',
	        data: [1]
	    }]
	};

	let getZoneList_times_index = 0;

	let getZoneList_times = {
	    day: (index,num)=>{
	        return changeFormat( (new Date()).getTime() - (3600 * 1000 * 24 * (10 * index + num)) );
	    },
	    week: (index,num)=>{
	        let getTime = new Date().getTime();
	        let _num = ( getTime - (3600 * 1000 * 24 * (70 * index + num * 7)) );
	        let getDayNum = (new Date(_num)).getDay() == 0 ? 6 : ((new Date(_num)).getDay() - 1) 
	        _num = _num - getDayNum * (3600 * 1000 * 24);
	        return changeFormat( _num );
	    },
	    month: (index,num)=>{
	        return changeFormat( (new Date()).getTime() - (3600 * 1000 * 24 * (305 * index + num * 31)), 'YYYY-MM' );
	    },
	}

	//校区经营数据详情 start
	let getZoneIndex = ()=>{
	    $.ajax({
	        type: "post",
	        dataType: "json",
	        url: '/pss/getZoneIndex',
	        data: {
	            code: $('#zone_code').val(),
	            zoneid: $('#zone_zoneid').val(),
	            index: $('#echartsBox_1 .echartSelect_type').val(),
	            period: $('#echartsBox_1 .echartSelect_date').val(),
	            sdate: getZoneList_times[ $('#echartsBox_1 .echartSelect_date').val() ]( getZoneList_times_index+1, -1 ),
	            edate: getZoneList_times[ $('#echartsBox_1 .echartSelect_date').val() ]( getZoneList_times_index, 0 ),
	            page: 0
	        },
	        success: (res)=>{
	            if( res.errcode != 0 ){
	                $.dialogFull.Tips( res.errmsg );
	                return;
	            }
	            const name = $('#echartsBox_1 .echartSelect_type option:checked').text();
	            
	            let ChartData = res.data;

	            let chartNameArr = [];
	            let chartDataArr = [];

	            ChartData.map(function(item, index){
	                chartNameArr.push( item.date );
	                chartDataArr.push( item.value );
	            });
	            option_1.xAxis.data = chartNameArr;
	            option_1.series[0].data = chartDataArr;
	            option_1.series[0].name = name;

	            
	            if( ChartData.length < 7 ){
	                option_1.series[0].barWidth = 70;
	            }


	            myChart1.setOption( option_1 );
	        },
	        error: ()=>{
	            myChart1.setOption( option_1 );
	            $.dialogFull.Tips( "网络错误，请稍后重试！" );
	        }
	    })
	}
	getZoneIndex();


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

	        		const e_times = new Date( li.start_time ).getTime() + (1000 * 60 * li.lesson_time);
	        		li.end_time = changeFormat(e_times,'hh:mm:ss');
	        		li.start_time = li.start_time.split(' ')[1];

			        const html = replaceTemplate( tpl.li, li );

			        const time = li.start_time || '8:00:00';

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

$('#s_date').val( changeFormat(false,'YYYY-MM-DD') );


if( flagship ){
	$('#left_nav ul').append( '<li><a href="javascript:;" data-href="/pss/goCourse">课程体系</a></li>\
		<li><a href="javascript:;" data-href="/pss/goPlan">·教学教研</a></li>\
		<li><a href="javascript:;" data-href="/pss/goTeacher">教师员工</a></li>' );
	$('.top_box .user').addClass( 'flagship' );
}else{
    let icon_class = +$('#type').val() < 2 ? 'direct' : 'cooperation';
	$('.top_box .user').addClass( icon_class );
}

$.laydate.render({
	elem: '#s_date',
	type: 'date',
	done: function(value, date){
		getZoneSummary({
			date: value
		});
		getZoneDayLessons(value,'teacher_id');
	}
});
// const yesterdayTime = new Date().getTime() - (1000*60*60*24) 
// const yesterdayDate = changeFormat(yesterdayTime,'YYYY-MM-DD');
// getZoneDayLessons(yesterdayDate,'teacher_id');
getZoneDayLessons($('#s_date').val(),'teacher_id');
$('#echartsBox_1').append('<p style="text-align: center;">\
    <a href="javascript:;" class="btn_dis getZoneList_times_prev">上一期</a>\
    <a href="javascript:;" class="btn_dis getZoneList_times_next">下一期</a>\
    </p>');

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

$.mainBox.on('click', '#echartsBox_1 .btn', function(){
    getZoneList_times_index = 0;
    getZoneIndex();
}).on('click', '.getZoneList_times_prev', function(){
    getZoneList_times_index++;
    getZoneIndex();

}).on('click', '.getZoneList_times_next', function(){
    getZoneList_times_index--;
    getZoneList_times_index = getZoneList_times_index < 0 ? 0 : getZoneList_times_index;
    getZoneIndex();
})
