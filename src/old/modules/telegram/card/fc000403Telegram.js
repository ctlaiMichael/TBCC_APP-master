define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc000403Telegram START 信用卡本期帳單查詢]=====//
MainApp.register.service("fc000403Telegram",function(
	telegramServices,sysCtrl
){
	var MainClass = this;
	this.telegramCode = 'card/fc000403';

	/**
	 * [getPayAmt 信用卡本期帳單查詢]
	 * @return {[type]} [description]
	 */
	this.getPayAmt = function(custId,endMethod)
	{
		var set_telegram = {};
		//==電文success==//
		if(typeof endMethod === 'function'){
			set_telegram.success = function(resultObj,headerObj){
				endMethod(true,resultObj,headerObj);
			}
			set_telegram.error = function(resultObj,headerObj){
				endMethod(false,resultObj,headerObj);
			}
		}
		//==不可改變的電文==//
		// set_telegram.telegram_nochange = [];

		var userModel = sysCtrl.getUserModel();
		if(typeof userModel.userId !== 'string' || !userModel.userId){
			endMethod(false,{});
			return false;
		}
		//==上行電文資料==//
		set_telegram.data = {
			"custId" : userModel.userId
		};
		//debugger;
		if (userModel.path == "#/billInst/" || userModel.path == "#/select/instSelect/"){
			set_telegram.data["queryType"] = '1';
			set_telegram.not_check_req = true;
		}
		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
	}

});
//=====[fc000403Telegram END]=====//


});
