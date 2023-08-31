
/**
 * [信用卡登入]
 */
define([
	"app"
	,"app_telegram/telegramServices"
	,"service/cgjscrypt_min" //密碼加密
	,'modules/service/qrcodePay/securityServices'
]
, function (MainApp) {
//=====[fc000303Telegram START]=====//
MainApp.register.service("fc000303Telegram",function(
	telegramServices
	,framework
	,$log
	,securityServices
){
	var MainClass = this;
	this.telegramCode = 'card/fc000303';


	this.loginData = function(save_data,endMethod)
	{
		var set_telegram = {};

		set_telegram.success = function(resultObj,headerObj){
			if(typeof headerObj.custId === 'undefined' || headerObj.custId === ''){
				$log.debug('no find id');
				endMethod(false,resultObj,headerObj);
			}else{
				endMethod(headerObj.custId,resultObj,headerObj);
			}
		}
		set_telegram.error = function(resultObj,headerObj){
			endMethod(false,resultObj,headerObj);
		}
		//密碼加密處理

		//==必要值檢查==//
		var check_list = ['idNo','userida','password'];
		var tmp_data;
		for(key in check_list){
			tmp_data = check_list[key];
			if(typeof save_data[tmp_data] === 'undefined' || save_data[tmp_data] === ''){
				$log.debug('miss :'+ tmp_data);
				endMethod(false);
				return false; //異常
			}
		}
		//==密碼加密處理==//
		var password_str = '';
		// if(typeof cgjsCrypt === 'undefined' || typeof cgjsCrypt.PEMCertEncrypt !== 'function'){
		// 	$log.debug('miss js cgjscrypt');
		// 	endMethod(false);
		// 	return false; //異常
		// }
		// var pem_cert = framework.getXML('config/cgjsCrypt','CGJSCRYPT'); //驗證碼
		// if(!pem_cert || pem_cert === ''){
		// 	$log.debug('miss pem_cert');
		// 	endMethod(false);
		// 	return false;
		// }
		// try {
		// 	password_str = cgjsCrypt.PEMCertEncrypt(pem_cert, save_data['password'], 0);
		// 	console.log(password_str);
		// }
		// catch (e) {
		// 	password_str = e;
		// 	var error_list = {
		// 		'9900': 'Message too long for RSA',
		// 		'9901': 'Invalid RSA public key',
		// 		'9902': 'Invalid RSA private key',
		// 		'9903': 'Could not find public key'
		// 	};
		// 	if(typeof error_list[e] !== 'undefined'){
		// 		$log.debug('[PASSWOAD ERROR]'+error_list[e]);
		// 	}else if(typeof e === 'string'){
		// 		$log.debug('[PASSWOAD ERROR]'+e);
		// 	}else{
		// 		$log.debug('[PASSWOAD ERROR]');
		// 		$log.debug(e);
		// 	}
		// 	endMethod(false);
		// 	return false; //異常
		// }

		//數位信封加密
		securityServices.digitalEnvelop(save_data['password'], function(signedText){
			//取得加密內容
			// console.log(signedText);
			// $log.debug(signedText);
			password_str = signedText;
			// console.log(password_str);
			//==telegramObj==//
			set_telegram.data = {
				custId : save_data['idNo'],
				userId : save_data['userida'],
				password : password_str
				
			};

			telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
			return true;
		}, function(error){
			//加密失敗
			// console.log("singed error");
			// $log.debug("singed error");
			endMethod(false);
			return false; //異常
		})
		return true;
	}

});
//=====[fc000303Telegram END]=====//


});
