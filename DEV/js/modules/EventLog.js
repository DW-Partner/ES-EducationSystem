require('./EventLog.css');


const tpl = '<li>\
				<div class="item"><p><span>{ctime}</span></p></div>\
				<div class="item"><p><span>{operator}</span></p></div>\
				<div class="item flex_3"><p><span>{event}</span></p></div>\
			</li>';
	// {"data":[{"work_no":1,"name":"赵赵","zone_name":"望京","type":"助教","entry_day":"2017-07-20","tid":1,"status":"正常"},{"work_no":2,"name":"keke","zone_name":"望京","type":"教师","entry_day":"2017-08-10","tid":2,"status":"正常"},{"work_no":3,"name":"赵赵","zone_name":"望京","type":"助教","entry_day":"2017-07-20","tid":3,"status":"正常"},{"work_no":4,"name":"赵赵","zone_name":"通州","type":"教师","entry_day":"2017-07-20","tid":4,"status":"正常"}],"errcode":"0","errmsg":"success"}

// {"ctime":"xxx","operator":"xxx","event":"xxx"}

//获取教师列表 start 3.23
$.jsonPage({
    listBox: 'ul.body',//列表容器
    ajaxUrl: '/pss/getEventLog',
    ajaxType: 'post',
    ajaxData: {
        code: $('#school_code').val()
    },//上行参数
    template: tpl,//列表模板
    listKey: ['data'],//下行结构
    pageBar: false,//是否启用分页
    pageSizeKeyName: 'rec_per_page',//key名——上行使用: pageSizeKeyName 
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
//获取教师列表 end