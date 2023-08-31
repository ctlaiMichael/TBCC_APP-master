define([
	"app"
	,"app_telegram/telegramServices"
]
, function (MainApp) {
//=====[fc001002Telegram START 未列帳單消費明細查詢]=====//
MainApp.register.service("fc001002Telegram",function(telegramServices,sysCtrl)
{
	var MainClass = this;
	this.telegramCode = 'card/fc001002';
	/**
	 * [getData 未列帳單消費明細查詢]
	 * @return {[type]} [description]
	 */
	this.getCardData = function(periods,CardNo,endMethod,PAGE)
	{
		// console.error('telegram cardno:'+CardNo);
		var set_telegram = {};
		//==電文success==//
		if(typeof endMethod === 'function'){
			set_telegram.success = function(jsonObj){
				if(typeof jsonObj.details !=="object" || typeof jsonObj.details.detail !=="object"){
					endMethod(false,jsonObj);
					return false;
				}
				var result = jsonObj;
				result.details = telegramServices.modifyResDetailObj(jsonObj.details.detail);

				var pageData = jsonObj.paginatedInfo;
				endMethod(result,pageData);
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
			"custId" : userModel.userId,
			"creditCardNo" : CardNo,
			"stage" : "0",
			"paginator" : {
				"pageSize" : "10",
				"pageNumber" : "0",
				"sortColName" : "EXPENDDATE",
				"sortDirection" : "DESC"
			}
		};
		if(periods){
			set_telegram.data.stage = periods;
		}
		//置換頁碼
		// console.error('telegram:',PAGE);
		if(typeof(PAGE) != "undefined" && PAGE){
			set_telegram.data.paginator.pageNumber = PAGE;
			//==在取第二頁之後均關閉loading設定==//
			set_telegram.loading = false;
		}
		if (set_telegram.data.paginator.pageNumber == '1') {
			set_telegram.data.paginator.pageNumber = '0';
		}
		// console.log('telegram loading:'+set_telegram.loading);
		//console.log(set_telegram);
		telegramServices.sendTelegram(MainClass.telegramCode,set_telegram);
	}

});
//=====[fc001002Telegram END]=====//


});