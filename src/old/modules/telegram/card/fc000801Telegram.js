define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc000801Telegram START 活動查詢]=====//
MainApp.register.service("fc000801Telegram",function(telegramServices)
{
	var MainClass = this;
	this.telegramCode = 'card/fc000801';

	/**
	 * [getData]
	 * @return {[type]} [description]
	 */
	this.getData = function(telegramObj,endMethod)
	{
		//==電文success==//
		var set_telegram = {};
		//==電文success==//
		if(typeof endMethod === 'function'){
			set_telegram.success = function(resultObj){
				if(typeof resultObj.activityDetails !== 'object' || typeof resultObj.activityDetails.activityDetail  !== 'object'){
					endMethod(false,resultObj);
					return false;
				}
				var result = telegramServices.modifyResDetailObj(resultObj.activityDetails.activityDetail);
				endMethod(result,resultObj);
			}
			set_telegram.error = function(resultObj){
				endMethod(false,resultObj);
			}
		}

		//==不可改變的電文==//
		// set_telegram.telegram_nochange = [];
		//==telegramObj 檢查==//
		set_telegram.data = {
			"custId" : telegramObj.idNo,
		};

		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);

	}

});
//=====[fc000801Telegram END]=====//


});