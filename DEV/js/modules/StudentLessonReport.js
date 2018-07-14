require('./StudentLessonReport.css');

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
const sid = $('#sid').val();
const sname = $('#sname').val();
const lessonid = $('#lessonid').val();

// $( '.page_head h3' ).text( sname + '的印记' );


let getStudentLessonReport = ()=>{
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
		    },
		    error: ()=>{
		        $.dialogFull.Tips( "网络错误，请稍后重试！" );
		    }
		})
}
getStudentLessonReport();


$.mainBox.on('mouseenter', '.class_list .info', function(e){
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