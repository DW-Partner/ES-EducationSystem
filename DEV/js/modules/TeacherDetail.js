require('./TeacherDetail.css');

import QRCode from '../kit/qrcode.js';

import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
import tab from '../comp/tab.js';//tab切换

const tpl = {
	base_info: '<p><span>教师姓名：</span><em>{name}</em></p>\
				<p><span>性别：</span><em>{gender}</em></p>\
				<p><span>出生日期：</span><em>{birthday}</em></p>\
				<p><span>入职时间：</span><em>{entry_day}</em></p>\
				<br />\
				<p><span>详细地址：</span><em>{address}</em></p>\
				<p><span>手机号：</span><em>{mobile}</em></p>\
				<br /><p><span>身份证号：</span><em>{id_num}</em></p>\
				<p><span>类型：</span><em>{type}</em></p>\
				<br />\
				<p><span>所属门店：</span><em>{zone_name}</em></p>\
				<p><span>毕业学历信息：</span><em>{education}</em></p>',
	work_info: '<div class="data data1">\
						<span>当月课时完成数</span>\
						<p>{completed_lessons}</p>\
					</div>\
					<div class="data data2">\
						<span>当月课时任务数</span>\
						<p>{lesson_num}</p>\
					</div>\
					<div class="data data3">\
						<span>负责班级数</span>\
						<p>{class_num}</p>\
					</div>\
					<div class="data data4">\
						<span>当月完成授课人次</span>\
						<p>{completed_students}</p>\
					</div>\
					<div class="data data5">\
						<span>当月班内续费人数</span>\
						<p>{renew_students}</p>\
					</div>\
					<div class="data data6">\
						<span>当月试听转正人数</span>\
						<p>{signed_num}</p>\
					</div>',
    classList: '<li>\
            <div class="item"><p><span>{class_name}</span></p></div>\
            <div class="item"><p><span>{course_name}</span></p></div>\
            <div class="item"><p><span>{start_time}</span></p></div>\
            <div class="item"><p><span>{teacher_name}</span></p></div>\
            <div class="item"><p><span>{current_lesson}</span></p></div>\
            <div class="item"><p><span>{student_num}</span></p></div>\
        </li>',
    teacherHistoryWorkInfo: '<li>\
                <div class="item"><p><span>{stat_time}</span></p></div>\
                <div class="item"><p><span>{class_num}</span></p></div>\
                <div class="item"><p><span>{lesson_num}</span></p></div>\
                <div class="item"><p><span>{completed_lessons}</span></p></div>\
                <div class="item"><p><span>{completed_students}</span></p></div>\
                <div class="item"><p><span>{renew_students}</span></p></div>\
                <div class="item"><p><span>{signed_num}</span></p></div>\
            </li>'
}
//time":"xxx","class_num":"xxx","lesson_num":"xxx","completed_lessons":"xxx","completed_students":"xxx", "renew_students":"xxx","signed_num":"xxx"

const tid = $('#tid').val();
let run_action;
let zoneid;

//qrcode start 3.29
let run_qrcode = (tips)=>{
	$.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/updateQrcode',
	    data: {
	        code: $('#school_code').val() || $('#zone_code').val(),
	        zoneid: zoneid,
	        usertype: 'teacher',
	        userid: tid,
	        expired: 180
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        $("#img_box").html('');
			//生成二维码图片start
		    let Teacher_qrcode = new QRCode($("#img_box")[0], {
			  text: 'your content',
			  width: 256,
			  height: 256,
			  colorDark : '#000000',
			  colorLight : '#ffffff',
		    });
		    Teacher_qrcode.makeCode(res.data.qrcode);

            tips && $.dialogFull.Tips( '更新成功！' );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
//qrcode end

//获取教师信息 start 3.24
let getTeacherDetail = ()=>{
	$.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getTeacherDetail',
	    data: {
	        code: $('#school_code').val() || $('#zone_code').val(),
	        tid: tid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        const html = replaceTemplate( tpl.base_info, res.data );
	        $('.TeacherDetail .center').html( html );
	        run_action = res.data.status == '停止授课' ? 'start' : 'stop';
	        $('#action span').text( res.data.status );
	        zoneid = res.data.zone_id;
			run_qrcode();
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
getTeacherDetail();
//获取教师信息 end


//获取教师教学信息 start 3.28
let getTeacherWorkInfo = ()=>{
	$.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getTeacherWorkInfo',
	    data: {
	        code: $('#school_code').val() || $('#zone_code').val(),
	        tid: tid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        const html = replaceTemplate( tpl.work_info, res.data );
	        $('.content_middle').eq( 0 ).append( html );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
getTeacherWorkInfo();
//获取教师教学信息 end 3.15

//授课操作 start 3.27
let action = ()=>{
	$.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/teachAction',
	    data: {
	        code: $('#school_code').val() || $('#zone_code').val(),
	        tid: tid,
	        action: run_action
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
            $.dialogFull.Tips( '操作成功！' );
            run_action = run_action == 'start' ? 'stop' : 'start';
	        $('#action span').text( run_action == 'start' ? '停止授课' : '正常' );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
//授课操作 end

let unBindTeacher = (that)=>{
	$.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/unBindTeacher',
	    data: {
	        code: $('#school_code').val() || $('#zone_code').val(),
	        tid: tid,
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
            $.dialogFull.Tips( '操作成功！' );
            that.addClass('btn_dis').data('stop','1');
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}

let getTeacherHistoryWorkInfo = ()=>{
    $.jsonPage({
        listBox: 'ul.body',//列表容器
        ajaxUrl: '/pss/getTeacherHistoryWorkInfo',
        ajaxType: 'post',
        ajaxData: {
            code: $('#school_code').val() || $('#zone_code').val(),
            // zoneid: $('#zone_zoneid').val(),
            tid: tid
        },//上行参数
        template: tpl.teacherHistoryWorkInfo,//列表模板
        listKey: ['data'],//下行结构
        pageBar: false,//是否启用分页
        eachTemplateHandle: false,//Function : function(msg,pageNum,pageSize){ return msg }
        noData: false,//Function : function( $listBox, $pageBox ){}
        codeKeyName: 'errcode',//状态标示key名
        codeSuccess: 0,//状态标示值
        successRunAfter: function(data, pageNum, pageSize, $listBox, $pageBox) {

        },//function(msg) {  }
        ajaxCodeError: function( res ){
            $.dialogFull.Tips( res.errmsg );
        },
        ajaxError: function(XMLHttpRequest, textStatus, errorThrown, text) {
            $.dialogFull.Tips( "网络错误，请稍后重试" );
        }
    });
};
getTeacherHistoryWorkInfo();

tab({
    tab_box: $('.tab_box')
});


$.mainBox.on('click', '#action', function(){
	action();
}).on('click', '#t_qrcode', function(){
	run_qrcode(true);
}).on('click', '#unBindTeacher', function(){
	let self = $(this);
	if( self.data('stop') ){
		return;
	}
	unBindTeacher( self );
})
