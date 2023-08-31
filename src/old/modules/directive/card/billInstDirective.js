/**
 * [帳單分期 Directive]
 */
define([
	'app'
],function(MainApp){
//=====[表單頁面]=====//
MainApp.register.directive('billInstFormDirective', function(){
	return {
		restrict: 'E',
		templateUrl: 'modules/template/installment/billInstForm.html'
	};
});
//=====[表單頁面 END]=====//

//=====[檢查表單頁面]=====//
MainApp.register.directive('billInstCheckDirective', function(){
	return {
		restrict: 'E',
		templateUrl: 'modules/template/installment/billInstCheck.html'
	};
});
//=====[檢查表單頁面 END]=====//

//=====[結果頁面]=====//
MainApp.register.directive('billInstEndDirective', function(){
	return {
		restrict: 'E',
		templateUrl: 'modules/template/installment/billInstEnd.html'
	};
});
//=====[結果頁面 END]=====//

});