	require('./AddStudent.css');//引入css文件
	$.mainBox.on('click', 'p', ()=>{
		//alert(5678);
	})

	//distory方法，挂载与$上
	$.distory = ()=>{
		$.mainBox.off();//可以不设置，在CMD文件中有统一off调用
		console.log('distory!')
	}