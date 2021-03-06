require('./StudentPayment.css');
import loading from '../comp/loading.js';

const tpl = '<li>\
                <div class="item"><p><span>{time}</span></p></div>\
                <div class="item"><p><span>{money}</span></p></div>\
                <div class="item"><p><span>{lessons}</span></p></div>\
                <div class="item"><p><span>{off_lessons}</span></p></div>\
                <div class="item flex_3"><p><span>{notes}</span></p></div>\
                <div class="item"><p><span>\
                 <a href="JavaScript:;" class="delStudentPayRecord" data-time="{time}" data-money="{money}" data-lessons="{lessons}">删除</a>\
                 </span></p></div>\
            </li>';
const sid = $('#sid').val();

//缴费情况 start
let getStudentPaySum = ()=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getStudentPaySum',
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
            $('.paysum').html( res.data.paysum ? res.data.paysum + '元' : '0元' );
            $('.remain_lessons').html( res.data.remain_lessons ? res.data.remain_lessons + '节' : '0节' );
            $('.total_lessons').html( res.data.total_lessons ? res.data.total_lessons + '节' : '0节' );
            $('.expiretime').html( res.data.expiretime  );
        },
        error: ()=>{

        }
    });
}
getStudentPaySum();
//缴费情况 end



//获取学员缴费记录 start 5.49
let getStudentPayRecord = ()=>{
    $.jsonPage({
        listBox: 'ul.body',//列表容器
        ajaxUrl: '/pss/getStudentPayRecord',
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
//获取学员缴费记录 end
getStudentPayRecord();


//有效期，大于等于今天
$.laydate.render({
  elem: '#expiretime',
  min: 0
});

$.mainBox.on('click', '#submit', function(){
    let self = $(this)
    
    const sub_data = $.form.get({
          error_text: 'placeholder',//存放错误文案的属性名
    });
    if( !sub_data ){
      return;
    }
    const lessons = $('[name="lessons"]').val();
    const is_pass = ( /^-?[1-9]\d*$/ ).test( lessons );
    if( !is_pass ){
      $.dialogFull.Tips( '请输入购买课时数!' );
      return;
    }
    if( +lessons <= 0 && !sub_data.notes ){
      $.dialogFull.Tips( '购买课时数为负/零，请输入备注说明!' );
      return;
    }



    const off_lessons = $('[name="off_lessons"]').val() || '0';
    const is_pass_off = ( /^\d*$/ ).test( off_lessons );
    if( !is_pass_off ){
      $.dialogFull.Tips( '请输入正确核销课时数!(大于等于0)' );
      return;
    }
    if( +off_lessons > +lessons ){
      $.dialogFull.Tips( '核销课时数不得大于购买课时数!' );
      return;
    }




  
    let ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val(),
        sid: sid,
        money: +sub_data.money,
        lessons: +lessons,
        off_lessons: +off_lessons,
        expiretime: $( '#expiretime' ).val() || undefined,
        notes: sub_data.notes
    }
    if( loading({element: self,handClose: true}) ){
      return;
    }
    $.form.submit({
        url: '/pss/studentPayment',
        data: ajaxData,
        success: (res) => {
            if( res.errcode != 0 ){
              $.dialogFull.Tips( res.errmsg );
              return;
            }
            loading({element: self,setClose: true});
            $.dialogFull.Tips( "提交成功！" );
            $.ajaxGetHtml({
              url: res.data.url
            })
        },
        error: function(){
          loading({element: self,setClose: true});
          $.dialogFull.Tips( "网络错误，请稍后重试" );
        }
    });
}).on('click', '.delStudentPayRecord', function(){
    const money = $(this).data('money');
    const time = $(this).data('time');
    const lessons = $(this).data('lessons');
    $.dialogFull.Pop({
        boxClass: '.delStudentPayRecordPop',
        width: 400,
        height: 'auto',
        title: '提示',//弹框标题
        content: '确定删除该条记录？',//弹框内容区
        runDone: function($this, $thisBox, dialogClose) {
            $.ajax({
                type: "post",
                dataType: "json",
                url: '/pss/delStudentPayRecord',
                data: {
                    code: $('#zone_code').val(),
                    zoneid: $('#zone_zoneid').val(),
                    sid: sid,
                    money: money,
                    time: time,
                    lessons: lessons
                },
                success: (res)=>{
                    if( res.errcode != 0 ){
                        $.dialogFull.Tips( res.errmsg );
                         return;
                    }
                    $.dialogFull.Tips( "操作成功！" );
                    getStudentPayRecord();
                    dialogClose();
                },
                error: ()=>{
                    $.dialogFull.Tips( "网络错误，请稍后重试！" );
                }
            })  
        },
        runClose: function($this, $thisBox, dialogClose) {
        }
    });

})
