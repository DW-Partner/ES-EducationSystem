require('./Plan.css');
//            <div class="item"><p><span>{lesson_id}</span></p></div>\
const tpl = {
	list:'<li>\
			<div class="item"><p><span>{theme}</span></p></div>\
			<div class="item"><p><span>{contributor}</span></p></div>\
			<div class="item"><p><span>{ctime}</span></p></div>\
			<div class="item"><p><span>{location}</span></p></div>\
			<div class="item"><p><span><a href="javascript:;" data-href="/pss/goPlanDetail?courseid={course_id}&lessonid={lesson_id}&planid={plan_id}#goPlan">查看</a></span></p></div>\
		</li>'
}
// {"errcode":0,"errmsg":"success","data":[{"course_id":"xxx","lesson_id":"xxx","plan_id":"xxx","lesson_theme":"xxx","contributor":"xxx","ctime":"xxx","location":"xxx"},...]}
//{"data":[{"course_id":1,"contributor":"赵赵","ctime":"2017-10-17 21:00:01","location":"baiziwan","lesson_id":1,"plan_id":1},{"course_id":1,"contributor":"赵赵","ctime":"2017-10-17 21:01:00","location":"baiziwan","lesson_id":2,"plan_id":2},{"course_id":1,"contributor":"keke","ctime":"2017-10-18 16:00:09","theme":"中级技术","location":"tongzhou","lesson_id":3,"plan_id":3}],"errcode":"0","errmsg":"success"}


let getList = ()=>{

    let ajaxData = {
        code: $('#school_code').val() || $('#zone_code').val(),
        courseid: $('#courseid').val(),
        theme: $('.page_head input').val()
    }
    !ajaxData.courseid && delete ajaxData.courseid;
    !ajaxData.theme && delete ajaxData.theme;

    //获取教案列表 start 3.21
    $.jsonPage({
        listBox: 'ul.body',//列表容器
        ajaxUrl: '/pss/getPlanList',
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
getList();

$.mainBox.on('click', '.page_head .btn', getList);
