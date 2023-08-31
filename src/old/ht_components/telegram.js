'use strict';

/**
 * Created by kie0723 on 15/8/12.
 * modify wei , 16/12/16
 * 注意 : 請避免放業務邏輯於此程式
 * telegramSet為封裝的物件，有需要對應處理的變數請用此，避免被其他程式異動
 */
angular.module('telegram', [])
.factory('telegram', function(
	$rootScope, $http, $log , $q
	,framework,sysCtrl,stringUtil,deviceInfo
){
	//==參數設定==//
	var DebugMode = framework.getConfig("OFFLINE", 'B');
	var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
	var snedToPO = framework.getConfig("SEND_TO_PO", 'B');
	var isNeededCipher = false; //加解密使用

	var telegram_function = framework.getConfig("TELEGRAM_PATH"); //電文路徑
	var register_function = framework.getConfig("REGISTER");
	var handShake_function = framework.getConfig("HAND_SHAKE");
	var exchangeKey_function = framework.getConfig("EXCHANGE_KEY");
	var crypto_enable = framework.getConfig("CRYPTO", 'B');
	var Authorization = 'hitrust_auth'; // framework.getConfig("AUTHORIZATION_KEY");
	var auth_token = 'auth_token'; // framework.getConfig("AUTH_TOKEN_KEY");

	var certsInfo = [
//	  { // 37
//				issuer: 'TAIWAN-CA',
//				sha1: 'E3 BA 38 2C 47 57 69 AA 5D D2 51 B2 B5 5F A4 FB 7E 72 05 3E',
//				publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuu4g+gJLIcYEK2wiZzm4' +
//				'Jzd1YtygMiCgW+3u8zQmM/22eEvk8wmSo9BXTCsMzFTelB/8QjC08cUez4Muj1c/' +
//				'JMEX9Cx5s64zXktf/T8JwTnrRd/JtEQz5TVdA4OdI+DdbLLQf3LmIjXtX4Q3j4TB' +
//				'BOsWq5apa1p4e/0hoZfHKL+DV8+/YQUpbl8Izy/Ahl2eg/LFn0dfoevZug0zYozW' +
//				'y5B+BsPBQM7QB97qusgLb7+EkaDqYpZ7v2PjPmUlHaQbDYmR3YNfnlztZBoJFJz7' +
//				'zTcmRW2z632rdZBS/5OZnXUEHWgOfE9IcrrrHynkVbJKxMTPBfnHdXPUql9DsUCH' +
//				'rQIDAQAB'
//		},
		{ // 正式
				issuer: 'TAIWAN-CA',
				sha1: 'F8 A4 E0 1A 56 CA 60 D0 EA C4 25 14 69 D2 1A 89 C0 88 82 F0',
				publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhFO6iAqTM3dZ/fbgwj9o' +
				'Qw1O5T1znjr8SdhqUiYFAKo9zC5htxFbK3UvjfL3kEEvcaQYYJfGGcFwITJ7fEbL' +
				'cQ262PVjLuF8/z9OL//4lxD0gCLMUg6piuXbTDkAZ5E46/omd9VLSh06QHkxaysA' +
				'XHz0DM0YMVUbdvADLh71Oy1naG7Sm9/ZB1sejvS7iEDTQ1oijyaTNnyNiJeseMbw' +
				'wrYTFsnrUuHHat8cbLVO80uVH5WYYFAKVOF3V+Wb38GHIgwmNEGtaGMhaK689CBl' +
				'nmxcqNrjWbcAvVp59KWYHFZQ0j+PhLd5k7xbbqQJV4BnQfHn3D5diwVGRenrkGMl' +
				'xwIDAQAB'
		},
		{
			issuer: 'TAIWAN-CA',
			sha1: '3D C3 8F 99 04 D6 2B 94 EE 35 C3 7E FD 3D EE BA 0E 8D 3F FD',
			publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwUnGywY3UZCi9v0FN8gc'+
				'yjox8zWh7R11hwsgsAGQlfcZpYv3s2rFY8o/htC7gB6F/wNGyszv5dip3pOvgFnt'+
				'N255GdXg8SeHmJd2S5tf1VRW6TKygsumtpxevYHoIyu2B4QI5xavoG9lA76KecQf'+
				'28s5SUeXQyeFzqG3kDkJOBLN7oMa7j6ylwg7ywBh/SR+FjaNOki9x8rEJCDWO4Da'+
				'msxn3/AUpKNOzou35ifQU/Yl/ZM4P/zT6KNMB3nlfZZRc2SHtml8VByBGIJ8VGGE'+
				'VMLIpKGyfyyDo2paN/SDXzQf6pQ85GNvE4s1+cHjJNos+69OKUbc5tqtrDutUeVo'+
				'KQIDAQAB'
		},
		{
			issuer: 'TAIWAN-CA',
			sha1: '9C BB 48 53 F6 A4 F6 D3 52 A4 E8 32 52 55 60 13 F5 AD AF 65',
			publicKey: 'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAsAXbyOuMxG6KIe+OTZxx'+
				'Ch9ScO1tgpyXxddMTkVJy0BCtRI0bBnCdKQxX4UCl+xDMwpT0pyMjre4edsr1Wry'+
				'jmbE7isBB5LUs9AC31D2Va9mDsvgR2AvKzI5NVI6KIP4exbGGLhi1kclkc7wGRJN'+
				'rWP10z91XynwoTAcKqCYphW97v0ZNvDikUOP+srWECdJTO/dwfGFcJvK6qhaQ/xt'+
				'hm9z6TdFqfA2x8yIdR67bAb/m2s+F+xhqnF8xh2i90npFbU81qFh9RH3BW8d/RG+'+
				'0DAHwimwCU4m3OOiqJFqH8KRRYhc5Zi4caUVGcl8dRHMcHRPLZsdkUT9Viig/ruG'+
				'asj6XAtY3MZLdsirItlzD6X0WgKJP0+eIoLuonRTKj1TJ2kdbI4yLGQAJmNhNk6j'+
				'Rrc/fbMtrG2QopWizs/agucHNBmW6bghqil+pji+jilKIWZ5H7PDtQln3tbUB0bz'+
				'KtrmIjdgy4G2D6AP6ciVf79VkQV6zz0VwG/eCZQBg9c0G8xApfC4m2fVmJE7p4R4'+
				'lSakWgj4K3S0AAQ837gUjujfqY1sZ5IzHcC30uySyL4JvywpBW8Ca57vvL8qvFvA'+
				'UI9BcHGHsk23BKmEozKvru5rF4uysf5s4ZCMiKiXSM7ITcvzBs9fagpCsR4edy+O'+
				'oOaSDgb8BSLSJuExUX0y3A8CAwEAAQ=='
		},{
			issuer: 'TAIWAN-CA',
			sha1: 'B3 F5 F8 D5 8F EB EE 41 8D B5 64 18 DD 09 7C 81 F9 D8 BB 43',
			publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz0fLA+s+Ebqh0fZpcgsS'+
				'+MFgmQEkgHiBqJC+MC+joxAgRf/m1QPCQD4iFjXCDr4b21f91hxgbVypz9daHY+t'+
				'1aMRrOsJ+EUaNtBErLboH3gb89u1Mx2W+vlV04xjTwUoDSl6aRbXWGgwQsM0ZGvs'+
				'n9Qm8fnNm4BwgGMvRIe1HqgXVaBbdfFOtUKTnBI2Nr9S3XoP87ii3cuWjK4Usos1'+
				'w0wzIiRebMuNXBySfrCOsh14k32EFBM38qUdp6JjTlJ9C/K+PchQeJQ6YDRbCree'+
				'U2lQ0K6sCp6Q401r7iHo3HQRP496P1heREPI+VtHKVBA921nBrEVnrzMCVUhT1jv'+
				'HQIDAQAB'
		}
	];
	/**
	 * [telegramSet 電文資料整理用]
	 * @type {Object}
	 */
	var telegramSet = {};
	telegramSet.url = framework.getUrl();	//電文url
	telegramSet.url_path = ""; 				//電文url後續的參數
	telegramSet.telegramId = "";			//電文編號
	//==預設header==//
	telegramSet.telegramHeader = {
		"rquId" : "",					//交易識別碼
		"sessionId" : "",				//使用者登入session id,取自login
		"mobileNo" : "",				//機碼 (手機號碼)
		"ipAddress" : "",				//IP位置,後面寫死了...
		"locale" : "",					//地區,取自login
		"appVersion" : "",				//應用程序版本,取自framework
		"plainText" : "",				//簽章原文
		"signature" : "",				//簽章值
		"certSN" : "",					//簽章憑證序號
		"cn" : "",						//RA-API驗章時傳送CN
		"SecurityType" : "",			//驗證模式
		"SecurityPassword" : "",		//驗證密碼
		"Acctoken" : "",				//驗證識別token
		"osType" : ""					//系統別,取自deviceInfo
	};

	/**
	 * [config AJAX的config]
	 * @type {Object}
	 */
	var config = {
		headers:{},
		responseType:XMLHttpRequest.responseText
	};
	config.headers[Authorization] = sessionStorage.temp_hitrust_auth;
	config.headers[auth_token] = sessionStorage.temp_auth_token;
	isNeededCipher = !!config.headers[Authorization] && !!config.headers[auth_token];
	//-------------------輔助Method---------------------//


	var isHandshakeTelegram = function(serviceId){
		return (serviceId == register_function) || (serviceId == handShake_function) || (serviceId == exchangeKey_function);
	};

	 /**
	 * [modifyReqTeltgram 修正ReqTelegram]
	  * @param  {[type]} serviceId [電文編號]
	  * @param  {[type]} jsonObj   [內容]
	  * @param  {[type]} jsonObj   [header]
	  * @return {[type]}           [description]
	  */
	function modifyReqTeltgram(serviceId,jsonObj,reqHeader)
	{
		if(typeof jsonObj !== 'object'){
			jsonObj = {};
		}
		var heq_header = {};
		var heq_body = {
			"@xsi:type" : serviceId+"BodyType"
		};

		var tmp_value,sub_value;
		//==header==//
		for(var key in reqHeader)
		{
			tmp_value = reqHeader[key];
			if(typeof tmp_value === 'object'){
				sub_value = {};
				for(subkey in tmp_value){
					sub_value['co:'+subkey] = tmp_value[subkey];
				}
				tmp_value = sub_value;
			}
			heq_header['co:'+key] = tmp_value;
		}

		var tmp_specail_list = ['custId','paginator','pageSize','pageNumber','sortColName','sortDirection'];
		//==body==//
		for(key in jsonObj)
		{
			tmp_value = jsonObj[key];
			if(typeof tmp_value === 'object'){
				sub_value = {};
				for(var subkey in tmp_value){
					if(tmp_specail_list.indexOf(subkey) > -1){
						sub_value['co:'+subkey] = tmp_value[subkey];
					}else{
						sub_value[subkey] = tmp_value[subkey];
					}
				}
				tmp_value = sub_value;
			}
			if(tmp_specail_list.indexOf(key) > -1){
				key = 'co:'+key;
			}
			heq_body[key] = tmp_value;
		}

		jsonObj = {
			"co:MNBRequest" : {
				"@xmlns" : "http://mnb.hitrust.com/service/schema/"+serviceId,
				"@xmlns:co" : "http://mnb.hitrust.com/service/schema",
				"@xmlns:xsi" : "http://www.w3.org/2001/XMLSchema-instance",
				"co:reqHeader" : heq_header,
				"co:body" : heq_body
			}
		};
		// console.log(jsonObj);
		return jsonObj;
	}

	/**
	 * [setTelegramHeader 產生telegramHeader]
	 * @param {[type]} set_obj [特殊參數設定]
	 */
	function setTelegramHeader(set_obj)
	{
		var reqHeader = telegramSet.telegramHeader;

		//reqHeader.reqDateTime = generateReqUid();
		reqHeader.rquId = generateGUID() + '-' + telegramSet.telegramId;
		// console.log(reqHeader.rquId);
		//reqHeader.appVersion = framework.getConfig('APP_VERSION','');
		reqHeader.appVersion = deviceInfo.appVersion;
		reqHeader.osType = deviceInfo.clientOS;

		var user = sysCtrl.getUserModel();
		reqHeader.locale = user.locale;
		reqHeader.sessionId = user.authToken;
		reqHeader.mobileNo = deviceInfo.uuid; //uuid

		//==憑證==//
		reqHeader.plainText = "";
		reqHeader.signature = "";
		reqHeader.certSN = (set_obj && set_obj.sn) ? set_obj.sn : '';
		reqHeader.cn = (set_obj && set_obj.cn) ? set_obj.cn : '';
		reqHeader.SecurityType = "";
		reqHeader.SecurityPassword = "";
		reqHeader.Acctoken = "";


		//==特殊設定==//
		if(typeof set_obj === 'object' )
		{
			for(var key in set_obj){
				if(typeof reqHeader[key] !== 'undefined'){
					reqHeader[key] = set_obj[key];
				}
			}
		}

		//Added by Grady on Jul 06 2018
		//-------------------------------------------
		reqHeader.cn = reqHeader.cn || '';
		reqHeader.certSN = reqHeader.certSN || '';
		//-------------------------------------------

		return reqHeader;
	}


	/**
	 * [generateGUID 產出GUID] => reqId不可超出40字元
	 * @return {[type]} [description]
	 */
	function generateGUID() {

		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4()  + s4()  + s4() + s4()  + s4();
		// return s4() + s4()  + s4()  + s4() + s4()  + s4() + s4() + s4();
	}

	/**
	 * [generateReqUid 產出reqUid]
	 * @return {[type]} [description]
	 */
	function generateReqUid() {
		var date = new Date();

		 return   date.getFullYear()+stringUtil.padLeft(date.getMonth()+1,2)+stringUtil.padLeft(date.getDate(),2)+
		stringUtil.padLeft(date.getHours(),2)+stringUtil.padLeft(date.getMinutes(),2)+stringUtil.padLeft(date.getSeconds(),2)
		+stringUtil.padLeft(date.getMilliseconds(),3)
	}

	/**
	 * [getHeader 組裝header]
	 * @param  {[type]} success [description]
	 * @param  {[type]} failed  [description]
	 * @return {[type]}         [description]
	 */
	var getHeader = function(success, failed)
	{
		// console.log('getHeader');
		// console.log('config.headers[Authorization]:'+config.headers[Authorization]);
		// console.log('config.headers[auth_token]:'+config.headers[auth_token]);
		if(crypto_enable){
			if (!!config.headers[Authorization] &&
				!!config.headers[auth_token]) {

				success(config);
				return;
			}
			else {
				var device_object = angular.copy(device);
				var about_version = framework.getAbout('Release');
				device_object.uuid = device_object.udid;
				device_object.appinfo.version = device_object.appinfo.version+'.'+about_version;
				plugin.crypto.InitPhoneData(device_object,
					function (jsonObj) {
						$log.debug('InitPhoneData error:' + jsonObj.error + '\n' + 'value:' + jsonObj.value);

						plugin.crypto.GetServerToken(
							function (jsonObj) {
								$log.debug('GetServerToken error:' + jsonObj.error + '\n' + 'value:' + jsonObj.value);
								config.headers[Authorization] = jsonObj.value;
								sessionStorage.temp_hitrust_auth = jsonObj.value;
								plugin.crypto.GenerateSessionID(
									function (jsonObj) {
										$log.debug('GenerateSessionID error:' + jsonObj.error + '\n' + 'value:' + jsonObj.value);
										config.headers[auth_token] = jsonObj.value;
										sessionStorage.temp_auth_token = jsonObj.value;
										success(config);
									},
									function (jsonObj) {
										$log.debug(jsonObj.message);
									}
								);
							},
							function (jsonObj) {
								$log.debug(jsonObj.message);
							}
						);
					},
					function (jsonObj) {
						$log.debug(jsonObj.message);
					}
				);
			}
		}else{
			success(config);
		}
	}
	//==getHeader END==//

	/**
	 * [getEncryptPromise 字串加密]
	 * @param  {[type]} set_string [description]
	 * @return {[type]}            [description]
	 */
	var getEncryptPromise = function(set_string){
		$log.debug('[STEP] getEncrypt');
		var deferred = $q.defer();
		var promise = deferred.promise;
		if(OpenNactive){
			$log.debug('[STEP] tcbb getSessionId start');
			plugin.crypto.AES_Encrypt("session", set_string, function(jsonObj){
				if(typeof jsonObj === 'object' && jsonObj.error == '0' && typeof jsonObj.value !== 'undefined'){
					deferred.resolve(jsonObj.value);
				}else{
					deferred.reject('Encrypt Error');
				}
			});
		}else if(DebugMode){
			deferred.resolve(set_string);
		}else{
			deferred.reject('Error Situation');
		}
		return promise;
	}

	/**
	 * [requestEncrypt request資料加密處理]
	 * @param  {[type]} jsonObj [要處理的json object]
	 * @return {[type]}         [description]
	 */
	var requestEncrypt = function(jsonObj){
		var result = {
			status : false,
			msg : '',
			errorCode : '',
			data : ''
		};

		$log.debug('[STEP] requestEncrypt');
		var deferred = $q.defer();
		var promise = deferred.promise;
		var jsonStr = (typeof jsonObj === 'object') ? JSON.stringify(jsonObj) : '';
		if(!jsonObj || jsonStr === "{}"){
			//==格式錯誤==//
			result.msg = 'Type Error';
			deferred.reject(result);
		}else{
			var combineEncrypt = function(str1,str2){
				var str_data;
				var set_len = 46;
				// console.log('hash:'+str2);
				// console.log('hash:'+str2.substr(0,set_len));
				// console.log('hash:'+str2.substr(set_len));
				str_data = str2.substr(set_len) + str1 + str2.substr(0,set_len);
				return str_data;
			}

			getEncryptPromise(jsonStr).then(function(encryptStr){
				framework.cryptoSHA256(encryptStr,function(hashObj){
					if(typeof hashObj !== 'object' || hashObj.error != '0' || typeof hashObj.value === 'undefined'){
						result.msg = 'hash Error 2';
						deferred.reject(result);
					}else{
						getEncryptPromise(hashObj.value).then(function(hashEncrypt){
							//==SUCCESS==//
							result.status = true;
							result.data = combineEncrypt(encryptStr,hashEncrypt);
							deferred.resolve(result.data);
						},function(){
							//==ERROR==//
							result.msg = 'getEncrypt 2 Error';
							deferred.reject(result);
						});
					}
				},function(){
					result.msg = 'hash Error';
					deferred.reject(result);
				});
			},function(error_str){
				result.msg = 'getEncrypt 1 Error';
				deferred.reject(result);
			});
		}
		return promise;
	}


	/**
	 * [verifyRes 檢查電文格式] => 電文格式檢查已納入telegramService
	 * @param  {[type]} Res [description]
	 * @return {[type]}     [description]
	 */
	var verifyRes = function(Res){
		return true;
	};


	/**
	 * [handShakeSuccessHandler 無解密格式處理] => handShake處理
	 */
	function handShakeSuccessHandler(data, success){
		if(isNeededCipher){
			if(typeof data != 'undefined' && typeof data.data != 'undefined'){
				plugin.crypto.AES_Decrypt("session",data.data, function(jsonObj){
					data.data = JSON.parse(jsonObj.value);
					success(data);
				});
			}else{
				success(data);
			}
		}else{
			success(data);
		}
	}

	/**
	 * [routineSuccessHandler 解密格式處理] => 電文處理方式
	 */
	function routineSuccessHandler(data, success){
		if(typeof data != 'undefined' && typeof data.data != 'undefined'){
			plugin.crypto.AES_Decrypt("session",data.data, function(jsonObj){
				data.data = JSON.parse(jsonObj.value);
				success(data.data);
			});
		}else{
			success(data);
		}
	}

	var requestCallbackHandler = handShakeSuccessHandler;

	/**
	 * [sendPostReq $http.post]
	 * @param  {[type]} reqUrl  [description]
	 * @param  {[type]} jsonObj [description]
	 * @param  {[type]} config  [description]
	 * @param  {[type]} success [description]
	 * @param  {[type]} error   [description]
	 * @param  {[type]} fail    [description]
	 * @return {[type]}         [description]
	 */
	var sendPostReq = function(reqUrl, jsonObj, config, success, error, fail)
	{
		var doPost = function () {
			$log.debug('[STEP] sendPostReq');
			$http.post(reqUrl, jsonObj, config )
			.then(function(res)
			{
				//---[POST SUCCESS]---//
				var now = Date.now();
				localStorage.setItem('telegramResTime', now);
				
				var data = res.data;
				//$log.debug(JSON.stringify(data));
				if(verifyRes(data)){
					sysCtrl.handShakeTimer.resolveHandShake();
					requestCallbackHandler(data, success);
	
				}else{
					//判斷是否為強制登出,是的話就不呼叫fail callback
					if( !telegram.forceLogout(data) ) {
						fail(data);
					}
				}
			}
			, function(err)
			{
				//---[POST ERROR]---//
				$log.debug(JSON.stringify(err));
				error(err);
			});
			//==$http post end==//
		};

		//http時直接發送不檢查
		if(String(reqUrl).indexOf('https')<0){
			doPost();
		}else{
			//檢查SSL憑證
			plugin.verifyServer.check(telegramSet.url, certsInfo, doPost , function () {
				console.log('failed');
				document.getElementById('loading').className = " loading_frame";
				var err = {
					result: -5000,
					msg: '憑證驗證失敗'
				};
				error(err);
			});
		}
	}
	//==sendPostReq END==//

	/**
	 * [sendGetReq $http.get] => 無使用
	 * @param  {[type]} reqUrl  [description]
	 * @param  {[type]} config  [description]
	 * @param  {[type]} success [description]
	 * @param  {[type]} error   [description]
	 * @param  {[type]} fail    [description]
	 * @return {[type]}         [description]
	 */
	// var sendGetReq = function(reqUrl, config, success, error, fail)
	// {
	// 	$http.get(reqUrl, config )
	// 	.then(function(res)
	// 	{
	// 		//---[POST SUCCESS]---//
	// 		var data = res.data;
	// 		//$log.debug(JSON.stringify(data));
	// 		if(verifyRes(data)){
	// 			if(isNeededCipher){
	// 				if(data.data != undefined){
	// 				   plugin.crypto.AES_Decrypt("session",data.data, function(jsonObj){
	// 						data.data = JSON.parse(jsonObj.value);
	// 						success(data);
	// 					});
	// 				}else
	// 					success(data);
	// 			}else{
	// 				success(data);
	// 			}
	// 		}else{
	// 			//判斷是否為強制登出,是的話就不呼叫fail callback
	// 			if( !telegram.forceLogout(data) ) {
	// 				fail(data);
	// 			}
	// 		}

	// 	}
	// 	, function(err)
	// 	{
	// 		//---[GET ERROR]---//
	// 		$log.error(err);
	// 		error(err);
	// 	});
	// };
	//==sendGetReq END==//


	///////////////////////////////////////////////////////////////////////////////
	// ┌┬┐┌─┐┬  ┌─┐┌─┐┬─┐┌─┐┌┬┐
	//  │ ├┤ │  ├┤ │ ┬├┬┘├─┤│││
	//  ┴ └─┘┴─┘└─┘└─┘┴└─┴ ┴┴ ┴
	///////////////////////////////////////////////////////////////////////////////
	var telegram = {}; //主要回傳的object

	telegramSet.telegramId = ""; //電文編號
	telegram.telegramPath = ""; //對應路徑
	/**
	 * [pageLimit 取得筆數設定]
	 * 預設值一次為200,page為 10
	 * @type {Number}
	 */
	telegram.pageLimit = 10;

	/**
	 * [header 電文上行header設定]
	 * @type {Object}
	 */
	telegram.header = telegramSet.telegramHeader;

	telegram.isOffLine = function(){
		return DebugMode;
	};
	telegram.setOffLine = function(mode){
		DebugMode = mode;
	};

	/**
	 * [forceLogout 強制登出]
	 * @param  {[type]} Res [description]
	 * @return {[type]}     [description]
	 */
	telegram.forceLogout = function(Res){
		var fLogout = false;
		if( Res.error == 'sessionTimeout' ){
			// framework.redirect('#/logout', false);
			fLogout = true;
		}
		return fLogout;
	};

	/**
	 * [setTeltgramPath 設定telegram路徑(模擬電文使用)]
	 * @param {[type]} path [description]
	 */
	telegram.setTeltgramPath = function(path){
		telegram.telegramPath = path;
	}

	/**
	 * [sendJson 發電文method]
	 * @param  {[type]} serviceId [電文編號]
	 * @param  {[type]} jsonObj   [傳送json object]
	 * @param  {[type]} success   [success method]
	 * @param  {[type]} error     [error method]
	 * @param  {[type]} fail      [fail method]
	 * @return {[type]}           [description]
	 */
	telegram.sendJson = function(serviceId, jsonObj, success, error , fail, header)
	{
		$log.debug('[STEP] sendJson:'+serviceId);
		if(typeof jsonObj !== 'object'){
			jsonObj = {};
		}
		var data = jsonObj;
		telegramSet.telegramId = serviceId;
		telegramSet.url_path = ""; //url後續接的string

		//確認是否為handshake之電文
		if(isHandshakeTelegram(serviceId)){
			$log.debug('[INFO] is handShake');
			requestCallbackHandler = handShakeSuccessHandler;
			data = jsonObj;
			//若是則將serviceId 寫入url_path
			telegramSet.url_path = serviceId; //url後續接的string
			if (serviceId == register_function) {
				isNeededCipher = false;
			}
			if(DebugMode){
				success();
				return true;
			}
		}else{
			requestCallbackHandler = routineSuccessHandler;
			telegramSet.url_path = telegram_function;
			//==正式==//
			var reqHeader = setTelegramHeader(header);
			// $log.debug('[INFO] get object header:'+JSON.stringify(reqHeader));
			// $log.debug('[INFO] get object data:'+JSON.stringify(data));
			data = modifyReqTeltgram(telegramSet.telegramId,data,reqHeader); //物件轉換
			$log.debug('[INFO] modify object:'+JSON.stringify(data));
		}

		//==模擬==//
		if(DebugMode){
			var telegramName = telegramSet.telegramId;
			var path = telegram.telegramPath;
			if(path !== ''){
				path += '/';
			}
			var url = "message/simulation/"+path+ telegramName +"_res.json";
			return telegram.loadJsonFile(url, success, error);
		}else if(snedToPO){
			return telegram.poSend(data, success, error , fail);
		}else{
			//==ERROR==//
			if(typeof error === 'function'){
				error('ERROR');
			}
		}
	};
	//==telegram.sendJson END==//

	/**
	 * [get GET] => 無使用
	 * @param  {[type]} serviceId [description]
	 * @param  {[type]} success   [description]
	 * @param  {[type]} error     [description]
	 * @param  {[type]} fail      [description]
	 * @return {[type]}           [description]
	 */
	// telegram.get = function(serviceId, success, error , fail)
	// {
	// 	$log.debug('[STEP] get');
	// 	var data = {};
	// 	telegramSet.telegramId = serviceId;

	// 	var reqHeader = setTelegramHeader();
	// 	data = modifyReqTeltgram(telegramSet.telegramId,data,reqHeader); //物件轉換

	// 	if(DebugMode){
	// 		var telegramName = telegramSet.telegramId;
	// 		var path = telegram.telegramPath;
	// 		if(path !== ''){
	// 			path += '/';
	// 		}
	// 		var url = "message/simulation/"+path+telegramName +"_res.json";
	// 		return telegram.loadJsonFile(url, success, error);
	// 	}else if(snedToPO){
	// 		return telegram.poGet(data, success, error , fail);
	// 	}else{
	// 		//==ERROR==//
	// 		if(typeof error === 'function'){
	// 			error('ERROR');
	// 		}
	// 	}
	// };
	//==telegram.get END==//

	/**
	 * [loadJsonFile 模擬電文] 取得local json file
	 * @param  {[type]} filepath        [file path]
	 * @param  {[type]} successCallBack [success method]
	 * @param  {[type]} failCallBack    [fail method]
	 * @return {[type]}                 [description]
	 */
	telegram.loadJsonFile = function(filepath, successCallBack, failCallBack){
		$log.debug('[STEP] loadJsonFile');
		$http.get(filepath).then(function(response) {
			successCallBack(response.data);
		},
		function(e) {
			$log.debug(e);
			failCallBack(e);
		});
	};

	telegram.deleteSession = function deleteSession(){
		console.log('deleteSession');
	    delete config.headers[Authorization];
	    delete config.headers[auth_token];
	};

	/**
	 * [poGet snedToPO GET] => 無使用
	 * @param  {[type]} jsonObj [description]
	 * @param  {[type]} success [description]
	 * @param  {[type]} error   [description]
	 * @param  {[type]} fail    [description]
	 * @return {[type]}         [description]
	 */
	// telegram.poGet = function(jsonObj, success, error, fail)
	// {
	// 	$log.debug('[STEP] poGet');
	// 	var reqUrl = telegramSet.url + telegramSet.url_path;
	// 	var serviceId = telegramSet.telegramId;
	// 	getHeader(function(config){
	// 		sendGetReq(reqUrl, config, success, error, fail);
	// 	});
	// 	if(serviceId == '/rest/app/device/exchange' && OpenNactive){
	// 		isNeededCipher = true;
	// 	}
	// 	return;
	// };
	//==telegram.poGet END==//

	/**
	 * [poSend description]
	 * @param  {[type]} jsonObj [description]
	 * @param  {[type]} success [description]
	 * @param  {[type]} error   [description]
	 * @param  {[type]} fail    [description]
	 * @return {[type]}         [description]
	 */
	telegram.poSend = function(jsonObj, success, error, fail)
	{
		$log.debug('[STEP] poSend');
		var reqUrl = telegramSet.url + telegramSet.url_path;
		var serviceId = telegramSet.telegramId;
		getHeader(function(config){
			$log.debug('[STEP] getHeader back');
			if(isNeededCipher && crypto_enable){
				requestEncrypt(jsonObj).then(function(sendObj){
					sendPostReq(reqUrl, sendObj, config, success, error, fail);
				},function(errorObj){
					//error
					if(typeof errorObj === 'object'){
						$log.debug('[ERROR] requestEncrypt Error');
						$log.debug(errorObj);
					}
				});
			}else{
				sendPostReq(reqUrl, jsonObj, config, success, error, fail);
			}
		});
		if(serviceId == exchangeKey_function){
			isNeededCipher = true;
		}
		return;

	};
	//==telegram.poSend END==//


	return telegram;

});
