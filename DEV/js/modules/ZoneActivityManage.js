require('./ZoneActivityManage.css');

//            <div class="item"><p><span>{lesson_id}</span></p></div>\
const tpl = {
	list:`<li>
			<div class="item"><p><span>{title}</span></p></div>
			<div class="item"><p><span>{time_describe}</span></p></div>
			<div class="item"><p><span>{introduce}</span></p></div>
			<div class="item"><p><span>{reserve_num}</span></p></div>
			<div class="item"><p><span>{sign_num}</span></p></div>
			<div class="item"><p><span>{mtime}</span></p></div>
			<div class="item"><p><span>{status}</span></p></div>
		</li>`
}
// {"errcode":0,"errmsg":"success","data":[{"course_id":"xxx","lesson_id":"xxx","plan_id":"xxx","lesson_theme":"xxx","contributor":"xxx","ctime":"xxx","location":"xxx"},...]}
//{"data":[{"course_id":1,"contributor":"赵赵","ctime":"2017-10-17 21:00:01","location":"baiziwan","lesson_id":1,"plan_id":1},{"course_id":1,"contributor":"赵赵","ctime":"2017-10-17 21:01:00","location":"baiziwan","lesson_id":2,"plan_id":2},{"course_id":1,"contributor":"keke","ctime":"2017-10-18 16:00:09","theme":"中级技术","location":"tongzhou","lesson_id":3,"plan_id":3}],"errcode":"0","errmsg":"success"}


let getActivityList = ()=>{

    let ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('.page_head input').val()
    }

    //获取教案列表 start 3.21
    $.jsonPage({
        listBox: 'ul.body',//列表容器
        ajaxUrl: '/pss/getActivityList',
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
        eventDom: '#main_box'
    });
    //获取教案列表 end
}
getActivityList();