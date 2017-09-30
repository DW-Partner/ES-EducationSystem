(function(context) {


	// const $$ = context.$ = require('./jquery.min.js');
	context.$ = require('jquery');

	import dialogFull from './dialogFull.js';

	//公共销毁方法
	$.distory = ()=>{};



	$('body').css({
		background: '#ccc'
	})



	let stopDefault = (e) => {
		if (e && e.preventDefault) {
			e.preventDefault();

		} else {
			window.event.returnValue = false;
		}

	}

	//ajax请求html页面公共方法
	let ajaxGetHtml;
	$.ajaxGetHtml = ajaxGetHtml = (url) => {
		$.ajax({
			type: "get",
			dataType: "html",
			url: url,
			data: {},
			success: (html)=>{
				if( html === 'xxxx' ){
					window.location.href = 'xxxx';
					return;
				}

				$.distory();


			},
			error: ()=>{

			}
		})
	}


	//退出方法
	var logout = ()=>{
		$.ajax({
			type: "post",
			dataType: "json",
			url: 'url',
			data: {},
			success: (json)=>{
				if( json.errcode != 0 ){
					window.location.href = 'xxxx';
					return;
				}


				$.distory();


			},
			error: ()=>{

			}
		})

	}



	$(document).on('click', '#left_nav a', (e)=>{
		stopDefault(e);
		const url = $(this).attr('href');


	})


})(window)