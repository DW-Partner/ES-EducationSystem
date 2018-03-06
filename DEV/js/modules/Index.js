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

let getZoneList_times_index = 0;
let getZoneIndexCompare_times_index = 0;

    // $('.echartsBox').eq(0).attr('id', 'echartsBox_1');
$('#entey_date').val( changeFormat(false,'YYYY-MM-DD') );
$('#echartsBox_1').append('<p style="text-align: center;">\
    <a href="javascript:;" class="btn_dis getZoneList_times_prev">上一期</a>\
    <a href="javascript:;" class="btn_dis getZoneList_times_next">下一期</a>\
    </p>');

$('#echartsBox_2').append('<p style="text-align: center;">\
    <a href="javascript:;" class="btn_dis getZoneIndexCompare_times_prev">上一期</a>\
    <a href="javascript:;" class="btn_dis getZoneIndexCompare_times_next">下一期</a>\
    </p>');

let getZoneList_times = {
    day: (index,num)=>{
        return changeFormat( (new Date()).getTime() - (3600 * 1000 * 24 * (20 * index + num)) );
    },
    week: (index,num)=>{
        let getTime = new Date().getTime();
        let _num = ( getTime - (3600 * 1000 * 24 * (140 * index + num * 7)) );
        let getDayNum = (new Date(_num)).getDay() == 0 ? 6 : ((new Date(_num)).getDay() - 1) 
        _num = _num - getDayNum * (3600 * 1000 * 24);
        return changeFormat( _num );
    },
    month: (index,num)=>{
        return changeFormat( (new Date()).getTime() - (3600 * 1000 * 24 * (610 * index + num * 31)), 'YYYY-MM' );
    },
}


let getZoneIndexCompare_times = {
    day: (_date,index)=>{

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
let getZoneIndex = ()=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getZoneIndex',
        data: {
            code: $('#school_code').val(),
            zoneid: $('#echartsBox_1 .echartSelect_zone').val(),
            index: $('#echartsBox_1 .echartSelect_type').val(),
            period: $('#echartsBox_1 .echartSelect_date').val(),
            sdate: getZoneList_times[ $('#echartsBox_1 .echartSelect_date').val() ]( getZoneList_times_index+1, -1 ),
            edate: getZoneList_times[ $('#echartsBox_1 .echartSelect_date').val() ]( getZoneList_times_index, 0 ),
            page: 0
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                return;
            }
            const name = $('#echartsBox_1 .echartSelect_type option:checked').text();
            
            let ChartData = res.data;

            let chartNameArr = [];
            let chartDataArr = [];

            ChartData.map(function(item, index){
                chartNameArr.push( item.date );
                chartDataArr.push( item.value );
            });
            option_1.xAxis.data = chartNameArr;
            option_1.series[0].data = chartDataArr;
            option_1.series[0].name = name;

            
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
    const period = $('#echartsBox_2 .echartSelect_date').val();

    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getZoneIndexCompare',
        data: {
            code: $('#school_code').val(),
            index: $('#echartsBox_2 .echartSelect_type').val(),
            period: period,
            date: getZoneIndexCompare_times[period]( _date, )
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                return;
            }
            const name = $('#echartsBox_2 .echartSelect_type option:checked').text();

            let ChartData = res.data;

            let chartNameArr = [];
            let chartDataArr = [];

            ChartData.map(function(item, index){
                chartNameArr.push( item.zone_name );
                chartDataArr.push( item.value );
            });
            option_2.xAxis.data = chartNameArr;
            option_2.series[0].data = chartDataArr;
            option_2.series[0].name = name;

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

$.laydate.render({
    elem: '#entey_date',
        type: 'date',
});

$.mainBox.on('click', '#echartsBox_1 .btn', function(){
    getZoneList_times_index = 0;
    getZoneIndex();
}).on('change', '#echartsBox_2 .echartSelect_date', function(){

    const val = $(this).val()
    const type = val == 'month' ? val : 'date';

    let entey_date = $('#entey_date');

    entey_date.after( entey_date.clone().removeAttr('lay-key') );
    entey_date.remove();


    $.laydate.render({
        elem: '#entey_date',
            type: type,
    });

    //$('.entey_date').attr('type', type);
    $('#entey_date').val( changeFormat(false, val == 'month' ? 'YYYY-MM' : 'YYYY-MM-DD' ) );

}).on('click', '#echartsBox_2 .btn', function(){
    getZoneIndexCompare();
}).on('click', '.getZoneList_times_prev', function(){
    getZoneList_times_index++;
    getZoneIndex();

}).on('click', '.getZoneList_times_next', function(){
    getZoneList_times_index--;
    getZoneList_times_index = getZoneList_times_index < 0 ? 0 : getZoneList_times_index;
    getZoneIndex();
}).on('click', '.getZoneIndexCompare_times_prev', function(){
    let _date = $('.entey_date').val();

    const period = $('#echartsBox_2 .echartSelect_date').val();
    let DATE;
    let num;

    if( period == 'day' ){
        num = 1;
        DATE = changeFormat( (new Date( _date )).getTime() - 1000 * 3600 * 24 * num, 'YYYY-MM-DD' );
    }else if( period == 'week' ){
        num = 7;
        DATE = changeFormat( (new Date( _date )).getTime() - 1000 * 3600 * 24 * num, 'YYYY-MM-DD' );
    }else if( period == 'month' ){
        DATE = changeFormat( (new Date( _date+'-1' )).getTime() - 1000 * 3600 * 24 * 2, 'YYYY-MM' )
    }

    $('#entey_date').val( DATE );

    getZoneIndexCompare();
}).on('click', '.getZoneIndexCompare_times_next', function(){
    let _date = $('.entey_date').val();

    const period = $('#echartsBox_2 .echartSelect_date').val();
    let DATE;
    let num;

    // if( (new Date( _date )).getTime() > (new Date()).getTime() ){
    //     return;
    // }

    if( period == 'day' ){
        num = 1;
        DATE = changeFormat( (new Date( _date )).getTime() + 1000 * 3600 * 24 * num, 'YYYY-MM-DD' );
    }else if( period == 'week' ){
        num = 7;
        DATE = changeFormat( (new Date( _date )).getTime() + 1000 * 3600 * 24 * num, 'YYYY-MM-DD' );
    }else if( period == 'month' ){
        DATE = changeFormat( (new Date( _date+'-1' )).getTime() + 1000 * 3600 * 24 * 32, 'YYYY-MM' )
    }

    $('#entey_date').val( DATE );

    getZoneIndexCompare();
});
