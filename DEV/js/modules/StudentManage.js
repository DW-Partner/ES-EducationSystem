    require('./StudentManage.css');//引入css文件
    import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎

    const tpl = {
        info: '<span>今日开课班级 {classes}个</span> <span>今日授课教师 {teachers}个</span> <span>今日正式学员 {students}人</span> <span>今日试听学员 {audits}人</span>',

//{"sid":"xxx","ctime":"xxx","name":"xxx","class_id":""class_name","age":"xxx","gender":"xxx","address":"xxx","official":"xxx","mobile":"xxx","origin":"xxx","remaining_lesson":"xxx"}
        // <div class="item"><p><span>{origin}</span></p></div>\
        // <div class="item flex_2"><p><span>{address}</span></p></div>\

        list: '<li>\
        <div class="item"><p><span>{ctime}</span></p></div>\
        <div class="item"><p><span>{isbinding}{name}</span></p></div>\
        <div class="item flex_3 class_name_list"><p><span class="class_name_list_b">\
        {class_name_list_DEL}\
        <select id="select_{sid}" class="{select_show}">{class_name_option}</select>\
        </span></p></div>\
        <div class="item"><p><span>{birthday}</span></p></div>\
        <div class="item"><p><span>{gender}</span></p></div>\
        <div class="item flex_2"><p><span>{mobile}</span></p></div>\
        <div class="item"><p><span>{remaining_lesson}</span></p></div>\
        <div class="item"><p><span>{expiretimeShow}</span></p></div>\
        <div class="item flex_2"><p><span>\
            <a href="JavaScript:;" data-href="/pss/goEditStudent?sid={sid}&page={_page}">编辑</a>\
            |\
            <a href="JavaScript:;"  data-href="/pss/goStudentPrintSituation?sid={sid}&page={_page}&data={_data}">综合学情</a>\
            <br />\
            <a href="JavaScript:;" data-href="/pss/goSendToStudent?sid={sid}&page={_page}">发送通知</a>\
            |\
            <a href="JavaScript:;" data-href="/pss/goStudentPayment?sid={sid}">缴续费</a>\
            <br />\
            <a href="JavaScript:;" data-href="/pss/goJoinToClass?sid={sid}&page={_page}" data-sid="{sid}">加入班级</a>\
            <em class="none{class_id}">|</em>\
            <a href="JavaScript:;" class="none{class_id} exitFromClass" data-sid={sid} data-page={_page}">退出班级</a>\
            \
            <a href="JavaScript:;" class="{isGraduate} runGraduate" data-sid={sid} data-page={_page}">毕业</a>\
            \
            <br />\
            <a href="JavaScript:;" class="none{class_id} linkClass" data-sid={sid} data-page={_page}">学员课表</a>\
            <em class="none{class_id}">|</em>\
            <a href="JavaScript:;" data-href="/pss/goStudentQrcode?sid={sid}&page={_page}">生成二维码</a><br />\
        </span></p></div>\
        </li>',
    };


const search_data = $('#data').val() ? $('#data').val().replace(/'/g, '"') : $('#data').val();
let onDelClass;
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
        eachTemplateHandle: false,//Function : function(msg,pageNum,pageSize){ return msg }
        eachDataHandle: function(item,pageNum,pageSize){
            item.isbinding = item.isbinding == 'yes' ? '<em class="isbinding"></em>' : '';
            item.ctime = item.ctime.split( ' ' )[0];


            item.isGraduate = item.class_id ? 'none' : '';

            const class_id_arr = item.class_id ? item.class_id.toString().split( ',' ) : [];
            // class_id_arr.shift();

            const class_name_arr = item.class_name ? item.class_name.split( ',' ) : [];


            item.class_name_list = class_id_arr.map((_item,_index)=>{
                return `<a href="JavaScript:;" data-href="/pss/goStudentArchive?sid=${item.sid}&classid=${_item}&page=${item._page}">${class_name_arr[_index]}</a>`;
            }).join('');

            item.class_name_list = class_id_arr.length>1 ? '<b></b>' + item.class_name_list : item.class_name_list;

            item.select_show = !class_id_arr.length ? 'none' : '';

            item.class_name_option = class_id_arr.map((_item,_index)=>{
                return class_name_arr[_index] ? `<option value="${_item}">${class_name_arr[_index]}</option>` : '';
            }).join('');

            //item.class_id = item.class_id ? item.class_id.split( ',' )[ 0 ] : '';

            if( item.expiretime ){
                const times = ( new Date( item.expiretime ) ).getTime() - ( new Date() ).getTime();
                item.expiretimeShow =  times / 24  / 3600 / 1000 < 31 ? `<em class="warn">${item.expiretime}</em>` : item.expiretime;                
            }
            item._data = encodeURIComponent( $('#data').val() || '' );
            return item;
        },
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

let exitFromClass_DEL = ( sid, classIds, classNames )=>{
    let self = $( this );
    let class_name_arr = classNames.split(',');
    let _list = classIds.split(',').map((_item,_index)=>{
        return `<span class="classItem" data-classid="${_item}">${class_name_arr[_index]}</span>`;
    }).join('');
    _list = '<p>请选择要退出班级：</p>' + _list;
    $.dialogFull.Pop({
        boxClass: '.exitFromClasspPop',
        width: 700,
        height: 'auto',
        title: '提示',//弹框标题
        content: _list,//弹框内容区
        showCallback: function($thisBox, $contentBox){
            onDelClass = false;
            $thisBox.on('click', '.classItem', function(){
                $(this).addClass( 'on' ).siblings('.on').removeClass( 'on' );
                onDelClass = $(this).data( 'classid' );
            })
        },
        runDone: function($this, $thisBox, dialogClose) {
            $.ajax({
                type: "post",
                dataType: "json",
                url: '/pss/exitFromClass',
                data: {
                    code: $('#zone_code').val(),
                    zoneid: $('#zone_zoneid').val(),
                    sid: sid,
                    classid: onDelClass,
                    page: +$('#page').val()
                },
                success: (res)=>{
                    if( res.errcode != 0 ){
                        $.dialogFull.Tips( res.errmsg );
                         return;
                    }
                    $.dialogFull.Tips( "提交成功！" );
                    dialogClose();
                    $.ajaxGetHtml({
                        url: res.data.url,
                    })
                },
                error: ()=>{
                    $.dialogFull.Tips( "网络错误，请稍后重试！" );
                }
            })  
        },
        runClose: function($this, $thisBox, dialogClose) {
        }
    });
}


let exitFromClass = ( sid, classId, className, page )=>{
    $.dialogFull.Pop({
        boxClass: '.exitFromClasspPop',
        width: 400,
        height: 'auto',
        title: '提示',//弹框标题
        content: `确定退出“${className}”?`,//弹框内容区
        showCallback: function($thisBox, $contentBox){
            onDelClass = false;
            $thisBox.on('click', '.classItem', function(){
                $(this).addClass( 'on' ).siblings('.on').removeClass( 'on' );
                onDelClass = $(this).data( 'classid' );
            })
        },
        runDone: function($this, $thisBox, dialogClose) {
            $.ajax({
                type: "post",
                dataType: "json",
                url: '/pss/exitFromClass',
                data: {
                    code: $('#zone_code').val(),
                    zoneid: $('#zone_zoneid').val(),
                    sid: sid,
                    classid: classId,
                    page: page
                },
                success: (res)=>{
                    if( res.errcode != 0 ){
                        $.dialogFull.Tips( res.errmsg );
                         return;
                    }
                    $.dialogFull.Tips( "提交成功！" );
                    dialogClose();
                    getStudentsList();
                },
                error: ()=>{
                    $.dialogFull.Tips( "网络错误，请稍后重试！" );
                }
            })  
        },
        runClose: function($this, $thisBox, dialogClose) {
        }
    });
}


let linkClass_DEL = ( sid, classIds, classNames )=>{
    let self = $( this );
    let class_name_arr = classNames.split(',');
    let _list = classIds.split(',').map((_item,_index)=>{
        return `<a href="JavaScript:;" class="classItem dialogFullClose" data-href="/pss/goClassInfo?classid=${_item}">${class_name_arr[_index]}</a>`;
    }).join('');
    _list = '<p>请选择班级：</p>' + _list;
    $.dialogFull.Pop({
        boxClass: '.linkClassPop',
        width: 700,
        height: 'auto',
        title: '提示',//弹框标题
        content: _list,//弹框内容区
        showCallback: function($thisBox, $contentBox){
            onDelClass = false;
            $thisBox.on('click', '.classItem', function(){
                const href = $(this).data('href');
                $.ajaxGetHtml({
                    url: href + '#goZoneClassManage'
                });
            })
        }
    });  
}

$.mainBox.on('click', '.exitFromClass_DEL', function(){
    const sid = $(this).data('sid');
    const classIds = $(this).data('classid').toString();
    const classNames = $(this).data('classname');
    exitFromClass( sid, classIds, classNames );
}).on('click', '.exitFromClass', function(){
    let self = $( this );
    const sid = self.data('sid');
    const page = self.data( 'page' );
    const class_id = $( `#select_${sid}` ).val();
    const class_name =  $( `#select_${sid} option:checked` ).text();
    exitFromClass( sid, class_id, class_name, page );
}).on('click', '.linkClass_DEL', function(){
    const sid = $(this).data('sid');
    const classIds = $(this).data('classid').toString();
    const classNames = $(this).data('classname');
    linkClass( sid, classIds, classNames );
}).on('click', '.linkClass', function(){
    let self = $( this );
    const sid = self.data('sid');
    const page = self.data( 'page' );
    const class_id = $( `#select_${sid}` ).val();
    const class_name =  $( `#select_${sid} option:checked` ).text();

    $.ajaxGetHtml({
      url: `/pss/goClassInfo?sid=${sid}&classid=${class_id}&classname=${class_name}&page=${page}#goZoneClassManage`
    })

}).on('click', '.runGraduate', function(){
    let self = $( this );
    const sid = self.data('sid');
    const page = self.data( 'page' );

    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/toBeGraduate',
        data: {
            code: $('#zone_code').val(),
            zoneid: $('#zone_zoneid').val(),
            sid: sid,
            page: page
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                 return;
            }
            $.dialogFull.Tips( "操作成功！" );
            $.ajaxGetHtml({
                url: res.data.url
              //url: `/pss/goClassInfo?sid=${sid}&classid=${class_id}&classname=${class_name}&page=${page}#goZoneClassManage`
            })
        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })

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
}).on('click', '#exportData', function(){
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/downStudentsList',
        data: {
            code: $('#zone_code').val(),
            zoneid: $('#zone_zoneid').val(),
            data: search_data || undefined
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                 return;
            }
            window.location.href = res.data.url;
        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    });
}).on('click', '.class_name_list_b b', function(){
    let self = $(this);
    let parent = self.parent();
    if( parent.hasClass( 'list' ) ){
        parent.removeClass( 'list' );
    }else{
        parent.addClass( 'list' );

    }
});

