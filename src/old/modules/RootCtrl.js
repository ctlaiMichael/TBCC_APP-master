var RootCtrlApp = angular.module('RootCtrlApp', []);

//=====[RootCtrl START]=====//
RootCtrlApp.controller('RootCtrl', function () {
	//console.log('RootCtrl');
});
//=====[RootCtrl END]=====//

//=====[loadCtrl START]=====//
RootCtrlApp.controller('loadCtrl'
	, function (
		$scope, $rootScope, $element, timer
		, RootServices, framework
	) {
		$rootScope.isLoading = false;
		$rootScope.isLoadingBefore = false;
		$scope.checkLoadingTime = $scope.checkLoadingTime || new timer.Instance(2, function () {
			$rootScope.isLoadingBefore = false;
		}
			, function () { });

		$rootScope.ios = false;
		var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
		if (OpenNactive) {
			if ((device.platform == "iOS")
				&& (device.model.indexOf('iPad') == -1)
				&& (parseInt(device.version) < 11)) {
					
				$rootScope.ios = true;
			}
		}

		// $scope.$on('$viewContentLoaded',function(event, toState, toParams, fromState, fromParams){
		// 	$rootScope.isLoading = true;
		// });
		// $scope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
		// 	$rootScope.isLoading = true;
		// });
		$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			// $rootScope.isLoading = false;
			RootServices.openInfo();
		});

		$rootScope.$watch('isLoading', function (val) {
			// console.log('$watch isLoading:'+val);
			if (val) {
				if (!$rootScope.isLoadingBefore) {
					//==避免短時間內跑兩次==//
					$element.fadeIn(800);
					$rootScope.isLoadingBefore = true;
					$scope.checkLoadingTime.start();
				}
			} else {
				$element.fadeOut(800);
			}
		});
		
		$rootScope.$on('isLoading', function (event, val) {
			// 當無關閉成功時,強制關閉
			if (!val) {
				$element.fadeOut(800);
			}
		});
	});
//=====[loadCtrl END]=====//