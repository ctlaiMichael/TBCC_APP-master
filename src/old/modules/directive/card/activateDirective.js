/**
 * [開卡/掛失  Directive]
 */
define([
	'app'
	,'service/branchServices'
],function(MainApp){
//=====[掛失表單頁面]=====//
MainApp.register.directive('lostFormDirective', function(){
	return {
		restrict: 'E',
		templateUrl: 'modules/template/activateCard/applyLost.html'
	};
});
//=====[掛失表單頁面]=====//
//=====[掛失查詢頁面]=====//
MainApp.register.directive('lostQueryDirective', function(branchServices){
	var linkFun = function($scope, iElm, iAttrs, controller){
		//==展分行==//
		branchServices.setCitySelect('#branch_city');
	}
	return {
		restrict: 'E',
		templateUrl: 'modules/template/activateCard/applyLostQueryResult.html',
		link : linkFun
	};
});
//=====[掛失查詢頁面]=====//
//=====[掛失結果頁面]=====//
MainApp.register.directive('lostResultDirective', function(){
	return {
		restrict: 'E',
		templateUrl: 'modules/template/activateCard/lostCardResult.html'
	};
});
//=====[掛失結果頁面]=====//

});