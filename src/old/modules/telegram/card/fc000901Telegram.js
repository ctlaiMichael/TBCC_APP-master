define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc000901Telegram START 帳單分期]=====//
MainApp.register.service("fc000901Telegram",function(telegramServices,sysCtrl)
{
	var MainClass = this;
	this.telegramCode = 'card/fc000901';

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
			"trnsfrAmount" : telegramObj.payableAmt,
			"periodInstallmenRate" : telegramObj.selectBill,
			"captchaVal" : telegramObj.captchaVal
		};
		//==小數檢查==//
		if(set_telegram.data['trnsfrAmount'].toString().indexOf('.') <= -1){
			set_telegram.data['trnsfrAmount'] = set_telegram.data['trnsfrAmount']+'.00';
		}

		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
	}

});
//=====[fc000901Telegram END]=====//


});