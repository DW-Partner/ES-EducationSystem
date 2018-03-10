require('./AddAudit.css');//引入css文件

import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎

const tpl = {
    class_option: '<option value="{class_id}">{class_name}</option>',
    lesson_option: '<option value="{lesson_id}" data-time="{lesson_time}">{lesson_time}&nbsp;&nbsp;&nbsp;&nbsp;{theme}</option>',
    auditRecord: '<li>\
                <div class="item"><p><span>{zone}</span></p></div>\
                <div class="item"><p><span>{class}</span></p></div>\
                <div class="item"><p><span>{course}</span></p></div>\
                <div class="item"><p><span>{theme}</span></p></div>\
                <div class="item"><p><span>{time}</span></p></div>\
                <div class="item flex_3"><p><span>{result}</span></p></div>\
            </li>'
}

const sid = $('#sid').val();
const page = $('#page').val();




let getAuditInfo = ()=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getAuditInfo',
        data: {
            code: $('#zone_code').val(),
            zoneid: $('#zone_zoneid').val(),
            sid: sid
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                 return;
            }
            if( res.data.class_id ){
                //"data":{"class_id":"xxx","class_name":"xxx","lesson_id":"xxx","lesson_name":"xxx"}

                let option_1 = replaceTemplate( tpl.class_option, res.data );
                $('[name=class_id]').html( option_1 ).val( res.data.class_id ).attr('disabled', 'disabled');

                let option_2 = replaceTemplate( '<option value="{lesson_id}">{lesson_name}</option>', res.data );
                $('[name=lesson_id]').html( option_2 ).val( res.data.lesson_id ).attr('disabled', 'disabled');
                $('#submit').html('删除试听').attr('id','submit_del');

            }else{
                getAuditLessonList();
            }
        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
}
getAuditInfo();



// /pss/getAuditLessonList?code=x&zoneid=x

//{"class_id":1,"class_name":"初级绘画班","lessons":[{"lesson_id":1,"theme":"主题1"}]}
let option_data;
let getAuditLessonList = ()=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getAuditLessonList',
        data: {
            code: $('#zone_code').val(),
            zoneid: $('#zone_zoneid').val()
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                 return;
            }
            option_data = res.data;

            let option_1 = '';
            option_data.map(function(_class){
                option_1 += replaceTemplate( tpl.class_option, _class );
            })

            $('[name=class_id]').html( option_1 );

            if( !option_data[0] || !option_data[0].lessons ){
                return;
            }

            let option_2 = '';
            let lesson_time = '';
            option_data[0].lessons.map(function( lesson, i ){
                // if( i==0 ){
                //     lesson_time = lesson.lesson_time;
                // }
                option_2 += replaceTemplate( tpl.lesson_option, lesson );
            })
            $('[name=lesson_id]').html( option_2 );
            //$('[name=lesson_id]').siblings('span').remove();
            //$('[name=lesson_id]').parent().append( '<span>(上课时间：' + lesson_time + ')</span>' );
        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
}

let getVisitorDetail = ()=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getVisitorDetail',
        data: {
            code: $('#zone_code').val(),
            zoneid: $('#zone_zoneid').val(),
            sid: sid,
            page: +$('#page').val() || 1
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                 return;
            }
            $('.pub_form ul em').html( res.data.name );
        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })  
}
getVisitorDetail();




//获取学员试听记录 start 5.50
let getAuditRecord = ()=>{
    $.jsonPage({
        listBox: 'ul.body',//列表容器
        ajaxUrl: '/pss/getAuditRecord',
        ajaxType: 'post',
        ajaxData: {
            code: $('#zone_code').val(),
            zoneid: $('#zone_zoneid').val(),
            sid: sid
        },//上行参数
        template: tpl,//列表模板
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
}
//获取学员试听记录 end
getAuditRecord();


$.mainBox.on('change', '[name=class_id]', function(){
    const val = $(this).val();
    const li = $(this).parent();
    option_data.map(function( item ){
        if( val == item.class_id ){
            let option_2 = '';
            let lesson_time = ''
            item.lessons.map(function( lesson, i ){
                if( i==0 ){
                    lesson_time = lesson.lesson_time
                }
                option_2 += replaceTemplate( tpl.lesson_option, lesson );
            })
            $('[name=lesson_id]').html( option_2 );
            // li.find('span').remove();
            // li.append( '<span>(上课时间：' + lesson_time + ')</span>' );
        }
    })

}).on('change', '[name=lesson_id111]', function(){
    const li = $(this).parent();
    const lesson_time = $(this).find('option:checked').data('time');
    // li.find('span').remove();
    // li.append( '<span>(上课时间：' + lesson_time + ')</span>' );
}).on('click', '#submit', function(){
    const sub_data = $.form.get();
    if( !sub_data ){
        return;
    }
    sub_data.class_id = +sub_data.class_id;
    sub_data.lesson_id = +sub_data.lesson_id;
    let ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val(),
        data: JSON.stringify( sub_data ),
        sid: sid,
        page: page ? page : 0
    }
    $.form.submit({
        url: '/pss/addAudit',
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
}).on('click', '#submit_del', function(){

    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/deleteAudit',
        data: {
            code: $('#zone_code').val(),
            zoneid: $('#zone_zoneid').val(),
            sid: sid
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                 return;
            }
            //"data":{"class_id":"xxx","class_name":"xxx","lesson_id":"xxx","lesson_name":"xxx"}

            $('[name=class_id]').removeAttr('disabled');

            $('[name=lesson_id]').removeAttr('disabled');
            $('#submit_del').html('提交').attr('id','submit');

            getAuditLessonList();
        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
})
