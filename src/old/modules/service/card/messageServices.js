/**
 * [messageCtrl]
 */
define([
	'app'
],function(MainApp){
//=====[messageServices START]=====//
MainApp.register.service('messageServices', function(
	$state,$log,i18n
){
	var mainClass = this;
	var errorMsg = {};
	//登入失敗
	errorMsg['401'] = {
		'title' : i18n.getStringByTag('LOGIN_MENU.LOGIN_ERROR'),
		'content' : i18n.getStringByTag('LOGIN_MENU.LOGIN_CHECK')
	};
	errorMsg['403'] = {
		'title' : i18n.getStringByTag('HTTP_ERROR.CONNECTION'),
		'content' : i18n.getStringByTag('HTTP_ERROR.CONNECTION')
	};
	//電文設定錯誤
	errorMsg['403_1'] = {
		'title' : i18n.getStringByTag('HTTP_ERROR.CONNECTION')+'(1)',
		'content' : i18n.getStringByTag('HTTP_ERROR.CONNECTION')
	};
	//找不到上行電文
	errorMsg['403_2'] = {
		'title' : i18n.getStringByTag('HTTP_ERROR.CONNECTION')+'(2)',
		'content' : i18n.getStringByTag('HTTP_ERROR.CONNECTION')
	};

	this.getMsg = function(msgCode)
	{
		var data = {
			title : i18n.getStringByTag('ERROR_MSG.ERROR'), //錯誤訊息
			content : i18n.getStringByTag('ERROR_MSG.ERROR')
		};
		if(typeof msgCode === 'undefined' || typeof errorMsg[msgCode] === 'undefined'){
			var tmp = i18n.getStringByTag(msgCode);
			if(typeof tmp !== 'string' || tmp === ''){
				return data;
			}
			data = {
				title : i18n.getStringByTag('ERROR_MSG.ERROR'),
				content: tmp
			}
		}else{
			data = errorMsg[msgCode];
		}

		return data;
	}


	//==錯誤訊息==//
	var errorCode = {};
	//----[系統讀取資料不符規格]----//
	errorCode['ERROR_CONNECTION'] = {
		//取得必要資料失敗
		message : i18n.getStringByTag('HTTP_ERROR.CONNECTION'),
		go_state : 'message',
		state_set : {
			code:'NOTE_JBROOT_CONTENT'
		}
	};
	//----[step_XXX 業務流程錯誤]----//
	errorCode['STEP_ERROR'] = i18n.getStringByTag('INPUT_CHECK.STEP_ERROR'); //'請依照正常步驟執行!';
	errorCode['AGREE_PROVISION'] = i18n.getStringByTag('INPUT_CHECK.AGREE_PROVISION'); //'請同意所有條款';
	errorCode['AGREE_PROVISION_ONE'] = i18n.getStringByTag('INPUT_CHECK.AGREE_PROVISION_ONE'); //'請同意條款';
	errorCode['INPUT_ERROR'] = i18n.getStringByTag('INPUT_CHECK.ERROR'); //'請確實完成資料';
	errorCode['SIGN'] = i18n.getStringByTag('INPUT_CHECK.SIGN'); //'請簽名';
	errorCode['CAPTCHA'] = i18n.getStringByTag('INPUT_CHECK.CAPTCHA'); //請輸入圖形驗證碼
	this.errorMsgData = errorCode;
	/**
	 * [setErrorCode 設定錯誤訊息]
	 * @param {[type]} errorCode [description]
	 */
	this.setErrorCode = function(set_data)
	{
		var errorCode = this.errorMsgData; //不斷加入error code
		if(typeof set_data === 'object' && Object.keys(set_data).length > 0){
			var error_key = []; //不可以取代
			for(key in set_data){
				if(typeof errorCode[key] !== 'undefined'){
					error_key.push(set_data[key]);
					delete set_data[key];
				}
			}
			if(error_key.length !== 0){
				$log.debug('以下編號不可以取代');
				$log.debug(error_key);
			}
			errorCode = angular.extend(errorCode, set_data);
			// console.log(errorCode);
		}
		this.errorMsgData = errorCode;
	}

	/**
	 * [getErrorMsgData description]
	 * @return {[type]} [description]
	 */
	this.getErrorMsgData = function(key,subkey){
		if(typeof mainClass.errorMsgData === 'undefined' || Object.keys(mainClass.errorMsgData).length <= 0){
			mainClass.setErrorCode();
		}
		if(typeof key === 'undefined'){
			return mainClass.errorMsgData;
		}else if(typeof subkey === 'undefined'){
			return (typeof mainClass.errorMsgData[key] !== 'undefined')
					? mainClass.errorMsgData[key] : false;
		}else{
			return (typeof mainClass.errorMsgData[key][subkey] !== 'undefined')
					? mainClass.errorMsgData[key][subkey] : false;
		}
	}

	/**
	 * [getErrorMsg 錯誤訊息處理]
	 * @param  {[type]} message    [description]
	 * @param  {[type]} submessage [description]
	 * @return {[type]}            [description]
	 */
	this.getErrorMsg = function(message,submessage,return_type)
	{
		var errorCode = mainClass.getErrorMsgData();
		if(typeof errorCode[message] !== 'undefined'){
			message = angular.copy(errorCode[message]);
		}
		if(typeof message !== 'object'){
			if(message.length <= 0){
				message = "";
			}
			message = {message:message};
		}
		if(typeof submessage === 'string' && submessage !== ''){
			message.message = message.message + '。' + submessage;
			if(typeof message.state_set !== 'undefined'){
				message.state_set.content = (typeof message.state_set.content !== 'undefined')
									? message.state_set.content + '<br>' + submessage
									: submessage;
			}
		}
		if(typeof message.go_state !== 'undefined' && message.go_state){
			//==導頁==//
			$state.go(message.go_state,message.state_set,{location: 'replace'});
			return false;
		}
		if(typeof return_type !== 'undefined' && return_type){
			return message.message;
		}

		//==錯誤訊息dialog==//
		var tmp_set = (typeof message.state_set === 'object')
						? message.state_set
						: message.message;
		MainUiTool.openDialog(tmp_set);
		return true;
	}
	//==預設設定errorCode==//
	this.setErrorCode();
});
//=====[messageServices END]=====//

});