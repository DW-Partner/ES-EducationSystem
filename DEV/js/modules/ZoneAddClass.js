require('./ZoneAddClass.css');//引入css文件
import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
import DDsort from '../comp/DDsort.js';//拖动插件

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
const _li = '<li>\
        <div class="item"><p><span>{snum}</span></p></div>\
        <div class="item"><p><span>{theme}</span></p></div>\
        <div class="item"><p><span>{status}</span></p></div>\
        <div class="item"><p><span class="line20px">{outline}</span></p></div>\
        <div class="item"><p><span>\
        <input type="checkbox" value="{lesson_id}" {disabled} />\
        </span></p></div>\
    </li>';

const baseId = 'i' + parseInt( Math.random() * 1000000 ).toString();
let item_i = 0;
let _before = baseId + item_i;
$('.timeList input').eq(0).attr('id',baseId + item_i++);
$.laydate.render({
	elem: '#' + _before,
	type: 'time',
	min: '08:00:00',
	max: '22:00:00',
	btns: ['confirm']
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
			$('[name=assistant_id]').html(`<option value="">请选择</option>${options}`);

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

let dataMap = {};
let dataMapSelect = {};
let dataCourse = [];
let selectOn = 'x';

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
	        $('.tips').html( '*本课程共有' + res.data.lesson_num +'个课时，每个课时的推荐时长为' + res.data.standard_time + '分钟' );
	        dataCourse = res.data.lessons;
	        selectOn = res.data.course_id;
			dataMap[ 'course_' + selectOn ] = {};
			if( dataMapSelect[ 'course_' + selectOn ] && dataMapSelect[ 'course_' + selectOn ].length ){
				$( '.selected_lessons' ).text( '挑选课时(' + dataMapSelect[ 'course_' + selectOn ].length + ')' );
			}else{
				$( '.selected_lessons' ).text( '挑选课时' );
			}
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}

let select_list = ()=>{
	
	let html = '<div class="head"><span>课时序号</span><span>课时主题名</span><span>当前状态</span><span>教学大纲</span><span>全选 <input type="checkbox" id="checkall"></span></div><ul class="body">';
	dataCourse.forEach((item,index)=>{

		dataMap[ 'course_' + selectOn ][ item.lesson_id ] = item;

		item.disabled = item.status === '正常' ? 'class="input_item"' : 'disabled="disabled"';
        html += replaceTemplate( _li, item );
	});
	html += '</ul>';
	return html;

}


let selectAll = ()=>{
    if ($("#checkall").prop("checked")) {
    	$(".pub_list .body input.input_item").prop("checked",true);//全选
    } else { 
        $(".pub_list .body input.input_item").prop("checked",false);  //取消全选     
    }  
} 


$('.timeList .item').length >= 6 && $( '.timeList .run_item_add' ).hide();

$('.tips').after( '<a href="JavaScript:;" class="btn selected_lessons">挑选课时</a>' );
$('[name="class_name"]').after( '<a href="JavaScript:;" class="btn getZoneStudentList">添加学员</a>' );

// let getZoneStudentList = ()=>{
//     $.ajax({
// 	    type: "post",
// 	    dataType: "json",
// 	    url: '/pss/getZoneStudentList',
// 	    data: {
// 	        code: $('#zone_code').val(),
// 	        zoneid: $('#zone_zoneid').val(),
// 	    },
// 	    success: (res)=>{
// 	        if( res.errcode != 0 ){
// 	            $.dialogFull.Tips( res.errmsg );
// 	             return;
// 	        }
// 	        let $div = $( '<div>' );
// 	        let classArr = {};
// 	        res.data.forEach((item,index)=>{
// 	        	if( !classArr[ item.class_id ] ){
// 		        	classArr[ item.class_id ] = true;
// 		        	item.class_name = item.class_name || '其它';
// 		        	$div.append( `<p><span>${item.class_name}：</span></p>` )
// 	        	}
// 				$div.find( 'p:last' ).append( `<span class="student" data-sid="${item.student_id}">${item.student_name}</sapn>` );
// 	        })
// 	        $( '.dialogPopBox .content' ).html( $div.html() );
// 	    },
// 	    error: ()=>{
// 	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
// 	    }
// 	})
// }



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
	        let select = '<div class="selectBox"><div class="checkedList"></div><select id="classSelect">';
	        res.data.forEach((item,index)=>{
	        	if( !classArr[ item.class_id ] ){
		        	classArr[ item.class_id ] = true;
		        	item.class_name = item.class_name || '其它';
		        	select += `<option value="${item.class_id}">${item.class_name}</option>`;
		        	$div.append( `<p class="classItem class_${item.class_id}"></p>` );//<span>${item.class_name}：</span>
	        	}
				$div.find( 'p:last' ).append( `<span class="student" data-sid="${item.sid || item.student_id}">${item.student_name}</sapn>` );
	        })
	        select += '</select></div>';
	        $div.prepend( select );
	        $( '.dialogPopBox .content' ).html( $div.html() );
	        $( '.dialogPopBox .content p' ).eq(0).show();
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}


let studentChecked = [];
let _dialogClose = ()=>{};
$.mainBox.on('click', '#submit_add', ()=>{
	console.log(dataMapSelect[ 'course_' + selectOn ]);
	const sub_data = $.form.get({
        error_text: 'placeholder',//存放错误文案的属性名
	});
	if( !sub_data ){
		return;
	}
	sub_data.course_id = +sub_data.course_id;
	sub_data.teacher_id = +sub_data.teacher_id;
	if( sub_data.assistant_id ){
		sub_data.assistant_id = +sub_data.assistant_id;
	}
	sub_data.reserve_num = +sub_data.reserve_num;
	const start_time = $('[name=start_time]').val();
	sub_data.time_regular = [];
	sub_data.audit = $('#set_audit:checked').val() ? 'true' : 'false';
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
	if( dataMapSelect[ 'course_' + selectOn ] && dataMapSelect[ 'course_' + selectOn ].length ){
		sub_data.selected_lessons = dataMapSelect[ 'course_' + selectOn ];
	}
	if( studentChecked.length ){
		sub_data.students = Array.from(new Set(studentChecked)).map((item)=>{
        		return {sid: +item};
        });
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
		min: '08:00:00',
		max: '22:00:00',
		btns: ['confirm']
	});
	$('.timeList .item').length >= 6 && $( this ).hide();
}).on('click', '.run_item_del', function(){
	$(this).parent().remove();
	$( '.timeList .run_item_add' ).show();	
}).on('click', '.selected_lessons', function(){

    $.dialogFull.Pop({
        boxClass: '.pub_list',
        width: 700,
        height: 'auto',
        title: '挑选课时',//弹框标题
        content: select_list(),//弹框内容区
        showCallback: function($thisBox, $contentBox){
        	if( dataMapSelect[ 'course_' + selectOn ] && dataMapSelect[ 'course_' + selectOn ].length ){
        		dataMapSelect[ 'course_' + selectOn ].forEach((lesson,index)=>{
        			$( '[value=' + lesson.lesson_id + ']' ).attr("checked","true"); 
        		});
	        	if( dataMapSelect[ 'course_' + selectOn ].length === $(".pub_list .body input.input_item").length ){
	        		$("#checkall").prop("checked", true);
	        	}
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
				submitArr.push( {lesson_id: +lesson_id} );//todp只传lesson_id
			});
			dataMapSelect[ 'course_' + selectOn ] = submitArr;
			submitArr.length && $( '.selected_lessons' ).text( '挑选课时(' + submitArr.length + ')' );

            dialogClose();
        }

    });
}).on('click', '.getZoneStudentList', function(){
    $.dialogFull.Pop({
        boxClass: '.getZoneStudentList',
        width: 700,
        height: 'auto',
        cacheId: 'getZoneStudentListCachId001', //开启必须使用唯一标示！！！
        title: '学员列表',//弹框标题
        content: '',//弹框内容区
        showCallback: function($thisBox, $contentBox){
        	getZoneStudentList();
        },
        runDone: function($this, $thisBox, dialogClose) {
            _dialogClose = dialogClose;
            dialogClose();
        },
        runClose: function($this, $thisBox, dialogClose) {
        	_dialogClose = dialogClose;
        }
    });	
});

$(document).on('change', '#checkall', selectAll).on('change', 'input.input_item', function(){
	if( $(".pub_list .body input.input_item:checked").length === $(".pub_list .body input.input_item").length ){
		$("#checkall").prop("checked", true);
	}else{
		$("#checkall").prop("checked", false);
	}
}).on('click', '.classItem .student', function(){
	let self = $( this );
	const sid = self.data( 'sid' );
	if( self.hasClass( 'checked' ) ){
		studentChecked.splice( studentChecked.indexOf( sid ), 1 );
		//self.removeClass( 'checked' );
		//$( `.checkedList [sid=${sid}]` ).remove();
	}else{
		studentChecked.push( sid );
		// self.addClass( 'checked' );
		$( '.checkedList' ).append( self.clone() );
		self.hide();
	}
}).on('click', '.checkedList .student', function(){
	let self = $( this );
	const sid = self.data( 'sid' );
	$( `.classItem [data-sid=${sid}]` ).show();
	self.remove();
}).on('change', '#classSelect', function(){
	const class_id = $( this ).val();
	$( `.class_${class_id}` ).show().siblings('p').hide();
});
$.distory = ()=>{
	_dialogClose(1);
	$(document).off('change', '#checkall').off('click', '.classItem .student').off('click', '.checkedList .student').off('change', '#classSelect');
};

