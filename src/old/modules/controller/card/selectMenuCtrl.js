/**
 * [子選單]
 */
define([
	'app'
	,'service/menuServices'
],function(MainApp){

MainApp.register.controller('selectMenuCtrl',function(
	$scope,$state,$rootScope,$stateParams,i18n
	,menuServices
){

	$rootScope.head_fix_title = true;
	$rootScope.head_title = '';
	$scope.menu_data = menuServices.selectMenu($stateParams.menu_type);
	if(!$scope.menu_data){
		$state.go('home');
		return false;
	}
	//i18n轉換
	var title = $scope.menu_data.title;
	var tmp = i18n.getStringByTag(title);
	if(typeof tmp === 'string' && tmp !== ''){
		title = tmp;
	}
	$rootScope.head_title = title;

	$scope.onMenuEvent = function(sub_menu){
		if(typeof sub_menu.sref !== 'undefined'){
			var login_method=sessionStorage.getItem('login_method');
			var type=false;//未登入
			if(login_method && (login_method=='1' || login_method == '2')){//登入
				type=true;
			}
			var state_set = (typeof sub_menu.state_set === 'object') ? sub_menu.state_set : {};
			if(sub_menu.sref == 'payVaCard' || 
			 (typeof sub_menu.type !=='undefined' && sub_menu.type =='pay-va-card')
			) {
			 if(!type){
			  sessionStorage.setItem('redirectToOldMenu','pay-va-card');
			 }
			 window.location.replace("../index.html#/card/card-pay/pay-va-card");
			}else if(sub_menu.sref == 'pay-market-card' || 
			 (typeof sub_menu.type !=='undefined' && sub_menu.type =='pay-market-card')){
			 if(!type){
			  sessionStorage.setItem('redirectToOldMenu','pay-market-card');
			 }
			 window.location.replace("../index.html#/card/card-pay/pay-market-card");
			} else if(sub_menu.sref == 'card-quota' || 
			(typeof sub_menu.type !=='undefined' && sub_menu.type =='card-quota')) {
				window.location.replace("../index.html#/card/card-quota");
			} else {
			 if(!type){
			  var sref_path="web:"+sub_menu.sref;
			  sessionStorage.setItem('redirectToOldMenu',sref_path);
			 }
			 $state.go(sub_menu.sref,state_set);
			}
		   }
	}


});
//=====[instSelectCtrl END]=====//


});
