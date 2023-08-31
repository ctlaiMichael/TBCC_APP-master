/**
 * [表單處理]
 * v2.2 2017.03.20
 */
define([
	"app"
]
, function (MainApp) {
//=====[formServices START 表單相關]=====//
MainApp.register.service("formServices",function(i18n)
{
	var MainClass = this;

	/**
	 * [checkEmpty 判斷空值]
	 * @param  {string} str [字串]
	 * @param  {blooean} return_type [回傳類型] 1 blooean , 0 obj
	 * @param  {blooean} zero_type [0是否可以]
	 * @return {obj}	{status:blooean,msg:'error msg'}
	 */
	this.checkEmpty = function(str,return_type,zero_type){
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.EMPTY')
		};
		if(typeof str === 'object'){
			data.status = (Object.keys(str).length <= 0) ? false : true;
			if(return_type){
				return data.status;
			}
			return data;
		}
		if(return_type){
			data = data.status;
		}
		if(typeof str === 'number'){
			str = str.toString();
		}
		if(typeof str !== 'string'){
			return data;
		}
		str = str.replace(/^\s+|\s+$/g, '');
		if(str === ''){
			return data;
		}
		if(zero_type && str == '0'){
			return data;
		}
		if(return_type){
			return true;
		}
		data.status = true;
		data.msg = '';
		return data;
	}

	/**
	 * [checkUndefined 檢查資料是否存在]
	 * @param  {[type]} inp_data      [description]
	 * @param  {[type]} required_list [description]
	 * @return {[type]}               [description]
	 */
	this.checkUndefined = function(inp_data,required_list){
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.ERROR'),
			error_msg_list : {}
		};
		data.error_msg_list = {};
		var result;
		var obj_key;
		for(key in required_list){
			obj_key = required_list[key];
			result = MainClass.checkEmpty(inp_data[obj_key]);
			if(!result.status){
				// console.log('check empty :'+obj_key+'/'+inp_data[obj_key]);
				data.error_msg_list[obj_key] = result.msg;
			}
		}
		//==check end==//
		if(Object.keys(data.error_msg_list).length === 0){
			data.status = true;
			data.msg = '';
			data.inp = inp_data;
			return data;
		}
		return data;
	}

	/**
	 * [checkIdentity 身份證字號檢查]
	 * @param  {string} identity [身分證字號檢查]
	 * @return {obj}	{status:blooean,msg:'error msg'}
	 */
	this.checkIdentity = function(identity)
	{
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.IDENTITY'),
			data : ''
		};
		if(typeof identity !== 'string'){
			return data;
		}
		var res = /^[A-Z]{1}[12]{1}\d{8}$/;
		identity = identity.toUpperCase();
		if(!res.test(identity)){
			return data;
		}
		var firstnum = identity.charAt(0);
		var first_list = {A:10,B:11,C:12,D:13,E:14,F:15,G:16,H:17,I:34,J:18,K:19,L:20,M:21,N:22,O:35,P:23,Q:24,R:25,S:26,T:27,U:28,V:29,W:32,X:30,Y:31,Z:33};
		firstnum = first_list[firstnum];
		var num = Math.floor(firstnum/10) + firstnum%10*9;
		var string_list = identity.substring(1,identity.length).split('');
		var i = 8;
		for(key in string_list){
			num += string_list[key]*i;
			i--;
		}
		var check_num = parseInt(identity.charAt(9));
		var check_code = 10-(num%10);
		if(check_num === check_code%10 ){
			data.status = true;
			data.msg = '';
			data.data = identity;
			return data;
		}
		return data;
	}

	/**
	 * [checkEmail Email檢查]
	 * @param  {string} str [Email]
	 * @return {obj}	{status:blooean,msg:'error msg'}
	 */
	this.checkEmail = function(str){
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.EMAIL')
		};
		if(typeof str !== 'string'){
			return data;
		}
		var res = /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
		if(res.test(str)){
			data.status = true;
			data.msg = '';
			return data;
		}
		return data;
	}

	this.checkuseridalen = function(str){
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.USERIDA')
		};
		
		if(str.length>5 && str.length<17){
			data.status = true;
			data.msg = '';
			return data;}
		
		return data;
	}

	this.checkpasswoedlen = function(str){
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.USERIDA')
		};
		
		if(str.length>7 && str.length<13){
			data.status = true;
			data.msg = '';
			return data;}
		
		return data;
	}

	/**
	 * [checkMobile 手機檢查]
	 * @param  {string} str [手機]
	 * @return {obj}	{status:blooean,msg:'error msg'}
	 */
	this.checkMobile = function(str){
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.MOBILE')
		};
		if(typeof str !== 'string'){
			return data;
		}
		var res = /^[09]{2}\d{8}$/;
		if(res.test(str)){
			data.status = true;
			data.msg = '';
			return data;
		}
		return data;
	}


	/**
	 * [checkTelphone 電話檢查]
	 * @param  {obj} tel_obj      [電話物件]
	 * @return boolean
	 * i18n請使用:INPUT_CHECK.NUMBER
	 */
	this.checkTelphone = function(tel_obj){
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.TELPHONE.ERROR')
		};
		if(typeof tel_obj.area !== 'string' || typeof tel_obj.tel !== 'string'){
			return data;
		}
		var extension_str = '';
		if(typeof tel_obj.extension_type !=='undefined' && tel_obj.extension_type){
			if(typeof tel_obj.extension !=='undefined' && tel_obj.extension !== ''){
				extension_str = tel_obj.extension;
			}else{
				var tmp = tel_obj.tel.split('#');
				if(tmp.length === 2){
					tel_obj.tel = tmp[0];
					extension_str = tmp[1];
				}
			}
		}else{
			tel_obj.extension_type = false;
		}
		var res = /^\d{0,3}$/;
		if(!res.test(tel_obj.area)){
			data.msg += '('+i18n.getStringByTag('INPUT_CHECK.TELPHONE.AREA')+')'; //區碼不符合規則
			return data;
		}
		// res = /^\d{7}$/;
		// if(!res.test(tel_obj.tel)){
		// 	return data;
		// }
		var real_tel = tel_obj.area +''+ tel_obj.tel;
		if(real_tel.length > 10 ){
			data.msg += '('+i18n.getStringByTag('INPUT_CHECK.TELPHONE.LENGTH')+')'; //長度不符合規則
			return data;
		}
		if(tel_obj.extension_type && extension_str !== ''){
			res = /^\d{1,10}$/;
			if(!res.test(extension_str)){
				data.msg += '('+i18n.getStringByTag('INPUT_CHECK.TELPHONE.EXTEN')+')'; //分機號碼不符合規則
				return data;
			}
		}
		data.status = true;
		data.msg = '';
		return data;
	}

	/**
	 * [checkDate 日期檢查]
	 * @param  {string} str      [日期字串]
	 * @return {obj}	{status:blooean,msg:'error msg'}
	 * 轉date計算比較妥當
	 */
	this.checkDate = function(str){
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.DATE'),
			formate:'',
			time:0
		};
		var dt = new Date(str);
		var timestamp = dt.getTime();
		if(timestamp){
			var month = dt.getMonth()+1;
			var day = dt.getDate();
			var year = dt.getFullYear();
			data.status = true;
			data.msg = '';
			data.formate = year+'/'+month+'/'+day;
			data.time = timestamp;
			data.data_list = {
				'y' : year,
				'm' : month,
				'd' : day,
				'h' : dt.getHours(),
				'i' : dt.getMinutes(),
				's' : dt.getSeconds()
			};
			data.date = dt;
			return data;
		}
		return data;
	}

	/**
	 * [checkEnglish 英文檢查]
	 * @param  {string} str      [英文字串]
	 * @param  {boolean} spacebar [是否允許空白]
	 * @return {obj}	{status:blooean,msg:'error msg'}
	 */
	this.checkEnglish = function(str,spacebar){
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.ENGLISH')
		};
		var res = /^[A-Za-z]+$/;
		if(spacebar){
			res = /^[A-Za-z\s\.-]+$/;
		}
		if(res.test(str)){
			data.status = true;
			data.msg = '';
			return data;
		}
		return data;
	}

	/**
	 * [checkNumber 數字檢查]
	 * @param  {string} str      [數字字串]
	 * @param  {obj} specail      [特殊設定]
	 * @return {obj}	{status:blooean,msg:'error msg'}
	 */
	this.checkNumber = function(str,specail){
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.NUMBER.NUMBER')
		};
		var res = /^(0|(\-|)([1-9]|[0-9]+\.[0-9]*|)[1-9][0-9]*)$/;
		if(typeof specail !== 'undefined'){
			switch(specail){
				case 'positive': //正整數不含0
					res = /^[0-9]*[1-9][0-9]*$/;
					data.msg = i18n.getStringByTag('INPUT_CHECK.NUMBER.POSITIVE');
				break;
				case 'negative': //負整數不含0
					res = /^-[0-9]*[1-9][0-9]*$/;
					data.msg = i18n.getStringByTag('INPUT_CHECK.NUMBER.NEGATIVE');
				break;
				case 'positive_float': //正數不含0
					str = parseFloat(str);
					//不允許0,0.00
					//允許1,0.01,1.00,1.01
					// res = /^[0-9]+\.[0-9]*[1-9][0-9]*$/;
					res = /^(([1-9]|[0-9]+\.[0-9]*|)[1-9][0-9]*)$/;
					data.msg = i18n.getStringByTag('INPUT_CHECK.NUMBER.POSITIVE_FLOAT');
				break;
				case 'negative_float': //負數不含0
					str = parseFloat(str);
					// res = /^-[0-9]+\.[0-9]*[1-9][0-9]*$/;
					res = /^-(([1-9]|[0-9]+\.[0-9]*|)[1-9][0-9]*)$/;
					data.msg = i18n.getStringByTag('INPUT_CHECK.NUMBER.NEGATIVE_FLOAT');
				break;
			}
		}
		if(!res.test(str)){
			return data;
		}
		data.status = true;
		data.msg = '';
		return data;
	}

	/**
	 * [checkLength 字串長度檢查]
	 * @param  {[type]} str    [字串]
	 * @param  {[type]} length [檢核長度]
	 * @param  {[type]} type [檢核類型]
	 * @return {[type]}        [description]
	 */
	this.checkLength = function(str,length,type){
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.STRLENGTH')
		};
		if(typeof str !== 'string'){
			return data;
		}
		if(typeof type === 'undefined'){
			type = 'same';
		}

		switch(type){
			case 'max':
				if(str.length > length){
					data.msg = i18n.getStringByTag('INPUT_CHECK.STRLENGTH_MAX');
					data.msg += '('+length+')';
					return data;
				}
			break;
			case 'min':
				if(str.length < length){
					data.msg = i18n.getStringByTag('INPUT_CHECK.STRLENGTH_MIN');
					data.msg += '('+length+')';
					return data;
				}
			break;
			case 'same':
				if(str.length != length){
					data.msg = i18n.getStringByTag('INPUT_CHECK.STRING_LENGTH');
					data.msg += '('+length+')';
					return data;
				}
			break;
		}

		data.status = true;
		data.msg = '';
		return data;
	}


	/**
	 * [checkYmData 檢查有效年月]
	 * @param  {string} str      [數字字串]
	 * @return {obj}	{status:blooean,msg:'error msg'}
	 */
	this.checkYmData = function(str){
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.CARD.YM'),
			data : {}
		};

		if(typeof str === 'undefined' || str === ''){
			return data;
		}
		var cardM = 0;
		var cardY = 0;
		if(str.indexOf('/') > -1){
			var tmp = str.split('/');
			cardM = parseInt(tmp[0]);
			cardY = tmp[1].toString();
			if(cardY.length > 2){
				cardY = cardY.substr(-2);
			}
			cardY = parseInt(cardY);
		}else{
			var tmp = str.replace('/','');
			cardM = parseInt(tmp.substr(0,2));
			cardY = parseInt(tmp.substr(2,2));
		}

		if(!cardY || !cardM || cardY <1 || cardM < 1 || cardM > 12){
			return data;
		}
		cardM = ("0"+cardM).substr(-2);
		cardY = ("0"+cardY).substr(-2);
		var cardYearString = cardM +""+ cardY;
		//檢查有效年月長度
		var result;
		var res = /^[0-9]{4}$/;
		if(!res.test(cardYearString)){
			// console.log('length:'+cardYearString);
			return data;
		}
		data.status = true;
		data.msg = '';
		data.data = {
			string : cardYearString, //MMYY
			m : cardM,
			y : cardY,
			formate : cardM + '/' + cardY
		};
		return data;
	}

	/**
	 * [checkCardNum 檢查信用卡卡號]
	 * @param  {string} str      [數字字串]
	 * @return {obj}	{status:blooean,msg:'error msg'}
	 */
	this.checkCardNum = function(str){
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.CARD.CARDNUM')
		};
		var res = /^[0-9]{16}$/;
		if(!res.test(str)){
			return data;
		}
		if(str.length === str.match(new RegExp(str.substr(0,1), "g")).length){
			//禁輸全一樣的值
			return data;
		}
		data.status = true;
		data.msg = '';
		return data;
	}

	/**
	 * [checkCardCode 檢查信用卡檢查碼]
	 * @param  {string} str      [數字字串]
	 * @return {obj}	{status:blooean,msg:'error msg'}
	 */
	this.checkCardCode = function(str){
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.CARD.CARD_CHECK_CODE')
		};
		var res = /^[0-9]{3}$/;
		if(!res.test(str)){
			return data;
		}
		data.status = true;
		data.msg = '';
		return data;
	}

	/**
	 * [checkActNum 檢查銀行帳號]
	 * @param  {string} str      [數字字串]
	 * @return {obj}	{status:blooean,msg:'error msg'}
	 */
	this.checkActNum = function(str){
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.CARD.ACNT') //請輸入正確的銀行帳號
		};
		var result = MainClass.checkNumber(str,"positive");
		if(!result.status){
			return data;
		}
		//不確定是否要長度判斷
		var res = /^[0-9]{8,16}$/;
		if(!res.test(str)){
			return data;
		}
		if(str.length === str.match(new RegExp(str.substr(0,1), "g")).length){
			//禁輸全一樣的值
			return data;
		}
		data.status = true;
		data.msg = '';
		return data;
	}


	/**
	 * [checkPaymentId 檢查銷帳編號]
	 * @param  {[type]} str [description]
	 * @return {[type]}     [description]
	 */
	this.checkPaymentId = function(str){
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.PAYMENT_ID'),
			data : ''
		};
		// 99666+身分證字號英文字(A=01，B=02---------或請參考Q&A中Q10之說明)+身分證字號後9碼。
		var bank_key = '99666';
		if(str.substr(0,5) !== bank_key){
			return data;
		}
		// 身分証字號英文字母第一碼：A為01，B為02，C為03，D為04，E為05，F為06，G為07，H為08，I為09，J為10，K為11，L為12，M為13，N為14，O為15，P為16，Q為17，R為18，S為19，T為20，U為21，V為22，W為23，X為24，Y為25，Z為26。
		var tmp = parseInt(str.substr(5,2));
		if(tmp < 1 || tmp > 26){
			return data;
		}
		tmp = str.substr(7);
		if(tmp.length !== 9){
			return data;
		}
		data.status = true;
		data.msg = '';
		data.data = str;
		return data;
	}


	this.checkENnumber = function(str) {
		var data = {
			status : false,
			msg : '請輸入英數字'
		};
		var reg = /^[a-zA-Z0-9]*$/g;
        if (reg.test(str)) {
            data.status = true;
			data.msg = '';
        }

	
		return data;
	}

	this.checkCnEN = function(str) {
		var data = {
			status : false,
			msg : '請勿輸入數字與符號資料'
		};
        var reg = /[《》？！┼：；、﹞﹝」「。／，+'"0-9!@#$&\*%^<>();\/?]/g;
        if (!reg.test(str)) {
            data.status = true;
			data.msg = '';
        }
		return data;

	}
	this.checkCnNameNew = function(str) {
		var data = {
			status : false,
			msg : '請勿輸入非中文資料'
		};
        var reg = /["a-zA-Z0-9!@#$&\*%^<>();\/?]/g;
        if (!reg.test(str)) {
            data.status = true;
			data.msg = '';
        }
		return data;

	}
	this.checkCnName = function(str) {
		var data = {
			status : false,
			msg : '請勿輸入符號'
		};


		// "" <>  () / ; %
        var reg = /["!@&#$%^<>();\/?]/g;
        if (!reg.test(str)) {
            data.status = true;
			data.msg = '';
        }

		// var check_number = true; // 允許數值
		// var check_english = true; // 允許英文
		// var check_symbol = false; // 允許符號
        // var i;
        // for (i = 0; i < str.length; i++) {
        //     var tmp_check = false;
        //     var check_str = str.charCodeAt(i);
		// 	// 允許英文數字特殊符號 // https://www.obliquity.com/computer/html/unicode0000.html
		// 	if (check_str >= 0x0020 && check_str <= 0x007E) {
		// 		tmp_check = true;
		// 		// 數值 0030~0039
		// 		var is_type = 'symbol';
		// 		if (check_str >= 0x0030 && check_str <= 0x0039) {
		// 			is_type = 'number';
		// 			if (!check_number) {
		// 				// 不允許數值
		// 				tmp_check = false;
		// 			}
		// 		}
		// 		// 英文 0041~005A, 0061~007A
		// 		if ((check_str >= 0x0041 && check_str <= 0x005A)
		// 			|| (check_str >= 0x0061 && check_str <= 0x007A)
		// 		) {
		// 			is_type = 'english';
		// 			if (!check_english) {
		// 				// 不允許英文
		// 				tmp_check = false;
		// 			}
		// 		}
		// 		// 不允許特殊符號
		// 		if (!check_symbol && is_type === 'symbol') {
		// 			tmp_check = false;
		// 		}
		// 	}

        //     if (!tmp_check) {
        //         data.status = false;
        //         break;
        //     }
		// }
		// if(data.status){
		// 	data.msg = '';
		// }
		return data;
	}


});
//=====[formServices END]=====//


/**
 * [paymentIdFilter 銷帳編號]
 */
MainApp.register.filter('paymentIdFilter', function(
	formServices
){
	return function(str){
		var result = formServices.checkIdentity(str);
		var payment_id = str;
		if(result.status){
			//==身分證==//
			// 99666+身分證字號英文字(A=01，B=02---------或請參考Q&A中Q10之說明)+身分證字號後9碼。
			// 身分証字號英文字母第一碼：A為01，B為02，C為03，D為04，E為05，F為06，G為07，H為08，I為09，J為10，K為11，L為12，M為13，N為14，O為15，P為16，Q為17，R為18，S為19，T為20，U為21，V為22，W為23，X為24，Y為25，Z為26。
			var identity = result.data;
			var idS = identity.substring(0,1).toUpperCase();
			var idE = identity.substr(1);
			var idString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var chnum = idString.indexOf(idS);
			if(chnum < 0){
				return str; //檢驗失敗
			}
			chnum = chnum+1;
			chnum = ( '0' + chnum ).substr(-2);
			payment_id = "99666"+chnum+idE;
		}
		//==銷編檢查==//
		result = formServices.checkPaymentId(payment_id);
		if(result.status){
			return result.data;
		}else{
			return str; //檢驗失敗
		}
	};
});

/**
 * [paymentIdDecodeFilter 銷帳編號反解]
 */
MainApp.register.filter('paymentIdDecodeFilter', function(
	formServices
){
	return function(str){
		var result = formServices.checkPaymentId(str);
		var payment_id = str;
		if(result.status){
			//==身分證==//
			// 99666+身分證字號英文字(A=01，B=02---------或請參考Q&A中Q10之說明)+身分證字號後9碼。
			// 身分証字號英文字母第一碼：A為01，B為02，C為03，D為04，E為05，F為06，G為07，H為08，I為09，J為10，K為11，L為12，M為13，N為14，O為15，P為16，Q為17，R為18，S為19，T為20，U為21，V為22，W為23，X為24，Y為25，Z為26。
			var identity = result.data.replace(/^99666/,'');
			var idS = parseInt(identity.substring(0,2));
			if(idS < 1 || idS > 26){
				return str; //檢驗失敗
			}
			var idE = identity.substr(2);
			var idString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var chnum = idString.substr((idS-1),1);
			if(chnum == ''){
				return str; //檢驗失敗
			}
			payment_id = chnum+idE;
		}
		//==銷編檢查==//
		result = formServices.checkIdentity(payment_id);
		if(result.status){
			return result.data;
		}else{
			return str; //檢驗失敗
		}
	};
});


});
