require('./Course.css');

const tpl = {
	list:'<li>\
			<div class="item"><p><span>{name}</span></p></div>\
			<div class="item"><p><span>{lesson_num}节</span></p></div>\
			<div class="item"><p><span>{user}</span></p></div>\
			<div class="item"><p><span class="line20px">{target}</span></p></div>\
			<div class="item flex_3"><p><span class="line20px">{outline}</span></p></div>\
			<div class="item"><p><span>{fee_model}</span></p></div>\
			<div class="item"><p><span><a href="javascript:;" data-href="/pss/goPlan?courseid={id}#goPlan">查看</a></span></p></div>\
			<div class="item"><p><span><a href="javascript:;" data-href="/pss/goAddOrEditCourse?courseid={id}"><i></i>编辑</a></span></p></div>\
		</li>'
}

//课程资源列表 start 3.17
$.jsonPage({
    listBox: 'ul.body',//列表容器
    ajaxUrl: '/pss/getCourses',
    ajaxType: 'post',
    ajaxData: {
        code: $('#school_code').val()
    },//上行参数
    template: tpl.list,//列表模板
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
    },
    eventDom: '#main_box'
});
//课程资源列表 end