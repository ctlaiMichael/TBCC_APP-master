/**
 * [電文包裝services]
 */
define([
	"app"
	,"app_telegram/telegramServices"
	,"modules/telegram/qrcodePay/telegram"
]
, function (MainApp) {

//=====[telegramServices START]=====//
MainApp.register.service("qrcodeTelegramServices",function(
	$rootScope,$state,$http,$log
	,qrcodeTelegram,framework,i18n,serviceStatus,sysCtrl
	,telegramServices
){
	angular.extend(this, telegramServices);
	var mainClass = this;

	//==參數設定==//
	var DebugMode = framework.getConfig("OFFLINE", 'B');
	var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
	this.telegramSetObject = {};


	/**
	 * [checkErrorTelegram 錯誤訊息處理]
	 * @return {[type]} [description]
	 */
	function checkErrorTelegram(jsonObj){
		$log.debug('[ERROR] checkErrorTelegram:'+JSON.stringify(jsonObj));
		var error_object = {
			result : 1,
			respCode : '',
			respCodeMsg : i18n.getStringByTag('MSG_FORMATE_ERROR')
		};
		if(typeof jsonObj.result === 'object'){
			error_object = jsonObj.result;
		}else if(typeof jsonObj.failure === 'object'){
			error_object = jsonObj.failure;
			error_object.result = 1;
			error_object.respCodeMsg = (typeof error_object.debugMessage !== 'undefined')
										 ? error_object.debugMessage : '';
			error_object.respCode = '';
			error_object.codeFromPlaceNameIs = '';
			if(typeof error_object.codeFromService !== 'undefined'){
				error_object.codeFromPlaceNameIs = 'Service';
				error_object.respCode = error_object.codeFromService;
			}else if(typeof error_object.codeFromHost !== 'undefined'){
				error_object.codeFromPlaceNameIs = 'Host';
				error_object.respCode = error_object.codeFromHost;
			}
		}else if(typeof jsonObj.debugMessage !== 'undefined'){
			error_object = {
				result : 1,
				respCode : '',
				respCodeMsg : jsonObj.debugMessage
			};
		}else if(typeof jsonObj.fatalError !== 'undefined'){
			error_object = jsonObj.fatalError;
			error_object.result = 1;
			error_object.respCodeMsg = error_object.debugMessage;
			error_object.respCode = '';
		}
		$log.debug('[ERROR] error object:'+JSON.stringify(error_object));
		return error_object;
	}
	
	/**
	 * [doErrorEvent 錯誤事件處理]
	 * @param  {[type]} methodObj [description]
	 * @param  {[type]} jsonObj   [description]
	 * @return {[type]}           [description]
	 */
	function doErrorEvent(methodObj,jsonObj){
		//==強制登出==//
		var error_object = checkErrorTelegram(jsonObj);
		var logout_code = ['ERR10001','ERR10011'];
		if(logout_code.indexOf(error_object.respCode) >= 0){
			$log.debug('[STEP] logOut, errorCode:'+error_object.respCode);
			if(sysCtrl.isLogin){
				sysCtrl.logout(function(){
					$log.debug('LOGOUT!!!!');
					//系統已自動將您登出
					MainUiTool.openDialog({
						title:  i18n.getStringByTag('LOGIN_MENU.TIMEOUT_SERVER'),
						content:error_object.respCodeMsg
					});
					methodObj.error(error_object,jsonObj.resHeader);
					$log.debug('LOGOUT END!!!!');
				});
			}
		}else{
			methodObj.error(error_object,jsonObj.resHeader);
		}
	}

	/**
	 * [getTelegramSet 取得設定]
	 * @param  {[type]} telegramName [description]
	 * @return {[type]}              [description]
	 */
	var getTelegramSet = function(telegramName,setObj)
	{
		if(typeof mainClass.telegramSetObject[telegramName] === 'object'){
			return mainClass.telegramSetObject[telegramName];
		}else if(typeof setObj !== 'object'){
			return false;
		}
		var telegramObj = {};
		var fixedResTelegram = [];
		var isLoading = true; //2017/08/03 新增loading開關功能
		var setMethod = {
			//ajax成功
			ajax_success : function(){}, //目前無作用
			//ajax失敗(連線失敗或異常)
			ajax_error : function(msg){
				var tmp = i18n.getStringByTag(msg);
				if(typeof tmp === 'string' && tmp !== ''){
					msg = tmp;
				}
				if(typeof MainUiTool === 'object'){
					framework.alert(msg);
				}
			},
			//ajax錯誤
			ajax_fail : function(msg){
				var tmp = i18n.getStringByTag(msg);
				if(typeof tmp === 'string' && tmp !== ''){
					msg = tmp;
				}
				if(typeof MainUiTool === 'object'){
					framework.alert(msg);
				}
			},
			//電文成功
			success : function(jsonObj){},
			//電文失敗
			error : function(jsonObj){
				var message = i18n.getStringByTag('MSG_WIFI_ERROR');
				if(typeof jsonObj.respCodeMsg !== 'undefined'){
					message = jsonObj.respCodeMsg;
				}
				if(typeof MainUiTool === 'object'){
					framework.alert(msg);
				}
			}
		}

		if(typeof setObj.ajax_success === 'function'){
			setMethod.ajax_success = setObj.ajax_success;
		}
		if(typeof setObj.ajax_error === 'function'){
			setMethod.ajax_error = setObj.ajax_error;
		}
		if(typeof setObj.ajax_fail === 'function'){
			setMethod.ajax_fail = setObj.ajax_fail;
		}
		if(typeof setObj.success === 'function'){
			setMethod.success = setObj.success;
		}
		if(typeof setObj.error === 'function'){
			setMethod.error = setObj.error;
		}
		if(typeof setObj.telegram_nochange === 'object'){
			fixedResTelegram = setObj.telegram_nochange;
		}
		if(typeof setObj.data === 'object'){
			telegramObj = setObj.data;
		}
		 //2017/08/03 新增loading開關功能
		if(typeof(setObj.loading) != "undefined"){
			isLoading = setObj.loading;
		}else{
			isLoading = true;
		}
		var ReqUrl = "message/templates/"+ telegramName +"_req.json";

		mainClass.telegramSetObject[telegramName] = {
			ReqUrl : ReqUrl,
			telegramName : telegramName,
			setMethod : setMethod,
			telegramObj : telegramObj,
			fixedResTelegram : fixedResTelegram,
			ResTelegram : {},
			Loading:isLoading   //2017/08/03 新增屬性：開啟或關閉loading
		};
		//$log.debug(JSON.stringify(mainClass.telegramSetObject[telegramName]));
		return mainClass.telegramSetObject[telegramName];
	}
	/**
	 * [getDividend 發送電文]
	 * @return object [description]
	 */
	function doTelegram(telegramName, header)
	{
		var telegramSet = getTelegramSet(telegramName);
		if(!telegramSet){
			$state.go('message',{code:'403_1'});
			return false;
		}
		var telegramObj = telegramSet.telegramObj;
		var methodObj = telegramSet.setMethod;

		//==api路徑處理==//
		var telegramPath = telegramSet.telegramName.split('/');
		telegramSet.telegramName = telegramPath.pop();
		if(telegramPath.length > 0){
			telegramPath = telegramPath.join('/');
		}else{
			telegramPath = "";
		}

		var ajax_success = function(jsonObj)
		{
			$log.debug('[STEP] ajax_success');
			if(telegramSet.Loading){ $rootScope.isLoading = false; }
			jsonObj = modifyResTelegram(jsonObj); //修正json
			//$log.debug('[INFO] modify object:'+JSON.stringify(jsonObj));
			$log.debug('[INFO] modify object');
			$log.debug(jsonObj);

			//==非fc0電文處理==//
			var check_data = checkTelegramType(jsonObj);
			if(!check_data.status){
				$log.debug('[ERROR] checkTelegramType');
				$log.debug(check_data);
				//==格式異常==//
				doErrorEvent(methodObj, jsonObj);
				return false;
			}
			$log.debug("[STEP] telegramResponce : "+ check_data.telegramName);
			jsonObj = check_data.jsonObj; //檢查

			if(typeof jsonObj.result === 'object'
				&& typeof jsonObj.result.result !== 'undefined' && jsonObj.result.result == "0"
			){
				$log.debug('[STEP] success');
				methodObj.success(jsonObj.result,jsonObj.resHeader);
			}else{
				$log.debug('[STEP] error');
				doErrorEvent(methodObj, jsonObj);
			}
		};
		var ajax_error = function(msg){
			$log.debug('[ERROR] ajax_error');
			if(telegramSet.Loading){ $rootScope.isLoading = false; }
			if(typeof msg !== 'string'){
				$log.debug('[ERROR] object:'+JSON.stringify(msg));
				msg = i18n.getStringByTag('MSG_CONNECTION_ERROR');
			}
			framework.alert(msg);
		};
		var ajax_fail = function(msg){
			$log.debug('[ERROR] ajax_fail');
			if(telegramSet.Loading){ $rootScope.isLoading = false; }
			if(typeof msg !== 'string'){
				$log.debug('[ERROR] object:'+JSON.stringify(msg));
				msg = i18n.getStringByTag('MSG_CONNECTION_ERROR');
			}
			framework.alert(msg);
		};

		//---上行電文設定---//
		var no_change = telegramSet.fixedResTelegram;
		var sendObj = telegramSet.ResTelegram;
		//---資料檢查---//
		for(key in sendObj)
		{
			if(no_change.indexOf(key) > -1){
				continue; //不可改變
			}
			if(typeof telegramObj[key] === "undefined"){
				continue;
			}
			sendObj[key] = telegramObj[key];
		}

		//發送
		//$log.debug('[STEP] send telegram :'+telegramSet.telegramName);

		telegram.setTeltgramPath(telegramPath);
		telegram.sendJson(telegramSet.telegramName,sendObj, ajax_success, ajax_error, ajax_fail, header);
	};
		
		
	// }
	/**
	 * [getXML 取得Req電文XML]
	 * @param  {[type]} telegramName [電文名稱]
	 * @param  {[type]} reqBody       [上行電文Body]
	 * @param  {[type]} xmlCallBack       [description]
	 * @param  {[type]} header       [上行電文header]
	 * @return {[type]}              [description]
	 */
	this.getXML = function(telegramName, reqBody, xmlCallBack, header)
	{
		var success = function(response){
			var reqTemplate = response.data;
			//---資料檢查---//
			for(key in reqBody)
			{
				if(typeof reqTemplate[key] === "undefined"){
					continue;
				}
				reqTemplate[key] = reqBody[key];
			}
			var headerTemplate = qrcodeTelegram.getHeaderTemplate();
			if(typeof header == 'object'){
				for(key in header)
				{
					if(typeof headerTemplate[key] === "undefined"){
						continue;
					}
					headerTemplate[key] = header[key];
				}
			}
			qrcodeTelegram.getXML(telegramName.substr(telegramName.indexOf('/')+1), reqTemplate, xmlCallBack, headerTemplate);
		}
		var error = function(e){
			$log.debug('[ERROR] get telegram request :'+telegramName);
			$log.debug(e);
			framework.alert('connect error:'+JSON.stringify(e));
		}
		//取得上行電文Body
		return $http.get("message/templates/"+ telegramName +"_req.json").then(success,error);
	}

	this.getRquId = function(telegramName){
		return qrcodeTelegram.getRquId(telegramName.substr(telegramName.indexOf('/')+1));
	}

});
//=====[telegramServices END]=====//

});