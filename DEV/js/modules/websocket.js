   let websocket = {};
    //判断当前浏览器是否支持WebSocket
    if ('WebSocket' in window) {
    	let zoneid = $('#zone_zoneid').val();
    	if ( !zoneid ){
    		console.log("输入校区id"); 
    	}else {
            try{
                websocket = new WebSocket("ws://pss.idrpeng.com/wsZoneConn?zoneid=" + zoneid);
            }catch(e){
                console.log( e );
            }
    	}
    }
    else {
        console.log('当前浏览器 Not support websocket')
    }
    //连接发生错误的回调方法
    websocket.onerror = function () {
        console.log("WebSocket连接发生错误");
    };
    //连接成功建立的回调方法
    websocket.onopen = function () {
    	// 将json: {"msg_type":"zone_id","zone_id":xxx}发送给服务端
        console.log("WebSocket连接成功");
    }
    //接收到消息的回调方法
    // websocket.onmessage = function (event) {
    // 	// 解析json: {"msg_type":"ajax","ajax":"getLessonsMissList"},刷新对应的接口
    //     console.log( event.data );
    //     //setMessageInnerHTML(event.data);
    // }

    //连接关闭的回调方法
    websocket.onclose = function () {
        console.log("WebSocket连接关闭");
    }
    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function () {
        closeWebSocket();
    }
    //将消息显示在网页上
    function setMessageInnerHTML(innerHTML) {
    }
    //关闭WebSocket连接
    function closeWebSocket() {
        websocket.close();
    }
    //发送消息
    function send() {
        // let message = document.getElementById('text').value;
        // websocket.send(message);
    }
    export default websocket;