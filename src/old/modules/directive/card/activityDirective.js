/**
 * [活動登錄  Directive]
 */
define([
	'app'
],function(MainApp){

//=====[activityMenu 活動登錄 切換選單]=====//
MainApp.register.directive('activityMenu', function(){
	var linkFun = function($scope, iElm, iAttrs, controller)
	{
	};
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: 'modules/template/activity/activityMenu.html',
		link: linkFun
	};
});
//=====[activityMenu 活動登錄 切換選單 END]=====//

//=====[活動登錄頁面]=====//
MainApp.register.directive('activityDirective', function(){
	return {
		restrict: 'E',
		templateUrl: 'modules/template/activity/activityIndex.html'
	};
});
//=====[活動登錄頁面 END]=====//

//=====[活動已登錄頁面]=====//
MainApp.register.directive('activityHaveDirective', function(){
	return {
		restrict: 'E',
		templateUrl: 'modules/template/activity/activityHave.html'
	};
});
//=====[活動已登錄頁面 END]=====//

//=====[活動已登錄頁面]=====//
MainApp.register.directive('activityResultDirective', function(){
	return {
		restrict: 'E',
		templateUrl: 'modules/template/activity/activitySuccess.html'
	};
});
//=====[活動已登錄頁面 END]=====//
});