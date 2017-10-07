	require('./login.css');//引入css文件


	//distory方法，挂载与$上
	$.distory = ()=>{
		$.mainBox.off();//可以不设置，在CMD文件中有统一off调用
		console.log('distory!')
	}