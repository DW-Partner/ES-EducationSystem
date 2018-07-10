	require('./ZoneLogin.css');//引入css文件
	import hex_md5 from '../kit/md5.js';
	import QRCode from '../kit/qrcode.js';

	//生成二维码图片start
	const qrcode_data = $('#qecode_data').val();
    let qrcode = new QRCode($(".qrcode")[0], {
	  text: 'your content',
	  width: 256,
	  height: 256,
	  colorDark : '#000000',
	  colorLight : '#ffffff',
    });
    qrcode.makeCode(qrcode_data);
	//生成二维码图片end

	//http://www.jb51.net/article/82831.htm


	let loginJump = (qid,loginid)=>{
		$.ajax({
             type: "post",
             url: "/pss/scanLogin",
             data: {
             	qid: qid,
             	loginid: loginid
             },
             dataType: "json",
             success: function(res){
             	if( res.errcode != 0 ){
                        if( res.errmsg.indexOf('frozen') > -1 ){
                              $('.content_box').html( '<div class="frozen"><p>您的账号已被冻结，请与机构联系！</p></div>' );
                              return;
                        }
             		$.dialogFull.Tips( res.errmsg );
             		return;
             	}
             	$.dialogFull.Tips('登录成功！');
             	window.location.href = res.data.url;
            },
            error: function(){
            	$.dialogFull.Tips( "网络错误，请稍后重试" );
            }
         });
	}


	let set;
	let queryScanResult = (qid)=>{
		$.ajax({
             type: "post",
             url: "/pss/queryScanResult",
             data: {
             	qid: qid
             },
             dataType: "json",
             success: function(res){
             	if( res.errcode == 50001 ){
             		//未扫描
             	}else if( res.errcode == 50002 ){
             		//扫描未确定
             		$(".qrcodeLogin").hide();
             		$(".loginStatus_success").show();
             	}else if( res.errcode == 50003 ){
             		clearInterval(set);
             		$(".qrcodeLogin, .loginStatus_success").hide();
             		$(".loginStatus_error").show();
             	}else if( res.errcode == 0 ){
             		clearInterval(set);
             		loginJump( qid, res.data.loginid );
             	}else{
             		$.dialogFull.Tips( res.errmsg );
             	}
            },
            error: function(){
            	$.dialogFull.Tips( "网络错误，请稍后重试" );
            }
         });

	};


	set = setInterval(function(){
		queryScanResult( qrcode_data )
	},2000);

	$('.content_box').on('click', '.loginType', function(){
		let self = $(this);
		const type = self.data('type');
		const dom = type === 'passwordLogin' ? '.qrcodeLogin' : '.passwordLogin';
		self.parent().slideUp();
		$( dom ).slideDown();

		if( dom === '.qrcodeLogin' ){
			clearInterval(set);
			set = setInterval(function(){

				queryScanResult( qrcode_data )

			},2000);
		}else{
			clearInterval(set);
		}

	}).on('click', '#submit_login', function(){
		const sub_data = $.form.get();
		if( !sub_data ){
			return;
		}
		sub_data.password = hex_md5( sub_data.password );
            sub_data.usertype = 'zone';
		$.form.submit({
                  url: '/pss/passwordLoginEx',
			data: sub_data,
			success: (res) => {
				if( res.errcode != 0 ){
             		$.dialogFull.Tips( res.errmsg );
					return;
				}
             	$.dialogFull.Tips('登录成功！');
             	window.location.href = res.data.url;
			},
            error: function(){
            	$.dialogFull.Tips( "网络错误，请稍后重试" );
            }
		});
	}).on('click', '.loginStatus_error .btn', function(){
		window.location.reload();
	})
