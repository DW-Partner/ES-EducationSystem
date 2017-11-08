require('./Index.css');
var echarts = require('echarts');

// 基于准备好的dom，初始化echarts实例
var myChart1 = echarts.init(document.getElementById('echart1'));
var myChart2 = echarts.init(document.getElementById('echart2'));
// 绘制图表
myChart1.setOption({
    title: { text: '校区经营数据详情' },
    tooltip: {},
    xAxis: {
        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
    }]
});
myChart2.setOption({
    title: { text: '校区对比详情' },
    tooltip: {},
    xAxis: {
        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
    }]
});





//校区经营数据详情 start 3.8
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

let getZoneIndex = ()=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getZoneIndex',
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
            ChartHandle( 'income', '校区经营数据详情' );
            //ChartHandle( $('#echartSelect').val(), $('#echartSelect').find("option:selected").text() );
        },
        error: ()=>{
            myChart1.setOption( option );
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
}
//getZoneIndex();
//校区经营数据详情 end



$.mainBox.on('change', '#echartSelect', function(){
    const type = $(this).val();
    const word = $(this).find("option:selected").text();
    getZoneIndex( type, word );
})