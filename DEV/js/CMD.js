	require('../css/CMD.css');
	// const $$ = window.$ = require('./jquery.min.js');
	window.$ = require('jquery');
	import jsonPage from './comp/jsonPage.js';//公共分页插件
	import dialogFull from './comp/dialogFull.js';//公共弹框插件
	import form from './comp/form.js';//公共表单插件

	$.dialogFull = dialogFull;
	$.jsonPage = jsonPage;
	//公共销毁方法
	$.distory = ()=>{};
	//main容器
	$.mainBox = $('#main_box');

	let base_data = {};
	if( $('#school_code').val() ){
		base_data = {
			code: $('#school_code').val()
		}
	}else{
		base_data = {
			code: $('#zone_code').val(),
			zoneid: $('#zone_zoneid').val()
		}
	}


	//公共表单插件
	$.form = {
		get: (opts)=>{
			opts = opts ? opts : {};
			opts.handle = opts.handle ? opts.handle : (opt)=>{
                opt.that.addClass('error');
				$.dialogFull.Tips({
					text: opt.text,
					status: false
				});
			}
			return form.get(opts)
		},
		submit: (opts)=>{
			form.submit(opts)
		}
	};
	//end

	//load css文件方法
	$.loadCss = (urls)=>{
		//let urls_arr = [];
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
	//end


    //时间转化start
    let changeFormat = (_format)=>{
        let format = _format ? _format : 'YYYY-MM-DD hh:mm:ss';
        const t = new Date();
        let tf = function(i) {
            return (i < 10 ? '0' : '') + i
        };
        let week = {
        	"1": "星期一",
        	"2": "星期二",
        	"3": "星期三",
        	"4": "星期四",
        	"5": "星期五",
        	"6": "星期六",
        	"0": "星期日",
        }
        return format.replace(/YYYY|MM|DD|hh|mm|ss/g, function(a) {
            switch (a) {
                case 'YYYY':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'DD':
                    return tf(t.getDate());
                    break;
                case 'hh':
                    return tf(t.getHours());
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    break;
            }
        }) + ' ' + week[ t.getDay() ]
    };
    //时间转化end
    

	//阻止浏览器默认事件
	let stopDefault = (e) => {
		if (e && e.preventDefault) {
			e.preventDefault();
		} else {
			window.event.returnValue = false;
		}
	}
	//end

	//ajax请求html页面公共方法
	let navGetHtml = (url, that) => {
		$.ajax({
			type: "get",
			dataType: "html",
			url: url,
			data: base_data,
			success: (html)=>{
				// if( html === 'xxxx' ){
				// 	window.location.href = 'xxxx';
				// 	return;
				// }
				$.mainBox.off();
				$.distory();
				that.addClass('on').siblings('.on').removeClass('on');
				$('#main_box').html( html );
			},
			error: ()=>{
            	$.dialogFull.Tips( "网络错误，请稍后重试" );
			}
		})
	}
	//end


	//内容区域ajax获取html satrt
	let ajaxGetHtml;
	$.ajaxGetHtml = ajaxGetHtml = (url, _data, _callback) => {
		$.ajax({
			type: "get",
			dataType: "html",
			url: url,
			data: _data || base_data,
			success: (html)=>{
				$.mainBox.off();
				$.distory();
				$('#main_box').html( html );
				_callback && _callback();
			},
			error: ()=>{
            	$.dialogFull.Tips( "网络错误，请稍后重试" );
			}
		})
	}
	//内容区域ajax获取html end


	//退出方法 start
	var logout = ()=>{
		$.ajax({
			type: "post",
			dataType: "json",
			url: '/pss/logout',
			data: base_data,
			success: (res)=>{
				if( res.errcode != 0 ){
                	$.dialogFull.Tips( res.errmsg );
					return;
				}
				$.distory();
				window.location.href = res.data.url;
			},
			error: ()=>{
            	$.dialogFull.Tips( "网络错误，请稍后重试" );
			}
		})
	}
	//退出方法 end


	let init = ()=>{
		$('#times').text( changeFormat('YYYY年MM月DD日') );
		$(document).on('click', '#left_nav a', function(e){
			const url = $(this).attr('href');
			const li = $(this).parent('li');
			navGetHtml( url, li );
			stopDefault(e);
		}).on('click', '#main_box a', function(e){
			const run = $(this).data('auto') == 0;
			if( run ){
				return;
			}
			const url = $(this).attr('href');
			ajaxGetHtml( url );
			stopDefault(e);
		}).on('click', '#logout', logout);
	};
	init();
