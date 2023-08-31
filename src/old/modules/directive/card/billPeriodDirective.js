/**
 * [帳單查詢Directive]
 */
define([
	'app'
],function(MainApp){
//=====[billDetailDirective 查詢明細頁]=====//
MainApp.register.directive('billDetailDirective', function(){
	var linkFun = function($scope, iElm, iAttrs, controller) {
	};
	return {
		restrict: 'E',
		templateUrl: 'modules/template/billSearch/billPeriodResult.html',
		replace: false, //是否把directive刪掉
		link: linkFun
	};
});
//=====[billDetailDirective 查詢明細頁 END]=====//


//=====[visaPeriodDirective visa期數選單]=====//
MainApp.register.directive('visaPeriodDirective', function(){
	var linkFun = function($scope, iElm, iAttrs, controller) {
	};
	return {
		restrict: 'E',
		templateUrl: 'modules/template/visaSearch/periodSelect.html',
		replace: false, //是否把directive刪掉
		link: linkFun
	};
});
//=====[visaPeriodDirective visa期數選單 END]=====//

//=====[visaResultDirective visa結果頁]=====//
MainApp.register.directive('visaResultDirective', function(){
	var linkFun = function($scope, iElm, iAttrs, controller) {
	};
	return {
		restrict: 'E',
		templateUrl: 'modules/template/visaSearch/result.html',
		replace: false, //是否把directive刪掉
		link: linkFun
	};
});
//=====[visaResultDirective visa結果頁 END]=====//

});