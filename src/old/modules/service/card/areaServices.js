define([
	"app"
]
, function (MainApp) {
//=====[areaServices START 地區相關]=====//
MainApp.register.service("areaServices",function($state,$http,i18n)
{
	var MainClass = this;

	this.restObject = []; //在還沒有資料前要產生的object
	this.areaData = {};

	/**
	 * [ajaxGetData 取得資料]
	 * @return {[type]} [description]
	 */
	this.ajaxGetData = function(){
		var url = 'resource/data/area.json';
		var mainInfo = $http.get(url).success(function(response) {
			MainClass.areaData = response;
			MainClass.setAreaData();
			if(MainClass.restObject.length > 0){
				for(key in MainClass.restObject){
					MainClass.setCitySelect(MainClass.restObject[key]);
				}
				MainClass.restObject = [];
			}
		});
	}

	/**
	 * [setAreaData 製作地區清單]
	 */
	this.setAreaData = function(){
		var data = MainClass.areaData;
		var tmp = {};
		var subdata = {};
		for(city in data.map){
			subdata = data.map[city];
			for(area in subdata){
				tmp[area] = {
					"post" : area,
					"area" : area,
					"name":subdata[area],
					"city":city
				};
			}
		}
		MainClass.areaData.area = tmp;
	}

	/**
	 * [getData 取得Card所有設定資料]
	 * @return object [description]
	 */
	/**
	 * [getData description]
	 * @param  {[type]} key    [city,area,post]
	 * @param  {[type]} subkey [sub]
	 * @return {[type]}        [description]
	 */
	this.getData = function(key,subkey)
	{
		if(Object.keys(MainClass.areaData) < 1){
			MainClass.ajaxGetData();
			return false;
		}
		var data = MainClass.areaData;
		if(typeof data.area === 'undefined'){
			MainClass.setAreaData();
		}
		if(typeof key !== 'undefined'){
			if(key === 'post'){
				key = 'area';
			}
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
	 * [getPost 郵遞區號取得]
	 * @param  {[type]} post_id [郵遞區號名稱]
	 * @return {[type]}         [description]
	 */
	this.getPost = function(post_id){
		var data = MainClass.getData('post');
		if(typeof data[post_id] === 'undefined'){
			return false;
		}
		data = data[post_id];
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
		var pap = angular.element(this).closest('.addressBox');
		// var pap = angular.element(this).closest('.address_group');
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
		//==area change==//
		pap.find('select[name=area]').change(function(){
			var pap = angular.element(this).closest('.addressBox');
			// var pap = angular.element(this).closest('.address_group');
			var area = angular.element(this).val();
			var post_obj = pap.find('input[name=post]');
			if(area=='0'){
				area = '';
			}
			if(typeof post_obj !== 'undefined'){
				post_obj.val(area).trigger('change');
			}
		});
		//==post change==//
		pap.find('input[name=post]').focusout(function(){
			var post = angular.element(this).val();
			var post_data = MainClass.getPost(post);
			var pap = angular.element(this).closest('.addressBox');
			// var pap = angular.element(this).closest('.address_group');
			var city_obj = pap.find('select[name=city]');
			var area_obj = pap.find('select[name=area]');
			if(post_data){
				city_obj.val(post_data.city).trigger('change');
				area_obj.val(post).trigger('change');
			}else{
				city_obj.val('').trigger('change');
				angular.element(this).val('').trigger('change');
				if(post){
					var error_msg = i18n.getStringByTag('INPUT_CHECK.SELECT_ERROR')
									+ '，'
									+ i18n.getStringByTag('INPUT_CHECK.AREA.POST');
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
		var area_obj = pap.find('select[name=area]');
		var post_obj = pap.find('input[name=post]');
		var map_data = MainClass.getData('map');
		var tmp_html = '<option value="0">'+i18n.getStringByTag('INPUT_CHECK.AREA.AREA')+'</option>';
		if(typeof map_data[city] !== 'undefined'){
			for(key in map_data[city]){
				tmp_obj = map_data[city][key];
				tmp_html += '<option value="'+key+'">'+tmp_obj+'</option>';
			}
		}
		area_obj.val('').trigger('change');
		post_obj.val('').trigger('change');
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
			case 'post':
				result.msg = i18n.getStringByTag('INPUT_CHECK.AREA.POST');
				tmp = MainClass.getPost(check_val);
				if(tmp){
					result.status = true;
					result.data = check_val;
					result.msg = '';
				}
			break;
			case 'city':
				result.msg = i18n.getStringByTag('INPUT_CHECK.AREA.CITY');
				tmp = MainClass.getData('city',check_val);
				if(tmp){
					result.status = true;
					result.data = tmp;
					result.msg = '';
				}

			break;
			case 'area':
				result.msg = i18n.getStringByTag('INPUT_CHECK.AREA.AREA');
				tmp = MainClass.getData('area',check_val);
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
//=====[areaServices END]=====//





});