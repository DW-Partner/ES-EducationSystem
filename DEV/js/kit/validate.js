export default {
	tel: ( val, handle, opts, must )=>{//手机号码
		if( !must && !val ){
			return true;
		}
		const reg = /^1[34578]\d{9}$/;
		if( !reg.test(val) ){
			opts.text = '请输入正确手机号码';
			handle( opts );
			return false;
		}
		return true;

	},
	number: ( val, handle, opts, must )=>{//数字
		if( !must && !val ){
			return true;
		}
		const reg = /^[0-9]+$/;
		if( !reg.test(val) ){
			opts.text = opts.text ? opts.text : '请输入正确数字';
			handle( opts );
			return false;
		}
		return true;

	},
	mail: ( val, handle, opts, must )=>{//数字
		if( !must && !val ){
			return true;
		}
		const reg = /^([a-zA-Z0-9]+[_.-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if( !reg.test(val) ){
			opts.text = '请输入正确邮箱';
			handle( opts );
			return false;
		}
		return true;
	},
	chinese: ( val, handle, opts, must )=>{//数字
		if( !must && !val ){
			return true;
		}
		const reg = /^[\u0391-\uFFE5]+$/;
		if( !reg.test(val) ){
			opts.text = opts.text ? opts.text : '请输入汉字';
			handle( opts );
			return false;
		}
		return true;
	},
	IDnumber: ( val, handle, opts, must )=>{//身份证
		if( !must && !val ){
			return true;
		}
		var city = [11, 12, 13, 14, 15, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 61, 62, 63, 64, 65, 71, 81, 82, 91];
	    var tip = "";
	    var pass = true;
	    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
	        tip = "身份证号格式错误";
	        pass = false;
	    } else if (city.indexOf(+code.substr(0, 2)) == -1) {
	        tip = "地址编码错误";
	        pass = false;
	    } else {
	        //18位身份证需要验证最后一位校验位
	        if (code.length == 18) {
		        code = code.split('');
		        //∑(ai×Wi)(mod 11)
		        //加权因子
		        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
		        //校验位
		        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
		        var sum = 0;
		        var ai = 0;
		        var wi = 0;
		        for (var i = 0; i < 17; i++) {
		            ai = code[i];
		            wi = factor[i];
		            sum += ai * wi;
		        }
		        var last = parity[sum % 11];
		        if (parity[sum % 11] != code[17]) {
		            tip = "校验位错误";
		            pass = false;
		        }
			}
		}
		if( !pass ){
			opts.text = '请输入正确身份证号码' || tip;
			handle( opts );
			return false;
		}
		return true || pass;
	},
	any: ( val, handle, opts, must )=>{//任意
		if( val || (!must && !val) ){
			return true;
		}
		opts.text = opts.text ? opts.text : '请填写必填项！';
		handle( opts );
		return false;

	},
	// must: ( val, handle, opts, type )=>{
	// 	if( !val ){
	// 		opts.text = '请填写必填项！';
	// 		handle( opts );
	// 		return false;
	// 	}
	// 	if( type ){
	// 		return this[type]( val, handle, opts )
	// 	}
	// 	return true;

	// },
}