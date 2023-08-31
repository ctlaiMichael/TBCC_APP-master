/**
 * [選單處理Ctrl]
 */
define([
	'app'
	,'directive/menuDirective'
	,'directive/adDirective'
	,'directive/loginDirective'
	,'service/menuServices'
	,'service/loginServices'
	,'modules/service/common/openAppUrlServices'
],function(MainApp){
//=====[headCtrl START]=====//
MainApp.register.controller('headCtrl'
,function(
	$scope,$rootScope,$state,i18n
	,menuServices,loginServices,sysCtrl,framework,$window
){
	$rootScope.head_pre_title = '';
	$rootScope.head_fix_title = false;
	$rootScope.head_title = '';
	// $rootScope.head_left = false; //左事件
	//==left==//
	$scope.state_set = {};
	$rootScope.head_left = false; //左事件
	$rootScope.head_left_title = ''; //左title
	$rootScope.changeHeaderLeft = null; //動態改header事件
	//==right==//
	$rootScope.head_right = true; //右事件
	$rootScope.head_right_title = '';
	$scope.tmp_head_title = '';

	//==header 變換事件==//
	$scope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams)
	{
		var state_data = toState.data;
		if(typeof state_data.pageTitle !== 'undefined'){
			//i18n轉換
			var tmp = i18n.getStringByTag(state_data.pageTitle);
			if(typeof tmp === 'string' && tmp !== ''){
				state_data.pageTitle = tmp;
			}
		}
		//==set title==//
		$rootScope.head_pre_title = (typeof $scope.tmp_head_title != 'undefined' && $scope.tmp_head_title != '')
									? $scope.tmp_head_title
									: state_data.pageTitle;
		if(!$rootScope.head_fix_title){
			$rootScope.head_title = state_data.pageTitle; //依照router的設定異動
			$scope.tmp_head_title = state_data.pageTitle;
		}
		$rootScope.head_fix_title = false; //true為強制設定title
		// console.error('head_title:',$rootScope.head_title);
		// console.error('tmp_head_title:',$scope.tmp_head_title);
		// console.error('head_pre_title:',$rootScope.head_pre_title);
		// console.log('===============');

		//==set back==//
		$scope.state_set = {};
		$rootScope.head_left = false;
		if(typeof state_data.pageBack !== 'undefined'){
			$rootScope.head_left = true;
			$scope.state_set = state_data.pageBack;
		}
		//==set right==//


		//==set back==//
		$scope.state_set = {};
		$rootScope.head_left = false;
		$rootScope.head_left_title = '';
		$rootScope.changeHeaderLeft = null;
		if(typeof state_data.pageBack !== 'undefined'){
			$rootScope.head_left = true;
			$scope.state_set = state_data.pageBack;
			if(typeof state_data.pageLeft !== 'undefined'){
				$rootScope.head_left_title = state_data.pageLeft;
			}
		}

		//==登入判斷==//
      // var isLogin = sysCtrl.isLogin();
	  var isLogin = sysCtrl.isLogined();
	  var userInfo=sessionStorage.getItem("userInfo");
	  var jsObj ={};
	  if(userInfo){
		jsObj=eval( '(' + userInfo + ')' );
	  }
		//==set right==//
		$rootScope.head_right = false;
		if(typeof state_data.pageRight !== 'undefined'){
			$rootScope.head_right = true;
			$scope.head_right_title = state_data.pageRight;
		}else if(isLogin||(jsObj.hasOwnProperty('isLogin') && jsObj['isLogin'])){//修復信用卡登入右上角登出按鈕消失
			$rootScope.head_right = true; //右事件
			$rootScope.head_right_title = i18n.getStringByTag("BTN.LOGOUT");
		}else{
			$rootScope.head_right_title = '';
		}
	});
	//==點選左按鈕事件==//
	$rootScope.$watch('changeHeaderLeft', function (set_method)
	{
		// console.log('=============changeHeaderLeft');
		if(typeof set_method !== 'function')
		{
			//預設method
			set_method = function(){
				if($rootScope.head_left){
					var state_set = $scope.state_set;
					if(typeof state_set !== 'object'){
						state_set = {};
					}
					if(typeof state_set.state === 'undefined'){
						state_set.state = 'home';
					}
					if(typeof state_set.set === 'undefined'){
						state_set.set = {};
					}
					if(typeof state_set.confirm === 'object'){
						if(typeof state_set.confirm.title === 'undefined' && typeof state_set.confirm.content === 'undefined'){
							state_set.confirm.content = i18n.getStringByTag('INPUT_CHECK.LEAVE');
						}
						state_set.confirm.success = function(){
							$state.go(state_set.state,state_set.set);
						}
						MainUiTool.openConfirm(state_set.confirm);
						return true;
					}
					if(typeof state_set.closeCamera !== 'undefined' && state_set.closeCamera===true){
						framework.closeEmbedQRCodeReader(function(){ });
					}
					$state.go(state_set.state,state_set.set);
				}else{
					MainUiTool.leftMenuOpen(1);
				}
			}
		}
		$scope.headerLeftEvent = set_method;
	});

	//android實體鍵盤返回鍵
	document.addEventListener("backbutton", function() {
		console.log('我點了返回鍵');
		$scope.headerLeftEvent();
	}, false);

	//==點選右按鈕事件==//
	$scope.headerRightEvent = function()
	{
		var logout_method = function(){
			loginServices.checkLogout({
				redirect : true,
				success : function(){
					$state.go('message',{title:i18n.getStringByTag('LOGIN_MENU.LOGOUT_SUCCESS'),content:i18n.getStringByTag('LOGIN_MENU.LOGOUT_SUCCESS')});
				}
			});
		}

		if($scope.head_right){
			MainUiTool.openConfirm({
				title : i18n.getStringByTag('LOGIN_MENU.LOGOUT_CONFIRM'),
				content : i18n.getStringByTag('LOGIN_MENU.LOGOUT_CONFIRM_MSG'),
				success : logout_method
			});
		}else{
			//MainUiTool.rightMenuOpen();
		}
	}

	//檢查是否已登入//
	$scope.isLogined = function () {
		return sysCtrl.isLogined();
	}
	//==點選登出事件==//
	$scope.logout = function()
	{
		sysCtrl.logout();
		sessionStorage.setItem("userInfo","");
		framework.mainPage();
	}
});
//=====[headCtrl END]=====//

//=====[menuCtrl START]=====//
MainApp.register.controller('menuCtrl'
,function($scope,menuServices, sysCtrl)
{
	//==get menu==//
	$scope.menu_data = menuServices.getMenu('main_list');
	MainUiTool.setSectionClass('menu_frame'); //section add class
	// 檢查登入狀態
	// sysCtrl.checkLogin(function(){
	// 	sysCtrl.doLoginAS('web', true);
	// });
	
});
//=====[menuCtrl END]=====//


//=====[menuLeftCtrl START]=====//
MainApp.register.controller('menuLeftCtrl'
,function(
	$scope,menuServices,i18n,openAppUrlServices,$window,sysCtrl
){
	if(sessionStorage.hasOwnProperty('login_method') && sessionStorage.getItem('login_method') == '2'){
		$scope.left_menu_data = menuServices.getMenu('left_cardLogin');
		console.log('2');
	}else{
		$scope.left_menu_data = menuServices.getMenu('left');
		console.log('1');
	}
	//==左選單設定==//
	$scope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams)
	{
		CelebrusInsertTool.reinitialise("");
		MainUiTool.leftMenuOpen(false); //close left menu
	});
	//edit by alex
	// $scope.clickweb = function(){
	// 	var urlpic = "http://www.tcb-bank.com.tw/creditcard/discount_news/Documents/107最新活動/20180306漢來美食/漢來春饗.html";
	// 	openAppUrlServices.openWeb(urlpic);
	// }
	$scope.clickweb = function(){
		$window.open("https://www.tcb-bank.com.tw/creditcard/discount_news/Documents/107最新活動/20180306漢來美食/漢來春饗.html",'_blank');
		setTimeout(function(){
			backPage();
		},500);
	}




});
//=====[menuLeftCtrl END]=====//


//=====[footerCtrl START]=====//
MainApp.register.controller('footerCtrl'
,function($scope,menuServices)
{
	//新增信用卡 下方FOOTER不同
	if(sessionStorage.hasOwnProperty('login_method') && sessionStorage.getItem('login_method') == '2'){
		$scope.footer_menu_data = menuServices.getMenu('footer_card');
	}else{
		$scope.footer_menu_data = menuServices.getMenu('footer');
	}
});
//=====[footerCtrl END]=====//


//=====[popupCtrl START]=====//
MainApp.register.controller('popupCtrl'
,function(
	$scope,$rootScope,$element,$state
){
	//==header 變換事件==//
	$rootScope.showLoginMenu = false;
	/**
	 * [登入選單 顯示隱藏]
	 */
	$rootScope.$watch('showLoginMenu', function (val) {
		if(val) {
			// console.log('顯示登入選單');
			$element.find('login-directive .poppup_window_frame').addClass('active');
		} else {
			$element.find('login-directive .poppup_window_frame').removeClass('active');
		}
	});

});
//=====[popupCtrl END]=====//

//=====[fixBoxCtrl START]=====//
MainApp.register.controller('fixBoxCtrl'
,function($scope,$rootScope,$element,$state)
{
	$rootScope.clear_flag = true;
	$rootScope.showFixBoxFlag = true;
	//==頁面 變換事件開始==//
	$scope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams)
	{
		$rootScope.showFixBoxFlag = true;
		$element.css('display','');
		if($rootScope.clear_flag){
			$element.empty();
		}
		//==前view變數設定==//
		$state.previous_set = {
			state : fromState,
			params : fromParams
		};
	});

	/**
	 * [FixBox 顯示隱藏]
	 */
	$rootScope.$watch('showFixBoxFlag', function (val) {
		if(val) {
			$element.css('display','');
		} else {
			$element.css('display','none');
		}
	});
});
//=====[fixBoxCtrl END]=====//

});