/**
 * [申請/補件  Directive]
 */
define([
	'app'
	,'ht_components/doNgRepeat'
	,'service/areaServices'
	,'service/branchServices'
],function(MainApp,doNgRepeat){
//=====[applyMenu 申請/補件 切換選單]=====//
MainApp.register.directive('applyMenu', function(){
	var linkFun = function($scope, iElm, iAttrs, controller)
	{
	};
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: 'modules/template/apply/apply_menu.html',
		replace: true,
		link: linkFun
	};
});
//=====[applyMenu 申請/補件 切換選單 END]=====//

//=====[cardSliderDirective 卡片slider頁面]=====//
MainApp.register.directive('cardSliderDirective', function($state,$compile){
	var linkFun = function($scope, iElm, iAttrs, controller)
	{
		var tmp_html = '';
		var tmp_pre_list = [];
		var tmp_list = [];
		var tmp_index = 0;
		var url = '#/apply/card/';
		var order_list = Object.keys($scope.card_data).reverse();
		for(key in order_list){
			var cardid = order_list[key];
			var tmp_data = $scope.card_data[cardid];
			tmp_html = '';
			tmp_html += '<li data-value="'+cardid+'">';
			tmp_html += 	'<span>'+tmp_data['name']+'</span>';
			tmp_html += 	'<img src="'+$scope.card_path+tmp_data['img']+'">';
			tmp_html += 	'<a href="javascript:void(0);" ng-click="applyCardEvent(\''+cardid+'\')">立即申辦</a>';
			tmp_html += '</li>';
			if(typeof tmp_data.order !== 'undefined'){
				tmp_pre_list[key] = tmp_html;
			}else{
				tmp_list[key] = tmp_html;
			}
		}
		tmp_html = tmp_pre_list.join('') + tmp_list.join('');
		iElm.append($compile(tmp_html)($scope));

		$scope.applyCardEvent = function(cardid){
			//$state.go('apply.card',{card_id:cardid});
			//2018/08/27 cheng for 105CR 
			$state.go('applyTypeCheck',{card_id:cardid});
		}

		//==make slider==//
		$('#card_box')
		.on('init', function() {
			$('#card_box').css("display","block");
		})
		.slick({
			dots: true,
			infinite: true,
			speed: 300,
			slidesToShow: 1, //第一個為更多信用卡
			initialSlide:1,
			centerMode: true,
			variableWidth: true,
		});

		// On before slide change
		$('#card_box').on('afterChange', function(){
			$scope.showNowCardInfo();
		});

		$scope.showNowCardInfo();
	};
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<ul id="card_box" class="credit_card_frame">'
					+	'<li data-value="more"><span>more</span>'
					+	'<img src="ui/images/card_more.png">'
					+	'<a href="javascript:void(0);" ng-click="changePageType();">more</a>'
					+	'</li>'
					+'</ul>',
		replace: true,
		link: linkFun
	};
});
//=====[cardSliderDirective 卡片slider頁面 END]=====//


//=====[applyChoseDirective 更多卡片頁面]=====//
MainApp.register.directive('applyChooseDirective', function(cardServices){
	var linkFun =  function($scope, iElm, iAttrs)
	{
		$scope.card_type_list = [];
		angular.forEach(cardServices.getData('card_type'), function(element) {
			$scope.card_type_list.push(element);
		});
		$scope.cardSelectChange = function(){
			$scope.card_subtype_list = [];
			angular.forEach(cardServices.getCardType($scope.inp_type.key), function(element) {
				$scope.card_subtype_list.push(element);
			});
		}
		$scope.submitChoose = function(){
			var card_type = (typeof $scope.inp_type !== 'undefined')
								? $scope.inp_type.key
								: '';
			var cardid = (typeof $scope.inp_card !== 'undefined')
								? $scope.inp_card.key
								: '';
			$scope.changePageType(card_type,cardid);
		}
	}
	return {
		restrict: 'E',
		templateUrl: 'modules/template/apply/choose.html',
		replace: true, //是否把directive刪掉
		link: linkFun
	}
});
MainApp.register.filter('orderByArray', ['$filter', function($filter) {
	return function(items, field, reverse) {
		var keys = $filter('orderBy')(Object.keys(items), field, reverse),
			obj = {};
		keys.forEach(function(key) {
			obj[key] = items[key];
		});
		return obj;
	};
}]);
//=====[applyChoseDirective 更多卡片頁面 END]=====//


//=====[applyFormDirective 申請表單頁面]=====//
MainApp.register.directive('applyFormDirective', function(areaServices,branchServices,$filter){
	var linkFun =  function($scope, iElm, iAttrs, controller)
	{
		$scope.inp = {};
		$scope.inp.ebillApply='1'; //電子帳單預設值 勾選 =>1 沒溝 =>0
		if(typeof $scope.inp.show === 'undefined'){
			$scope.inp.show = {};
		}

		$scope.inp.cashRemark='1'; //電子帳單預設值 勾選 =>1 沒溝 =>0
		// if(typeof $scope.inp.show === 'undefined'){
		// 	$scope.inp.show = {};
		// }

		$scope.inp.show.idNo = '';
		//==展地區==//
		areaServices.setCitySelect('#city,#comp_city');
		branchServices.setCitySelect('#branch_city');
		//==指定身分證==//
		if($scope.fixUserId && $scope.setUserId !== '') {
			$scope.inp.idNo = $scope.setUserId;
			$scope.inp.show.idNo = $filter('identityMaskFilter')($scope.setUserId);
		} else {
			$scope.fixUserId = false; // 不明原因失敗
		}

	}
	return {
		restrict: 'E',
		templateUrl: 'modules/template/apply/form.html',
		link : linkFun
	};
});
//=====[applyFormDirective 申請表單頁面 END]=====//


//=====[applyCheckDirective 檢附資料]=====//
MainApp.register.directive('applyCheckDirective', function(){
	var linkFun =  function($scope, iElm, iAttrs, controller)
	{

	}
	return {
		restrict: 'E',
		templateUrl: 'modules/template/apply/check.html',
		link : linkFun
	};
});
//=====[applyCheckDirective 檢附資料 END]=====//

});
