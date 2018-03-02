require('./ZoneTasks.css');//引入css文件
import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
const type = $('#type').val();

const tpl = {
	//{"task_id":"xxx","time":"xxx","from":"xxx","content":"xxx","status":"xxx"}}
	ZoneTasks: '<li>\
	<div class="item"><p><span>{time}</span></p></div>\
	<div class="item"><p><span>{from}</span></p></div>\
	<div class="item"><p><span>{content}</span></p></div>\
	<div class="item"><p><span><input type="checkbox" name="id_{task_id}" {checked} {status} data-taskid={task_id}></span></p></div>\
	</li>',
	MsgFromSchool: '<li>\
	<div class="item"><p><span>{time}</span></p></div>\
	<div class="item"><p><span>{from}</span></p></div>\
	<div class="item"><p><span>{content}</span></p></div>\
	<div class="item"><p><span><input type="checkbox" name="id_{msg_id}" {checked} {status} data-msgid={msg_id}></span></p></div>\
	</li>',
	SendList: '<li>\
	<div class="item"><p><span>{time}</span></p></div>\
	<div class="item"><p><span>{to}</span></p></div>\
	<div class="item"><p><span>{content}</span></p></div>\
	</li>',
}


let ZoneTasks = ()=>{
	//getZoneTaskList start 5.30
	//{"data":[{"task_id":4,"from":"小小学员的家长","time":"2017-10-27 23:30:00","content":"申请补课","status":"已处理"}],"errcode":"0","errmsg":"success"}
	$.jsonPage({
	    listBox: 'ul.body',//列表容器
	    ajaxUrl: '/pss/getZoneTaskList',
	    ajaxType: 'post',
	    ajaxData: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val()
	    },//上行参数
	    template: tpl.ZoneTasks,//列表模板
        listKey: ['data','list'],//下行结构
        eachDataHandle: function(msg,pageNum,pageSize){
        	msg.checked = msg.status == '已处理' ? 'checked' : '';
        	msg.status = msg.status == '已处理' ? 'disabled' : '';

        	return msg
        },//Function : 
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
	// end
}



let MsgFromSchool = ()=>{
	//getZoneTaskList start 5.30
	//{"data":[{"from":"皮亚诺艺术中心","time":"2017-10-27 22:00:00","msg_id":1,"content":"检查","status":"已处理"}],"errcode":"0","errmsg":"success"}
	$.jsonPage({
	    listBox: 'ul.body',//列表容器
	    ajaxUrl: '/pss/getMsgFromSchool',
	    ajaxType: 'post',
	    ajaxData: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        page: 0
	    },//上行参数
	    template: tpl.MsgFromSchool,//列表模板
        listKey: ['data','list'],//下行结构
        eachDataHandle: function(msg,pageNum,pageSize){
        	msg.checked = msg.status == '已处理' ? 'checked' : '';
        	msg.status = msg.status == '已处理' ? 'disabled' : '';

			if( msg.content.indexOf('填写当日流水') > -1 ){
				msg.status = 'disabled';
			}
			if( msg.checked ){
        		msg.content = msg.content.replace( /填写当日流水/g, '<a href="javascript:;" class="disabled">填写当日流水</a>')
			}else{
        		msg.content = msg.content.replace( /填写当日流水/g, '<a href="javascript:;" data-href="/pss/goInAndOutCome?date=' + msg.time.split(' ')[0] + '&page=' + msg._page + '">填写当日流水</a>')
			}

        	return msg
        },//Function : 
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
	// end
}





let SendList = ()=>{
	//getZoneTaskList start 5.30
	$.jsonPage({
	    listBox: 'ul.body',//列表容器
	    ajaxUrl: '/pss/getSendList',
	    ajaxType: 'post',
	    ajaxData: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        page: 0
	    },//上行参数
	    template: tpl.SendList,//列表模板
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
	    }
	});
	// end
}


if( type == 'ZoneTasks' ){
	ZoneTasks();

}else if( type == 'MsgFromSchool' ){
	MsgFromSchool();

}else if( type == 'SendList' ){
	SendList();

}

///pss/goInAndOutCome


$.mainBox.on('change', '#ZoneTaskList input', function(){
	$(this).attr('disabled','disabled');
	const taskid = $(this).data('taskid');
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/submitZoneTask',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        taskid: taskid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
				$(this).removeAttr('disabled');
	            return;
	        }
	        //const html = replaceTemplate( tpl, res.data );
	        //$('.classLi').html( html );
	    },
	    error: ()=>{
			$(this).removeAttr('disabled');
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}).on('change', '#MsgFromSchool input', function(){
	$(this).attr('disabled','disabled');
	const msgid = $(this).data('msgid');
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/submitMsgFromSchool',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        msgid: msgid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
				$(this).removeAttr('disabled');
	             return;
	        }
	        //const html = replaceTemplate( tpl, res.data );
	        //$('.classLi').html( html );
	    },
	    error: ()=>{
			$(this).removeAttr('disabled');
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
})
