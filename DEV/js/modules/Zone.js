require('./Zone.css');


var tpl = {
    zoneList: '<li>\
                    <div class="item"><p><span><em class="{icon_class}"></em>{name}</span></p></div>\
                    <div class="item"><p><span>{official}</span></p></div>\
                    <div class="item"><p><span>{mobile}</span></p></div>\
                    <div class="item"><p><span>{address}</span></p></div>\
                    <div class="item"><p><span>{type}</span></p></div>\
                    <div class="item"><p><span>{coreContent}</span></p></div>\
                    <div class="item"><p><span><a href="JavaScript:;" data-href="/pss/goZoneDetail?zoneid={id}">查看详情</a></span></p></div>\
                </li>',

}

//校区列表 start 3.9
$.jsonPage({
    listBox: 'ul.body',//列表容器
    ajaxUrl: '/pss/getZoneList',
    ajaxType: 'post',
    ajaxData: {
        code: $('#school_code').val()
    },//上行参数
    template: tpl.zoneList,//列表模板
    listKey: ['data'],//下行结构
    pageBar: false,//是否启用分页
    eachDataHandle: function(msg,pageNum,pageSize){
        const words = {
            '00': '直营/商场',
            '01': '直营/社区',
            '10': '合作/商场',
            '11': '合作/社区',
        }
        msg.type = words[msg.type];

        msg.icon_class = +msg.type < 2 ? 'direct' : 'cooperation';
        msg.icon_class = msg.flagship == 1 ? 'flagship' : msg.icon_class;
        return msg;
    },
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
//校区列表 end
