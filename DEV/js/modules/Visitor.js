require('./Visitor.css');//引入css文件

//{"sid":"xxx","ctime":"xxx","name":"xxx","age":"xxx","gender":"xxx","address":"xxx","official":"xxx","mobile":"xxx","visitor_content":"xxx","origin":"xxx","audit_time":"xxx","audit_status":"xxx"}
//{"data":{"page_num":1,"list":[{"address":"通州","gender":"男","origin":"市场活动","visitorContent":"","name":"bb","mobile":"1322222","official":"老王","ctime":"2017-09-28 10:00:00","visitorStatus":"登记状态","age":7,"sid":1}]},"errcode":"0","errmsg":"success"}
const tpl = {
	list:'<li>\
	<div class="item flex_2"><p><span>{ctime}</span></p></div>\
	<div class="item"><p><span>{name}</span></p></div>\
	<div class="item"><p><span>{age}</span></p></div>\
	<div class="item"><p><span>{gender}</span></p></div>\
	<div class="item flex_2"><p><span>{address}</span></p></div>\
	<div class="item flex_2"><p><span>{mobile}</span></p></div>\
	<div class="item"><p><span>{official}</span></p></div>\
	<div class="item flex_2"><p><span>{visitorContent}</span></p></div>\
	<div class="item"><p><span>{origin}</span></p></div>\
	<div class="item"><p><span>--</span></p></div>\
	<div class="item"><p><span>--</span></p></div>\
	<div class="item"><p><span>{visitorStatus}</span></p></div>\
	<div class="item"><p><span>\
	<a href="JavaScript:;" data-href="/pss/goEditVisitor?sid={sid}">编辑</a><br />\
	<a href="JavaScript:;" data-href="/pss/goAddAudit?sid={sid}&page=0">试听</a><br />\
	<a href="JavaScript:;" class="toBeStudent" data-sid="{sid}">转正式</a></span></p></div>\
	</li>'
}

let getVisitorList = (data)=>{
    let ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val(),
    }
    if( data ){
		ajaxData.data = JSON.stringify( data );
    }
    //列表 start 5.15
    $.jsonPage({
        listBox: 'ul.body',//列表容器
        ajaxUrl: '/pss/getVisitorList',
        ajaxType: 'post',
        ajaxData: ajaxData,//上行参数
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
			getVisitorList();
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	});
})