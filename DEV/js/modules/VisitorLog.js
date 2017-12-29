require('./VisitorLog.css');//引入css文件

import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
const tpl = {
	info: '<li><span>·</span><em>{content}</em></li>',
	item: '<li><span></span><input type="text" value="{content}" placeholder="请输入反馈信息"><a href="JavaScript:;" class="btn_dis del">删除</a></li>'
}

const sid = $('#sid').val();
const page = $('#page').val();
let getVisitorDetail = ()=>{
	$.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getVisitorDetail',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        sid: sid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        const name = res.data.name;
	        $('.pub_form em').eq(0).html( name );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
getVisitorDetail();



let getVisitorLog = ()=>{
	$.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getVisitorLog',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        sid: sid,
	        page: page ? page : 0
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        let listData = res.data;
	        let li = '';
	        listData.map(function(item){
	        	console.log(li);
	        	li += replaceTemplate( tpl.info, item );
	        });
	        $('.pub_form li').eq(0).after(li);
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}
getVisitorLog();


let addVisitorLog = ()=>{
	let listData = [];
	$('.pub_form [type=text]').map(function(index){
		const val = $(this).val();
		if( index>0 && !val ){
			$(this).parent().remove();
		}
		if( val ){
			let item = {
				content: val
			}
			listData.push(item)
		}
	})

	$.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/addVisitorLog',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        sid: sid,
	        page: page ? page : 0,
	        data: JSON.stringify( listData )
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
        	$.dialogFull.Tips( "提交成功！" );
         	$.ajaxGetHtml({
         		url: res.data.url,
         		data: {
         			page: page ? page : 0
         		}
         	})
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}


$.mainBox.on('click', '#addItem', function(){
	const li = replaceTemplate( tpl.item, {} );
	if( !$('.pub_form [type=text]').eq(0).val() ){
		$('.pub_form [type=text]').eq(0).focus();
		return;
	}
	$('.pub_form [type=text]').map(function(index){
		const val = $(this).val();
		if( index>0 && !val ){
			$(this).parent().remove();
		}
	})
	$('.pub_form ul').append( li ).find('[type=text]').eq(-1).focus();
}).on('click', '.del', function(){
	$(this).parent().remove();
}).on('click', '#submit_log', function(){
	addVisitorLog();
})
