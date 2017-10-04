(function(context) {

//粗糙版本，待完善

	require('../css/CMD.css');
	// const $$ = context.$ = require('./jquery.min.js');
	context.$ = require('jquery');

	//import dialogFull from './dialogFull.js';

	//公共销毁方法
	$.distory = ()=>{};
	$.mainBox = $('#main_box');

	//load css文件方法
	$.loadCss = (urls)=>{
		if( typeof urls === 'string' ){
			let link=document.createElement('link');
		 	link.setAttribute('rel','stylesheet');
		 	link.setAttribute('type','text/css');
		 	link.setAttribute('href',urls);
		 	link.setAttribute('class','main_css');
	 		document.getElementById('main_box').appendChild(link);
		}else{
			for( let i=0;i<urls.length; i++ ){
				let link=document.createElement('link');
			 	link.setAttribute('rel','stylesheet');
			 	link.setAttribute('type','text/css');
			 	link.setAttribute('href',urls[i]);
			 	link.setAttribute('class','main_css');
		 		document.getElementById('main_box').appendChild(link);
			}
		}
	}


	//阻止浏览器默认事件
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