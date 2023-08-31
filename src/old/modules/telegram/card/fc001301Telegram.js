define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc001301Telegram START 帳單分期]=====//
MainApp.register.service("fc001301Telegram",function(telegramServices,sysCtrl)
{
	var MainClass = this;
	this.telegramCode = 'card/fc001301';

	/**
	 * [getData]
	 * @return {[type]} [description]
	 */
	this.getData = function(telegramObj,endMethod)
	{
		var set_telegram = {};
		//==電文success==//
		if(typeof endMethod === 'function'){
			set_telegram.success = function(resultObj){
				endMethod(true,resultObj);
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
		//==telegramObj 檢查==//
		set_telegram.data = {
			"custId" : userModel.userId,
			"period" : telegramObj.selectBill,
			"captchaVal" : telegramObj.captchaVal,
			"payCategory" : telegramObj.payCategory
		};
		//==小數檢查==//
		// if(set_telegram.data['trnsfrAmount'].toString().indexOf('.') <= -1){
		// 	set_telegram.data['trnsfrAmount'] = set_telegram.data['trnsfrAmount']+'.00';
		// }

		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
	}

});
//=====[fc001301Telegram END]=====//


});