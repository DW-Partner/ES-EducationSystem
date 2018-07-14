require('./StudentPrintSituation.css');
import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎

const search_data = $('#data').val() ? $('#data').val().replace(/'/g, '"') : $('#data').val();
const sid = $( '#sid' ).val();
const sname = $( '#sname' ).val();

const tpl = {
	list: '<li>\
	<div class="item"><p><span>{theme}</span></p></div>\
	<div class="item"><p><span>{lesson_time}</span></p></div>\
	<div class="item flex_2"><p><span>{class_name}</span></p></div>\
    <div class="item"><p><span>{status}</span></p></div>\
    <div class="item"><p><span>{tname}</span></p></div>\
    <div class="item"><p><span>\
	<a href="JavaScript:;" data-href="/pss/goStudentLessonReport?classid={class_id}&lessonid={lesson_id}&sid={sid}&page={page}&data={data}" class="btn">查看教师反馈</a>\
    </span></p></div>\
	</li>',
	summary: '<span>总课时数：${total_lessons}</span>\
	<span>剩余课时数${remain_lessons}</span>\
	<span>签到数${sign_lessons}</span>\
	<span>未签到数${unsign_lessons}</span>\
	<span>请假数：${leave_lessons}</span>\
	<span>缺勤数：${absence_lessons}</span>\
	<span>取消课时数：${cancel_lessons}</span>\
	<span>有效期：${expiretime}</span>',
	classList: '<span>{class_name}</span>'
};

$( '.page_head h3' ).val( `${sname}——学员印记` );

let getStudentPrintSummary = ()=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getStudentPrintSummary',
        data: {
            code: $('#zone_code').val(),
            zoneid: $('#zone_zoneid').val(),
            sid: sid,
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                 return;
            }
            let summary = replaceTemplate( tpl.summary, item );
            $( '#summary' ).html( summary );
        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
}
getStudentPrintSummary();


let getStudentClasseListInZone = ()=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getStudentClasseListInZone',
        data: {
            code: $('#zone_code').val(),
            zoneid: $('#zone_zoneid').val(),
            sid: sid,
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                 return;
            }
            let classList = replaceTemplate( tpl.classList, item );
            $( '#classList' ).html( classList );
        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
}
getStudentClasseListInZone();

let getStudentPrintList = ()=>{

    let ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val(),
        data: search_data || undefined
    }

    $.jsonPage({
        listBox: 'ul.body',//列表容器
        ajaxUrl: '/pss/getStudentPrintList',
        ajaxType: 'post',
        ajaxData: ajaxData,//上行参数
        template: tpl.list,//列表模板
        listKey: ['data','list'],//下行结构
        pageBar: true,//是否启用分页
        eachTemplateHandle: false,//Function : function(msg,pageNum,pageSize){ return msg }
        noData: false,//Function : function( $listBox, $pageBox ){}
        codeKeyName: 'errcode',//状态标示key名
        codeSuccess: 0,//状态标示值
        eachTemplateHandle: false,//Function : function(msg,pageNum,pageSize){ return msg }
        eachDataHandle: function(item,pageNum,pageSize){
            return item;
        },
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
getStudentPrintList();