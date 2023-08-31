define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[f4000103Telegram START 銀行代碼查詢]=====//
MainApp.register.service("f4000103Telegram",function(telegramServices)
{
	var MainClass = this;
	this.telegramCode = 'card/f4000103';

	/**
	 * [getData 取得分行資料]
	 * @return {[type]} [description]
	 */
	this.getData = function(endMethod,telegramObj)
	{
		var set_telegram = {};
		//==電文success==//
		if(typeof endMethod === 'function'){
			set_telegram.success = function(jsonObj){
				if(typeof jsonObj.details === 'object' && typeof jsonObj.details.detail === 'object'){
					//==特殊處理(只有一筆時)==//
					var result = telegramServices.modifyResDetailObj(jsonObj.details.detail);
					endMethod(result);
				}else{
					endMethod(false,jsonObj);
				}
			}
			set_telegram.error = function(jsonObj){
				endMethod(false,jsonObj);
			}
		}

		//==不可改變的電文==//
		// set_telegram.telegram_nochange = [];

		//==上行電文資料==//
		set_telegram.data = {
		};

		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
	}

});
//=====[f4000103Telegram END]=====//


});