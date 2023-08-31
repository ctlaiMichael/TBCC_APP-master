define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc000701Telegram START]=====//
MainApp.register.service("fc000701Telegram",function(telegramServices,sysCtrl)
{
	var MainClass = this;
	this.telegramCode = 'card/fc000701';

	/**
	 * [getData 取得本期帳單明細]
	 * @return {[type]} [description]
	 */
	this.getData = function(endMethod)
	{
		var set_telegram = {};
		//==電文success==//
		if(typeof endMethod === 'function'){
			set_telegram.success = function(resultObj){
				if(typeof resultObj.billDetails !== 'object' || typeof resultObj.billDetails.billDetail  !== 'object'){
					endMethod(false,resultObj);
					return false;
				}
				//==特殊處理(只有一筆時)==//
				var result = telegramServices.modifyResDetailObj(resultObj.billDetails.billDetail);
				endMethod(true,result);
			}
			set_telegram.error = function(resultObj){
				endMethod(false,resultObj);
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
		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
	}

});
//=====[fc000701Telegram END]=====//


});