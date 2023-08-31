/**
 * [推薦人編號設定結果 Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('referenceResultCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, stringUtil, framework, sysCtrl
			, qrcodePayServices, $window
		) {
			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				qrcodePayServices.closeActivity();
			}
			
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
			//推薦人編號
			$scope.referenceNo = $scope.result.referenceNo;
			// console.log(JSON.stringify($scope.result));
			

			//點選確認
			$scope.clickSubmit = function () {
				qrcodePayServices.closeActivity();
			}

			/**
			 * 點選取消
			 */
			$scope.clickCancel = function () {
				qrcodePayServices.closeActivity();
			}
			//點選返回
			$scope.clickBack = $scope.clickCancel;

		});
	//=====[ END]=====//


});