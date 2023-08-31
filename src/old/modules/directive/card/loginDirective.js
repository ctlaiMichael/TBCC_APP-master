/**
 * [登入處理Directive]
 */
define([
	'app'
	,'service/loginServices'
],function(MainApp){
//=====[loginDirective 登入選單]=====//
MainApp.register.directive('loginDirective', function(
	$state,$rootScope,$compile,i18n
	,loginServices,loginModelServices
){
	var linkFun = function($scope, iElm, iAttrs, controller)
	{
		$scope.loginSet = {};
		$scope.loginSet.loginType = {};
		$scope.login_inp = {};
		/**
		 * [init_method 預設]
		 * @return {[type]} [description]
		 */
		$scope.radioInput={
			name:"login_Radio"
		}
		var init_method = function(){
			var ord_loginType = $scope.loginSet.loginType;
			
			var default_key = 'web';
			$scope.loginSet.loginType = $scope.loginSet.loginMenuData[default_key];
			iElm.find('.login_form_box').empty();
			if(ord_loginType.key !== default_key){
				$scope.loginSet.changeLogin($scope.loginSet.loginMenuData[default_key]);
				$scope.radioInput.name="web";
			}
		}
		/**
		 * [closeLogin 取消登入]
		 * @return {[type]} [description]
		 */
		$scope.loginSet.closeLogin = function(){
			init_method();
			$rootScope.showLoginMenu = false;
			//==返回指定頁面==//
			loginServices.backPrePage();
		}
		/**
		 * [loginMenuData 登入選單設定]
		 * @type {Object}
		 */
		$scope.loginSet.loginMenuData = loginModelServices.getLoginMenu();
		/**
		 * [changeLogin 改變登入模式]
		 * @param  {[type]} loginType [description]
		 * @return {[type]}           [description]
		 */
		$scope.loginSet.changeLogin = function(loginType)
		{
			$scope.login_inp = {};
			if(typeof loginType !== 'object' || typeof loginType.key === 'undefined'){
				MainUiTool.openDialog(i18n.getStringByTag('LOGIN_MENU.TITLE'));
				return false;
			}
			$scope.loginSet.loginType = loginType;
			var pap_obj = iElm.find('.login_form_box');
			var btn_obj = iElm.find('.text_content #web_login_row');
			//==特殊表單顯示==//
			pap_obj.find('.menu_box').css('display','none');
			btn_obj.css('display','');
			if(typeof loginType.directive === 'string' && loginType.directive !== ''){
				//==隱藏預設按鈕==//
				btn_obj.css('display','none');
				//==顯示表單==//
				if(pap_obj.find(loginType.directive).length < 1){
					var tmp_html = '<div class="menu_box menu_'+loginType.key+'_box"><'+loginType.directive+'/></div>';
					pap_obj.append($compile(tmp_html)($scope));
				}
				pap_obj.find('.menu_box.menu_'+loginType.key+'_box').css('display','');
			}
		}
		/**
		 * [loginEvent 登入執行]
		 * @return {[type]} [description]
		 */
		$scope.loginSet.loginEvent = function()
		{
			$scope.loginSet.login_error_msg = {};
			var set_data = (typeof $scope.login_inp === 'object')
							? $scope.login_inp : {};

			var loginType = $scope.loginSet.loginType;
			var result = loginModelServices.checkLoginData(loginType.key,set_data);
			if(!result.status){
				$scope.loginSet.login_error_msg = result.error_list;
				MainUiTool.openDialog(result.msg);
				return false;
			}
			set_data = result.data;
			loginServices.loginEvent(loginType.key,set_data);
		}

		//==預設執行==//
		init_method();
	};
	return {
		restrict: 'E',
		templateUrl : 'modules/template/login/menu.html',
		replace: false,
		link: linkFun
	};
});
//=====[loginDirective 登入選單 END]=====//


//=====[loginCardDirective 信用卡登入表單]=====//
MainApp.register.directive('loginCardDirective', function(
	$rootScope,i18n
	// ,loginModelServices
){
	var linkFun = function($scope, iElm, iAttrs, controller)
	{
		$scope.loginSet.loginCardEvent = function(){
			$scope.login_inp.idNo = iElm.find('input[identity-mask-directive]').data('realvalue');
			$scope.loginSet.loginEvent('card',$scope.login_inp);
		}
	};
	return {
		restrict: 'E',
		templateUrl : 'modules/template/login/card.html',
		replace: false,
		link: linkFun
	};
});
//=====[loginCardDirective 信用卡登入表單 END]=====//

});
