define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc000201Telegram START 補件上傳案件查詢]=====//
MainApp.register.service("fc000201Telegram",function(telegramServices)
{
	var MainClass = this;
	this.telegramCode = 'card/fc000201';


	/**
	 * [getData 取得圖形驗證碼]
	 * @return {[type]} [description]
	 */
	this.getData = function(telegramObj,endMethod)
	{
		var result_data = {
			'status' : false,
			"msg" : ""
		};

		var set_telegram = {};

		//==telegramObj 檢查==//
		if(typeof telegramObj !== 'object'
		 || typeof telegramObj.idNo === 'undefined'
		 || typeof telegramObj.captchaVal === 'undefined'
		){
			return result_data;
		}

		//==電文success==//
		if(typeof endMethod === 'function')
		{
			set_telegram.success = function(jsonObj){
				var txNo = (typeof jsonObj.details !== 'undefined' && typeof jsonObj.details.txNo !== 'undefined')
							? jsonObj.details.txNo
							: [];
				endMethod(true,txNo);
			}
			set_telegram.error = function(jsonObj){
				endMethod(false,jsonObj);
			}
		}

		//==不可改變的電文==//
		// set_telegram.telegram_nochange = [];
		//==telegramObj 檢查==//
		set_telegram.data = {
			"custId" : telegramObj.idNo,
			"captchaVal" : telegramObj.captchaVal
		};

		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);

		result_data.status = true;
		result_data.msg = "電文發送中";
		return result_data;
	}

});
//=====[fc000201Telegram END]=====//


});