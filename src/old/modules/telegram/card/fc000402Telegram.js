define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc000402Telegram START 轉出帳號查詢]=====//
MainApp.register.service("fc000402Telegram",function(telegramServices,sysCtrl)
{
	var MainClass = this;
	this.telegramCode = 'card/fc000402';

	/**
	 * [getData 取得轉出帳號]
	 * @return {[type]} [description]
	 */
	this.getAcntData = function(endMethod)
	{
		var set_telegram = {};
		//==電文success==//
		if(typeof endMethod === 'function'){
			set_telegram.success = function(resultObj,headerObj){
				if(typeof resultObj.trnsOutAccts === 'undefined' || typeof resultObj.trnsOutAccts.acctNo === 'undefined' ){
					endMethod(false,resultObj,headerObj);
				}else{
					if(typeof resultObj.trnsOutAccts === 'object' && typeof resultObj.trnsOutAccts.acctNo === 'string'){
						//==特殊處理(只有一筆時)==//
						// console.log("特殊處理(只有一筆時)");
						var result = [resultObj.trnsOutAccts.acctNo];
						endMethod(result);
					}else{
						// console.log("一般處理()");
						endMethod(resultObj.trnsOutAccts.acctNo,resultObj,headerObj);
					}
				}
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

		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
	}

});
//=====[fc000402Telegram END]=====//


});