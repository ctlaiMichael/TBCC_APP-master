/**
 * [關閉app Ctrl]
 */
define([
	'app'
	,'service/loginServices'
],function(MainApp){

//=====[closeCtrl START]=====//
MainApp.register.controller('closeCtrl'
, function(
	$scope,$state,framework,$log
	,loginServices, telegram, serviceStatus, $rootScope
){
	var login_method=sessionStorage.getItem('login_method');
	
	if(login_method &&login_method ==2){
		window.location.href="../index.html";
		return;
	}
	var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
	var success_method = function(jsonObj){
		$log.debug(jsonObj.value)
	}
	var error_method = function(jsonObj){
		$log.debug(jsonObj.value)
	}
	//強制登出信用卡
	loginServices.checkLogout({
		redirect : false,
		success : function(){
			$log.debug('logout SUCCESS');
			//==返回首頁==//
			serviceStatus.serverReady = false;
			telegram.deleteSession();
			if($rootScope.rehandShakeTime){		
				$rootScope.rehandShakeTime.stop();
			}
			if(OpenNactive){
				// plugin.tcbb.returnHome(success_method,error_method);
				// $state.go('home',{});
				framework.mainPage();
			}else{
				$log.debug('go home');
				$state.go('home',{});
			}
		}
	},'card');


});
//=====[closeCtrl END]=====//

});