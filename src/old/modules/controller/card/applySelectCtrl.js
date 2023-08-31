/**
 * [申請信用卡-卡片選擇 Ctrl]
 * applySelectCtrl : 卡片選擇
 */
define([
	'app'
	,'directive/applyDirective'
	,'service/cardServices'
	,'ui/js/slick' //卡片滑動效果
],function(MainApp){

/**
 * [applySelectCtrl] 卡片選擇
 * @param  {string} page  				[頁面]
 *                  index : 卡片介紹頁 		$state.go('apply',{page:'index'});
 *                  choose : 卡片更多選擇頁	$state.go('apply',{page:'choose'});
 * @param  {string} card_type 			[卡片分類] 請參照卡片設定檔
 * @param  {string} card_id 			[卡片編號] 請參照卡片設定檔
 */
MainApp.register.controller('applySelectCtrl'
, function(
		$scope,$state,$stateParams,i18n
		,cardServices
){
	//==card class==//
	MainUiTool.setSectionClass('has_subtitle');
	//==變數設定==//
	$scope.apply_menu = 'apply'; //submenu on active
	$scope.show_type = 'trait'; //預設取得卡片特色
	$scope.page_name = $stateParams.page; //頁面
	$scope.card_type = $stateParams.card_type; //卡片類型
	$scope.cardid = $stateParams.card_id; //卡片編號
	//==卡片圖片資料==//
	$scope.card_path = cardServices.cardImgPath;
	//==卡片資料取得==//
	$scope.card_data = cardServices.getCardType($scope.card_type,$scope.cardid);


	//==Menu==// 搬離section
	MainUiTool.showMenu($scope.apply_menu,{
		'menu' : {
			'apply' : i18n.getStringByTag('CTRL_APPLY.APPLY_MENU'),
			'upload' : i18n.getStringByTag('PAGE_TITLE.UPLOAD')
		},
		'event' : function(menu){
			$state.go(menu);
		}
	});


	//==卡片分類改變==//
	$scope.changePageType = function(card_type,cardid){
		var change = ($scope.page_name === 'index') ? 'choose' : 'index';
		var card_type = (typeof card_type !== 'undefined') ? card_type : $scope.card_type;
		var cardid = (typeof cardid !== 'undefined') ? cardid : $scope.cardid;
		$state.go('apply',{
			page : change,
			card_type : card_type,
			card_id : cardid
		});
	};

	/**
	 * [showNowCardInfo 卡片說明資訊]
	 * @param  {[string]} show_type [顯示的區塊]
	 * @return {[type]}           [description]
	 */
	$scope.showNowCardInfo = function(show_type)
	{
		if(typeof show_type === 'undefined'){
			show_type = $scope.show_type;
		}
		var info_obj = $('.credit_card_info');
		$(info_obj).css('display','block');
		$(info_obj).find('.card_info_tab a').removeClass('active');

		var cardid = $('.slick-current').data('value');
		$scope.cardid = cardid;
		$scope.show_type = show_type;

		var cardDataList = $scope.card_data;
		if(typeof cardDataList !== 'object' || typeof cardDataList[cardid] === 'undefined'){
			$(info_obj).css('display','none');
			$(info_obj).find('.card_info').html('');
			return false;
		}
		var main_data = cardDataList[cardid];

		$(info_obj).data('cardid',cardid);
		$(info_obj).find('.card_info').html(main_data[show_type]);
		$(info_obj).find('.card_info_tab a.'+show_type).addClass('active');
	}

});
//=====[applyCtrl END]=====//

});