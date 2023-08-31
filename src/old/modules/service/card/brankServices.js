/**
 * [銀行代碼清單]
 */
define([
	"app"
	,"app_telegram/f4000103Telegram"
]
, function (MainApp) {
//=====[brankServices START 分行相關]=====//
MainApp.register.service("brankServices",function(
	$state,i18n,$filter,$timeout
	,f4000103Telegram
	,framework
){
	var MainClass = this;
	//==參數設定==//
	// var UAT_FLAG = framework.getConfig("UAT_FLAG", 'B');

	this.restObject = []; //在還沒有資料前要產生的object
	this.brankhData = {};

	/**
	 * [ajaxGetData 取得資料]
	 * @return {[type]} [description]
	 */
	this.ajaxGetData = function(){
		f4000103Telegram.getData(function(response){
			if(typeof response === 'object' && Object.keys(response).length > 0)
			{
				MainClass.brankhData.list = response;
				MainClass.setListData();
				if(MainClass.restObject.length > 0){
					for(key in MainClass.restObject){
						MainClass.setCitySelect(MainClass.restObject[key]);
					}
					MainClass.restObject = [];
				}
			}
		});
	}

	/**
	 * [setAreaData 製作地區清單]
	 */
	this.setListData = function(){
		var data = MainClass.brankhData.list;
		var key_obj = {};
		var key_list = {};
		var array_list = [];
		var tmp = {};
		//==特殊處理==//
		// if(UAT_FLAG){
		// 	data['test444'] = {
		// 		bankCode : '444',
		// 		bankName : '測試銀行'
		// 	};
		// }
		for(key in data)
		{
			tmp = data[key];
			tmp['bankNameAll'] = tmp['bankName']+'-'+tmp['bankCode'];
			if(typeof tmp['bankCode'] !== 'undefined' && tmp['bankCode'] !== '')
			{
				if(typeof key_list[tmp['bankCode']] === 'undefined'){
					key_list[tmp['bankCode']] = tmp['bankName'];
					key_obj[tmp['bankCode']] = tmp;
					array_list.push(tmp);
				}
			}
		}

		MainClass.brankhData.key_list = key_list;
		MainClass.brankhData.key_obj = key_obj;
		MainClass.brankhData.array_list = array_list;
	}

	/**
	 * [getData 取得Card所有設定資料]
	 * @param  {[type]} key    [list,city,branch,city_branch]
	 * @param  {[type]} subkey [sub]
	 * @return {[type]}        [description]
	 */
	this.getData = function(key,subkey)
	{
		var data = MainClass.brankhData;
		if(typeof MainClass.brankhData.list === 'undefined'
			|| Object.keys(MainClass.brankhData.list) < 1){
			MainClass.ajaxGetData();
			return false;
		}
		if(typeof key !== 'undefined'){
			data = (typeof data[key] !== 'undefined')
					? data[key]
					: {};
			if(typeof subkey !== 'undefined'){
				data = (typeof data[subkey] !== 'undefined')
						? data[subkey]
						: false;
			}
		}
		return data;
	}

	/**
	 * [setCitySelect 地區city select]
	 * @param {[type]} obj [產生的物件]
	 */
	this.setCitySelect = function(obj)
	{
		var tmp_obj;
		var tmp_html = '';
		var pap = angular.element(obj).closest('.info_select');
		var pap_data = MainClass.getData('key_obj');
		if(!pap_data || Object.keys(pap_data).length < 1){
			MainClass.restObject.push(obj);
			return false;
		}
		tmp_html += '<option value="">'+i18n.getStringByTag('INPUT_MSG.CARD.SELECT_BANK')+'</option>'; //請選擇轉出銀行
		for(key in pap_data){
			tmp_obj = pap_data[key];
			tmp_html += '<option value="'+key+'">'+tmp_obj['bankNameAll']+'</option>';
			if(key == '444'){
				console.log(tmp_obj);
			}
		}
		angular.element(obj).empty().append(tmp_html);
		$timeout(function(){
			angular.element(obj).val('006').trigger('change'); //預設選擇
		},1);

		//==branch change==//
		angular.element(obj).change(function(){
			var pap = angular.element(this).closest('.info_select');
			var branch = angular.element(this).val();
			var code_obj = pap.find('input[name=brank_id]');
			if(branch=='0'){
				branch = '';
			}
			if(typeof code_obj !== 'undefined'){
				code_obj.val(branch).trigger('change');
			}
		});

		//==brank_id change==//
		pap.find('input[name=brank_id]').focusout(function(){
			var branch_id = angular.element(this).val();
			var branch_id_data = MainClass.checkData('brank_id',branch_id);
			var pap = angular.element(this).closest('.info_select');
			var bank_obj = pap.find('select[name=bank_select]');
			if(branch_id_data){
				bank_obj.val(branch_id).trigger('change');
			}else{
				bank_obj.val('').trigger('change');
				angular.element(this).val('').trigger('change');
				if(branch_id){
					var error_msg = i18n.getStringByTag('INPUT_CHECK.SELECT_ERROR')
									+ '，'
									+ i18n.getStringByTag('INPUT_MSG.BANK.ID');
					MainUiTool.openDialog(error_msg);
				}
			}
		});
	}

	/**
	 * [checkData 檢查地區設定]
	 * @param  {[type]} check_type [檢查變數類型]
	 * @param  {[type]} check_val  [檢查資料值]
	 * @return {[type]}            [description]
	 */
	this.checkData = function(check_type,check_val)
	{
		var result = {
			status : false,
			msg : '',
			data : ''
		};
		var tmp;
		switch(check_type){
			case 'brank_id':
				result.msg = i18n.getStringByTag('INPUT_MSG.BRANCH.ID');
				tmp = MainClass.getData('key_list',check_val);
				if(tmp){
					result.status = true;
					result.data = tmp;
					result.msg = '';
				}
			break;
			case 'brank_name':
				result.msg = i18n.getStringByTag('INPUT_CHECK.AREA.CITY');
				tmp = MainClass.getData('array_list');
				var newTemp = $filter("filter")(tmp, {bankName:check_val});
				if(typeof newTemp !== 'undefined' && typeof newTemp[0] === 'object'){
					result.status = true;
					result.data = newTemp[0];
					result.msg = '';
				}
			break;
		}
		return result;
	}

});
//=====[brankServices END]=====//


});