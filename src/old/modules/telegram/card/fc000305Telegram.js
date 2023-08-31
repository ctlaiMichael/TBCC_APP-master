define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc000305Telegram START 身分驗證]=====//
MainApp.register.service("fc000305Telegram",function(telegramServices)
{
	var MainClass = this;
	this.telegramCode = 'card/fc000305';

	/**
	 * [sendReq]
	 * @return {[type]} [description]
	 */
	this.sendReq = function(telegramObj,endMethod)
	{
		
		var set_telegram = {};
		//==電文success==//
		if(typeof endMethod === 'function'){
			set_telegram.success = function(resultObj){
				endMethod(true,resultObj);
			}
			set_telegram.error = function(resultObj){
				// 主機卻認為025A
				if(resultObj.respCode==="025A"){
					//FC0013_003
					resultObj.respCodeMsg="FC0013_003";
				}else if(resultObj.respCode==="010003" || resultObj.respCode==="9999"){
					resultObj.respCodeMsg="FC0013_002";
				}else{
					resultObj.respCodeMsg="FC0013_001";
				}	
				endMethod(false,resultObj);
			}
		}
		//==不可改變的電文==//
		// set_telegram.telegram_nochange = [];
		// var userModel = sysCtrl.getUserModel();
		// if(typeof userModel.userId !== 'string' || !userModel.userId){
		// 	endMethod(false,{});
		// 	return false;
		// }

		//生日欄位調整格式 為 yyyymmdd  1986/1/1
		var dt = new Date(telegramObj.birthDate);
		var timestamp = dt.getTime();
		if(timestamp){
			var month = dt.getMonth()+1;
			month = ('0' + month).substr(-2);
			var date = ('0' +dt.getDate() ).substr(-2);
			var year = dt.getFullYear();
			telegramObj.birthDate = year+''+month+''+date;
			
		}

		//==telegramObj 電文欄位檢查==//
		set_telegram.data = {
			'custId':telegramObj.custId,
			'creditCardNO':telegramObj.creditCardNO,
			'ValidMonthYear':telegramObj.ValidMonthYear,
			'checkCode':telegramObj.checkCode,
			'birthDate':telegramObj.birthDate,
			'captchaVal':telegramObj.captchaVal,
			'isSelf':telegramObj.isSelf
		};
		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
	}

});
//=====[fc000305Telegram END]=====//


});