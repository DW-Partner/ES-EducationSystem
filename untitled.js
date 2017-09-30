/*
1、ajax请求返回字段格式:统一放在data字段吧
考虑到数据交互期间，前端将会用到js模板引擎，统一使用data字段作为数据源
*/

{
	errcode:0,//标准成功code
	errmsg:"xxxx",//相关描述报文
	data:{
		//返回的业务数据
	}
}
//例如 3.24.获取教师教学信息 ：
{
	errcode:0,//标准成功code
	errmsg:"success",//相关描述报文
	data:{
		ready_rate:"xxxxxx",
		work_rate:"xxxxxx",
		lesson_ num:"xxxxxx",
		class_num:"xxxxxx"
		//返回的业务数据
	}
}


/*
2、ajax请求返回数据格式: ajax接口原则上不返回html代码，可直接返回url
考虑页面开发过程中，涉及当前页面url处理、history收取、事件污染等，可直接返回url，由前端js负责跳转
*/

//例如 2.4. 提交新密码 ：
//上行：
{
	mobile: 13566665555
	vcode: 457457
	newpass: "passwords123"
}
//下行：
{
	errcode:0,//标准成功code
	errmsg:"success",//相关描述报文
	data:{
		url:"/pss/goHome"
		//前端接收到该参数，进行url跳转
	}
}

