/**
 * [QR Code繳卡費 Service]
 */
define([
	"app"
	,"service/formServices"
	,"service/messageServices"
]
, function (MainApp) {
//=====[cardServices START] 卡片相關=====//
MainApp.register.service("qrCode4FeeServices",function(
	i18n,$filter
	,formServices,messageServices,framework
){
	var MainClass = this;

	var DebugMode = framework.getConfig("OFFLINE", 'B');
	var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');

	/**
	 * [checkQRCode 檢核與處理]
	 * @param  {[type]} qrCode [description]
	 * @return {[type]}        [description]
	 */
	this.checkQRCode = function(qrCode){
		var data = {
			status : false,
			msg_code : 'FC0004_303',
			msg : '',
			data : {}
		};

		var result = formServices.checkEmpty(qrCode);
		if(!result.status){
			data.msg = result.msg;
			return data;
		}

		pos = qrCode.indexOf("?");
		if(pos != -1){
			qrCode = qrCode.substring(pos+1);
		}

		var itemAry = qrCode.split("&");
		var paymentData = {};
		for(i = 0; i < itemAry.length; i++){
			k = itemAry[i];
			if((pos=k.indexOf("writeOff=")) != -1){
				//銷帳編號
				paymentData.cardnum = k.substring(pos + "writeOff=".length);
			}else if((pos=k.indexOf("payableAmt=")) != -1){
				//應繳總金額
				paymentData.payableAmt = k.substring(pos + "payableAmt=".length);
			}else if((pos=k.indexOf("leastPayableAmt=")) != -1){
				//最低應繳金額
				paymentData.lowestPayableAmt = k.substring(pos + "leastPayableAmt=".length);
			}
		}

		var inp_key;
		//==銷編檢查==//
		inp_key = 'cardnum';
		result = checkWriteOff(paymentData[inp_key]);
		if(!result.status){
			data.msg = result.msg;
			return data;
		}
		paymentData[inp_key] = result.data;

		data.data = paymentData;
		data.status = true;
		data.msg_code = '';
		data.msg = '';
		return data;
	}


	/**
	 * [getCameraEvent QR Code掃描]
	 * @param  {[type]} getCallBack_method [description]
	 * @return {[type]}                    [description]
	 */
	this.getCameraEvent = function(getCallBack_method)
	{
		var data = {
			status : false,
			msg_code : 'FC0004_301',
			msg : '',
			data : {}
		};
		var success_method = function(jsonObj){
			if(typeof jsonObj !== 'object'
				|| typeof jsonObj.cancelled === 'undefined'
				|| typeof jsonObj.text === 'undefined'
				|| jsonObj.cancelled
			){
				data.msg_code = 'FC0004_302'; // QR Code掃描取消
				data.msg = '';
				getCallBack_method(false,data);
				return false;
			}

			var returnObj = MainClass.checkQRCode(jsonObj.text);
			if(returnObj.status){
				getCallBack_method(true,returnObj);
			}else{
				getCallBack_method(false,returnObj);
			}
		};
		var error_method = function(errMsg){
			data.msg_code = 'FC0004_301'; // QR Code掃描失敗
			data.msg = errMsg;
			getCallBack_method(false,data);
			return false;
		}

		if(OpenNactive){
			framework.openQRCodeReader(success_method,error_method);
			return true;
		}else if(DebugMode){
			var jsonObj = {
				// text : "http://210.200.4.11/MobileHospital/AppInfoToCreditCard?writeOff=1234567890123456&payableAmt=25097&leastPayableAmt=10346",
				// text : "http://210.200.4.11/MobileHospital/AppInfoToCreditCard?writeOff=9966601123456789&payableAmt=25097&leastPayableAmt=10346",
				text : "http://210.200.4.11/MobileHospital/AppInfoToCreditCard?writeOff=8012-4608-A126-4209&payableAmt=25097&leastPayableAmt=10346",
				format : "QR_CODE",
				cancelled : false
			};
			success_method(jsonObj);
			return true;
		}else{
			data.msg_code = 'NOTE_JBROOT_CONTENT'; //不安全
			data.msg = '';
			getCallBack_method(false,data);
			return false;
		}
	}

	var checkWriteOff = function(str){
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.PAYMENT_ID'),
			data : ''
		};
		if(typeof str !== 'string' && typeof str !== 'number'){
			return data;
		}
		str = str.replace(/\s|\-|\,|\./g,'');

		if(str.length !== 16){
			return data;
		}

		var str_list = [8,9,10,11,4,12,5,13,7,15]
		var cut_list = [11,12,13];
		var cardnum = '';
		var tmp = '';
		for(key in str_list){
			tmp = str.charAt(str_list[key]);
			if(tmp === ''){
				continue;
			}
			if(cut_list.indexOf(str_list[key]) > -1){
				tmp = 9 - parseInt(tmp);
			}
			cardnum += ''+tmp;
		}
		cardnum = $filter('paymentIdFilter')(cardnum);

		var result = formServices.checkPaymentId(cardnum);
		if(!result.status){
			data.msg = result.msg;
			return data;
		}
		data.status = true;
		data.msg = '';
		data.data = cardnum;
		return data;
	}

	/**
	 * [getCameraEventNew QR Code掃描]
	 * (for cordova-plugin-qrscanner)
	 * @param  {[type]} getCallBack_method [description]
	 * @return {[type]}                    [description]
	 */
	this.getCameraEventNew = function(getCallBack_method)
	{
		var data = {
			status : false,
			msg_code : 'FC0004_301',
			msg : '',
			data : {}
		};
		var success_method = function(jsonObj){
			//離開畫面前要關閉camera
			framework.closeEmbedQRCodeReader(function(){ });
			if(typeof jsonObj !== 'string'){
				data.msg_code = 'FC0004_302'; // QR Code掃描取消
				data.msg = '';
				getCallBack_method(false,data);
				return false;
			}

			var returnObj = MainClass.checkQRCode(jsonObj);
			if(returnObj.status){
				getCallBack_method(true,returnObj);
			}else{
				getCallBack_method(false,returnObj);
			}
		};
		var error_method = function(errMsg){
			//離開畫面前要關閉camera
			framework.closeEmbedQRCodeReader(function(){ });
			data.msg_code = 'FC0004_301'; // QR Code掃描失敗
			data.msg = errMsg.name;
			getCallBack_method(false,data);
			return false;
		}

		if(OpenNactive){
			framework.openEmbedQRCodeReader(success_method,error_method);
			return true;
		}else if(DebugMode){
			var jsonObj = "http://210.200.4.11/MobileHospital/AppInfoToCreditCard?writeOff=8012-4608-A126-4209&payableAmt=25097&leastPayableAmt=10346";
			success_method(jsonObj);
			return true;
		}else{
			data.msg_code = 'NOTE_JBROOT_CONTENT'; //不安全
			data.msg = '';
			getCallBack_method(false,data);
			return false;
		}
	}


});
//=====[cardServices END]=====//


});
