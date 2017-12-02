	require('./StudentManage.css');//引入css文件
	import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎

	const tpl = {
		info: '<span>今日开课班级 {classes}个</span> <span>今日授课教师 {teachers}个</span> <span>今日正式学员 {students}人</span> <span>今日试听学员 {audits}人</span>',

//{"sid":"xxx","ctime":"xxx","name":"xxx","class_id":""class_name","age":"xxx","gender":"xxx","address":"xxx","official":"xxx","mobile":"xxx","origin":"xxx","remaining_lesson":"xxx"}
		list: '<li>\
		<div class="item flex_2"><p><span>{ctime}</span></p></div>\
		<div class="item"><p><span>{name}</span></p></div>\
		<div class="item"><p><span>{class_name}</span></p></div>\
		<div class="item"><p><span>{age}</span></p></div>\
		<div class="item"><p><span>{gender}</span></p></div>\
		<div class="item flex_2"><p><span>{address}</span></p></div>\
		<div class="item flex_2"><p><span>{mobile}</span></p></div>\
		<div class="item"><p><span>{origin}</span></p></div>\
		<div class="item"><p><span>{remaining_lesson}</span></p></div>\
		</li>',
	};




//{"data":[{"start_time":"2017-10-10","teacher_name":"赵正","class_id":1,"students":1,"class_name":"初级","audits":0},{"start_time":"2017-11-01","teacher_name":"keke","class_id":2,"students":1,"class_name":"中级","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":3,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":4,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":5,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":6,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":7,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":8,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":9,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":10,"students":0,"class_name":"newnew","audits":0}],"errcode":"0","errmsg":"success"}
// start 3.21
$.jsonPage({
    listBox: 'ul.body',//列表容器
    ajaxUrl: '/pss/getStudentsList',
    ajaxType: 'post',
    ajaxData: {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val(),
        page:0      	
    },//上行参数
    template: tpl.list,//列表模板
    listKey: ['data','list'],//下行结构
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
//获取教案列表 end