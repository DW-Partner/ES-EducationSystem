	require('../css/CMD.css');
	// const $$ = window.$ = require('./jquery.min.js');
	window.$ = require('jquery');
	//import jsonPage from './comp/jsonPage.js';//公共分页插件
	//import dialogFull from './comp/dialogFull.js';//公共弹框插件

	//公共销毁方法
	$.distory = ()=>{};
	//main容器
	$.mainBox = $('#main_box');

	//load css文件方法
	$.loadCss = (urls)=>{
		//let urls = typeof urls === 'string' ? [urls] : urls;
		for( let i=0;i<urls.length; i++ ){
			let link=document.createElement('link');
		 	link.setAttribute('rel','stylesheet');
		 	link.setAttribute('type','text/css');
		 	link.setAttribute('href',urls[i]);
		 	link.setAttribute('class','main_css');
	 		document.getElementById('main_box').appendChild(link);
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
	});