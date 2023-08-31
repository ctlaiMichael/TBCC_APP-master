define([
	'framework'
	,'ht_components/dependencyRouter'
	,'config/router'
	,'modules/RootCtrl'
	,'modules/RootServices'
	,'modules/RootDirective'
	,'modules/RootFilter'
]
,function(
	framework
	,dependencyRouter
	,router_config
){

	var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
	var DEBUG_MODE_LOG = framework.getConfig("DEBUG_MODE_LOG", 'B');
	var MainApp = angular.module("MainApp", [
		//==Angular==//
		'ngTouch',
		'ngAnimate', //務必有
		'ngResource',
		//==Library==//
		'angularTranslate', //i18n

		'angularCSS',
		'ja.qr',
		'angular-barcode',
		//==MainApp Root setting==//
		'RootCtrlApp',
		'RootServicesApp',
		'RootDirectiveApp',
		'RootFilterApp',

		//==HtComponents==//
		'timer', //時間
		// 'spinningWheelDirectiveModule',
		'sysCtrl', //登入登出
		'serviceStatus', //中台檢查
		'boundle', //頁面切換
		'crypto', //安控
		'deviceInfo', //裝置連動
		// 'view', //記憶上一頁的路徑
		'stringUtil', //字串處理
		'telegram' //電文
	]);
	MainApp.constant('framework', framework); // bind framework
	MainApp.config([
		'$controllerProvider'
		,'$compileProvider'
		,'$filterProvider'
		,'$provide'
		,'$logProvider'
		// ,'$locationProvider'
		,function(
			$controllerProvider
			,$compileProvider
			,$filterProvider
			,$provide
			,$logProvider
			// ,$locationProvider
		){
		//--------------------[config START]--------------------//
			MainApp.register = {
				controller : $controllerProvider.register,
				directive: $compileProvider.directive,
				filter: $filterProvider.register,
				factory: $provide.factory,
				service: $provide.service
			};
			$logProvider.debugEnabled(DEBUG_MODE_LOG); //使用$log.debug()是否顯示
			// $locationProvider.html5Mode(true);
		//--------------------[config END]--------------------//
	}]);

	/**
	 * [Router設定]
	 * 採用ui-router
	 * @return {[type]} [description]
	 */
	MainApp.requires.push('ui.router'); //賦予app依賴
	MainApp.config([
		'$stateProvider'
		,'$urlRouterProvider'
		,function(
			$stateProvider
			,$urlRouterProvider
		){
		//--------------------[router config START]--------------------//
			$urlRouterProvider.otherwise(router_config.init);
			for(state in router_config){
				var state_set = router_config[state];
				if(state === 'init'){
					continue;
				}
				state_set.resolve = dependencyRouter.ui_router(state_set.controller_path,state_set);
				$stateProvider.state(state,state_set);
			}
		//--------------------[router config END]--------------------//
			if(OpenNactive){
				switch(device.platform) {
					case "Android":
						// framework.disabledScreenshotPrevention(function(){},function(){});
						break;
					case "iOS":
						// ios改在TCBMobileBankAppDelegate.m,不套用framework
						// 因為改在app.js, 登入行動網銀/epay後會有問題 
						break;
				}
				document.addEventListener('deviceready', function(){
					plugin.tcbb.getMobileNo(function(mobileNo){
						device.udid = device.uuid;
						device.mobileNo = mobileNo;
						device.uuid = mobileNo;
					}, false);
				}, false);
				// framework.disabledScreenshotPrevention(function(){},function(){});
			}
	}]);

	return MainApp;
});
