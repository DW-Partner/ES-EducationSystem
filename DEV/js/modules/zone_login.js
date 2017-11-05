	require('./zone_login.css');//引入css文件
	import hex_md5 from '../kit/md5.js';
	import QRCode from '../kit/qrcode.js';

	// alert( validate.tel('1234567655') );

    //     var qrcode = new QRCode($("div")[0], {
		  // text: 'your content',
		  // width: 256,
		  // height: 256,
		  // colorDark : '#000000',
		  // colorLight : '#ffffff',
    //     });
    //     qrcode.makeCode("http://www.baidu.com");

	//http://www.jb51.net/article/82831.htm
	let set;
	$('.content_box').on('click', '.loginType', function(){
		let self = $(this);
		const type = self.data('type');
		const dom = type === 'passwordLogin' ? '.qrcodeLogin' : '.passwordLogin';
		self.parent().slideUp();
		$( dom ).slideDown();

		if( dom === '.qrcodeLogin' ){
			clearInterval(set);
			set = setInterval(function(){
				console.log(1)
			},2000);
		}else{
			clearInterval(set);
		}

	}).on('click', '#submit_login', function(){

		//$.dialogFull.Alert(234567);

		const sub_data = $.form.get();

		if( !sub_data ){
			return;
		}
		// alert( sub_data.passpord )
		sub_data.password = hex_md5( sub_data.password );
		$.form.submit({
			data: sub_data
		});
		console.log(sub_data);
	})
