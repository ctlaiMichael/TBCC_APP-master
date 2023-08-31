define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc001101Telegram START 未列帳單消費明細查詢]=====//
MainApp.register.service("fc001101Telegram",function(telegramServices,sysCtrl)
{
	var MainClass = this;
	this.telegramCode = 'card/fc001101';

	/**
	 * [getData 未列帳單消費明細查詢]
	 * @return {[type]} [description]
	 */
	this.getData = function(endMethod)
	{
		var set_telegram = {};
		//==電文success==//
		if(typeof endMethod === 'function'){
			set_telegram.success = function(jsonObj){
				if(typeof jsonObj.cards !=="object" || typeof jsonObj.cards.cardDetail !=="object"){
					endMethod(false,jsonObj);
					return false;
				}
				//==特殊處理(只有一筆時)==//
				var result = telegramServices.modifyResDetailObj(jsonObj.cards.cardDetail);
				var tmp_data = [];
				var tmp;
				for (key in result) {
					tmp = result[key];
					tmp['detail'] = [];
					if (typeof tmp.details === 'object' && typeof tmp.details.detail === 'object') {
						tmp['detail'] = telegramServices.modifyResDetailObj(tmp.details.detail);
					}
					tmp_data[key] = tmp;
				}
				result = tmp_data;
				// console.log(result);
				endMethod(result,jsonObj);
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
//=====[fc001101Telegram END]=====//


});