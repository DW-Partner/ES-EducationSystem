	require('./JoinToClass.css');//引入css文件

	const tpl = {
		item: '<p><label><input type="radio" name="class" value="{class_id}">{class_name}</label></p>'
	};


const sid = $('#sid').val();
const page = $('#page').val();
const classid = $('#classid').val();

let getZoneClassesList = ()=>{
	$.jsonPage({
	    listBox: '.classList',//列表容器
	    ajaxUrl: '/pss/getZoneClassesList',
	    ajaxType: 'post',
	    ajaxData: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val()        	
	    },//上行参数
	    template: tpl.item,//列表模板
	    listKey: ['data'],//下行结构
	    pageBar: false,//是否启用分页
	    eachTemplateHandle: false,//Function : function(msg,pageNum,pageSize){ return msg }
	    noData: false,//Function : function( $listBox, $pageBox ){}
	    codeKeyName: 'errcode',//状态标示key名
	    codeSuccess: 0,//状态标示值
	    successRunAfter: function(data, pageNum, pageSize, $listBox, $pageBox) {
	    	//classid
	    	$("[value=" + classid + ']').attr("checked","checked");

	    },//function(msg) {  }
	    ajaxCodeError: function( res ){
	        $.dialogFull.Tips( res.errmsg );
	    },
	    ajaxError: function(XMLHttpRequest, textStatus, errorThrown, text) {
	        $.dialogFull.Tips( "网络错误，请稍后重试" );
	    }
	});
}
getZoneClassesList();


$.mainBox.on('click', '#submit', ()=>{
	const classid = $("input[name='class']:checked").val();

	if( !classid ){
        $.dialogFull.Tips( "请选择班级" );
		return;
	}
    let ajaxData = {
        code: $('#zone_code').val(),
        zoneid: $('#zone_zoneid').val(),
		classid: classid,
		sid: sid,
		page: page ? page : 0
    }

	$.form.submit({
		url: 'joinToClass',
		data: ajaxData,
		success: (res) => {
			if( res.errcode != 0 ){
         		$.dialogFull.Tips( res.errmsg );
				return;
			}
        	$.dialogFull.Tips( "提交成功！" );
         	$.ajaxGetHtml({
         		url: res.data.url
         	})
		},
        error: function(){
        	$.dialogFull.Tips( "网络错误，请稍后重试" );
        }
	});
});