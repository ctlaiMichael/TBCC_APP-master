/**
 * [廣告處理Directive]
 */
define([
	'app'
],function(MainApp){
//=====[leftMenuAd 左側選單廣告]=====//
MainApp.register.directive('leftMenuAd', function(){
	var linkFun = function($scope, iElm, iAttrs, controller)
	{
		var date33 = "2018/06/03";
		var dtToday = new Date();
		var myDate = new Date(date33);
		if (myDate >= dtToday){$scope.status = "1"} 
		else{$scope.status = "2"}
	};
	return {
		restrict: 'A',
		templateUrl : 'modules/template/ad/left_menu_ad.html',
		replace: false,
		link: linkFun
	};
});
//=====[leftMenuAd 左側選單廣告 END]=====//

//=====[mainFooterAd 頁尾廣告]=====//
MainApp.register.directive('mainFooterAd', function(){
	var linkFun = function($scope, iElm, iAttrs, controller)
	{
	};
	return {
		restrict: 'A',
		templateUrl : 'modules/template/ad/footer_ad.html',
		replace: false,
		link: linkFun
	};
});
//=====[mainFooterAd 頁尾廣告 END]=====//

});