require('./Visitor.css');//引入css文件
import QRCode from '../kit/qrcode.js';
//{"sid":"xxx","ctime":"xxx","name":"xxx","age":"xxx","gender":"xxx","address":"xxx","official":"xxx","mobile":"xxx","visitor_content":"xxx","origin":"xxx","audit_time":"xxx","audit_status":"xxx"}
//{"data":{"page_num":1,"list":[{"address":"通州","gender":"男","origin":"市场活动","visitorContent":"","name":"bb","mobile":"1322222","official":"老王","ctime":"2017-09-28 10:00:00","visitorStatus":"登记状态","age":7,"sid":1}]},"errcode":"0","errmsg":"success"}
const tpl = {
	list:'<li>\
	<div class="item flex_2"><p><span>{ctime}</span></p></div>\
	<div class="item"><p><span>{name}</span></p></div>\
	<div class="item"><p><span>{birthday}</span></p></div>\
	<div class="item"><p><span>{gender}</span></p></div>\
	<div class="item flex_2"><p><span>{address}</span></p></div>\
	<div class="item flex_2"><p><span>{mobile}</span></p></div>\
	<div class="item"><p><span>{official}</span></p></div>\
	<div class="item flex_2"><p><span>{visitorContent}</span></p></div>\
	<div class="item"><p><span>{origin}</span></p></div>\
	<div class="item"><p><span>--</span></p></div>\
	<div class="item"><p><span>{audit_time}</span></p></div>\
	<div class="item"><p><span>{visitorStatus}</span></p></div>\
	<div class="item flex_2"><p><span>\
	<a href="JavaScript:;" data-href="/pss/goEditVisitor?sid={sid}&page={_page}">编辑</a>\
	|\
	<a href="JavaScript:;" data-href="/pss/goAddAudit?sid={sid}&page={_page}">试听</a><br />\
	<a href="JavaScript:;" class="toBeStudent" data-sid="{sid}">转正式</a>\
	|\
	<a href="JavaScript:;" data-href="/pss/goVisitorLog?sid={sid}&page={_page}">跟进反馈</a>\
	</span></p></div>\
	</li>'
}

const search_data = $('#data').val() ? $('#data').val().replace(/'/g, '"') : $('#data').val();

let getVisitorList = ()=>{
    let ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val(),
    }
    if( search_data ){
		ajaxData.data = search_data;
    }
    //列表 start 5.15
    $.jsonPage({
        listBox: 'ul.body',//列表容器
        ajaxUrl: '/pss/getVisitorList',
        ajaxType: 'post',
        ajaxData: ajaxData,//上行参数
        template: tpl.list,//列表模板
        listKey: ['data','list'],//下行结构
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
getVisitorList();

$.mainBox.on('click', '.toBeStudent', function(){
	const sid = $(this).data('sid');
	$.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/toBeStudent',
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

            $.dialogFull.Tips( '操作成功！' );
			//getVisitorList();

         	$.ajaxGetHtml({
         		url: '/pss/goStudentManage#goStudentManage'
         	})
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	});
}).on('change', '.inputFile', function(){
    $.dialogFull.Alert( "文件上传中，请勿刷新！" );
    let self = $(this);
    let formData = new FormData();//构造空对象，下面用append 方法赋值。
    formData.append("code", $('#zone_code').val());
    formData.append("zoneid", $('#zone_zoneid').val());
    formData.append("type", 'visitor');
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
            getVisitorList();
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
        url: '/pss/downVisitorList',
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
}).on('click', '#run_qrcode', function(){
    $.dialogFull.Pop({
        boxClass: '.dialog_run_qrcode',
        confirm: false,
        width: 647,
        height: 'auto',
        title: '校区咨询登记码',//弹框标题
        content: '<div class="dialog_qrcode_box">\
        <div class="words">\
        <em></em>\
        <h6>（本校区专属）线下招生二维码</h6>\
        <p>适用：校区各种线下宣传产品中嵌入使用，如地推宣传单等。</p>\
        <p>优点：友好采集用户信息，立体化传递形象，从而实现登记和预约跟进一体化。</p>\
        </div>\
        <div id="visitor_qrcode" class="visitor_qrcode"></div>\
        </div>',//弹框内容区
        showCallback: function($thisBox, $contentBox){
            let visitor_qrcode = new QRCode($("#visitor_qrcode")[0], {
              text: 'your content',
              width: 169,
              height: 169,
              colorDark : '#000000',
              colorLight : '#ffffff',
            });

            $.ajax({
                type: "post",
                dataType: "json",
                url: '/pss/getZoneVisitCode',
                data: {
                    code: $('#zone_code').val(),
                    zoneid: $('#zone_zoneid').val()
                },
                success: (res)=>{
                    if( res.errcode != 0 ){
                        $.dialogFull.Tips( res.errmsg );
                         return;
                    }
                    visitor_qrcode.makeCode(res.data.visit_code);
                },
                error: ()=>{
                    $.dialogFull.Tips( "网络错误，请稍后重试！" );
                }
            });
        }
    });
});
