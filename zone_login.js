	require('./zone_login.css');//引入css文件
	import hex_md5 from '../kit/md5.js';

	import dialogFull from '../comp/dialogFull.js';

	//dialogFull.Tips();
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
		const data = {
			a: $('input').eq(0).val(),
			b: $('input').eq(1).val(),
			c: hex_md5( $('input').eq(2).val() )
		}
		console.log(data);
	})
