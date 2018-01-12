require('./Index.css');
    require('../comp/laydate/laydate.css');//引入css文件

var echarts = require('echarts');
import changeFormat from '../kit/changeFormat.js';//时间轴转换

// 基于准备好的dom，初始化echarts实例
var myChart1 = echarts.init(document.getElementById('echart1'));
var myChart2 = echarts.init(document.getElementById('echart2'));
// 绘制图表
let option_1 = {
    title: { text: '校区经营数据详情' },
    tooltip: {
        enterable:true,
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    xAxis: {
        data: ["网络错误，请稍后重试"]
    },
    yAxis: {},
    series: [{
        name: '',
        type: 'bar',
        data: [1]
    }]
};
let option_2 = {
    title: { text: '校区对比详情' },
    tooltip: {
        enterable:true,
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    xAxis: {
        data: ["网络错误，请稍后重试"]
    },
    yAxis: {},
    series: [{
        name: '',
        type: 'bar',
        data: [1]
    }]
};


    // $('.echartsBox').eq(0).attr('id', 'echartsBox_1');
$('#entey_date').val( changeFormat(false,'YYYY-MM-DD') );


let getZoneList_times = {
    day: ()=>{
        return changeFormat( (new Date()).getTime() - (3600 * 1000 * 24 * 20) );
    },
    week: ()=>{
        let getTime = new Date().getTime();
        let num = ( getTime - (3600 * 1000 * 24 * 140) );
        let getDayNum = (new Date(num)).getDay() == 0 ? 6 : ((new Date(num)).getDay() - 1) 
        num = num - getDayNum * (3600 * 1000 * 24);
        return changeFormat( num );
    },
    month: ()=>{
        return changeFormat( (new Date()).getTime() - (3600 * 1000 * 24 * 610), 'YYYY-MM' );
    },
}


let getZoneIndexCompare_times = {
    day: (_date)=>{

        return changeFormat( (new Date( _date )).getTime(), 'YYYY-MM-DD' );
    },
    week: (_date)=>{
        const newDate = new Date(_date);
        const getTime = newDate.getTime();
        const getDay = newDate.getDay() == 0 ? 7 : newDate.getDay(); 
        const num = getTime - (getDay-1) * (3600 * 1000 * 24);
        return changeFormat( num, 'YYYY-MM-DD' );
    },
    month: (_date)=>{
        return changeFormat( (new Date( _date+'-1' )).getTime(), 'YYYY-MM' );
    },
}



//获取校区列表 start
let getZoneList = ()=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getZoneList',
        data: {
            code: $('#school_code').val()
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                return;
            }
            let options = '';
            let data = res.data;
            data.map(function(item){
                options += '<option value="' + item.id +'">'+ item.name +'</option>'
            });
            $('.echartsBox').eq(0).find('.echartSelect_zone').html( options );

            getZoneIndex();
        },
        error: ()=>{

        }
    });
}

getZoneList();


//校区经营数据详情 start
let getZoneIndex = (zoneid, type, period)=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getZoneIndex',
        data: {
            code: $('#school_code').val(),
            zoneid: $('#echartsBox_1 .echartSelect_zone').val(),
            index: $('#echartsBox_1 .echartSelect_type').val(),
            period: $('#echartsBox_1 .echartSelect_date').val(),
            sdate: getZoneList_times[ $('#echartsBox_1 .echartSelect_date').val() ],
            edate: $('#echartsBox_1 .echartSelect_date').val() == 'month' ? changeFormat(false, 'YYYY-MM') : changeFormat(),
            page: 0
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                return;
            }
            let ChartData = res.data;

            let chartNameArr = [];
            let chartDataArr = [];

            ChartData.map(function(item, index){
                chartNameArr.push( item.date );
                chartDataArr.push( item.value );
            });
            option_1.xAxis.data = chartNameArr;
            option_1.series[0].data = chartDataArr;
            if( ChartData.length < 7 ){
                option_1.series[0].barWidth = 70;
            }


            myChart1.setOption( option_1 );
        },
        error: ()=>{
            myChart1.setOption( option_1 );
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
}
//getZoneIndex();
//校区经营数据详情 end



// $('#echartsBox_2 .echartSelect_date').after('<input type="date" value="" class="entey_date">')
//校区对比详情 start
let getZoneIndexCompare = ()=>{
    let _date = $('.entey_date').val();
    if( !_date ){
        $.dialogFull.Tips( "请输入时间！" );
        return;
    }
    // if( _date.indexOf( 'W' ) > 0 ){

    //         const newDate = new Date( _date.split('W')[0] + '01-01'); 

    //         const num = newDate.getTime() + (_date.split('W')[1] - 1) * 7 * 24 * 3600 * 1000

    //         const thenDay = (new Date( num )).getDay();

    //         let getDayNum = thenDay == 0 ? 6 : thenDay - 1;

    //         const targetNum = num - ( getDayNum * 3600 * 1000 * 24 );

    //         _date = changeFormat( targetNum );
    // }
    const period = $('#echartsBox_2 .echartSelect_date').val();

    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getZoneIndexCompare',
        data: {
            code: $('#school_code').val(),
            index: $('#echartsBox_2 .echartSelect_type').val(),
            period: period,
            date: getZoneIndexCompare_times[period]( _date )
            // sdate: '',
            // edate: '',
            // page: ''
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                return;
            }
            let ChartData = res.data;

            let chartNameArr = [];
            let chartDataArr = [];

            ChartData.map(function(item, index){
                chartNameArr.push( item.zone_name );
                chartDataArr.push( item.value );
            });
            option_2.xAxis.data = chartNameArr;
            option_2.series[0].data = chartDataArr;

            if( ChartData.length < 7 ){
                option_2.series[0].barWidth = 70;
            }
            myChart2.setOption( option_2 );
        },
        error: ()=>{
            myChart2.setOption( option_2 );
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
}
getZoneIndexCompare();
//校区对比详情 end




    //$('[type="date"]').attr('type','text').attr('id','entey_date');

    $.laydate.render({
        elem: '#entey_date',
            type: 'date',
    });

$.mainBox.on('click', '#echartsBox_1 .btn', function(){
    getZoneIndex();
}).on('change', '#echartsBox_2 .echartSelect_date', function(){

    const val = $(this).val()
    const type = val == 'month' ? val : 'date';

    let entey_date = $('#entey_date');

    entey_date.after( entey_date.clone() );
    entey_date.remove();


    $.laydate.render({
        elem: '#entey_date',
            type: type,
    });



    //$('.entey_date').attr('type', type);
    $('#entey_date').val( changeFormat(false, val == 'month' ? 'YYYY-MM' : 'YYYY-MM-DD' ) );

}).on('click', '#echartsBox_2 .btn', function(){
    getZoneIndexCompare();
});
