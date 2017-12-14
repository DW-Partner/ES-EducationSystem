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
        <div class="item flex_2"><p><span>\
            <a href="JavaScript:;" data-href="/pss/goEditStudent?sid={sid}&page={_page}">编辑</a>\
            |\
            <a href="JavaScript:;" data-href="/pss/goStudentQrcode?sid={sid}&page={_page}">生成二维码</a><br />\
            <a href="JavaScript:;" data-href="/pss/goSendToStudent?sid={sid}&page={_page}">发送通知</a>\
            |\
            <a href="JavaScript:;" data-href="/pss/goJoinToClass?sid={sid}&page={_page}&classid={class_id}" data-sid="{sid}">加入班级</a><br />\
            <a href="JavaScript:;" class="none{class_id} exitFromClass" data-sid={sid} data-classid={class_id}>退出班级</a><br />\
            <a href="JavaScript:;" data-href="/pss/goStudentPayment?sid={sid}">缴续费</a>\
        </span></p></div>\
		</li>',
	};


const search_data = $('#data').val() ? $('#data').val().replace(/'/g, '"') : $('#data').val();

let getStudentsList = ()=>{
    let ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val(),
        data: search_data || undefined
    }

    //{"data":[{"start_time":"2017-10-10","teacher_name":"赵正","class_id":1,"students":1,"class_name":"初级","audits":0},{"start_time":"2017-11-01","teacher_name":"keke","class_id":2,"students":1,"class_name":"中级","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":3,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":4,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":5,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":6,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":7,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":8,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":9,"students":0,"class_name":"newnew","audits":0},{"start_time":"2017-10-23 16:00:00","teacher_name":"keke","class_id":10,"students":0,"class_name":"newnew","audits":0}],"errcode":"0","errmsg":"success"}
    // start 3.21
    $.jsonPage({
        listBox: 'ul.body',//列表容器
        ajaxUrl: '/pss/getStudentsList',
        ajaxType: 'post',
        ajaxData: ajaxData,//上行参数
        template: tpl.list,//列表模板
        listKey: ['data','list'],//下行结构
        pageBar: true,//是否启用分页
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
        },
        gotoIndex: +$('#page').val()

    });
    //获取教案列表 end
}
getStudentsList();


let exitFromClass = (sid,classid)=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/exitFromClass',
        data: {
            code: $('#zone_code').val(),
            zoneid: $('#zone_zoneid').val(),
            sid: sid,
            classid: classid,
            page: +$('#page').val()
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                 return;
            }
            $.dialogFull.Tips( "提交成功！" );
            $.ajaxGetHtml({
                url: res.data.url,
            })
        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })    
}

$.mainBox.on('click', '.exitFromClass', function(){
    const sid = $(this).data('sid');
    const classid = $(this).data('classid');
    exitFromClass(sid,classid);
}).on('change', '.inputFile', function(){

    $.dialogFull.Alert( "文件上传中，请勿刷新！" );

    let self = $(this);

    let formData = new FormData();//构造空对象，下面用append 方法赋值。
    formData.append("code", $('#zone_code').val());
    formData.append("zoneid", $('#zone_zoneid').val());
    formData.append("type", 'student');

    formData.append("file", self[0].files[0]);
    $.ajax({
        type: 'post',
        cache: false,
        url: '/pss/uploadStudentList',
        data: formData,
        processData : false,
        contentType : false,
        mimeType: "multipart/form-data",
        dataType: 'json',
        success: function(res) {
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                 return;
            }
            self.after( self.clone().val("") );
            self.remove();
            $.dialogFull.Alert({
                content: "操作成功！" ,
                clear: true
            })
            getStudentsList();
        },
        error: function(){
            $.dialogFull.Alert({
                content: "网络错误，请刷新页面或稍后重试" ,
                clear: true
            })
        }
    });
});