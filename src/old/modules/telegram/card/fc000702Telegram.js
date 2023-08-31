define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc000702Telegram START]=====//
MainApp.register.service("fc000702Telegram",function(telegramServices,sysCtrl)
{
	var MainClass = this;
	this.telegramCode = 'card/fc000702';

	this.sendData = function(telegramObj,endMethod)
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

		//==上行電文資料==//
		set_telegram.data = {
			"custId" : userModel.userId,
			"consumptionDate" : telegramObj.consumptionDate,
			"consumptionAmount" : telegramObj.consumptionAmount,
			"period" : telegramObj.period,
			"captchaVal" : telegramObj.captchaVal
		};
		//==小數檢查==//
		if(set_telegram.data['consumptionAmount'].toString().indexOf('.') <= -1){
			set_telegram.data['consumptionAmount'] = set_telegram.data['consumptionAmount']+'.00';
		}

		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
	}

});
//=====[fc000702Telegram END]=====//


});