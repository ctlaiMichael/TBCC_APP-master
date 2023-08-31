define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc000301Telegram START 紅利點數查詢]=====//
MainApp.register.service("fc000301Telegram",function(telegramServices,sysCtrl)
{
	var MainClass = this;
	this.telegramCode = 'card/fc000301';

	/**
	 * [getData 取得紅利點數]
	 * @return {[type]} [description]
	 */
	this.getData = function(endMethod,telegramObj)
	{
		var set_telegram = {};
		//==電文success==//
		if(typeof endMethod === 'function'){
			set_telegram.success = function(jsonObj){
				endMethod(jsonObj.bonus,jsonObj);
			}
			set_telegram.error = function(jsonObj){
				endMethod(false,jsonObj);
			}
		}

		var userModel = sysCtrl.getUserModel();
		if(typeof userModel.userId !== 'string' || !userModel.userId){
			endMethod(false,{});
			return false;
		}

		//==不可改變的電文==//
		// set_telegram.telegram_nochange = [];

		//==上行電文資料==//
		set_telegram.data = {
			"custId" : userModel.userId
		};

		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
	}

});
//=====[fc000301Telegram END]=====//


});