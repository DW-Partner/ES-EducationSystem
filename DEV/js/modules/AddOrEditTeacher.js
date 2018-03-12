require('./AddOrEditTeacher.css');

//{"data":{"birthday":"1991-05-11","address":"平乐园","gender":"女","mobile":"1323345","zone_name":"望京","type":"助教","mtime":"2017-10-18 12:45:49","tid":1,"native_place":"上海","name":"赵赵","id_num":"4013420333","entry_day":"2017-07-20","status":"正常"},"errcode":"0","errmsg":"success"}




import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
const form_tpl = '<li>\
					<span><i>*</i>教师姓名</span>\
					<input type="text" class="normal" placeholder="请输入教师姓名" value="{name}" name="name" data-validate="any" data-must="1" />\
					<span><i>*</i>教师性别</span>\
					<select name="gender" data-validate="any" placeholder="请选择教师性别" data-must="1">\
						<option value="">请选择</option>\
						<option value="男">男</option>\
						<option value="女">女</option>\
					</select>\
				</li>\
				<li>\
					<span><i>*</i>第二称谓</span>\
					<input type="text" class="normal" placeholder="请输入第二称谓" value="{name_2}" name="name_2" data-validate="any" data-must="1" />\
				</li>\
				<li>\
					<span>出生年月</span>\
					<input type="text" id="birthday" class="normal" placeholder="请输入出生年月" value="{birthday}" name="birthday" data-validate="any" />\
					<span>籍贯</span>\
					<input type="text" class="short" placeholder="请输入籍贯" value="{native_place}" name="native_place" data-validate="any" />\
				</li>\
				<li>\
					<span>身份证号</span>\
					<input type="text" class="normal" placeholder="请输入身份证号" value="{id_num}" name="id_num" data-validate="IDnumber" />\
				</li>\
				<li>\
					<span><i>*</i>手机号</span>\
					<input type="text" class="normal" placeholder="请输入手机号" value="{mobile}" name="mobile" data-validate="any" data-must="1" />\
					<span><i>*</i>所属校区</span>\
					<select id="zoneList" name="zone_id" data-validate="any" placeholder="请选择所属校区" data-must="1" >\
					</select>\
				</li>\
				<li>\
					<span>当前住址</span>\
					<input type="text" class="long" placeholder="请输入当前住址" value="{address}" name="address" data-validate="any" />\
				</li>\
				<li>\
					<span>入职时间</span>\
					<input type="text" id="entry_day" class="normal" placeholder="请输入入职时间" value="{entry_day}" name="entry_day" data-validate="any" />\
					<span><i>*</i>类别</span>\
					<select name="type" data-validate="any" placeholder="请选择类别" data-must="1">\
					<option value="">请选择</option>\
					<option value="主课">主课</option>\
					<option value="助教">助教</option>\
					</select>\
				</li>\
				<li>\
					<span class="wide">毕业学历信息</span>\
					<input type="text" class="long" placeholder="请输入“毕业院校”、“毕业时间”、“学历”3项信息，输入格式：毕业院校/毕业时间/学历" value="{education}" name="education" data-validate="any" />\
				</li>\
				<li>\
					<span>其他信息</span>\
					<input type="text" class="long" placeholder="请输入" value="{other_info}" name="other_info" data-validate="any" />\
				</li>';



const tid = $('#tid').val();

//获取校区列表 start
let getZoneList = (zone_id)=>{
    $.ajax({
        type: "post",
        dataType: "json",
        url: '/pss/getZoneList',
        data: {
            code: $('#school_code').val() || $('#zone_code').val()
        },
        success: (res)=>{
            if( res.errcode != 0 ){
                $.dialogFull.Tips( res.errmsg );
                return;
            }
            let options = '<option value="">请选择</option>';
            let data = res.data;
            data.map(function(item){
                options += '<option value="' + item.id +'">'+ item.name +'</option>'
            });
            $('#zoneList').html( options ).val( zone_id || '' );
            $.laydate.render({
				elem: '#birthday',
					type: 'date'
			});
            $.laydate.render({
				elem: '#entry_day',
					type: 'date'
			});
        },
        error: ()=>{

        }
    });
}

//getZoneList();



let getTeacherDetail = ()=>{
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getTeacherDetail',
	    data: {
	        code: $('#school_code').val() || $('#zone_code').val(),
	        tid: tid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        const html = replaceTemplate( form_tpl, res.data );
	        $('.pub_form ul').html( html );
			getZoneList( res.data.zone_id );
			$('[name="type"]').val( res.data.type );
			$('[name="gender"]').val( res.data.gender );
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}


if( tid ){
	getTeacherDetail();
	$( '.btn_dis' ).data( 'href', '/pss/goTeacherDetail?tid=' + tid );
}else{
    const html = replaceTemplate( form_tpl, {} );
    $('.pub_form ul').html( html );
	getZoneList();
}

$.mainBox.on('click', '#submit_AddOrEditTeacher', function(){
	const sub_data = $.form.get({
        error_text: 'placeholder',//存放错误文案的属性名
	});
	if( !sub_data ){
		return;
	}
	sub_data.zone_id = +sub_data.zone_id;

    let ajaxData = {
        code: $('#school_code').val() || $('#zone_code').val(),
        tid: tid,
		data: JSON.stringify( sub_data )
    }
    !ajaxData.tid && delete ajaxData.tid;

	$.form.submit({
		url: tid ? '/pss/editTeacher' : '/pss/addTeacher',
		data: ajaxData,
		success: (res) => {
			if( res.errcode != 0 ){
         		$.dialogFull.Tips( res.errmsg );
				return;
			}
        	$.dialogFull.Tips( "提交成功！" );
         	$.ajaxGetHtml({
         		url: '/pss/goTeacherDetail',
         		data: {
         			tid: tid || res.data.tid
         		}
         	})
		},
        error: function(){
        	$.dialogFull.Tips( "网络错误，请稍后重试" );
        }
	});
})
