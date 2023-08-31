/**
 * [選單相關]
 */
define([
	"app",
	"config/menu"
]
, function (MainApp,menuConfig) {
//=====[menuServices START]=====//
MainApp.register.service("menuServices",function($resource)
{
	this.menuData = {}; //所有menu data

	/**
	 * [getMenu 取得menu設定]
	 * @return {[type]} [description]
	 */
	this.getMenu = function(menu_type,remake)
	{
		if(remake || Object.keys(this.menuData).length <= 0){
			this.ajaxMenu();
		}
		var menu = this.menuData;
		if(typeof menu_type != 'undefined'){
			menu = (typeof menu[menu_type] != 'undefined')
					? menu[menu_type]
					: [];
		}
		return menu;
	}

	/**
	 * [ajaxMenu 取得設定檔]
	 * @return object [menu]
	 */
	this.ajaxMenu = function()
	{
		//==menu==//
		var menu = menuConfig;
		if(typeof menu.main !== 'undefined'){
			var menu_data = menu.main;
			var main_list = [];
			var chunk = 9;
			if(typeof menu_data !== 'undefined' && menu_data.length > chunk){
				for (i=0,j=menu_data.length; i<j; i+=chunk) {
					main_list.push(menu_data.slice(i,i+chunk));
				}
			}else{
				main_list.push(menu_data);
			}
			menu.main_list = main_list;
		}
		this.menuData = menu;
		return menu;
	}
	var today = new Date();//獲得當前日期
	var houseday = new Date(2020, 5, 15); //房屋稅 JavaScript 表達月份 (month) 是從 0 到 11，0 是一月；11 是十二月。
	var taxday = new Date(2020, 6, 15); //綜所稅
	var selectMenuData = {};
	if ( today > taxday){
		selectMenuData['instSelect'] = {
		title : 'PAGE_TITLE.INSTSELECT', //分期付款
		sub_menu : [
				{name : 'PAGE_TITLE.BILLINST', sref : 'billInst'}, //帳單分期
				{name : 'PAGE_TITLE.SINGLEINST', sref : 'singleInst'}, //單筆分期
				// {name : 'PAGE_TITLE.TAXBILLINST', sref : 'taxbillInst'}, //108年綜所稅帳單分期
				// {name : 'PAGE_TITLE.HOUBILLINST', sref : 'houbillInst'}, //109年房屋稅分期
				// {name : 'PAGE_TITLE.LICENSEINST', sref : 'licenseInst'} //109年牌照稅分期

			]
		};
	} else if (today > houseday) {
		
			selectMenuData['instSelect'] = {
			title : 'PAGE_TITLE.INSTSELECT', //分期付款
			sub_menu : [
					{name : 'PAGE_TITLE.BILLINST', sref : 'billInst'}, //帳單分期
					{name : 'PAGE_TITLE.SINGLEINST', sref : 'singleInst'}, //單筆分期
					{name : 'PAGE_TITLE.TAXBILLINST', sref : 'taxbillInst'}, //108年綜所稅帳單分期
					// {name : 'PAGE_TITLE.HOUBILLINST', sref : 'houbillInst'}, //109年房屋稅分期
					// {name : 'PAGE_TITLE.LICENSEINST', sref : 'licenseInst'} //109年牌照稅分期
	
				]
		};

	} else {
			selectMenuData['instSelect'] = {
			title : 'PAGE_TITLE.INSTSELECT', //分期付款
			sub_menu : [
					{name : 'PAGE_TITLE.BILLINST', sref : 'billInst'}, //帳單分期
					{name : 'PAGE_TITLE.SINGLEINST', sref : 'singleInst'}, //單筆分期
					{name : 'PAGE_TITLE.TAXBILLINST', sref : 'taxbillInst'}, //108年綜所稅帳單分期
					{name : 'PAGE_TITLE.HOUBILLINST', sref : 'houbillInst'}, //109年房屋稅分期
					//{name : 'PAGE_TITLE.LICENSEINST', sref : 'licenseInst'} //109年牌照稅分期
	
				]
		};
	
	}	
	if(sessionStorage.hasOwnProperty('login_method') && sessionStorage.getItem('login_method') == '2'){
		selectMenuData['payCardFee'] = {
			title : 'PAGE_TITLE.PAYCARDFEE', //繳卡費
			sub_menu : [
					{name : 'PAGE_TITLE.PAY_FORM', sref : 'payForm'}, //自行輸入繳款
					{name : 'PAGE_TITLE.PAY_LOGIN', sref : 'payFormLogin'}, //登入網銀繳款
					{name : '超商繳卡費', sref : 'pay-market-card', type:'pay-market-card'} //超商繳卡費
				]
		};
	}else {
		selectMenuData['payCardFee'] = {
			title : 'PAGE_TITLE.PAYCARDFEE', //繳卡費
			sub_menu : [
					{name : 'PAGE_TITLE.PAY_FORM', sref : 'payForm'}, //自行輸入繳款
					{name : 'PAGE_TITLE.PAY_LOGIN', sref : 'payFormLogin'}, //登入網銀繳款
					{name : '繳本人卡款', sref : 'pay-va-card', type:'pay-va-card'}, //本人合庫信用卡款
					{name : '超商繳卡費', sref : 'pay-market-card', type:'pay-market-card'} //超商繳卡費
				]
		};
	}
	
	selectMenuData['activateCard'] = {
		title : 'PAGE_TITLE.ACTIVATECARD', //'開卡/掛失'
		sub_menu : [
				{name : 'MENU.LEFT.OPEN', sref : 'activateForm'}, //'信用卡開卡'
				{name : 'MENU.LEFT.LOST', sref : 'lostForm'} //'信用卡掛失'
			]
	};
	selectMenuData['billSearch'] = {
		title : 'PAGE_TITLE.BILLSEARCH', //'帳單查詢'
		sub_menu : [
				{name : 'PAGE_TITLE.BILLUNRECORDED', sref : 'bill_unrecorded'}, //'信用卡未列帳單明細'
				{name : 'PAGE_TITLE.VISASEARCH', sref : 'visa_search'}, //'VISA金融卡帳單查詢'
				{name : 'PAGE_TITLE.BILLPERIOD0', sref : 'bill_period' , state_set :{period : 0}}, //'本期帳單'
				// {name : 'PAGE_TITLE.BILLPERIOD1', sref : 'bill_period' , state_set :{period : 1}} //'前期帳單'
				//{name : 'PAGE_TITLE.BILLPERIOD2', sref : 'bill_period' , state_set :{period : 2}} //'前兩期帳單'
			]
	};

	// selectMenuData['card-quota'] = {
	// 	title : '額度調整', //
	// 	sub_menu : [
	// 			{name : '額度調整', sref : 'card-quota', type:'card-quota'} //額度調整
	// 		]
	// };

	this.selectMenu = function(menu){
		if(typeof menu === 'string' && typeof selectMenuData[menu] !== 'undefined'){
			return selectMenuData[menu];
		}
		return false;
	}


});
//=====[menuServices END]=====//




});
