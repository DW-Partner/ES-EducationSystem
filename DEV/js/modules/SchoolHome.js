require('./SchoolHome.css');

var echarts = require('echarts');
import changeFormat from '../kit/changeFormat.js';//时间轴转换
import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎

const yesterdayTime = new Date().getTime() - (1000*60*60*24) 
const yesterdayDate = changeFormat(yesterdayTime,'YYYY-MM-DD');

// 基于准备好的dom，初始化echarts实例
var myChart1 = echarts.init(document.getElementById('echart1'));
// 绘制图表
var option = {
    title: { text: '校区今日数据对比' },
    tooltip: {
        enterable:true,
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    xAxis: {
        data: ['网络错误，请稍后重试']
    },
    yAxis: {},
    series: [{
        name: '今日流水实收',
        type: 'bar',
        data: [1]
    }]
};


var tpl = {
    dayIndex: '<li><span>昨日流水实收</span><em>¥{income}</em></li>\
                <li><span>昨日杂项支出</span><em>¥{outcome}</em></li>\
                <li><span>昨日咨询登记数</span><em>{visit_num}人</em></li>\
                <li><span>昨日报名数</span><em>{sign_num}人</em></li>\
                <li><span>昨日预约发出数</span><em>{reserve_num}人</em></li>\
                <li><span>昨日请假数</span><em>{teacher_leave_num}人</em></li>\
                <li class="none"><span>开班数</span><em>{class_num}人</em></li>',
    zoneList: '<li>\
                    <div class="item"><p style="text-align: left;"><span><em class="{icon_class}"></em>{name}</span></p></div>\
                    <div class="item"><p><span>{official}</span></p></div>\
                    <div class="item"><p><span>{mobile}</span></p></div>\
                    <div class="item"><p><span>{address}</span></p></div>\
                    <div class="item"><p><span>{type}</span></p></div>\
                    <div class="item"><p><span>{coreContent}</span></p></div>\
                    <div class="item"><p><span><a href="JavaScript:;" data-href="/pss/goZoneDetail?zoneid={id}#goZone">查看详情</a></span></p></div>\
                </li>',

}


//经营指标 start 3.7
let getDayIndex = ()=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getDayIndex',
        data: {
            code: $('#school_code').val(),
            day: yesterdayDate
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                 return;
            }
            const html = replaceTemplate( tpl.dayIndex, res.data );
            $('.left ul').html( html )

        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
}
getDayIndex();
//经营指标 end


//校区今日数据对比 start 3.8
let chartNameArr = [];
let ChartData=[];
// ChartData = [{"zone_name":"校区2","income":888,"zone_id":1,"teacher_leave_num":0,"sign_num":1,"reserve_num":0,"visit_num":12,"outcome":999,"class_num":6},{"zone_name":"校区2","income":43242,"zone_id":2,"teacher_leave_num":0,"sign_num":3,"reserve_num":1,"visit_num":34,"outcome":7654,"class_num":16}];
// ChartData.map(function(item, index){
//     chartNameArr.push( item.zone_name );
// });
// option.xAxis.data = chartNameArr;

let ChartHandle = (type,word)=>{
    let data = [];
    ChartData.map(function(item, index){
        data.push( item[type] );
    });
    option.series[0].name = word;
    if( ChartData.length < 5 ){
        option.series[0].barWidth = 70;
    }
    option.series[0].data = data;
    myChart1.setOption( option );
}

let getZoneDayIndex = ()=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getZoneDayIndex',
        data: {
            code: $('#school_code').val(),
            day: yesterdayDate
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                return;
            }
            ChartData = res.data;
            ChartData.map(function(item, index){
                chartNameArr.push( item.zone_name || '校区'+index );
            });
            option.xAxis.data = chartNameArr;
            ChartHandle( 'income', '昨日流水实收' );
            //ChartHandle( $('#echartSelect').val(), $('#echartSelect').find("option:selected").text() );
        },
        error: ()=>{
            myChart1.setOption( option );
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
}
getZoneDayIndex();
//校区今日数据对比 end


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
        msg.icon_class = +msg.type < 2 ? 'direct' : 'cooperation';
        msg.icon_class = msg.flagship == 1 ? 'flagship' : msg.icon_class;
        msg.type = words[msg.type];
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
    }
});
//校区列表 end

//获取机构介绍
let introduce = '';
let getSchoolIntroduce = ()=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getSchoolIntroduce',
        data: {
            code: $('#school_code').val(),
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                return;
            }
            introduce = res.data.introduce;
            $( '.user strong' ).attr( 'title', introduce ).data( 'introduce', introduce );
        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
}
getSchoolIntroduce();

let submitSchoolIntroduce = (dialogClose)=>{
    const _introduce = $('#introduce').val();
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/submitSchoolIntroduce',
        data: {
            code: $('#school_code').val(),
            data: JSON.stringify( {introduce: _introduce} )
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                return;
            }
            $( '.user strong' ).attr( 'title', _introduce ).data( 'introduce', _introduce );
            dialogClose();
            $.dialogFull.Tips( "操作成功" );
        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
}

$.mainBox.on('change', '#echartSelect', function(){
    const type = $(this).val();
    const word = $(this).find("option:selected").text();
    ChartHandle( type, word );
});
$('body').on('click', '.user strong', function(){
    $.dialogFull.Pop({
        boxClass: '.dialog_edit_introduce',
        width: 400,
        height: 300,
        title: '请编辑本机构介绍详情(不超过100字)',//弹框标题
        content: '<textarea id="introduce" placeholder="请编辑本机构介绍详情（不超过100字）" maxlength="100"></textarea>',//弹框内容区
        showCallback: function($thisBox, $contentBox){
            const _introduce = $( '.user strong' ).data( 'introduce' );
            $thisBox.find('textarea').val(_introduce);
        },
        runDone: function($this, $thisBox, dialogClose) {
            submitSchoolIntroduce(dialogClose);
        }
    });
})
