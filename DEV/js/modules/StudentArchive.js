require('./StudentArchive.css');
import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
const tpl = {
	list: '<li>\
			<div class="info status_{lesson_status}" data-status="{lesson_status}" data-lessonid="{lesson_id}">\
			<a href="javascript:;" data-{href}="/pss/goLessonOperate?classid={class_id}&lessonid={lesson_id}&sid={sid}&status={lesson_status}">\
			<h6>{theme}</h6>\
			<p>{lesson_time}</p>\
			<strong data-lessonid="{lesson_id}">{del}</strong></a>\
			</div>\
			<div class="arrow"></div>\
			</li>',
	span: '<span>{student_name}</span>',//{sid}:
};
const classid = $('#classid').val();
const classname = $('#classname').val();
const sid = $('#sid').val();
const sname = $('#sname').val();
$( '.page_head h3' ).text( `${classname}的${sname}课表` );

let getClassLessonsList = ()=>{
	$.jsonPage({
	    listBox: '.class_list',//列表容器
	    ajaxUrl: '/pss/getClassLessonsList',
	    ajaxType: 'post',
	    ajaxData: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        classid: classid,
	        sid: sid
	    },//上行参数
	    template: tpl.list,//列表模板
	    listKey: ['data'],//下行结构
	    pageBar: false,//是否启用分页
	    eachDataHandle: function(msg,pageNum,pageSize){
	        // const words = {
	        //     '0': '已经上过',
	        //     '1': '马上要上',
	        //     '2': '以后上',
	        //     '3': '缺课',
	        // }
	        // msg.words = words[msg.lesson_status];
			msg.class_id = classid;
			msg.href = msg.lesson_status == 0 ? 'null' : 'href';

			//msg.del = msg.lesson_status == 0 ? '' : '删除'

			msg.sid = sid;

			msg.lesson_time = msg.lesson_time.substr(0,16).replace(/\s/g, '<br />');

	        return msg;
	    },
	    eachTemplateHandle: false,//Function : function(msg,pageNum,pageSize){ return msg }
	    noData: false,//Function : function( $listBox, $pageBox ){}
	    codeKeyName: 'errcode',//状态标示key名
	    codeSuccess: 0,//状态标示值
		successRunBefore: function(msg, pageNum, pageSize, $listBox, $pageBox) {
			let _sortList = [];
			let time_obj = {};
			let time_arr = msg.data.map(function(_item){
				const key = +_item.lesson_time.replace(/[^\d]/g,'');
				time_obj[ key ] = _item;
				return key;
			});
			time_arr.sort(function(a,b){return a-b});

			time_arr.forEach(function(_arr){
				_sortList.push( time_obj[ _arr ] );
			});
			msg.data = _sortList;
			return msg
		},
	    successRunAfter: function(msg, pageNum, pageSize, $listBox, $pageBox) {
	    },//function(msg) {  }
	    ajaxCodeError: function( res ){
	        $.dialogFull.Tips( res.errmsg );
	    },
	    ajaxError: function(XMLHttpRequest, textStatus, errorThrown, text) {
	        $.dialogFull.Tips( "网络错误，请稍后重试" );
	    }
	});
}
getClassLessonsList();

let getLessonAbsenceAndAudits = (that,lessonid)=>{
	let list = that.find( '.list' );
	if(list.length){
		list.show();
		return;
	}
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getLessonAbsenceAndAudits',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        classid: classid,
	        lessonid: lessonid,
            // sid: sid || undefined
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        let dom = '<div class="list"><p class="student"><span>请假学员：</span></p><p class="visitor"><span>试听学员：</span></p></div>';
	        let $dom = $(dom);
	        res.data.forEach(function(item){
	        	$dom.find( '.' + item.type ).append( '<span>' + item.sname + '、</span>' )
	        });
	        if( $dom.find( '.student' ).find('span').length==1 ){
	        	$dom.find( '.student' ).append('<span>无</span>');
	        }
	        if( $dom.find( '.visitor' ).find('span').length==1 ){
	        	$dom.find( '.visitor' ).append('<span>无</span>');
	        }
	        let last_student = $dom.find( '.student' ).find('span').eq(-1);
	        last_student.text( last_student.text().replace('、','') );

	        let last_visitor = $dom.find( '.visitor' ).find('span').eq(-1);
	        last_visitor.text( last_student.text().replace('、','') );

	        that.append( $dom );
	        that.find('.list').show();
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}

let getLessonsMissList = (that,lessonid)=>{
	let list = that.find( '.list' );
	if(list.length){
		list.show();
		return;
	}
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getLessonsMissList',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        classid: classid,
	        lessonid: lessonid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }

	        let dom = '<div class="list"><p><span>提交照片数：</span></p><p><span>提交视频数：</span></p></div>';
	        let $dom = $(dom);

	        let status_arr = [];

	        let _p = res.data.map(function(item){
	        	const _status = item.status;
	        	const push = status_arr.indexOf( _status ) == -1 ?  status_arr.push( _status ) : '';
	        	return push ? `<p><span>${_status}：</span></p>` : '';
			});
			$dom.prepend( _p.join('') );

	        let span = res.data.map(function(item){
	        	const _status = item.status;
	        	const index = status_arr.indexOf( _status );
	        	$dom.find('p').eq( index ).append( replaceTemplate( tpl.span, item ) + '、' );
			});
			$dom.find('p').each(function(){
				const html = $(this).html().substring(0, $(this).html().length - 1);;
				console.log( html );
				$(this).html( html );
			})

			getLessonsFileCounts( that,lessonid,$dom  );

	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})	
}
let getLessonsFileCounts = (that,lessonid,$dom)=>{
	let list = that.find( '.list' );
	if(list.length){
		list.show();
		return;
	}
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getLessonsFileCounts',
	    data: {
	        code: $('#zone_code').val(),
	        zoneid: $('#zone_zoneid').val(),
	        classid: classid,
	        lessonid: lessonid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
			$dom.find('p').eq(-2).append( res.data.pics );
			$dom.find('p').eq(-1).append( res.data.videos );

	        that.append( $dom );
	        that.find('.list').show();
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})	
}


$.mainBox.on('click', '.class_list .info_DEL', function(){
	let self = $(this);
	const _status = self.data('status');
	if( _status == 0 ){

		const lessonid = self.data('lessonid');

	    $.ajax({
		    type: "post",
		    dataType: "json",
		    url: '/pss/getStudentLessonReport',
		    data: {
		        code: $('#zone_code').val(),
		        zoneid: $('#zone_zoneid').val(),
		        classid: classid,
		        lessonid: lessonid,
		        sid: sid
		    },
		    success: (res)=>{
		        if( res.errcode != 0 ){
		            $.dialogFull.Tips( res.errmsg );
		             return;
		        }
				// $( '.comment' ).remove();
		        const comment = res.data.comment || '';
		        let li = `<li class="comment"><h6>本期点评：</h6><div class="text"><p>${comment}</p></div></li>`;
		        for( let key in res.data ){
		        	const value = res.data[key];
		        	if( key.indexOf('pic') != -1 ){
		        		li += `<li><img src="${value}"></li>`;
		        	}else if( key.indexOf('video') != -1 ){
		        		li += `<li><video src="${value}" controls="controls">暂不支持该类型视频播放</video></li>`;
				}
		        }
		        $( '.report' ).html( li );
		        $( '.class_list .click' ).removeClass( 'click' );
		        self.addClass( 'click' );
		    },
		    error: ()=>{
		        $.dialogFull.Tips( "网络错误，请稍后重试！" );
		    }
		})
	}


}).on('click', '.class_list li strong', function(e){
    if ( e && e.stopPropagation ){
        e.stopPropagation(); 
    }
    else{
        window.event.cancelBubble = true; 
    }
	const lessonid = $(this).data('lessonid');
	const self = $(this);
	$.dialogFull.Pop({
        title: '提示',//弹框标题
        content: '确认删除该课时？',//弹框内容区
        runDone: function($this, $thisBox, dialogClose) {
			// /pss/cancelLesson?code=x&zoneid=x&classid=x&lessonid=x&sid=x
		    $.ajax({
			    type: "post",
			    dataType: "json",
			    url: '/pss/cancelLesson',
			    data: {
			        code: $('#zone_code').val(),
			        zoneid: $('#zone_zoneid').val(),
			        classid: classid,
			        lessonid: lessonid,
			        sid: $( '#students' ).val() || undefined
			    },
			    success: (res)=>{
			        if( res.errcode != 0 ){
			            $.dialogFull.Tips( res.errmsg );
			             return;
			        }
		            $.dialogFull.Tips( '删除成功！' );
		            self.parent().parent().parent().remove();
		        	dialogClose();
			    },
			    error: ()=>{
			        $.dialogFull.Tips( "网络错误，请稍后重试！" );
			    }
			})
        }
	});
}).on('mouseenter', '.class_list .info', function(e){
	let self = $(this);

	const _status = self.data('status');
	if( _status == 3 ){
		self.attr( 'title', '点击安排补课事宜' );
	}
	return;

	if( $('#students').val() ){
		const _status = self.data('status');
		if( _status == 3 ){
			self.attr( 'title', '点击安排补课事宜' );
		}
		return;
	}
	self.data('req', 1);
	setTimeout(function(){
		if( self.data('req') == 0 ){
			return;
		}
		const lessonid = self.data('lessonid');
		const status = self.data('status');
		if( status == 1 || status == 2 ){
			getLessonAbsenceAndAudits( self, lessonid );
		}else{
			getLessonsMissList( self, lessonid );
		}
	},500)
}).on('mouseleave', '.class_list .info', function(e){
	return;
	if( $('#students').val() ){
		return;
	}
	$(this).data('req', 0).find( '.list' ).hide();
}).on('click', '.report li', function(){
	const self = $( this );
	const is_comment = self.find( 'h6' ).length;
	const title = is_comment ? '本期点评' : '';
	const content = is_comment ? self.find( 'div' ).html() : self.html();
	const img = is_comment ? false : self.find( 'img' );
	const maxHeight  = $(window).height() * 0.9 - 79;
    $.dialogFull.Pop({
        boxClass: '.lightBox',
        width: 'auto',
        height: 'auto',
        title: title,//弹框标题
        confirm: false,//是否显示“确定/取消”按钮，及只显示alert确定按钮
        content: content,//弹框内容区
        coverClose: true,//其否启用点击遮罩关闭弹框
        showCallback: function($thisBox, $contentBox){
        	if( img ){
        		const className = img.width() / img.height() < 1 ? 'status_1' : 'status_2';
        		const _height = img.width() / img.height() < 1 ? 650 : 600;
        		$thisBox.find( 'img,video' ).addClass( className );
        		if( maxHeight < _height ){
        			$thisBox.find( 'img,video' ).height( maxHeight );
        		}
        	}
        }

    });






})
