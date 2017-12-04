	require('./ClassInfo.css');//引入css文件
import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎

const tpl = {
	//{"errcode":0,"errmsg":"success","data":{"class_name":"xxx","teacher":"xxx","start_time":"xxx","reserve_num":"xxx","students_num":"xxx","students":[{"sid":"xxx","name":"xxx"},...]}
	info: '<span>上课时间<em>{start_time}</em></span><span>预招人数<em>{reserve_num}</em></span><span>实际学员人数<em>{students_num}</em></span><span>讲师<em>{teacher}</em></span>',
	//{"lesson_id":"xxx","theme":"xxx","lesson_status":"xxx"}
	list: '<li class="li_status_{lesson_status}" data-lessonid="{lesson_id}">\
			<a href="javascript:;" data-{href}="/pss/goLessonOperate?classid={class_id}&lessonid={lesson_id}">\
			<div class="info">\
			<em class="status_{lesson_status}"></em>\
			<h6>{theme}</h6>\
			<p>{words}</p>\
			</div>\
			<div class="arrow"><div>\
			</div></div></a></li>',
	span: '<span>{sid}:{student_name}</span>',
};
const classid = $('#classid').val();

let getClassLessonsList = (sid)=>{
	// start 3.21
	$.jsonPage({
	    listBox: '.class_list',//列表容器
	    ajaxUrl: '/pss/getClassLessonsList',
	    ajaxType: 'post',
	    ajaxData: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        classid: classid,
	        sid: sid     	
	    },//上行参数
	    template: tpl.list,//列表模板
	    listKey: ['data'],//下行结构
	    pageBar: false,//是否启用分页
	    eachDataHandle: function(msg,pageNum,pageSize){
	        const words = {
	            '0': '已经上过',
	            '1': '马上要上',
	            '2': '以后上',
	            '3': '缺课',
	        }
	        msg.words = words[msg.lesson_status];
			msg.class_id = classid;
			msg.href = msg.lesson_status == 0 ? 'null' : 'href';



	        return msg;
	    },
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
			let select = '<select id="students">';
			res.data.students.map(function(item){
			    select += '<option value="' + item.sid + '">' + item.name + '</option>'
			});
			select += '</select>';

	        const html = replaceTemplate( tpl.info, res.data );
	        $('.run').html( select + html );
	        $('.page_head h3').text(res.data.class_name);
	        getClassLessonsList();
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
getZoneSummary();





$.mainBox.on('change', '#students', function(){
	const sid = $(this).val();
    getClassLessonsList(sid);
}).on('click', '.li_status_0, .li_status_3', function(){
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
})
