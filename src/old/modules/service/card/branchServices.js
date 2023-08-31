define([
	"app"
	,"app_telegram/fc000104Telegram"
]
, function (MainApp) {
//=====[branchServices START 分行相關]=====//
MainApp.register.service("branchServices",function(
	$state,i18n
	,fc000104Telegram
){
	var MainClass = this;

	this.restObject = []; //在還沒有資料前要產生的object
	this.branchData = {};

	/**
	 * [ajaxGetData 取得資料]
	 * @return {[type]} [description]
	 */
	this.ajaxGetData = function(){
		fc000104Telegram.getData(function(response){
			if(typeof response === 'object' && Object.keys(response).length > 0)
			{
				MainClass.branchData.list = response;
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
		var data = MainClass.branchData.list;
		var city_list = {};
		var branch = {};
		var city_branch = {};

		var tmp = {};
		var subkey;
		for(key in data)
		{
			tmp = data[key];
			subkey = (typeof tmp['branchId'] !== 'undefined' && tmp['branchId'] !== '')
						? tmp['branchId']
						: 'error_'+key;
			tmp['branchNameOld'] = tmp['branchName'];
			tmp['branchName'] = tmp['branchName'].replace(tmp['branchId'],'').replace(/\(|\)/g, "");
			branch[subkey] = tmp;
			if(typeof tmp.city !== 'undefined')
			{
				if(typeof city_list[tmp.city] === 'undefined'){
					city_list[tmp.city] = tmp.city;
					city_branch[tmp.city] = {};
				}
				city_branch[tmp.city][subkey] = tmp['branchName'];
			}
		}
		MainClass.branchData.city = city_list;
		MainClass.branchData.branch = branch;
		MainClass.branchData.city_branch = city_branch;

	}

	/**
	 * [getData 取得Card所有設定資料]
	 * @param  {[type]} key    [list,city,branch,city_branch]
	 * @param  {[type]} subkey [sub]
	 * @return {[type]}        [description]
	 */
	this.getData = function(key,subkey)
	{
		var data = MainClass.branchData;
		if(typeof MainClass.branchData.list === 'undefined'
			|| Object.keys(MainClass.branchData.list) < 1){
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
		var pap = angular.element(obj).closest('.addressBox');
		// var pap = angular.element(obj).closest('.address_group');
		var city_data = MainClass.getData('city');
		if(!city_data || Object.keys(city_data).length < 1){
			MainClass.restObject.push(obj);
			return false;
		}
		for(key in city_data){
			tmp_obj = city_data[key];
			tmp_html += '<option value="'+key+'">'+tmp_obj+'</option>';
		}
		angular.element(obj).append(tmp_html);
		//==city change==//
		angular.element(obj).change(function(){
			var city_obj = angular.element(this);
			var city = city_obj.val();
			MainClass.setAreaSelect(city_obj,city);
		});
		//==branch change==//
		pap.find('select[name=branch]').change(function(){
			var pap = angular.element(this).closest('.addressBox');
			// var pap = angular.element(this).closest('.address_group');
			var branch = angular.element(this).val();
			var post_obj = pap.find('input[name=branch_id]');
			if(branch=='0'){
				branch = '';
			}
			if(typeof post_obj !== 'undefined'){
				post_obj.val(branch).trigger('change');
			}
		});
		//==branch_id change==//
		pap.find('input[name=branch_id]').focusout(function(){
			var branch_id = angular.element(this).val();
			var branch_id_data = MainClass.getData('branch',branch_id);
			var pap = angular.element(this).closest('.addressBox');
			// var pap = angular.element(this).closest('.address_group');
			var city_obj = pap.find('select[name=branch_city]');
			var area_obj = pap.find('select[name=branch]');
			if(branch_id_data){
				city_obj.val(branch_id_data.city).trigger('change');
				area_obj.val(branch_id).trigger('change');
			}else{
				city_obj.val('').trigger('change');
				angular.element(this).val('').trigger('change');
				if(branch_id){
					var error_msg = i18n.getStringByTag('INPUT_CHECK.SELECT_ERROR')
									+ '，'
									+ i18n.getStringByTag('INPUT_MSG.BRANCH.ID');
					MainUiTool.openDialog(error_msg);
				}
			}
		});
	}

	/**
	 * [setAreaSelect 區域產生]
	 * @param {[type]} obj  [物件]
	 * @param {[type]} city [指定都市]
	 */
	this.setAreaSelect = function(obj,city)
	{
		var pap = angular.element(obj).closest('.addressBox');
		// var pap = angular.element(obj).closest('.address_group');
		var area_obj = pap.find('select[name=branch]');
		var map_data = MainClass.getData('city_branch');
		var tmp_html = '<option value="0">'+i18n.getStringByTag('INPUT_MSG.BRANCH.NAME')+'</option>';
		if(typeof map_data[city] !== 'undefined'){
			for(key in map_data[city]){
				tmp_obj = map_data[city][key];
				tmp_html += '<option value="'+key+'">'+tmp_obj+'</option>';
			}
		}
		area_obj.val('').trigger('change');
		area_obj.html(tmp_html);
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
			case 'branch_id':
				result.msg = i18n.getStringByTag('INPUT_MSG.BRANCH.ID');
				tmp = MainClass.getData('branch',check_val);
				if(tmp){
					result.status = true;
					result.data = tmp;
					result.msg = '';
				}
			break;
			case 'branch_city':
				result.msg = i18n.getStringByTag('INPUT_CHECK.AREA.CITY');
				tmp = MainClass.getData('city',check_val);
				if(tmp){
					result.status = true;
					result.data = tmp;
					result.msg = '';
				}

			break;
			case 'branch':
				result.msg = i18n.getStringByTag('INPUT_MSG.BRANCH.NAME');
				tmp = MainClass.getData('branch',check_val);
				if(tmp){
					result.status = true;
					result.data = tmp.name;
					result.msg = '';
				}
			break;
		}
		return result;
	}

});
//=====[branchServices END]=====//





});