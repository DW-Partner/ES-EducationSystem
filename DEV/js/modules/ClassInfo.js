	require('./ClassInfo.css');//引入css文件
import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
const tpl = {
	//{"errcode":0,"errmsg":"success","data":{"class_name":"xxx","teacher":"xxx","start_time":"xxx","reserve_num":"xxx","students_num":"xxx","students":[{"sid":"xxx","name":"xxx"},...]}
	info: '<div class="data_line">\
			<span>班级名称</span>\
			<strong>{class_name}</strong>\
			<span>任课老师</span>\
			<strong>{teacher}</strong>\
			<span>开班时间</span>\
			<strong>{start_time}</strong>\
			<span>预招人数</span>\
			<strong>{reserve_num}</strong>\
			<span>学员人数</span>\
			<strong>{students_num}</strong>\
		</div>',
	// <span>上课时间<em>{start_time}</em></span><span>预招人数<em>{reserve_num}</em></span><span>实际学员人数<em>{students_num}</em></span><span>讲师<em>{teacher}</em></span>',
	//{"lesson_id":"xxx","theme":"xxx","lesson_status":"xxx"}
	list: '<li>\
			<a href="javascript:;" data-{href}="/pss/goLessonOperate?classid={class_id}&lessonid={lesson_id}&sid={sid}">\
			<div class="info status_{lesson_status}" data-lessonid="{lesson_id}">\
			<h6>{theme}</h6>\
			<p>{lesson_time}</p>\
			<strong data-lessonid="{lesson_id}">{del}</strong>\
			</div></a>\
			<div class="arrow"></div>\
			</li>',
	span: '<span>{sid}:{student_name}</span>',
};
const classid = $('#classid').val();

let getClassLessonsList = (sid, title_info)=>{
	// start 3.21
	$.jsonPage({
	    listBox: '.class_list',//列表容器
	    ajaxUrl: '/pss/getClassLessonsList',
	    ajaxType: 'post',
	    ajaxData: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        classid: classid,
	        sid: sid || undefined
	    },//上行参数
	    template: tpl.list,//列表模板
	    listKey: ['data'],//下行结构
	    pageBar: false,//是否启用分页
	    eachDataHandle: function(msg,pageNum,pageSize){
	        // const words = {
	        //     '0': '已经上过',
	        //     '1': '马上要上',
	        //     '2': '以后上',
	        //     '3': '缺课',
	        // }
	        // msg.words = words[msg.lesson_status];
			msg.class_id = classid;
			msg.href = msg.lesson_status == 0 ? 'null' : 'href';

			//msg.del = msg.lesson_status == 0 ? '' : '删除'

			msg.sid = sid;

	        return msg;
	    },
	    eachTemplateHandle: false,//Function : function(msg,pageNum,pageSize){ return msg }
	    noData: false,//Function : function( $listBox, $pageBox ){}
	    codeKeyName: 'errcode',//状态标示key名
	    codeSuccess: 0,//状态标示值
	    successRunAfter: function(data, pageNum, pageSize, $listBox, $pageBox) {
		    $('.page_head h3').text( '班级信息——' + (title_info || '班级课程表'));
	    },//function(msg) {  }
	    ajaxCodeError: function( res ){
	        $.dialogFull.Tips( res.errmsg );
	    },
	    ajaxError: function(XMLHttpRequest, textStatus, errorThrown, text) {
	        $.dialogFull.Tips( "网络错误，请稍后重试" );
	    }
	});
	//获取教案列表 end
}


let getZoneSummary = ()=>{

    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getClassSummary',
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
			let select = '学员列表：<select id="students"><option value="">所有</option>';
			res.data.students.map(function(item){
			    select += '<option value="' + item.sid + '">' + item.name + '</option>'
			});
			select += '</select>';

	        const html = replaceTemplate( tpl.info, res.data );
	        $('.dataBox').html( html );
	        $('.run').html( select );
	        getClassLessonsList('');
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
getZoneSummary();





$.mainBox.on('change', '#students', function(){
	const sid = $(this).val();
    const title_info = sid ? $(this).find('option:selected').text() + '的课程表' : '';
    getClassLessonsList(sid, title_info);
}).on('click', '.status_0, .status_3', function(){
	const lessonid = $(this).data('lessonid');
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
	        let span = '';
			res.data.map(function(item){
	        	span += replaceTemplate( tpl.span, item );

			});
	        $.dialogFull.Alert({
                title: '缺课人员',//弹框标题
                content: span || '无缺课学生',//弹框内容区
	        });

	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}).on('click', '.class_list li strong', function(e){
    if ( e && e.stopPropagation ){
        e.stopPropagation(); 
    }
    else{
        window.event.cancelBubble = true; 
    }
	const lessonid = $(this).data('lessonid');
	const self = $(this);
	$.dialogFull.Pop({
        title: '提示',//弹框标题
        content: '确认删除该课时？',//弹框内容区
        runDone: function($this, $thisBox, dialogClose) {
			// /pss/cancelLesson?code=x&zoneid=x&classid=x&lessonid=x&sid=x
		    $.ajax({
			    type: "post",
			    dataType: "json",
			    url: '/pss/cancelLesson',
			    data: {
			        code: $('#zone_code').val(),
			        zoneid: $('#zone_zoneid').val(),
			        classid: classid,
			        lessonid: lessonid,
			        sid: $( '#students' ).val() || undefined
			    },
			    success: (res)=>{
			        if( res.errcode != 0 ){
			            $.dialogFull.Tips( res.errmsg );
			             return;
			        }
		            $.dialogFull.Tips( '删除成功！' );
		            self.parent().parent().parent().remove();
		        	dialogClose();
			    },
			    error: ()=>{
			        $.dialogFull.Tips( "网络错误，请稍后重试！" );
			    }
			})
        }
	});
})
