/**
 * [電文包裝services]
 */
define([
	"app"
]
, function (MainApp) {

//=====[telegramServices START]=====//
MainApp.register.service("telegramServices",function(
	$rootScope,$state,$http,$log
	,telegram,framework,i18n,serviceStatus,sysCtrl
){
	var mainClass = this;

	//==參數設定==//
	var DebugMode = framework.getConfig("OFFLINE", 'B');
	var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');

	this.telegramSetObject = {};

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
					MainUiTool.openDialog(msg);
				}
			},
			//ajax錯誤
			ajax_fail : function(msg){
				var tmp = i18n.getStringByTag(msg);
				if(typeof tmp === 'string' && tmp !== ''){
					msg = tmp;
				}
				if(typeof MainUiTool === 'object'){
					MainUiTool.openDialog(msg);
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
					MainUiTool.openDialog(message);
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

		var not_check_req = false;
		if(typeof setObj.not_check_req != 'undefined' && setObj.not_check_req == true){
			not_check_req = true;
		}

		mainClass.telegramSetObject[telegramName] = {
			ReqUrl : ReqUrl,
			telegramName : telegramName,
			setMethod : setMethod,
			telegramObj : telegramObj,
			fixedResTelegram : fixedResTelegram,
			ResTelegram : {},
			Loading:isLoading,   //2017/08/03 新增屬性：開啟或關閉loading
			not_check_req: not_check_req // 2019/1121 追加不檢核req
		};
		//$log.debug(JSON.stringify(mainClass.telegramSetObject[telegramName]));
		return mainClass.telegramSetObject[telegramName];
	}

	/**
	 * [deleteTelegramSet 刪除設定]
	 * @param  {[type]} telegramName [description]
	 * @return {[type]}              [description]
	 */
	var deleteTelegramSet = function(telegramName){
		if(getTelegramSet(telegramName)){
			delete mainClass.telegramSetObject[telegramName];
		}
	}

	/**
	 * [sendTelegram 發送電文整理]
	 * @param  {[type]} telegramName [description]
	 * @param  {[type]} setObj       [description]
	 * @return {[type]}              [description]
	 */
	this.sendTelegram = function(telegramName,setObj, header, backgroundMode)
	{
		var telegramSet = getTelegramSet(telegramName,setObj);
		// console.log('isLoading:'+$rootScope.isLoading);
		if(OpenNactive){
			 if(telegramSet.Loading&&!backgroundMode){
				$rootScope.isLoading = true;
			 }

		}

		if(typeof telegramName !== "string"){
			$state.go('message',{code:'403_1'});
			return false;
		}
		$log.debug('[STEP] sendTelegram:'+telegramName);
		//避免被覆蓋，每個需要獨立
		var success = function(response){
			mainClass.telegramSetObject[telegramName]['ResTelegram'] = response.data;
			var ajax_success = function(){
				$log.debug('[STEP] sendTelegram to telegram:'+telegramName);
				doTelegram(telegramSet.telegramName, header);
				deleteTelegramSet(telegramName);
			};
			if(DebugMode){
				ajax_success();
			}else{
				$log.debug('[STEP] check Server:'+telegramName);
				serviceStatus.checkServer(ajax_success,function(res){
					$log.debug('[ERROR] handshake error');
					$log.debug(res);
					delete sessionStorage.temp_hitrust_aut;
					delete sessionStorage.temp_auth_token;
					if(telegramSet.Loading){ $rootScope.isLoading = false; }
				});
			}
		}
		var error = function(e){
			$log.debug('[ERROR] get telegram request :'+telegramName);
			$log.debug(e);
			if(telegramSet.Loading){ $rootScope.isLoading = false; }
			$state.go('message',{code:'403_2'});
			deleteTelegramSet(telegramName);
		}
		return $http.get(telegramSet.ReqUrl).then(success,error);
	}


	/**
	 * [getResTelegramList 處理巢狀結構]
	 * @param  {[type]} jsonObj     [處理物件]
	 * @param  {[type]} check_child [是否檢查子層]
	 * @return {[type]}             [description]
	 */
	function getResTelegramList(jsonObj,check_child)
	{
		if(typeof check_child === 'undefined'){
			check_child = true;
		}
		if(typeof jsonObj !== 'object'){
			return jsonObj;
		}
		var data = {};
		var child_key;
		var sub_data;
		for(subkey in jsonObj){
			child_key = subkey.replace(/^sch\:|fc0\:|f40\:/,'');
			sub_data = jsonObj[subkey];
			if(check_child && typeof sub_data === 'object'){
				sub_data = getResTelegramList(sub_data,true);
			}
			data[child_key] = sub_data;
		}
		return data;
	}

	/**
	 * [modifyResTelegram 修正ResTelegram]
	 * @return {[type]} [description]
	 */
	function modifyResTelegram(jsonObj)
	{
		//暫時處理
		if(typeof jsonObj['MNBResponse'] === 'undefined' && typeof jsonObj['sch:MNBResponse'] === 'object'){
			jsonObj['MNBResponse'] = jsonObj['sch:MNBResponse'];
		}
		if(typeof jsonObj['MNBResponse'] === 'object')
		{
			var new_obj = {};
			var tmp_value;
			var sub_value;
			var pap_key;
			var child_key;
			for(key in jsonObj['MNBResponse'])
			{
				pap_key = key.replace(/^sch\:/,'');
				tmp_value = jsonObj['MNBResponse'][key];
				if(typeof tmp_value === 'object'){
					new_obj[pap_key] = getResTelegramList(tmp_value,true);
				}else{
					new_obj[pap_key] = tmp_value;
				}
			}
			jsonObj = new_obj;
		}
		return jsonObj;
	}

	/**
	 * [checkTelegramType 檢查電文資料]
	 * @param  {[type]} jsonObj [description]
	 * @return {[type]}         [description]
	 */
	function checkTelegramType(jsonObj){
		var data = {
			status : false,
			telegramName : '',
			jsonObj : {}
		};
		data.jsonObj = jsonObj; //原則上不異動

		if(typeof jsonObj.result === 'undefined' || typeof jsonObj.result['@xsi:type'] === 'undefined' || jsonObj.result['@xsi:type'].indexOf("ResultType") < 0){
			return data;
		}
		var tmp = jsonObj.result['@xsi:type'].split(':');
		if(tmp.length !== 2){
			return data;
		}
		data.telegramName = tmp[1].replace(/ResultType/,'');
		if(tmp[0] !== 'fc0' && typeof jsonObj.result.result === 'undefined'){
			//==非信用卡的API，需補上result==//
			data.jsonObj.result.result = "0";
			data.jsonObj.result.respCode = "";
			data.jsonObj.result.respCodeMsg = "";
		}
		data.status = true;
		return data;
	}

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
			methodObj.ajax_error(msg);

			var error_object = {
				result : 1,
				respCode : '',
				respCodeMsg : msg
			};
			doErrorEvent(methodObj, error_object);
		};
		var ajax_fail = function(msg){
			$log.debug('[ERROR] ajax_fail');
			if(telegramSet.Loading){ $rootScope.isLoading = false; }
			if(typeof msg !== 'string'){
				$log.debug('[ERROR] object:'+JSON.stringify(msg));
				msg = i18n.getStringByTag('MSG_CONNECTION_ERROR');
			}
			methodObj.ajax_fail(msg);
		};

		//---上行電文設定---//
		var no_change = telegramSet.fixedResTelegram;
		var sendObj = telegramSet.ResTelegram;
		//---資料檢查---//
		for(var key in sendObj)
		{
			if(no_change.indexOf(key) > -1){
				continue; //不可改變
			}
			if(typeof telegramObj[key] === "undefined"){
				continue;
			}
			sendObj[key] = telegramObj[key];
		}

		// 20191121 不檢核req
		var not_check_req = telegramSet.not_check_req;
		if (not_check_req == true) {
			sendObj = telegramObj;
		}

		//發送
		//$log.debug('[STEP] send telegram :'+telegramSet.telegramName);

		telegram.setTeltgramPath(telegramPath);
		telegram.sendJson(telegramSet.telegramName,sendObj, ajax_success, ajax_error, ajax_fail, header);
	};


	/**
	 * [modifyResDetailObj [針對detail再做xml轉json時的漏洞處理]
	 * @param  {[type]} detail_obj [description]
	 * @return {[type]}            [description]
	 */
	this.modifyResDetailObj = function(detail_obj){
		var tmp = angular.copy(detail_obj);
		//==特殊處理(只有一筆時)==//
		if(typeof tmp === 'object' && typeof tmp[0] === 'undefined' && Object.keys(tmp).length > 0){
			tmp = [tmp];
		}
		if(Object.keys(tmp).length <= 0){
			tmp = [];
		}
		// console.log(tmp);
		return tmp;
	}




});
//=====[telegramServices END]=====//

});
