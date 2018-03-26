require('./Sales.css');
//<div class="item"><p><span>{work_no}</span></p></div>\
const tpl = '<li>\
				<div class="item"><p><span>{name}</span></p></div>\
				<div class="item"><p><span>{mobile}</span></p></div>\
				<div class="item"><p><span>{entry_day}</span></p></div>\
				<div class="item"><p><span><a href="JavaScript:;"" data-href="/pss/goSalesDetail?salesid={sales_id}">详情</a>\
				<a href="JavaScript:;" data-href="/pss/goAddOrEditSales?salesid={sales_id}">编辑</a>\
				<a href="JavaScript:;" clas="del_sales" data-salesid="{sales_id}">删除</a>\
				</span></p></div>\
			</li>';

//列表 start 3
let getSalesList = ()=>{
	// getZoneTeacherList
    const ajaxUrl = '/pss/getSalesList';
    const ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val()
    }

    $.jsonPage({
        listBox: 'ul.body',//列表容器
        ajaxUrl: ajaxUrl,
        ajaxType: 'post',
        ajaxData: ajaxData,//上行参数
        template: tpl,//列表模板
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
        }
    });
}
//师列表 end
getSalesList();


let deleteSales = (salesid)=>{
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/deleteSales',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        salesid: salesid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        $.dialogFull.Tips( "操作成功" );
			getTeacherList();
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}

$.mainBox.on('click', '.del_sales', function(){
	const salesid = $(this).data( 'salesid' );
	deleteSales( salesid );
});
