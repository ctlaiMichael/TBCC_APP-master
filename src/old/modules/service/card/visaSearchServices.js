/**
 * [VISA金融卡帳單查詢]
 */
define([
	"app"
	,"service/messageServices"
	,"app_telegram/fc001201Telegram"
	,"app_telegram/fc001202Telegram"
]
, function (MainApp) {

//=====[dividendServices START]=====//
MainApp.register.service("visaSearchServices",function(
	i18n
	,messageServices
	,fc001201Telegram,fc001202Telegram
){
	var mainClass = this;

	//==錯誤訊息==//
	var error_btn = {
		//'返回帳單查詢選單'
		"menu" : {"name":i18n.getStringByTag("PAGE_TITLE.BILLSEARCH"),"sref":"select({menu_type:'billSearch'})"}
	};
	var errorCode = {};
	errorCode['FC0012_001'] = {
		message : i18n.getStringByTag('ERROR_MSG.NO_SEARCH'),
		return_flag : false,
		go_state : 'message',
		state_set : {
			title : i18n.getStringByTag('ERROR_MSG.NO_SEARCH'),
			content : i18n.getStringByTag('ERROR_MSG.NO_SEARCH'),
			btn_list:[error_btn.menu]
		}
	};
	errorCode['FC0012_002'] = i18n.getStringByTag('ERROR_CODE.FC0012_002.MESSAGE');
	messageServices.setErrorCode(errorCode);
	this.getErrorMsg = messageServices.getErrorMsg;

 　  //取第一頁資料
	this.getData = function(getCallBack_method){
		fc001201Telegram.getData(function(jsonObj,pageData){
			if(!jsonObj){
				getCallBack_method(false);
				return false;
			}
			getCallBack_method(jsonObj,pageData);
		});
	}
　　//取第N頁資料
	this.getDataOnPage = function(PAGE,getCallBack_method){
		fc001201Telegram.getData(function(jsonObj,pageData){
			if(!jsonObj){
				getCallBack_method(false);
				return false;
			}
			getCallBack_method(jsonObj,pageData);
		},PAGE);
	}
 　  //取第一頁資料
	this.getCardData = function(periods,CardNo,getCallBack_method){
		fc001202Telegram.getCardData(periods,CardNo,function(jsonObj,pageData){
			if(!jsonObj){
				getCallBack_method(false);
				return false;
			}
			var data = jsonObj;
			data.cardDetail = jsonObj.cardDetail;
			// console.error(pageData);
			getCallBack_method(data,pageData);
		});
	}
	//取第N頁資料
	this.getCardDataOnPage = function(PAGE,periods,CardNo,getCallBack_method){
		fc001202Telegram.getCardData(periods,CardNo,function(jsonObj,pageData){
			if(!jsonObj){
				getCallBack_method(false);
				return false;
			}
			var data = jsonObj;
			data.cardDetail = jsonObj.cardDetail;
			getCallBack_method(data,periods,pageData);
		},PAGE);
	}
});
//=====[dividendServices END]=====//

});