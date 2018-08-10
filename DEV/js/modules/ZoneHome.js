require('./ZoneHome.css');

import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
import QRCode from '../kit/qrcode.js';
import changeFormat from '../kit/changeFormat.js';
import websocket from '../comp/websocket.js';

const flagship = $( '#flagship' ).val() == 1 ? true : false;
let $dayItem;
let $calendarItem;
let $monthItem;
let $last;
let $yearItem;
let $next;
let currentDate;
let currentDate_normal;
let makeupflag;
let classid;
let lessonid;

let onStudentCheck;
let student_box_list;
const tpl = {
	//<span>课时长：{lesson_time}</span>
	zoneDayLessons: `<li data-info="{info}">
			<em></em>
			<b class="cancelLesson {show}" data-info="{info}"></b>
			<h6>{mark}{class_name}</h6>
			<p>
				<span>开课时间：{start_time} -- {end_time}</span>
			</p>
			<p>
				<span>授课教师：{teacher_name}</span>
			</p>
			<p>
				主题：{theme}
			</p>
		</li>`,
	info: `<h6><a href="javascript:" data-href="/pss/goClassInfo?classid={class_id}#goZoneClassManage">{class_name}</a></h6>
			<p>{start_time} -- {end_time}</p>
			<p>授课教师：{teacher_name}</p>
			<p>授课地点：{classroom}</p>
			<p>主题：<a href="javascript:" data-href="/pss/goLessonOperate?classid={class_id}&lessonid={lesson_id}#goZoneClassManage">{theme}</a></p>
			<p>教学目标：{target}</p>`,
			//主题，上课，当天具体上课时间（日期不能选），教师，学员，
    addLessonForm: `<ul class="pub_form">
            <li>
                <span class="wide"><i>*</i>课时主题</span>
                <input type="text" placeholder="请输入课时主题名" name="theme" data-validate="any" data-must="1" />
            </li>
            <li>
                <span class="wide"><i>*</i>时长</span>
                <input type="text" placeholder="请输入课时时长(单位：分钟)" name="time_length" data-validate="number" data-must="1" />
            </li>
            <li>
                <span class="wide"><i>*</i>开课时间</span>
                <input type="text" placeholder="请输入开课时间" id="stime" name="stime" data-validate="any" data-must="1" />
            </li>
            <li>
                <span class="wide"><i>*</i>教师</span>
                <select name="tid" data-validate="any">
                </select>
            </li>
            <li>
                <span class="wide"><i>*</i>学员</span>
                <a href="javascript:;" class="btn" id="addStudents">选择学员</a>
            </li>
            <li>
                <span class="wide"><i>*</i>扣减课时数</span>
                <select name="deduction_lessons" data-validate="any">
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
					<option value="6">6</option>
					<option value="7">7</option>
					<option value="8">8</option>
					<option value="9">9</option>
					<option value="10">10</option>
				</select>
            </li>
        </ul>`
}


if( flagship ){
	$( '.goTeacher' ).remove();
	$('#left_nav ul').append( '<li><a href="javascript:;" data-href="/pss/goCourse">课程体系</a></li>\
		<li><a href="javascript:;" data-href="/pss/goPlan">·教学教研</a></li>\
		<li><a href="javascript:;" data-href="/pss/goTeacher">教师督导</a></li>' );
	$('.top_box .user').addClass( 'flagship' );
}else{
    let icon_class = +$('#type').val() < 2 ? 'direct' : 'cooperation';
	$('.top_box .user').addClass( icon_class );
}


var CalendarHandler = {
	currentYear: 0,
	currentMonth: 0,
	isRunning: false,
	showYearStart:2009,
	tag:0,
	initialize: function() {
		$calendarItem = this.CreateCalendar(0, 0, 0, true);
		$("#centerCalendarMain").append($calendarItem);

		var itemPaddintTop = $(".dayItem").height() / 6;

	},
	CreateSelectYear: function(showYearStart) {
		CalendarHandler.showYearStart=showYearStart;
		$(".currentDay").show();
		$("#selectYearDiv").children().remove();
		var yearindex = 0;
		for (var i = showYearStart; i < showYearStart+12; i++) {
			yearindex++;
			if(i==showYearStart){
				$last=$("<span>往前</span>");
				$("#selectYearDiv").append($last);
				$last.click(function(){
					CalendarHandler.CreateSelectYear(CalendarHandler.showYearStart-10);
				});
				continue;
			}
			if(i==showYearStart+11){
				$next=$("<span>往后</span>");
				$("#selectYearDiv").append($next);
				$next.click(function(){
					CalendarHandler.CreateSelectYear(CalendarHandler.showYearStart+10);
				});
				continue;
			}
			
			if (i == this.currentYear) {
				$yearItem=$("<span class=\"currentYearSd\" id=\"" + yearindex + "\">" + i + "</span>")
			
			}
			else{
				 $yearItem=$("<span id=\"" + yearindex + "\">" + i + "</span>");
			}
			$("#selectYearDiv").append($yearItem);
			$yearItem.click(function(){
				$calendarItem=CalendarHandler.CreateCalendar(Number($(this).html()),1,1);
				$("#centerCalendarMain").append($calendarItem);
				CalendarHandler.CSS()
			    CalendarHandler.isRunning = true;
			    $($("#centerCalendarMain").find(".dayItem")[0]).animate({
				height: "0px"
			    }, 300, function() {
				$(this).remove();
				CalendarHandler.isRunning = false;
			    });
				$("#centerMain").animate({
				marginLeft: "-100%"
			}, 500);
			});
			if (yearindex == 1 || yearindex == 5 || yearindex == 9) $("#selectYearDiv").find("#" + yearindex).css("border-left-color", "#fff");
			if (yearindex == 4 || yearindex == 8 || yearindex == 12) $("#selectYearDiv").find("#" + yearindex).css("border-right-color", "#fff");
			
		}
		$("#selectYearDiv span").css("line-height", ($("#center").height() - 4) / 3 + "px");
		$("#centerMain").animate({
			marginLeft: "0px"
		}, 300);
	},
	CreateSelectMonth: function() {
		$(".currentDay").show();
		$("#selectMonthDiv").children().remove();
		for (var i = 1; i < 13; i++) {
			if (i == this.currentMonth) $monthItem=$("<span class=\"currentMontSd\" id=\"" + i + "\">" + i + "月</span>");
			else  $monthItem=$("<span id=\"" + i + "\">" + i + "月</span>");
			$("#selectMonthDiv").append($monthItem);
			$monthItem.click(function(){
				$calendarItem=CalendarHandler.CreateCalendar(CalendarHandler.currentYear,Number($(this).attr("id")),1);
				$("#centerCalendarMain").append($calendarItem);
				CalendarHandler.CSS()
			    CalendarHandler.isRunning = true;
			    $($("#centerCalendarMain").find(".dayItem")[0]).animate({
				height: "0px"
			    }, 300, function() {
				$(this).remove();
				CalendarHandler.isRunning = false;
			    });
				$("#centerMain").animate({
				marginLeft: "-100%"
			}, 500);
			});
			if (i == 1 || i == 5 || i == 9) $("#selectMonthDiv").find("#" + i).css("border-left-color", "#fff");
			if (i == 4 || i == 8 || i == 12) $("#selectMonthDiv").find("#" + i).css("border-right-color", "#fff");
		}
		$("#selectMonthDiv span").css("line-height", ($("#center").height() - 4) / 3 + "px");
		$("#centerMain").animate({
			marginLeft: "-200%"
		}, 300);
	},
	IsRuiYear: function(aDate) {
		return (0 == aDate % 4 && (aDate % 100 != 0 || aDate % 400 == 0));
	},
	CalculateWeek: function(y, m, d) {
		var arr = "7123456".split("");
		// with(document.all) {
			var vYear = parseInt(y, 10);
			var vMonth = parseInt(m, 10);		
			var vDay = parseInt(d, 10);
		// }
		var week =arr[new Date(y,m-1,vDay).getDay()];
		return week;
	},
	CalculateMonthDays: function(m, y) {
		var mDay = 0;
		if (m == 0 || m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12) {
			mDay = 31;
		} else {
			if (m == 2) {
				//判断是否为芮年
				var isRn = this.IsRuiYear(y);
				if (isRn == true) {
					mDay = 29;
				} else {
					mDay = 28;
				}
			} else {
				mDay = 30;
			}
		}
		return mDay;
	},
	CreateCalendar: function(y, m, d, mark) {
		$dayItem = $("<div class=\"dayItem\"></div>");
		//获取当前月份的天数
		var nowDate = new Date();
		if(y==nowDate.getFullYear()&&m==nowDate.getMonth()+1||(y==0&&m==0))
		$(".currentDay").hide();
		let nowYear = y == 0 ? nowDate.getFullYear() : y;
		this.currentYear = nowYear;
		let nowMonth = m == 0 ? nowDate.getMonth() + 1 : m;
		nowMonth = nowMonth < 10 ? '0' + nowMonth : nowMonth;
		this.currentMonth = nowMonth;
		let nowDay = d == 0 ? nowDate.getDate() : d;
		$(".selectYear").html(nowYear);
		$(".selectMonth").html(nowMonth);
		var nowDaysNub = this.CalculateMonthDays(nowMonth, nowYear);
		//获取当月第一天是星期几
		//var weekDate = new Date(nowYear+"-"+nowMonth+"-"+1);
		//alert(weekDate.getDay());
		var nowWeek = parseInt(this.CalculateWeek(nowYear, nowMonth, 1));
		//nowWeek=weekDate.getDay()==0?7:weekDate.getDay();
		//var nowWeek=weekDate.getDay();
		//获取上个月的天数
		var lastMonthDaysNub = this.CalculateMonthDays((nowMonth - 1), nowYear);

		if (nowWeek != 0) {
			//生成上月剩下的日期
			for (var i = (lastMonthDaysNub - (nowWeek - 1)); i < lastMonthDaysNub; i++) {
				$dayItem.append( `<span class="item lastItem"><a href="JavaScript:;">${i + 1}</a></span>` );

			}
		}
		//生成当月的日期
		for (var i = 0; i < nowDaysNub; i++) {
			const thatDay = i + 1 < 10 ? '0' + (i + 1) : i + 1;
			if( currentDate == `${nowYear}-${nowMonth}-${thatDay}` ){
				$dayItem.append(`<span class="item targetItem currentItem" data-date="${nowYear}-${nowMonth}-${thatDay}"><a href="JavaScript:;">${i + 1}</a></span>`);	
			}else if (i == (nowDay - 1) && mark){
				$dayItem.append(`<span class="item targetItem currentItem" data-date="${nowYear}-${nowMonth}-${thatDay}"><a href="JavaScript:;">${i + 1}</a></span>`);
				getZoneDayLessons( `${nowYear}-${nowMonth}-${thatDay}` );
				currentDate = `${nowYear}-${nowMonth}-${thatDay}`;
			}else{
				$dayItem.append(`<span class="item targetItem" data-date="${nowYear}-${nowMonth}-${thatDay}"><a href="JavaScript:;">${i + 1}</a></span>`);//toDO EDIT
			}
			// $dayItem.append("<div class=\"item\"><a>" + (i + 1) + "</a></div>");
		}
		//获取总共已经生成的天数
		var hasCreateDaysNub = nowWeek + nowDaysNub;
		//如果小于42，往下个月推算
		if (hasCreateDaysNub < 42) {
			for (var i = 0; i <= (42 - hasCreateDaysNub); i++) {
				$dayItem.append( `<span class="item lastItem"><a>${i + 1}</a></span>` );
			}
		}
		return $dayItem;
	},
	CSS: function() {
		var itemPaddintTop = $(".dayItem").height() / 6;
		//$(".item").css({
			//"width": $(".week").width() / 7 + "px",
			//"line-height": itemPaddintTop + "px",
			//"height": itemPaddintTop + "px"
		//});
		//$(".currentItem>a").css("margin-left", ($(".item").width() - 25) / 2 + "px").css("margin-top", ($(".item").height() - 25) / 2 + "px");
	},
	CalculateNextMonthDays: function() {
		if (this.isRunning == false) {
			$(".currentDay").show();
			var m = this.currentMonth == 12 ? 1 : +this.currentMonth + 1;
			var y = this.currentMonth == 12 ? (this.currentYear + 1) : this.currentYear;
			var d = 0;
			var nowDate = new Date();
			if (y == nowDate.getFullYear() && m == nowDate.getMonth() + 1) d = nowDate.getDate();
			else d = 1;
			$calendarItem = this.CreateCalendar(y, m, d);
			$("#centerCalendarMain").append($calendarItem);

			this.CSS();
			this.isRunning = true;
			$($("#centerCalendarMain").find(".dayItem")[0]).animate({
				height: "0px"
			}, 300, function() {
				$(this).remove();
				CalendarHandler.isRunning = false;
			});
		}
	},
	CalculateLastMonthDays: function() {
		if (this.isRunning == false) {
			$(".currentDay").show();
			var nowDate = new Date();					
			var m = this.currentMonth == 1 ? 12 : +this.currentMonth - 1;
			var y = this.currentMonth == 1 ? (this.currentYear - 1) : this.currentYear;
			var d = 0;
			if (y == nowDate.getFullYear() && m == nowDate.getMonth() + 1) d = nowDate.getDate();
			else d = 1;
			$calendarItem = this.CreateCalendar(y, m, d);
			$("#centerCalendarMain").append($calendarItem);
			var itemPaddintTop = $(".dayItem").height() / 6;
			this.CSS();
			this.isRunning = true;
			$($("#centerCalendarMain").find(".dayItem")[0]).animate({
				height: "0px"
			}, 300, function() {
				$(this).remove();
				CalendarHandler.isRunning = false;
			});
		}
	},
	CreateCurrentCalendar: function() {
		if (this.isRunning == false) {
			$(".currentDay").hide();
			$calendarItem = this.CreateCalendar(0, 0, 0);
			$("#centerCalendarMain").append($calendarItem);
			this.isRunning = true;
			$($("#centerCalendarMain").find(".dayItem")[0]).animate({
				height: "0px"
			}, 300, function() {
				$(this).remove();
				CalendarHandler.isRunning = false;
			});
			this.CSS();
			$("#centerMain").animate({
				marginLeft: -$("#center").width() + "px"
			}, 500);
		}
	}
}

let getZoneDayLessons = ( date )=>{
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
	        let html = '';
	        res.data.forEach((item)=>{
			item.show = (new Date( item.start_time || `${currentDate} 00:00:00` )).getTime() <= (new Date()).getTime() && 'none';

	        	const end_time_getTime = (new Date( item.start_time || `${currentDate} 00:00:00` )).getTime() + (item.lesson_time * 60 * 1000);
				item.end_time = changeFormat( end_time_getTime, 'hh:mm' );
				item.start_time = changeFormat( (new Date( item.start_time || `${currentDate} 00:00:00` )).getTime(), 'hh:mm' );
	        	//item.start_time = item.start_time.substring( 0, item.start_time.length-3 );
	        	const mark = item.class_name.indexOf( '#加课' ) === 0 ? '#' : '';
	        	item.class_name = mark ? '#' + item.theme : item.class_name;
	        	item.info = JSON.stringify( item ).replace( /\"/ig, "'" );

		        html += replaceTemplate( tpl.zoneDayLessons, item );
	        });
	        $('.calendar_info ul').html( html || '<li><em></em><h6>今日无课</h6></li>' );
        	currentDate_normal = !!html;
	        $( '.calendar_info li' ).eq( 0 ).click();
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}

CalendarHandler.initialize();

let getLessonsMissList = ( classid, lessonid, makeupflag )=>{
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getLessonsMissList',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        classid: classid,
	        lessonid: lessonid,
	        makeupflag: makeupflag
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        let _list = {
	        	'1': [],
	        	'2': [],
	        	'3': [],
	        	'4': []
	        }
	        res.data.forEach((item)=>{
	        	//var item = {"sid":"xxx","student_name":"xxx","status":"1"};
	        	const code = item.status === '未签到' ? '1' : item.status === '签到' ? '2' : item.status === '请假' ? '3' : '4';
	        	_list[ code ].push( `<span>${item.student_name}</span>` );
	        });
	        student_box_list = res.data;
	        $('.student_box').find('span').remove();
	        $('.student_box p').eq(0).append( _list['1'].join('') );
	        $('.student_box p').eq(1).append( _list['2'].join('') );
	        $('.student_box p').eq(2).append( _list['3'].join('') );
	        $('.student_box p').eq(3).append( _list['4'].join('') );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}

let getClassLessonSignQrcode = ( classid, lessonid )=>{
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getClassLessonSignQrcode',
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
		$( '.qr_box' ).show();
	        $(".qr_img").html( '' );
			let qrcode = new QRCode($(".qr_img")[0], {
				text: 'your content',
				width: 280,
				height: 280,
				colorDark : '#000000',
				colorLight : '#ffffff',
			});
			qrcode.makeCode( res.data.qrcode );
			//生成二维码图片end
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}

let cancelLesson = ( _classid, _lessonid )=>{
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/cancelLesson',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        classid: _classid,
	        lessonid: _lessonid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        $.dialogFull.Tips( "操作成功" );

			getZoneDayLessons( currentDate );
	        //window.location.reload();

	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}

let getZoneStudentList = (_class)=>{
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
	        let select = '<div class="selectBox"><select id="classSelect">';
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
	        $( `.${_class} .content` ).html( $div.html() );
	        $( `.${_class} .content p` ).eq(0).show();


			if( _class === 'student_box_getZoneStudentList' ){
				$( `.student_box_getZoneStudentList .selectBox` ).prepend( '<div class="student_box_checkedList"></div>' );

		        studentChecked_student_box = [];
		        student_box_list.forEach((item)=>{
		        	// studentChecked_student_box.push( item.sid );
		        	// $( `[data-sid=${item.sid}]` ).addClass( 'checked' );
		        	$( `.student_box_getZoneStudentList [data-sid=${item.sid}]` ).click();
		        });
			}else{
				$( `.addLessonPop_getZoneStudentList .selectBox` ).prepend( '<div class="addLessonPop_checkedList"></div>' );

			}
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
	        let options = "";
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


let getUndoneTaskCount = ()=>{
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getUndoneTaskCount',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        $( '.msg' ).html( res.data.counts || '' )
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
getUndoneTaskCount();

websocket.onmessage = function (event) {
	console.log( event );
	let data = {};
	try{
    	data = JSON.parse( event.data.replace(/'/g, '"') );
	}catch(e){
		console.log(e);
	}
	data.ajax === 'getLessonsMissList' && currentDate_normal && getLessonsMissList( classid, lessonid, makeupflag );
	// 解析json: {"msg_type":"ajax","ajax":"getLessonsMissList"},刷新对应的接口
    // console.log( event.data );
    //setMessageInnerHTML(event.data);
}



$.mainBox.prepend( '<em class="slideHide" title="投屏显示"></em>' );



let _dialogClose = ()=>{};
let _dialogClose_student_box = ()=>{};
let _dialogClose_addLessonPop = ()=>{};
let _dialogClose_addLessonPop_getZoneStudentList = ()=>{};
let studentChecked_student_box = [];
let studentChecked_addLesson = [];

$.mainBox.on('click', '.slideHide', function(){
	$('#left_nav').hide();
	$( '#main_box' ).width('100%').css({
		'left': 0,
		'width': '100%'
	});
	$( this ).removeClass().addClass( 'slideShow' ).attr( 'title', '取消投屏显示' );
	// CalendarHandler.initialize();
}).on('click', '.slideShow', function(){
	$('#left_nav').show();
	$( '#main_box' ).width('100%').css({
		'left': '190px',
		'width': 'calc(100% - 190px)'
	});
	$( this ).removeClass().addClass( 'slideHide' ).attr( 'title', '投屏显示' );
	// CalendarHandler.initialize();
}).on('click', '.selectBtn.month', function(){
	CalendarHandler.CalculateLastMonthDays();
}).on('click', '.selectBtn.selectYear', function(){
	CalendarHandler.CreateSelectYear(CalendarHandler.showYearStart);
}).on('click', '.selectBtn.selectMonth', function(){
	CalendarHandler.CreateSelectMonth();
}).on('click', '.selectBtn.nextMonth', function(){
	CalendarHandler.CalculateNextMonthDays();
}).on('click', '.selectBtn.currentDay', function(){
	CalendarHandler.CreateCurrentCalendar(0,0,0);
}).on('click', '.addLesson', function(){
	onStudentCheck = 'addLessonPop';
    $.dialogFull.Pop({
        boxClass: '.addLessonPop',
        width: 700,
        height: 'auto',
        title: '当日加课',//弹框标题
        cacheId: 'addLessonPop', //开启必须使用唯一标示！！！
        content: tpl.addLessonForm,//弹框内容区
        showCallback: function($thisBox, $contentBox){
			getZoneTeacherList();
			$.laydate.render({
				elem: '#stime',
				type: 'time',
				min: '08:00:00',
				max: '22:00:00',
				btns: ['confirm']
			});
        },
        runDone: function($this, $thisBox, dialogClose, dialogLoadingHandle) {
            _dialogClose_addLessonPop = dialogClose;
            //studentChecked_addLesson
			const sub_data = $.form.get({
		        error_text: 'placeholder',//存放错误文案的属性名
			});
			if( !sub_data ){
				return;
			}
        	if( !studentChecked_addLesson.length ){
	            $.dialogFull.Tips( "请选择学员" );
        		return;
        	}
        	let studentChecked_addLesson_obj = Array.from(new Set(studentChecked_addLesson)).map((item)=>{
        		return {sid: +item};
        	});
        	dialogLoadingHandle( true, $this );
			sub_data.students = studentChecked_addLesson_obj;
			sub_data.date = currentDate;
			sub_data.tid = +sub_data.tid;
			sub_data.time_length = +sub_data.time_length;
			sub_data.deduction_lessons = +sub_data.deduction_lessons;
		    let ajaxData = {
		        code: $('#zone_code').val(),
		        zoneid: $('#zone_zoneid').val(),
				data: JSON.stringify( sub_data ),
		    }
			$.form.submit({
				url: '/pss/addAdditionalLesson',
				data: ajaxData,
				success: (res) => {
					if( res.errcode != 0 ){
		         		$.dialogFull.Tips( res.errmsg );
		        		dialogLoadingHandle( false, $this );
						return;
					}
		        	$.dialogFull.Tips( "提交成功！" );
		        	dialogLoadingHandle( false, $this );
				    _dialogClose_addLessonPop(1);
				    _dialogClose_addLessonPop_getZoneStudentList(1);
				    studentChecked_addLesson = [];
		        	getZoneDayLessons( currentDate );
				},
		        error: function(){
		        	dialogLoadingHandle( false, $this );
		        	$.dialogFull.Tips( "网络错误，请稍后重试" );
		        }
			});

        },
        runDoneLoading: true,
        runClose: function($this, $thisBox, dialogClose) {
            _dialogClose_addLessonPop = dialogClose;
        }
    });	

}).on('click', '.calendar_list .targetItem', function(){
	$(this).addClass( 'currentItem' ).siblings().removeClass( 'currentItem' );
	currentDate = $(this).data( 'date' );
	getZoneDayLessons( currentDate );
}).on('click', '.calendar_info li', function(){
	const info = JSON.parse( ($(this).data('info') || '{}').replace( /'/g, '"' ) );
	if( !info.class_id ){
		$( '.info_box' ).hide();
		$( '.lesson_box' ).html( '' );
		$( '.student_box span' ).remove();
		return;
	}
	classid = info.class_id;
	lessonid = info.lesson_id;
	makeupflag = info.class_name.indexOf( '-补课' ) > -1 ? 1 : 0;
	$( '.info_box' ).show();
	$(this).addClass( 'on' ).siblings( '.on' ).removeClass( 'on' );
	$( '.lesson_box' ).html( replaceTemplate( tpl.info, info ) );
	getLessonsMissList( classid, lessonid, makeupflag );
	$( '.qr_box' ).hide();
	info.show && getClassLessonSignQrcode( classid, lessonid );
}).on('click', '.student_box_DEL', function(){
	onStudentCheck = 'student_box_getZoneStudentList';

    $.dialogFull.Pop({
        boxClass: '.student_box_getZoneStudentList',
        width: 700,
        height: 'auto',
        cacheId: 'student_box_getZoneStudentList', //开启必须使用唯一标示！！！
        title: '学员列表',//弹框标题
        content: '',//弹框内容区
        confirm: 'alert',
        showCallback: function($thisBox, $contentBox){
        	getZoneStudentList( 'student_box_getZoneStudentList' );
        },
        runDone: function($this, $thisBox, dialogClose) {
        	if( !studentChecked_student_box.length ){
	            $.dialogFull.Tips( "请选择学员" );
        		return;
        	}
        	let studentChecked_student_box_obj = Array.from(new Set(studentChecked_student_box)).map((item)=>{
        		return {sid: +item};
        	});
    	    $.ajax({
		        type: "post",
		        dataType: "json",
		        url: '/pss/adjustClassLessonStudents',
		        data: {
		            code: $('#zone_code').val(),
		            zoneid: $('#zone_zoneid').val(),
			        classid: classid,
			        lessonid: lessonid,
		            data: JSON.stringify( studentChecked_student_box_obj )
		        },
		        success: (res)=>{
		            if( res.errcode != 0 ){
		                $.dialogFull.Tips( res.errmsg );
		                 return;
		            }
		            $.dialogFull.Tips( "提交成功！" );

					getZoneDayLessons( currentDate );
		            //window.location.reload();
		        },
		        error: ()=>{
		            $.dialogFull.Tips( "网络错误，请稍后重试！" );
		        }
		    })
        	_dialogClose_student_box = dialogClose;
            dialogClose();
        },
        runClose: function($this, $thisBox, dialogClose) {
            _dialogClose_student_box = dialogClose;
        }
    });	
}).on('click', '.cancelLesson', function(event){
	const info = JSON.parse( $(this).data('info').replace( /'/g, '"' ) );
	const _classid = info.class_id;
	const _lessonid = info.lesson_id;

    $.dialogFull.Pop({
        boxClass: '.cancelLessonPop',
        width: 300,
        height: 'auto',
        title: '提示',//弹框标题
        content: '确定删除该课时？',//弹框内容区
        runDone: function($this, $thisBox, dialogClose) {
			cancelLesson( _classid, _lessonid );
            dialogClose();
        }
    });	
	event.stopPropagation();
})

$(document).off('click', '.student').on('click', '.student', function(){
	let self = $( this );
	const sid = self.data( 'sid' );
	if( onStudentCheck == 'student_box_getZoneStudentList' ){
		// if( self.hasClass( 'checked' ) ){
		// 	studentChecked_student_box.splice( studentChecked_student_box.indexOf( sid ), 1 );
		// 	self.removeClass( 'checked' );
		// }else{
		// 	studentChecked_student_box.push( sid );
		// 	self.addClass( 'checked' );
		// }
		if( studentChecked_student_box.indexOf( +sid ) == -1 ){
			$( '.student_box_checkedList' ).append( self.clone() );
			studentChecked_student_box.push( +sid );
		}else if( !$( `.student_box_checkedList [data-sid=${sid}]` ).length ){
			$( '.student_box_checkedList' ).append( self.clone() );
		}
		$( `.student_box_getZoneStudentList .classItem [data-sid=${sid}]` ).hide();
	}else{
		// if( self.hasClass( 'checked' ) ){
		// 	studentChecked_addLesson.splice( studentChecked_addLesson.indexOf( sid ), 1 );
		// 	self.removeClass( 'checked' );
		// }else{
		// 	studentChecked_addLesson.push( sid );
		// 	self.addClass( 'checked' );
		// }
		if( studentChecked_addLesson.indexOf( +sid ) == -1 ){
			$( '.addLessonPop_checkedList' ).append( self.clone() );
			studentChecked_addLesson.push( +sid );
		}else if( !$( `.addLessonPop_checkedList [data-sid=${sid}]` ).length ){
			$( '.addLessonPop_checkedList' ).append( self.clone() );
		}
		$( `.addLessonPop_getZoneStudentList .classItem [data-sid=${sid}]` ).hide();
	}
}).on('click', '.student_box_checkedList .student', function(){
	let self = $( this );
	const sid = self.data( 'sid' );
	studentChecked_student_box.splice( studentChecked_student_box.indexOf( sid ), 1 );
	$( `.student_box_getZoneStudentList .classItem [data-sid=${sid}]` ).show();
	self.remove();
}).on('click', '.addLessonPop_checkedList .student', function(){
	let self = $( this );
	const sid = self.data( 'sid' );
	studentChecked_addLesson.splice( studentChecked_addLesson.indexOf( sid ), 1 );
	$( `.addLessonPop_getZoneStudentList .classItem [data-sid=${sid}]` ).show();
	self.remove();
}).on('change', '#classSelect', function(){
	const class_id = $( this ).val();
	$( `.class_${class_id}` ).show().siblings('p').hide();
}).on('click', '#addStudents', function(){

    $.dialogFull.Pop({
        boxClass: '.addLessonPop_getZoneStudentList',
        width: 700,
        height: 'auto',
        cacheId: 'addLessonPop_getZoneStudentList', //开启必须使用唯一标示！！！
        title: '学员列表',//弹框标题
        content: '',//弹框内容区
        showCallback: function($thisBox, $contentBox){
        	getZoneStudentList( 'addLessonPop_getZoneStudentList' );
        },
        runDone: function($this, $thisBox, dialogClose) {
        	if( !studentChecked_addLesson.length ){
	            $.dialogFull.Tips( "请选择学员" );
        		return;
        	}
        	const showLength = Array.from(new Set(studentChecked_addLesson));
        	$( '#addStudents' ).html( `选择学员(${showLength.length})` );
        	_dialogClose_addLessonPop_getZoneStudentList = dialogClose;
         	dialogClose();
        	$( '.addLesson' ).click();
        },
        closeBtnText: false,
        runClose: function($this, $thisBox, dialogClose) {
        	_dialogClose_addLessonPop_getZoneStudentList = dialogClose;
        	$( '.addLesson' ).click();
        }
    });	

})

$.distory = ()=>{
	$( '.slideShow' ).click();
	$(document).off('click', '.student').off('click', '#addStudents').off('change', '#classSelect').off('click', '.student_box_checkedList .student').off('click', '.addLessonPop_checkedList .student');
    _dialogClose(1);
    _dialogClose_student_box(1);
    _dialogClose_addLessonPop(1);
    _dialogClose_addLessonPop_getZoneStudentList(1);
};