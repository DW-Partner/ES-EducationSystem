require('./SchoolHome.css');

var echarts = require('echarts');

import replaceTemplate from '../kit/replaceTemplate.js';//公共表单插件

// 基于准备好的dom，初始化echarts实例
var myChart1 = echarts.init(document.getElementById('echart1'));
// 绘制图表
var option = {
    title: { text: '校区今日数据对比' },
    tooltip: {},
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
    dayIndex: '<li><span>今日流水实收</span><em>¥{income}</em></li>\
                <li><span>杂项支出</span><em>¥{outcome}</em></li>\
                <li><span>今日咨询登记数</span><em>{visit_num}人</em></li>\
                <li><span>今日报名数</span><em>{sign_num}人</em></li>\
                <li><span>预约发出数</span><em>{reserve_num}人</em></li>\
                <li><span>今天请假数</span><em>{teacher_leave_num}人</em></li>\
                <li><span>班级数</span><em>{class_num}人</em></li>',
    zoneList: '<li>\
                    <div class="item"><p><span>{name}</span></p></div>\
                    <div class="item"><p><span>{official}</span></p></div>\
                    <div class="item"><p><span>{mobile}</span></p></div>\
                    <div class="item"><p><span>{address}</span></p></div>\
                    <div class="item"><p><span>{type}</span></p></div>\
                    <div class="item"><p><span>{coreContent}</span></p></div>\
                </li>',

}


//经营指标 start 3.7
let getDayIndex = ()=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getDayIndex',
        data: {
            code: $('#school_code').val()
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
    option.series[0].data = data;
    myChart1.setOption( option );
}

let getZoneDayIndex = ()=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getZoneDayIndex',
        data: {
            code: $('#school_code').val()
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
            ChartHandle( 'income', '今日流水实收' );
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
    eachDataHandle: false,//Function : function(msg,pageNum,pageSize){ return msg }
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

$.mainBox.on('change', '#echartSelect', function(){
    const type = $(this).val();
    const word = $(this).find("option:selected").text();
    ChartHandle( type, word );
})