define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc000103Telegram START 圖形驗證碼取得]=====//
MainApp.register.service("fc000103Telegram",function(telegramServices,deviceInfo)
{
	var MainClass = this;
	this.telegramCode = 'card/fc000103';

	/**
	 * [getData 取得圖形驗證碼]
	 * @return {[type]} [description]
	 */
	this.getData = function(successMethod,errorMethod){
		var set_telegram = {};
		//==電文success==//
		set_telegram.success = function(jsonObj){
			var tmp = jsonObj.captcha;
			jsonObj.captcha = tmp.replace(/\n/g,'');
			var captcha = "data:image/jpeg;base64,"+jsonObj.captcha;
			if(typeof successMethod === 'function'){
				successMethod(captcha);
			}
		}
		//==電文error==//
		if(typeof errorMethod === 'function'){
			set_telegram.error = function(jsonObj){
				errorMethod(jsonObj);
			}
		}

		//==不可改變的電文==//
		// set_telegram.telegram_nochange = [];
		//==telegramObj 檢查==//
		set_telegram.data = {
			uid : deviceInfo.uuid
		};

		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
	}

});
//=====[fc000103Telegram END]=====//


});