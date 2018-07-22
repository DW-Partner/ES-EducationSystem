require('./ZoneHome.css');

import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
import QRCode from '../kit/qrcode.js';

let $dayItem;
let $calendarItem;
let $monthItem;
let $last;
let $yearItem;
let $next;
let currentDate;



let classid;
let lessonid;


const HTML = `<div class="calendar_box">
				<div class="calendar_list">
					<div id="title">
						<a class="selectBtn month" href="javascript:"><</a>
						<a class="selectBtn selectYear" href="javascript:">-</a>
						<a class="selectBtn selectMonth">-</a>
						<a class="selectBtn addLesson" href="javascript:">当日加课</a>
						<a class="selectBtn nextMonth" href="javascript:">></a>
						<a class="selectBtn currentDay" href="javascript:">今天</a>
					</div>
					<div id="context">
						<div class="week">
							<span> 一 </span>
							<span> 二 </span>
							<span> 三 </span>
							<span> 四 </span>
							<span> 五 </span>
							<span> 六 </span>
							<span> 日 </span>
						</div>
						<div id="center">
							<div id="centerMain">
								<div id="selectYearDiv"></div>
								<div id="centerCalendarMain">
								</div>
								<div id="selectMonthDiv"></div>
								</div>
						</div>
					</div>
				</div>
				<div class="calendar_info">
					<ul>
						<li>
							<em></em>
							<b class="cancelLesson">X</b>
							<h6>K1  基础美术启航班</h6>
							<p>
								<span>16:30--17:30</span>
							</p>
							<p>
								<span>授课教师：  Friendy</span>
								<span>授课地点：  A3教室</span>
							</p>
							<p>
								<span>主题：  素描静物
							</p>
						</li>
						<li>
							<em></em>
							<b class="cancelLesson">X</b>
							<h6>K1  基础美术启航班</h6>
							<p>
								<span>16:30--17:30</span>
							</p>
							<p>
								<span>授课教师：  Friendy</span>
								<span>授课地点：  A3教室</span>
							</p>
							<p>
								<span>主题：  素描静物
							</p>
						</li>
						<li>
							<em></em>
							<b class="cancelLesson">X</b>
							<h6>K1  基础美术启航班</h6>
							<p>
								<span>16:30--17:30</span>
							</p>
							<p>
								<span>授课教师：  Friendy</span>
								<span>授课地点：  A3教室</span>
							</p>
							<p>
								<span>主题：  素描静物
							</p>
						</li>
						<li>
							<em></em>
							<b class="cancelLesson">X</b>
							<h6>K1  基础美术启航班</h6>
							<p>
								<span>16:30--17:30</span>
							</p>
							<p>
								<span>授课教师：  Friendy</span>
								<span>授课地点：  A3教室</span>
							</p>
							<p>
								<span>主题：  素描静物
							</p>
						</li>
						<li>
							<em></em>
							<b class="cancelLesson">X</b>
							<h6>K1  基础美术启航班</h6>
							<p>
								<span>16:30--17:30</span>
							</p>
							<p>
								<span>授课教师：  Friendy</span>
								<span>授课地点：  A3教室</span>
							</p>
							<p>
								<span>主题：  素描静物
							</p>
						</li>
						<li>
							<em></em>
							<b class="cancelLesson">X</b>
							<h6>K1  基础美术启航班</h6>
							<p>
								<span>16:30--17:30</span>
							</p>
							<p>
								<span>授课教师：  Friendy</span>
								<span>授课地点：  A3教室</span>
							</p>
							<p>
								<span>主题：  素描静物
							</p>
						</li>
						<li>
							<em></em>
							<b class="cancelLesson">X</b>
							<h6>K1  基础美术启航班</h6>
							<p>
								<span>16:30--17:30</span>
							</p>
							<p>
								<span>授课教师：  Friendy</span>
								<span>授课地点：  A3教室</span>
							</p>
							<p>
								<span>主题：  素描静物
							</p>
						</li>
						<li>
							<em></em>
							<b class="cancelLesson">X</b>
							<h6>K1  基础美术启航班</h6>
							<p>
								<span>16:30--17:30</span>
							</p>
							<p>
								<span>授课教师：  Friendy</span>
								<span>授课地点：  A3教室</span>
							</p>
							<p>
								<span>主题：  素描静物
							</p>
						</li>
						<li>
							<em></em>
							<b class="cancelLesson">X</b>
							<h6>K1  基础美术启航班</h6>
							<p>
								<span>16:30--17:30</span>
							</p>
							<p>
								<span>授课教师：  Friendy</span>
								<span>授课地点：  A3教室</span>
							</p>
							<p>
								<span>主题：  素描静物
							</p>
						</li>
					</ul>
				</div>
			</div>
			<div class="info_box">
				<div class="lesson_box">
				</div>
				<div class="student_box">
					<p><b>已签到：</b></p>
					<p><b>未签到：</b></p>
					<p><b>请假：</b></p>
				</div>
				<div class="qr_box">
				</div>
			</div>`;
$.mainBox.html( HTML );

const tpl = {
	zoneDayLessons: `<li data-info="{info}">
			<em></em>
			<b class="cancelLesson" data-info="{info}">X</b>
			<h6>{class_name}</h6>
			<p>
				<span>开始时间：{start_time}</span>
				<span>课时长：{lesson_time}</span>
			</p>
			<p>
				<span>授课教师：{teacher_name}</span>
				<span>授课地点：{classroom}</span>
			</p>
			<p>
				主题：{theme}
			</p>
		</li>`,
	info: `<h6>{start_time}  {class_name}</h6>
			<p>授课教师：  {teacher_name}</p>
			<p>授课地点：{classroom}</p>
			<p>主题：{theme}</p>
			<p>教学目标：{target}</p>`
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

		$("#context").css("height", $("#CalendarMain").height() - 65 + "px");
		$("#center").css("height", $("#context").height() - 30 + "px");
		$("#selectYearDiv").css("height", $("#context").height() - 30 + "px").css("width", $("#context").width() + "px");
		$("#selectMonthDiv").css("height", $("#context").height() - 30 + "px").css("width", $("#context").width() + "px");
		$("#centerCalendarMain").css("height", $("#context").height() - 30 + "px").css("width", $("#context").width() + "px");

		$calendarItem.css("height", $("#context").height() - 30 + "px"); //.css("visibility","hidden");
		$("#centerCalendarMain").css("height", "0px").css("width", "0px").css("margin-left", $("#context").width() / 2 + "px").css("margin-top", ($("#context").height() - 30) / 2 + "px");
		$("#centerCalendarMain").animate({
			width: $("#context").width() + "px",
			height: ($("#context").height() - 30) * 2 + "px",
			marginLeft: "0px",
			marginTop: "0px"
		}, 300, function() {
			//$calendarItem.css("visibility", "visible");
		});
		$(".dayItem").css("width", $("#context").width() + "px");
		var itemPaddintTop = $(".dayItem").height() / 6;
		//$(".item").css({
			//"width": $(".week").width() / 7 + "px",
			//"line-height": itemPaddintTop + "px",
			// "height": itemPaddintTop + "px"
		//});
		//$(".currentItem>a").css("margin-left", ($(".item").width() - 25) / 2 + "px").css("margin-top", ($(".item").height() - 25) / 2 + "px");
		//$(".week>h3").css("width", $(".week").width() / 7 + "px");
		//this.RunningTime();
	},
	CreateSelectYear: function(showYearStart) {
		CalendarHandler.showYearStart=showYearStart;
		$(".currentDay").show();
		$("#selectYearDiv").children().remove();
		var yearindex = 0;
		for (var i = showYearStart; i < showYearStart+12; i++) {
			yearindex++;
			if(i==showYearStart){
				$last=$("<div>往前</div>");
				$("#selectYearDiv").append($last);
				$last.click(function(){
					CalendarHandler.CreateSelectYear(CalendarHandler.showYearStart-10);
				});
				continue;
			}
			if(i==showYearStart+11){
				$next=$("<div>往后</div>");
				$("#selectYearDiv").append($next);
				$next.click(function(){
					CalendarHandler.CreateSelectYear(CalendarHandler.showYearStart+10);
				});
				continue;
			}
			
			if (i == this.currentYear) {
				$yearItem=$("<div class=\"currentYearSd\" id=\"" + yearindex + "\">" + i + "</div>")
			
			}
			else{
				 $yearItem=$("<div id=\"" + yearindex + "\">" + i + "</div>");
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
				marginLeft: -$("#center").width() + "px"
			}, 500);
			});
			if (yearindex == 1 || yearindex == 5 || yearindex == 9) $("#selectYearDiv").find("#" + yearindex).css("border-left-color", "#fff");
			if (yearindex == 4 || yearindex == 8 || yearindex == 12) $("#selectYearDiv").find("#" + yearindex).css("border-right-color", "#fff");
			
		}
		$("#selectYearDiv>div").css("width", ($("#center").width() - 4) / 4 + "px").css("line-height", ($("#center").height() - 4) / 3 + "px");
		$("#centerMain").animate({
			marginLeft: "0px"
		}, 300);
	},
	CreateSelectMonth: function() {
		$(".currentDay").show();
		$("#selectMonthDiv").children().remove();
		for (var i = 1; i < 13; i++) {
			if (i == this.currentMonth) $monthItem=$("<div class=\"currentMontSd\" id=\"" + i + "\">" + i + "月</div>");
			else  $monthItem=$("<div id=\"" + i + "\">" + i + "月</div>");
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
				marginLeft: -$("#center").width() + "px"
			}, 500);
			});
			if (i == 1 || i == 5 || i == 9) $("#selectMonthDiv").find("#" + i).css("border-left-color", "#fff");
			if (i == 4 || i == 8 || i == 12) $("#selectMonthDiv").find("#" + i).css("border-right-color", "#fff");
		}
		$("#selectMonthDiv>div").css("width", ($("#center").width() - 4) / 4 + "px").css("line-height", ($("#center").height() - 4) / 3 + "px");
		$("#centerMain").animate({
			marginLeft: -$("#center").width() * 2 + "px"
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
		console.log( nowMonth )
		this.currentMonth = nowMonth;
		let nowDay = d == 0 ? nowDate.getDate() : d;

console.log( nowYear + '-' + nowMonth );

		$(".selectYear").html(nowYear + "年");
		$(".selectMonth").html(nowMonth + "月");
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
				$dayItem.append("<div class=\"item lastItem\"><a>" + (i + 1) + "</a></div>");
			}
		}

		//生成当月的日期
		for (var i = 0; i < nowDaysNub; i++) {
			const thatDay = i + 1 < 10 ? '0' + (i + 1) : i + 1;
			if( currentDate == `${nowYear}-${nowMonth}-${thatDay}` ){
				$dayItem.append(`<div class="item currentItem" data-date="${nowYear}-${nowMonth}-${thatDay}"><a>${i + 1}</a></div>`);	
			}else if (i == (nowDay - 1) && mark){
				$dayItem.append(`<div class="item currentItem" data-date="${nowYear}-${nowMonth}-${thatDay}"><a>${i + 1}</a></div>`);
				getZoneDayLessons( `${nowYear}-${nowMonth}-${thatDay}` );
				currentDate = `${nowYear}-${nowMonth}-${thatDay}`;
			}else{
				$dayItem.append(`<div class="item" data-date="${nowYear}-${nowMonth}-${thatDay}"><a>${i + 1}</a></div>`);//toDO EDIT
			}
			// $dayItem.append("<div class=\"item\"><a>" + (i + 1) + "</a></div>");
		}

		//获取总共已经生成的天数
		var hasCreateDaysNub = nowWeek + nowDaysNub;
		//如果小于42，往下个月推算
		if (hasCreateDaysNub < 42) {
			for (var i = 0; i <= (42 - hasCreateDaysNub); i++) {
				$dayItem.append("<div class=\"item lastItem\"><a>" + (i + 1) + "</a></div>");
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
	},
	// RunningTime: function() {
	// 	var mTiming = setInterval(function() {
	// 		var nowDate = new Date();
	// 		var h=nowDate.getHours()<10?"0"+nowDate.getHours():nowDate.getHours();
	// 		var m=nowDate.getMinutes()<10?"0"+nowDate.getMinutes():nowDate.getMinutes();
	// 		var s=nowDate.getSeconds()<10?"0"+nowDate.getSeconds():nowDate.getSeconds();
	// 		var nowTime = h + ":" + m + ":" + s;
	// 		$("#footNow").html("本地时间 "+nowTime);
	// 	}, 1000);

	// }
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
	        res.data = ['3'];
	        res.data.forEach((item)=>{
	        	var item = {"class_id":"xxx","class_name":"22xxx","course_id":"xxx","course_name":"xxx","lesson_id":"xxx","start_time":"12:23:32","lesson_time":"xxx","teacher_id":"xxx","teacher_name":"xxx","classroom":"xxx","theme":"xxx","target":"xxx"};
	        	item.start_time = item.start_time.substring( 0, item.start_time.length-3 );
	        	item.info = JSON.stringify( item ).replace( /\"/ig, "'" );
		        html += replaceTemplate( tpl.zoneDayLessons, item );
	        });
	        $('.calendar_info ul').html( html );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}

CalendarHandler.initialize();

let getLessonsMissList = ( classid, lessonid )=>{
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getLessonsMissList',
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
	        let html = '';
	        res.data = ['3'];
	        let _list = {
	        	'1': [],
	        	'2': [],
	        	'3': []
	        }
	        res.data.forEach((item)=>{
	        	var item = {"sid":"xxx","student_name":"xxx","status":"1"};
	        	_list[ item.status ].push( `<span>${item.student_name}</span>` );
	        });
	        console.log( _list )
	        $('.student_box').find('span').remove();
	        $('.student_box p').eq(0).append( _list['1'].jion() );
	        $('.student_box p').eq(1).append( _list['2'].jion() );
	        $('.student_box p').eq(2).append( _list['3'].jion() );
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
	        $(".qr_box").html( '' );
			let qrcode = new QRCode($(".qr_box")[0], {
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
	        window.location.reload();

	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}

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
	        let select = '<div class="selectBox"><select id="classSelect">';
	        res.data.forEach((item,index)=>{
	        	if( !classArr[ item.class_id ] ){
		        	classArr[ item.class_id ] = true;
		        	item.class_name = item.class_name || '其它';
		        	select += `<option value="${item.class_id}">${item.class_name}</option>`;
		        	$div.append( `<p class="classItem class_${item.class_id}" style="diaplay:none;"><span>${item.class_name}：</span></p>` )
	        	}
				$div.find( 'p:last' ).append( `<span class="student" data-sid="${item.sid}">${item.student_name}</sapn>` );
	        })
	        select += '</select></div>';
	        $div.prepend( select );
	        $( '.dialogPopBox .content' ).html( $div.html() );
	        $( '.dialogPopBox .content p' ).eq(0).show();
	        //getClassLessonStudentList();
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}


$.mainBox.on('click', '.selectBtn.month', function(){
	CalendarHandler.CalculateLastMonthDays();
}).on('click', '.selectBtn.selectYear', function(){
	CalendarHandler.CreateSelectYear(CalendarHandler.showYearStart);
}).on('click', '.selectBtn.selectMonth', function(){
	CalendarHandler.CreateSelectMonth();
}).on('click', '.selectBtn.nextMonth', function(){
	CalendarHandler.CalculateNextMonthDays();
}).on('click', '.selectBtn.currentDay', function(){
	CalendarHandler.CreateCurrentCalendar(0,0,0);
}).on('click', '.selectBtn.addLesson', function(){
	alert(12)
}).on('click', '.calendar_list .item', function(){
	$(this).addClass( 'currentItem' ).siblings().removeClass( 'currentItem' );
	currentDate = $(this).data( 'date' );
	getZoneDayLessons( currentDate );
}).on('click', '.calendar_info li', function(){

	const info = JSON.parse( $(this).data('info').replace( /'/g, '"' ) );
	$( '.lesson_box' ).html( replaceTemplate( tpl.info, info ) );
	classid = info.class_id;
	lessonid = info.lesson_id;
	getLessonsMissList( classid, lessonid );
}).on('click', '.student_box', function(){

    $.dialogFull.Pop({
        boxClass: '.getZoneStudentList',
        width: 700,
        height: 'auto',
        cacheId: 'getZoneStudentListCachIdIndex', //开启必须使用唯一标示！！！
        title: '学员列表',//弹框标题
        content: '',//弹框内容区
        showCallback: function($thisBox, $contentBox){
        	getZoneStudentList();
        },
        runDone: function($this, $thisBox, dialogClose) {
        	let studentCheckedObj = studentChecked.map((item)=>{
        		return {sid: item};
        	});
        	if( !studentChecked.length ){
	            $.dialogFull.Tips( "请选择学员" );
        		return;
        	}
    	    $.ajax({
		        type: "post",
		        dataType: "json",
		        url: '/pss/adjustClassLessonStudents',
		        data: {
		            code: $('#zone_code').val(),
		            zoneid: $('#zone_zoneid').val(),
			        classid: class_id,
			        lessonid: lesson_id
		        },
		        success: (res)=>{
		            if( res.errcode != 0 ){
		                $.dialogFull.Tips( res.errmsg );
		                 return;
		            }
		            $.dialogFull.Tips( "提交成功！" );
		            window.location.reload();
		        },
		        error: ()=>{
		            $.dialogFull.Tips( "网络错误，请稍后重试！" );
		        }
		    })
        	_dialogClose = dialogClose;
            dialogClose();
        }
    });	
}).on('click', '.cancelLesson', function(event){
	const info = JSON.parse( $(this).data('info').replace( /'/g, '"' ) );
	const _classid = info.class_id;
	const _lessonid = info.lesson_id;
	cancelLesson( _classid, _lessonid );
	event.stopPropagation();
})




$(document).off('change', '#classSelect').on('change', '#classSelect', function(){
	const class_id = $( this ).val();
	$( `.class_${class_id}` ).show().siblings('p').hide();
});


$.distory = ()=>{
    _dialogClose(1);

};
