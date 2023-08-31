/**
 * [繳卡費  Directive]
 */
define([
	'app'
],function(MainApp){
//=====[繳卡費確認頁面]=====//
MainApp.register.directive('payCheckDirective', function(){
	return {
		restrict: 'E',
		templateUrl: 'modules/template/payCardFee/payCheck.html'
	};
});
//=====[繳卡費確認頁面 END]=====//

//=====[繳卡費結果頁面]=====//
MainApp.register.directive('payResultDirective', function(){
	return {
		restrict: 'E',
		templateUrl: 'modules/template/payCardFee/payResult.html'
	};
});
//=====[繳卡費結果頁面 END]=====//

});