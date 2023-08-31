define([
	"app"
	,"data/card"
	,"data/apply_agree"
]
, function (MainApp,applyCard,applyAgree) {
//=====[cardServices START] 卡片相關=====//
MainApp.register.service("cardServices",function()
{
	var MainClass = this;
	/**
	 * [getData 取得Card所有設定資料]
	 * @return object [description]
	 */
	this.getData = function(key)
	{
		var data = applyCard;
		if(typeof key != 'undefined'){
			data = (typeof data[key] != 'undefined')
					? data[key]
					: {};
		}
		return data;
	}
	this.cardImgPath = this.getData('img_path');

	/**
	 * [getCardData 卡片資料取得]
	 * @param  {number} card_id [卡片編號]
	 * @return {[type]}         [description]
	 */
	this.getCardData = function(card_id)
	{
		var data = this.getData('card');
		if(typeof card_id !== 'undefined'){
			if(typeof data[card_id] !== 'undefined') {
				data = data[card_id];
				var spe_list = (typeof data.agree !== 'undefined') ? data.agree : [];
				data.agree_list = MainClass.getCardAgree(spe_list);
			}else{
				data = {};
			}
		}
		return data;
	}

	/**
	 * [getCardType 取得設定清單卡片資料]
	 * @param  string type    [卡片分類]
	 * @param  string card_id [卡片編號]
	 * @return object         [卡片資料]
	 */
	this.getCardType = function(type,card_id)
	{
		var data = {};
		var card_data = MainClass.getCardData();
		var type_list = MainClass.getData('card_type');
		if(typeof type === 'undefined' || typeof type_list[type] === 'undefined'){
			type = 'hot';
		}
		var order_list = (typeof type_list[type]['sub_order'] !== 'undefined') ? type_list[type]['sub_order'] : false;
		type_list = type_list[type]['sub'];
		for(key in type_list){
			var tmp_id = type_list[key];
			if(typeof card_data[tmp_id] !== 'undefined'){
				data[tmp_id] = card_data[tmp_id];
				if(order_list && order_list.indexOf(tmp_id) > -1){
					data[tmp_id]['order'] = order_list.indexOf(tmp_id) + 1;
				}
			}
		}
		if(typeof card_id !== 'undefined' && typeof data[card_id] !== 'undefined'){
			var tmp = data[card_id];
			data = {};
			data[card_id] = tmp;
		}
		return data;
	}

	/**
	 * [getCardAgree 取得卡片同意條款]
	 * @param  {array} specail_list [特殊清單]
	 * @param  {array} only_specail [指定取得清單的資料]
	 * @return {array}         [同意條款清單]
	 */
	this.getCardAgree = function(specail_list,only_specail)
	{
		var data = applyAgree;
		if(typeof specail_list === 'string'){
			data = (typeof data[specail_list] !== 'undefined') ? data[specail_list]: {};
		}else if(typeof specail_list === 'object'){
			if(typeof only_specail === 'undefined'){
				only_specail = false;
			}
			var tmp = {};
			var get_aggree = true;
			var is_specail = false;
			var is_list = false;
			var agree_key;
			for(key in applyAgree)
			{
				agree_key = key;
				get_aggree = true;
				if(agree_key.match(/^spe_*/)){ //特別條款預設不取出
					get_aggree = false;
				}
				is_list = (specail_list.indexOf(agree_key) > -1) ? true : false; //在清單中
				if(is_list){
					//清單內必取出
					get_aggree = true;
				}else if(only_specail){
					//只取清單內
					get_aggree = false;
				}
				if(get_aggree){
					//tmp.push(applyAgree[key]);
					tmp[key] = applyAgree[key];
				}
			}
			data = tmp;
		} //check object end
		return data;
	}

});
//=====[cardServices END]=====//


});