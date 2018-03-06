require('./AddOrEditZone.css');

import replaceTemplate from '../kit/replaceTemplate.js';//模板引擎
const form_tpl = '<li><span><i>*</i>校区名称</span>\
					<input type="text" class="long" placeholder="请输入校区名称" value="{name}" name="zone_name" data-validate="any" data-must="1" />\
				</li><li><span><i>*</i>负责人</span>\
					<input type="text" class="short" placeholder="请输入负责人姓名" value="{official}" name="official" data-validate="any" data-must="1" />\
				</li><li><span><i>*</i>手机</span>\
					<input type="text" class="short" placeholder="请输入手机号码" value="{mobile}" name="mobile" data-validate="mobile" data-must="1" />\
				</li><li><span>固定电话</span>\
					<input type="text" class="short" placeholder="请输入固定电话号码" value="{telephone}" name="telephone" data-validate="number" />\
				</li><li><span><i>*</i>地址</span>\
					<select class="{opacity}" data-validate="any" name="city" data-must="1" id="city"></select>\
					<select class="{opacity}" data-validate="any" name="area" data-must="1" id="area"></select>\
					<input type="text" class="" placeholder="请输入地址" value="{address}" name="address" data-validate="any" data-must="1" />\
				</li><li><span><i>*</i>校区类型</span>\
					<p class="raioBox1">\
						<label><input type="radio" value="0" name="type_1" checked>直营</label>\
						<label><input type="radio" value="1" name="type_1">合作</label>\
					</p><p class="raioBox2">\
						<label><input type="radio" value="0" name="type_2" checked>商场</label>\
						<label><input type="radio" value="1" name="type_2">社区</label>\
					</p></li>\
					<li><span>设置为旗舰</span>\
					<input type="checkbox" id="flagship" class="m-checkbox" value="1"><label for="flagship"></label></li>\
					</li>\
					<li><span><i>*</i>主营项目</span>\
					<input type="text" class="long" placeholder="请输入主营项目(不得超过3项,请用斜杠 / 隔开)" value="{coreContent}" name="core_content" data-validate="any" data-must="1" />';

let adress_data = [{city:"北京",list:[{county:"东城区",list:["东华门","景山","交道口","安定门","北新桥","东四","建国门","东直门","和平里","前门","崇文门","东花市","龙潭","体育馆路","天坛","永定门"]},{county:"西城区",list:["西长安街","新街口","月坛","展览路","德胜门","金融街","什刹海","大栅栏","天桥","椿树","陶然亭","广安门","牛街","白纸坊"]},{county:"朝阳区",list:["建外","朝外","呼家楼","三里屯","左家庄","香河园","和平街","安贞","亚运村","小关","酒仙桥","麦子店","团结湖","六里屯","八里庄","双井","劲松","潘家园","垡头","南磨房","高碑店","将台","太阳宫","大屯","望京","小红门","十八里店","平房","东风","奥运村","来广营","常营","三间房","管庄","金盏","孙河","崔各庄","东坝","黑庄户","豆各庄","王四营","首都机场","望京"]},{county:"丰台区",list:["右安门","太平桥","西罗园","大红门","南苑","东高地","东铁匠营","卢沟桥","新村","长辛店","云岗","马家堡","和义","方庄","宛平","王佐","卢沟桥","花乡"]},{county:"石景山",list:["八宝山","老山","八角","古城","苹果园","金顶街","广宁","五里坨"]},{county:"海淀区",list:["万寿路","永定路","羊坊店","甘家口","八里庄","紫竹院","北下关","北太平庄","学院路","中关村","黄庄","青龙桥","清华园","燕园","香山","清河","花园路","西三旗","马连洼","田村路","上地","万柳","东升","曙光","温泉","四季青","西北旺","苏家坨","上庄"]},{county:"门头沟区",list:["大峪","城子","东辛房","大台","王平","潭柘寺","永定","龙泉","军庄","雁翅","斋堂","清水","妙峰山"]},{county:"房山区",list:["城关","东风","向阳","迎风","新乡","星城","拱辰","西潞","良乡","琉璃河","周口店","佛子庄","大安山","史家营","南窖","霞云岭","蒲洼"]},{county:"通州区",list:["中仓","新华","北苑","玉桥","永顺","梨园","宋庄","张家湾","漷县","马驹桥","西集","台湖","永乐店","潞城","于家务"]},{county:"顺义区",list:["胜利","光明","空港","旺泉","双丰","仁和","后沙峪","天竺","杨镇","牛栏山","南法信","马坡","石园","高丽营","李桥","李遂","南彩","北务","大孙各庄","张镇","龙湾屯","木林","北小营","北石槽","赵全营"]},{county:"昌平区",list:["城北","南口","马池口","沙河","城南","回龙观","东小口","阳坊","小汤山","南邵","崔村","百善","北七家","兴寿","长陵","流村","十三陵"]},{county:"大兴区",list:["兴丰","林校路","清源","亦庄","黄村","旧宫","西红门","青云店","采育","安定","礼贤","榆垡","庞各庄","北臧村","魏善庄","长子营","瀛海"]},{county:"怀柔",list:[]},{county:"平谷",list:[]},{county:"密云",list:[]},{county:"延庆",list:[]}]}];

let addressHandle = ( data )=>{
	let _area = '';
	data.map(function(item, index){
		const _county = item.county;

		if( item.list.length ){
			item.list.map(function(_item){
				let obj = {
					value : _county + '-' + _item
				};
		    	_area += replaceTemplate( '<option value="{value}">{value}</option>', obj );
			});
			return;
		}
		let obj = {
			value : _county
		};
		_area += replaceTemplate( '<option value="{value}">{value}</option>', obj );

	})
	$('#area').html( _area );
	
}

let _citys = '';
adress_data.map(function(item,index){
	item.index = index;
	_citys += replaceTemplate( '<option value="{city}" data-index="{index}">{city}</option>', item );
});

const zoneid = $('#zoneid').val();
let flagshipBar;
if( zoneid ){
    $.ajax({
	    type: "post",
	    dataType: "json",
	    url: '/pss/getZoneInfo',
	    data: {
	        code: $('#school_code').val(),
	        zoneid: zoneid
	    },
	    success: (res)=>{
	        if( res.errcode != 0 ){
	            $.dialogFull.Tips( res.errmsg );
	             return;
	        }
	        res.data.opacity = 'opacity';
	        const html = replaceTemplate( form_tpl, res.data );
	        $('.pub_form ul').html( html );
	        $('[name=type_1]').eq( +res.data.type.split('')[0] ).prop('checked', true);
	        $('[name=type_2]').eq( +res.data.type.split('')[1] ).prop('checked', true);
	    
			$('#city').html( _citys ).val( res.data.city ).attr('disabled','disabled');
			addressHandle( adress_data[0].list );
	    	$('#area').val( res.data.area ).attr('disabled','disabled');
		    res.data.flagship == 1 ? $('#flagship').prop('checked',true) : '';
		    flagshipBar = $('[name="type_1"]:checked').val() == '0' ? true : false;
		    if( !flagshipBar ){
    			$('#flagship').attr('checked',false).attr( 'disabled', 'disabled' );
		    }
	    },
	    error: ()=>{
	        $.dialogFull.Tips( "网络错误，请稍后重试！" );
	    }
	})
}else{
	const html = replaceTemplate( form_tpl, {} );
	$('.pub_form ul').html( html );
	$('#city').html( _citys );
	addressHandle( adress_data[0].list );
}

$.mainBox.on('click', '#submit_AddOrEditZone', function(){
	const sub_data = $.form.get({
        error_text: 'placeholder',//存放错误文案的属性名
	});
	if( !sub_data ){
		return;
	}

	sub_data.type = $('[name="type_1"]:checked').val() + $('[name="type_2"]:checked').val();

	if( sub_data.core_content.split('/').length > 3 ){
        $.dialogFull.Tips( '主营项目不得超过3项，请重新编辑！' );
	}

	sub_data.flagship = $('#flagship:checked').val() ? 1 : 0;

	$.form.submit({
		url: zoneid ? '/pss/editZone' : '/pss/addZone',
		data: {
			code: $('#school_code').val(),
			zoneid: zoneid ? zoneid : '',
			data: JSON.stringify( sub_data )
		},
		success: (res) => {
			if( res.errcode != 0 ){
         		$.dialogFull.Tips( res.errmsg );
				return;
			}
        	$.dialogFull.Tips( "提交成功！" );
         	$.ajaxGetHtml({
         		url: '/pss/goZoneDetail',
         		data: {
         			zoneid: zoneid || res.data.zoneid
         		}
         	})
		},
        error: function(){
        	$.dialogFull.Tips( "网络错误，请稍后重试" );
        }
	});
}).on('change', '#city', function(){
	const index = $(this).find('option:checked').data('index');
	addressHandle( adress_data[index].list );
}).on('change', '[name="type_1"]', function(){
    flagshipBar = $('[name="type_1"]:checked').val() == '0' ? true : false;
    if( !flagshipBar ){
    	$('#flagship').prop('checked',false).attr( 'disabled', 'disabled' );
    }else{
    	$('#flagship').removeAttr( 'disabled' );
    }
})

