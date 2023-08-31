define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc000401Telegram START 繳卡費]=====//
MainApp.register.service("fc000401Telegram",function(telegramServices,sysCtrl)
{
	var MainClass = this;
	this.telegramCode = 'card/fc000401';

	/**
	 * [sendData 繳卡費]
	 * @return {[type]} [description]
	 */
	this.sendData = function(telegramObj,endMethod)
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

		// console.log(telegramObj);
		if(typeof telegramObj.idNo === 'undefined'){
			telegramObj.idNo = '';
		}
		if(typeof telegramObj.paymentType === 'undefined'){
			telegramObj.paymentType = (telegramObj.selectAmt) ? telegramObj.selectAmt : '3';
		}

		//==上行電文資料==//
		set_telegram.data = {
			"custId" : telegramObj.idNo,
			"bussNO" : telegramObj.cardnum,
			"trnsfrOutBank" : telegramObj.selectBank,
			"trnsfrOutAccnt" : telegramObj.payAcnt,
			"trnsfrAmount" : telegramObj.payAmt,
			"paymentType" : telegramObj.paymentType,
			"byPassage" : telegramObj.byPassage,
			"captchaVal" : telegramObj.captchaVal
		};
		// console.log(set_telegram.data);
		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
	}

});
//=====[fc000401Telegram END]=====//


});