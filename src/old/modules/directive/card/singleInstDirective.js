/**
 * [單筆分期 Directive]
 */
define([
	'app'
],function(MainApp){
//=====[同意條款頁面]=====//
MainApp.register.directive('singleInstAgreeDirective', function(){
	return {
		restrict: 'E',
		templateUrl: 'modules/template/installment/singleInstAgree.html'
	};
});
//=====[同意條款頁面 END]=====//

//=====[表單頁面]=====//
MainApp.register.directive('singleInstFormDirective', function(){
	return {
		restrict: 'E',
		templateUrl: 'modules/template/installment/singleInstForm.html'
	};
});
//=====[表單頁面 END]=====//

//=====[表單檢核頁面]=====//
MainApp.register.directive('singleInstCheckDirective', function(){
	return {
		restrict: 'E',
		templateUrl: 'modules/template/installment/singleInstCheck.html'
	};
});
//=====[表單檢核頁面 END]=====//
//=====[結果頁面]=====//
MainApp.register.directive('singleInstEndDirective', function(){
	return {
		restrict: 'E',
		templateUrl: 'modules/template/installment/singleInstEnd.html'
	};
});
//=====[結果頁面 END]=====//

});