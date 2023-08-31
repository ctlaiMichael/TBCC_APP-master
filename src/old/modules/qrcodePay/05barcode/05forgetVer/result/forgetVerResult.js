/**
 * [查詢驗證碼 Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('forgetVerResultCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, stringUtil, framework
			, qrcodePayServices
		) {
			const DebugMode = framework.getConfig("OFFLINE", 'B');
			const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			
			$scope.result = $stateParams.result;
			if(($scope.result.respCode == null || $scope.result.respCode == '') && $scope.result.trnsRsltCode!=null){
				$scope.result.respCode = $scope.result.trnsRsltCode;
			}
			if(($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.trnsRsltCodeMsg!=null){
				$scope.result.respCodeMsg = $scope.result.trnsRsltCodeMsg;
			}
			if(($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.hostCodeMsg!=null){
				$scope.result.respCodeMsg = $scope.result.hostCodeMsg;
			}
						
			if ($scope.result.code == "200") {
				$scope.email = $scope.result.email;
			}
			// console.log(JSON.stringify($scope.result));
			
			
			/**
			 * 點選取消
			 */
			$scope.clickCancel = function () {
				qrcodePayServices.backToEinvoice();
			}
			//點選返回
			$scope.clickBack = $scope.clickCancel;
			$scope.clickSubmit = function () {
				if ($scope.result.respCode == 0) {
					$state.go('getBarcodeEdit', {});  //back to 查詢手機條碼顯示頁
				}else {
					$state.go('forgetVerEdit', {});  //back to 查詢驗證碼編輯頁
				}
			}
			// document.addEventListener("backbutton", $scope.clickBack, false);

		});
	//=====[ END]=====//


});