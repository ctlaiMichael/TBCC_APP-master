define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc000802Telegram START 活動登錄]=====//
MainApp.register.service("fc000802Telegram",function(telegramServices,sysCtrl)
{
	var MainClass = this;
	this.telegramCode = 'card/fc000802';

	/**
	 * [saveData 活動登錄]
	 * @return {[type]} [description]
	 */
	this.saveData = function(telegramObj,endMethod)
	{
		var result_data = {
			'status' : false,
			"msg" : ""
		};

		var set_telegram = {};
		//==電文success==//
		if(typeof endMethod === 'function'){
			set_telegram.success = function(resultObj){
				if(typeof resultObj.activityRegDetails !== 'object' || typeof resultObj.activityRegDetails.activityRegDetail  !== 'object'){
					endMethod(false,resultObj);
					return false;
				}
				var result = telegramServices.modifyResDetailObj(resultObj.activityRegDetails.activityRegDetail);
				endMethod(result,resultObj);
			}
			set_telegram.error = function(resultObj){
				endMethod(false,resultObj);
			}
		}
		//==不可改變的電文==//
		// set_telegram.telegram_nochange = [];

		//==上行電文資料==//
		set_telegram.data = telegramObj;

		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
		result_data.status = true;
		result_data.msg = "電文發送中";
		return result_data;
	}
});
//=====[fc000802Telegram END]=====//


});