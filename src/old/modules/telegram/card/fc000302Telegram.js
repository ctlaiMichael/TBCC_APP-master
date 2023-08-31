define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[captchaTelegram START 紅利點數兌換]=====//
MainApp.register.service("fc000302Telegram",function(telegramServices,sysCtrl)
{
	var MainClass = this;
	this.telegramCode = 'card/fc000302';

	/**
	 * [saveData 紅利點數兌換]
	 * @return {[type]} [description]
	 */
	this.saveData = function(telegramObj,endMethod)
	{
		var result_data = {
			'status' : false,
			"msg" : ""
		};

		//==telegramObj 檢查==//
		if(typeof telegramObj !== 'object' && typeof telegramObj === "number"){
			var tmp = {
				"dividend":telegramObj
			};
			telegramObj = tmp;
		}
		if(typeof telegramObj.dividend === 'undefined'
			|| typeof telegramObj.dividend !== 'number'
			|| telegramObj.dividend < 1
		){
			result_data.msg = "請設定兌換紅利點數";
			return result_data;
		}


		var set_telegram = {};
		//==電文success==//
		if(typeof endMethod === 'function'){
			set_telegram.success = function(jsonObj){
				var dividend_object = jsonObj;
				 //兌換點數
				dividend_object['transfer'] = (typeof dividend_object.redemptionPoints !== 'undefined')
												? dividend_object.redemptionPoints
												: 0;
				 //持有紅利
				dividend_object['dividend'] = (typeof dividend_object.remainingPoints !== 'undefined')
												? dividend_object.remainingPoints
												: 0;
				 //兌換現金
				dividend_object['money'] = (typeof dividend_object.dollarsArrived !== 'undefined')
												? dividend_object.dollarsArrived
												: 0;

				endMethod(true,dividend_object);
			}
			set_telegram.error = function(jsonObj){
				endMethod(false,jsonObj);
			}
		}


		var userModel = sysCtrl.getUserModel();
		if(typeof userModel.userId !== 'string' || !userModel.userId){
			result_data.msg = "請先登入";
			return result_data;
		}

		//==不可改變的電文==//
		// set_telegram.telegram_nochange = [];

		//==上行電文資料==//
		set_telegram.data = {
			"custId" : userModel.userId,
			"bonus":telegramObj.dividend
		};

		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
		result_data.status = true;
		result_data.msg = "電文發送中";
		return result_data;
	}

});
//=====[captchaTelegram END]=====//


});