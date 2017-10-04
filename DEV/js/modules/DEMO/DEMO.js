(function($,$mainBox) {

	require('./DEMO.css');//引入css文件


	$('#right_content p').text('DEMO');
	$mainBox.on('click', 'p', ()=>{
		alert(5678);
	})

	//distory方法，挂载与$上，
	$.distory = ()=>{
		$mainBox.off();
		console.log('distory!')
	}


})($,$.mainBox);