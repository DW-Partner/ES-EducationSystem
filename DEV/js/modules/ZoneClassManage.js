require('./ZoneClassManage.css');//引入css文件
import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎

const tpl = {
    info: '<span>今日开课班级 {classes}个</span> <span>今日授课教师 {teachers}个</span> <span>今日正式学员 {students}人</span> <span>今日试听学员 {audits}人</span>',
    list: '<li>\
        <div class="item"><p><span>{class_name}</span></p></div>\
        <div class="item"><p><span>{start_time}</span></p></div>\
        <div class="item"><p><span>{teacher_name}({name_2})</span></p></div>\
        <div class="item"><p><span>{students}</span></p></div>\
        <div class="item"><p><span class="audits" data-classid="{class_id}">{audits}</span></p></div>\
        <div class="item"><p><span>\
        <a href="JavaScript:;" data-href="/pss/goClassInfo?classid={class_id}">查看</a>\
        <a href="JavaScript:;" data-href="/pss/goEditClass?classid={class_id}">更新班级</a>\
        <a href="JavaScript:;" class="deleteClass {del}" data-classid="{class_id}">删除班级</a>\
        </span></p></div>\
        </li>',
};

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
            $('.page_head').prepend( html );
        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
}
//getZoneSummary();

//{"data":[{"start_time":"2017-10-10","teacher_name":"赵正","class_id":1,"students":1,"class_name":"初级","audits":0},{"start_time":"2017-11-01","teacher_name":"keke","class_id":2,"students":1,"class_name":"中级","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":3,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":4,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":5,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":6,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":7,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":8,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":9,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":10,"students":0,"class_name":"newnew","audits":0}],"errcode":"0","errmsg":"success"}
// start 3.21
let getZoneClassesList = ()=>{
    $.jsonPage({
        listBox: 'ul.body',//列表容器
        ajaxUrl: '/pss/getZoneClassesList',
        ajaxType: 'post',
        ajaxData: {
            code: $('#zone_code').val(),
            zoneid: $('#zone_zoneid').val(),
            status: 'pending'
        },//上行参数
        template: tpl.list,//列表模板
        listKey: ['data'],//下行结构
        pageBar: false,//是否启用分页
        eachTemplateHandle: false,//Function : function(msg,pageNum,pageSize){ return msg }
        eachDataHandle: function(item,pageNum,pageSize){
            item.del = item.students == 0 && item.audits == 0 ? '' : 'none';
            return item;
        },
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
}
//获取教案列表 end
getZoneClassesList();

let getClassAuditList = (classid)=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getClassAuditList',
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
            $.ajaxGetHtml({
                url: '/pss/goVisitor#goVisitor',
                data: {
                    page: 0,
                    data: JSON.stringify( {sids: res.data} ).replace(/\"/g,"'")
                }
            })
        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
}



let deleteClass = (classid)=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/deleteClass',
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
            $.dialogFull.Tips( "操作成功" );
            getZoneClassesList();
        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
}


$.mainBox.on('click', '.audits', function(){
    const num = +$(this).text();
    const classid = $(this).data('classid');
    num && getClassAuditList( classid );
}).on('click', '.deleteClass', function(){
    const classid = $(this).data('classid');
    deleteClass( classid );
})

