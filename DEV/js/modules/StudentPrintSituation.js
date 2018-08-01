require('./StudentPrintSituation.css');
import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎

let search_data = $('#data').val() ? $('#data').val().replace(/'/g, '"') : '';
const sid = $( '#sid' ).val();
const sname = $( '#sname' ).val();
let select_data = JSON.parse( search_data || '{}' );


const tpl = {
	list: '<li>\
	<div class="item"><p><span>{lesson_time}</span></p></div>\
    <div class="item"><p><span>{theme}</span></p></div>\
	<div class="item"><p><span>{class_name}</span></p></div>\
    <div class="item"><p><span>{status}</span></p></div>\
    <div class="item"><p><span>{tname}</span></p></div>\
    <div class="item"><p><span>\
	<a href="JavaScript:;" class="goStudentLessonReport" data-classid="{class_id}" data-lessonid="{lesson_id}" data-sid="{sid}" data-page="{_page}" data-hrefdel="/pss/goStudentLessonReport?classid={class_id}&lessonid={lesson_id}&sid={sid}&page={_page}&data={data}">详情</a>\
    </span></p></div>\
	</li>',
	summary: '<div><h6>总课时数</h6><span>{total_lessons}</span></div>\
	<div><h6>当前剩余课时</h6><span>{remain_lessons}</span></div>\
	<div><h6>签到</h6><span>{sign_lessons}</span></div>\
    <div><h6>缺勤</h6><span>{absence_lessons}</span></div>\
    <div><h6>请假</h6><span>{leave_lessons}</span></div>\
	<div><h6>未签到</h6><span>{unsign_lessons}</span></div>',
	// <div><h6>取消课时</h6><span>{cancel_lessons}</span></div>',
	// <p><h6>有效期：</h6><span>{expiretime}</span></p>',
	classList: '<option value="{class_id}">{name}</option>'
};

let getStudentPrintSummary = ()=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getStudentPrintSummary',
        data: {
            code: $('#zone_code').val(),
            zoneid: $('#zone_zoneid').val(),
            sid: sid,
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                 return;
            }
            $( '.page_head' ).html( `<h3>${sname}</h3><div class="run">课时有效截止日期：${res.data.expiretime || "-"}</div>` );
            let summary = replaceTemplate( tpl.summary, res.data );
            $( '#summary' ).html( summary );
        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
}
getStudentPrintSummary();


$( '#summary' ).after( `<div class="search_item">
    <input type="text" id="dateSelect_start" class="dateSelect" placeholder="请选查询起始日期" />
    <input type="text" id="dateSelect_end" class="dateSelect" placeholder="请选查询结束日期" />
    <select id="classSelect"></select>
    <select id="statusSelect">
        <option value="">所有</option>
        <option value="签到">签到</option>
        <option value="未签到">未签到</option>
        <option value="缺勤">缺勤</option>
        <option value="请假">请假</option>
    </select>
    <a href="JavaScript:;" class="btn" id="run_search">搜索</a>
</div>` );

console.log( select_data );
console.log( select_data.status );
console.log( $( '#statusSelect' ).length );

$( '#statusSelect' ).val( select_data.status || '' );

// $.laydate.render({
//   elem: '#dateSelect'
//   ,range: true
//   ,done: function( value, sdate, edate ){
//     if( sdate.year ){
//         select_data = select_data || JSON.parse( search_data || '{}' );
//         select_data.start_date = `${sdate.year}-${sdate.month}-${sdate.date}`;
//         select_data.end_date = `${edate.year}-${edate.month}-${edate.date}`;
//     }else {
//         delete select_data.start_date;
//         delete select_data.end_date;
//     }
//     getStudentPrintList( JSON.stringify( select_data ) );
//   }
// });

let start_date_fn = ( _date )=>{
    let options = {
      elem: '#dateSelect_start',
      done: function( value, date ){
        if( date.year ){
            const month = date.month > 9 ? date.month : '0' + date.month;
            const DATE = date.date > 9 ? date.date : '0' + date.date;
            select_data.start_date = `${date.year}-${month}-${DATE}`;
            end_date_fn( select_data.start_date );
        }else {
            delete select_data.start_date;
            end_date_fn( '' );
        }
      }
    };
    $( '#dateSelect_start' ).remove();
    $( '#dateSelect_end' ).before( '<input type="text" id="dateSelect_start" class="dateSelect" placeholder="请选查询开始日期" />' );
    options.value = select_data.start_date || '';
    if( _date ){
        options.max = _date;
    }
    $.laydate.render( options );
}

let end_date_fn = ( _date )=>{
    let options = {
      elem: '#dateSelect_end',
      done: function( value, date ){
        if( date.year ){
            const month = date.month > 10 ? date.month : '0' + date.month;
            const DATE = date.date > 10 ? date.date : '0' + date.date;
            select_data.end_date = `${date.year}-${month}-${DATE}`;
            start_date_fn( select_data.end_date );
        }else {
            delete select_data.end_date;
            start_date_fn( '' );
        }
      }
    }
    $( '#dateSelect_end' ).remove();
    $( '#dateSelect_start' ).after( '<input type="text" id="dateSelect_end" class="dateSelect" placeholder="请选查询结束日期" />' );
    options.value = select_data.end_date || '';
    if( _date ){
        options.min = _date;
    }
    $.laydate.render( options );
}
start_date_fn();
end_date_fn();

let getStudentClasseListInZone = ()=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getStudentClasseListInZone',
        data: {
            code: $('#zone_code').val(),
            zoneid: $('#zone_zoneid').val(),
            sid: sid,
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                 return;
            }

            let classList = res.data.map((item)=>{
                return replaceTemplate( tpl.classList, item );
            }).join('');
            $( '#classSelect' ).html( `<option value="">所有</option>${classList}` );
            $( '#classSelect' ).val( select_data.class_id || '' );
            getStudentPrintList( JSON.stringify( select_data ) );
        },
        error: ()=>{
            $.dialogFull.Tips( "网络错误，请稍后重试！" );
        }
    })
}
getStudentClasseListInZone();

let getStudentPrintList = (_search_data)=>{

    let ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val(),
        sid: $('#sid').val(),
        data: _search_data || undefined
    }

    $.jsonPage({
        listBox: 'ul.body',//列表容器
        ajaxUrl: '/pss/getStudentPrintList',
        ajaxType: 'post',
        ajaxData: ajaxData,//上行参数
        template: tpl.list,//列表模板
        listKey: ['data','list'],//下行结构
        pageBar: true,//是否启用分页
        eachTemplateHandle: false,//Function : function(msg,pageNum,pageSize){ return msg }
        noData: false,//Function : function( $listBox, $pageBox ){}
        codeKeyName: 'errcode',//状态标示key名
        codeSuccess: 0,//状态标示值
        eachTemplateHandle: false,//Function : function(msg,pageNum,pageSize){ return msg }
        eachDataHandle: function(item,pageNum,pageSize){
            item.sid = sid;
            item.data = encodeURIComponent( $('#data').val() || '' );

            return item;
        },
        successRunAfter: function(data, pageNum, pageSize, $listBox, $pageBox) {

        },//function(msg) {  }
        ajaxCodeError: function( res ){
            $.dialogFull.Tips( res.errmsg );
        },
        ajaxError: function(XMLHttpRequest, textStatus, errorThrown, text) {
            $.dialogFull.Tips( "网络错误，请稍后重试" );
        }
    });
    //获取教案列表 end
}
// getStudentPrintList();



$.mainBox.on('change', '#classSelect', function(){
    const class_id = +$( this ).val();
    if( class_id ){
        select_data.class_id = class_id;
    }else{
        delete select_data.class_id;
    }
}).on('change', '#statusSelect', function(){
    const status = $( this ).val();
    if( status ){
        select_data.status = status;
    }else{
        delete select_data.status;
    }
}).on('click', '#run_search', function(){
    getStudentPrintList( JSON.stringify( select_data ) );
}).on('click', '.goStudentLessonReport', function(){
    let self = $( this );
    const classid = self.data( 'classid' );
    const lessonid = self.data( 'lessonid' );
    const sid = self.data( 'sid' );
    const page = self.data( 'page' );
    const data = JSON.stringify( select_data ).replace( /"/ig, "'" );
    $.ajaxGetHtml({
        url: '/pss/goStudentLessonReport',
        data: {
            classid,
            lessonid,
            sid,
            page,
            data
        }
    })
})
