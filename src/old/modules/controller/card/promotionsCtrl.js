/**
 * [優惠活動app Ctrl]
 */
define([
	'app'
	,'components/hitrust/HtStartApp'
],function(MainApp,HtStartApp){
//=====[promotionsCtrl START]=====//
MainApp.register.controller('promotionsCtrl'
, function(
	$scope,$state,framework,$element
	,$window
	,$log
){
	var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');

	var scheme_set = {};
	scheme_set.iOS = {
		scheme : "comtcbcrmapp://",
		// store : "https://appsto.re/tw/sJOwL.i"
		store : "itms-apps://appsto.re/tw/sJOwL.i"
	};
	scheme_set.Android = {
		scheme: "com.tcb.crm.app",
		store : "market://details?id=com.tcb.crm.app"
	};

	$scope.platform = "";

	var backPage = function(){
		var state = "home";
		var params = {};
		if(typeof $state.previous_set !== 'undefined'){
			state = $state.previous_set.state;
			params = $state.previous_set.params;
		}
		$state.go(state,params);
	}

	var success_method = function(jsonObj){
		$log.debug('open success');
		$log.debug(jsonObj);
		backPage();
	}
	var error_method = function(){
		if(!$scope.platform || typeof scheme_set[$scope.platform] === 'undefined' || typeof scheme_set[$scope.platform]['store'] === 'undefined'){
			$log.debug('error open stroe:'+$scope.platform);
			return false;
		}
		var url = scheme_set[$scope.platform]['store'];

		if(OpenNactive){
			var set_obj = angular.copy(scheme_set);
			set_obj[$scope.platform]['scheme'] = url;
			if(HtStartApp.set(set_obj,true)){
				HtStartApp.start(function(){
					$log.debug('success open stroe');
					backPage();
				},function(){
					$log.debug('error open stroe');
					backPage();
				});
			}
		}else{
			$window.open(url,'_blank');
			setTimeout(function(){
				backPage();
			},500);

		}
	}



	//==2017.06 APP下架...所以改連結==//
	$window.open("https://www.tcb-bank.com.tw/creditcard/discount_news/Pages/activity.aspx",'_blank');
	setTimeout(function(){
		backPage();
	},500);

	// if(OpenNactive){
	// 	$scope.platform = HtStartApp.set(scheme_set);
	// 	if($scope.platform){
	// 		HtStartApp.start(success_method,error_method);
	// 	}
	// }else{
	// 	$scope.platform = "Android";
	// 	error_method();
	// }


});
//=====[promotionsCtrl END]=====//

});