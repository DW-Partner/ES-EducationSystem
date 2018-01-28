require('./AddOrEditStudent.css');//引入css文件

import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
const form_tpl = '<li>\
                <span><i>*</i>姓名</span>\
                <input type="text" class="short" value="{name}" placeholder="请输入姓名" name="name" data-validate="any" data-must="1" />\
            </li>\
            <li>\
                <span>出生日期</span>\
                <input type="text" id="birthday" class="short" value="{birthday}" placeholder="请输入出生日期" name="birthday" data-validate="any" />\
            </li>\
            <li>\
                <span>性别</span>\
                <select name="gender" data-validate="any" placeholder="请选择性别">\
                    <option value="">请选择</option>\
                    <option value="男">男</option>\
                    <option value="女">女</option>\
                </select>\
            </li>\
            <li>\
                <span>住址</span>\
                <input type="text" class="long" value="{address}" placeholder="请输入住址" name="address" data-validate="any" />\
            </li>\
            <li>\
                <span>电话</span>\
                <input type="text" class="short" value="{mobile}" placeholder="请输入电话" name="mobile" data-validate="mobile" />\
            </li>\
            <li>\
                <span>家长姓名</span>\
                <input type="text" class="short" value="{official}" placeholder="请输入家长姓名" name="official" data-validate="any" />\
            </li>\
            <li>\
                <span class="wide">与学员关系</span>\
                <input type="text" class="short" value="{relation}" placeholder="请输入与学员关系" name="relation" data-validate="any"/>\
            </li>\
            <li>\
                <span>来源</span>\
                <select name="origin" data-validate="any">\
                    <option value="">请选择</option>\
                    <option value="市场活动">市场活动</option>\
                    <option value="主动咨询">主动咨询</option>\
                    <option value="熟人介绍">熟人介绍</option>\
                    <option value="其他途径">其他途径</option>\
                </select>\
            </li>';

const sid = $('#sid').val();
const page = $('#page').val();
if( sid ){
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getVisitorDetail',
        data: {
            code: $('#zone_code').val(),
            zoneid: $('#zone_zoneid').val(),
            sid: sid,
            page: +$('#page').val() || 0
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                 return;
            }
            const html = replaceTemplate( form_tpl, res.data );
            $('.pub_form ul').html( html );
            $('[name=origin]').val( res.data.origin || '' );
            $('[name=gender]').val( res.data.gender || '' );
            //常规用法
            $.laydate.render({
              elem: '#birthday'
            });
        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
}else{
    const html = replaceTemplate( form_tpl, {} );
    $('.pub_form ul').html( html );
    //常规用法
    $.laydate.render({
      elem: '#birthday'
    });
}

$.mainBox.on('click', '#submit_AddOrEdit', ()=>{
    const sub_data = $.form.get({
        error_text: 'placeholder',//存放错误文案的属性名
        get_empty: false
    });
    if( !sub_data ){
        return;
    }
    if( sub_data.age ){
        sub_data.age = +sub_data.age;
    }
    let ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val(),
        data: JSON.stringify( sub_data ),
        sid: sid || undefined,
        page: page || 0
    }

    $.form.submit({
        url: sid ? '/pss/editStudent' : '/pss/addStudent',
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
})
