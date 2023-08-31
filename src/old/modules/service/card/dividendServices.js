/**
 * [紅利]
 */
define([
	"app"
	,"service/formServices"
	,"service/loginServices"
	,"service/messageServices"
	,"app_telegram/fc000301Telegram"
	,"app_telegram/fc000302Telegram"
]
, function (MainApp) {

//=====[dividendServices START]=====//
MainApp.register.service("dividendServices",function(
	$rootScope,$state,i18n
	,formServices,loginServices,messageServices
	,fc000301Telegram,fc000302Telegram
){
	var mainClass = this;

	/**
	 * [dividendSetData 資料設定]
	 * @type {Object}
	 */
	var dividendSetData = {
		min_num : 1000, 			//最低可替換
		factor_num : 1000, 			//替換
		transfer_money : 60, 		//每factor_num可換點數
		dividend_point : 0			//當前持有
	};


	//==錯誤訊息設定==//
	var errorCode = {};
	//兌換點數需大於XX點
	errorCode['FC0003_001'] = i18n.getStringByTag('CTRL_DIVIDEND.CHECK.MORE')
						+dividendSetData.min_num
						+i18n.getStringByTag('CTRL_DIVIDEND.POINT');
	//點數不足，無法兌換
	errorCode['FC0003_002'] = i18n.getStringByTag('CTRL_DIVIDEND.CHECK.LESS');
	//請勿超過持有紅利XX點
	errorCode['FC0003_003'] = i18n.getStringByTag('CTRL_DIVIDEND.CHECK.OVER');
	//'查無點數',
	errorCode['FC0003_004'] = {
		message : i18n.getStringByTag("CTRL_DIVIDEND.CHECK.NO_POINT"),
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag("CTRL_DIVIDEND.CHECK.NO_POINT"),
			content : i18n.getStringByTag("CTRL_DIVIDEND.CHECK.NO_POINT_MSG")
		}
	};
	//紅利兌換失敗
	errorCode['FC0003_005'] = {
		message : i18n.getStringByTag("CTRL_DIVIDEND.CHECK.EXCHANGE_ERROR"),
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag("CTRL_DIVIDEND.CHECK.EXCHANGE_ERROR"),
			content : i18n.getStringByTag("CTRL_DIVIDEND.CHECK.EXCHANGE_ERROR")
		}
	};
	//請勿超過持有紅利XX點
	errorCode['FC0003_006'] = i18n.getStringByTag('CTRL_DIVIDEND.CHECK.CANNOT');
	messageServices.setErrorCode(errorCode);
	this.getErrorMsg = messageServices.getErrorMsg;

	/**
	 * [getDividendSet 取得紅利設定資料]
	 * @param  {[type]} key [description]
	 * @return {[type]}     [description]
	 */
	this.getDividendSet = function(key){
		var data = dividendSetData;
		if(typeof key !== 'undefined'){
			data = (typeof dividendSetData[key]) ? dividendSetData[key] : '';
		}
		return data;
	}


	/**
	 * [checkDividend description]
	 * @param  {[type]} dividend      [兌換]
	 * @param  {[type]} dividend_have [擁有]
	 * @return {[type]}                [錯誤代碼]
	 *         	0 成功
	 */
	this.checkDividend = function(dividend,dividend_have){
		var error = 0; //成功
		if(dividend_have < dividendSetData.min_num){
			error = 3; //擁有數低於最低可替換數
		}else if(dividend >= 0){
			//==兌換比對==//
			if(dividend < dividendSetData.min_num){
				error = 1; //兌換點數低於最低可替換數
			}else if(dividend > dividend_have){
				error = 2; //兌換點數大於最大擁有數
			}
		}
		return error;
	}

	/**
	 * [getDividendTrans 紅利點數轉換]
	 * @param  {[type]} dividend [description]
	 * @return {[type]}          [description]
	 */
	this.getDividendTrans = function(dividend)
	{
		var data = {
			status : false,
			msg : i18n.getStringByTag('CTRL_DIVIDEND.CHECK.CANNOT'),
			data : {
				money : 0,
				dividend_trans : 0
			}
		}

		var result = formServices.checkNumber(dividend,'positive');
		if(!result.status){
			data.msg = result.msg;
			return data;
		}

		var tmp = Math.floor(dividend / dividendSetData.factor_num);
		data.data.money = tmp * dividendSetData.transfer_money;
		data.data.dividend_trans = tmp  * dividendSetData.factor_num;
		data.status = true;
		data.msg = '';
		return data;
	}


	/**
	 * [getDividend 取得紅利點數電文]
	 * @return object [description]
	 */
	this.getDividendTelegram = function(methodObj)
	{
		var callBack = function(bonus,jsonObj){
			var dividend_point = parseInt(bonus);
			dividendSetData.dividend_point = dividend_point;
			if(bonus === false){
				dividend_point = false;
			}
			methodObj(dividend_point,jsonObj);
		}
		fc000301Telegram.getData(callBack);
	};

	/**
	 * [sendDividendTelegram 兌換紅利點數電文]
	 * @return object [description]
	 */
	this.sendDividendTelegram = function(telegramObj,methodObj)
	{
		var result = {
			status : false,
			msg : i18n.getStringByTag('CTRL_DIVIDEND.CHECK.APPLY_ERROR') //申請兌換失敗
		}
		var isLogin = loginServices.checkLogin({
			showLoginMenu : true
		}); //沒登入重來
		if(isLogin){
			result = fc000302Telegram.saveData(telegramObj,methodObj);
		}
		return result;
	};


});
//=====[dividendServices END]=====//

});