/**
 * [使用條款Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/telegram/qrcodePay/telegramServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('forFundTestCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, sysCtrl
			, qrcodeTelegramServices
			, qrcodePayServices
			, qrCodePayTelegram
		) {

			$scope.click1 = function () {
				sysCtrl.loging(
					function () {	//登入後動作
						$state.go('fundTermsSipOti', {});
					},
					function () { $state.go('mainPageMenu', {}); }//登入失敗動作
				);
			}
			$scope.click2 = function () {
				sysCtrl.loging(
					function () {	//登入後動作
						$state.go('fundTermsProfitAcnt', {});
					},
					function () { $state.go('mainPageMenu', {}); }//登入失敗動作
				);
			}
			$scope.click3 = function () {
				sysCtrl.loging(
					function () {	//登入後動作
						$state.go('fundTermsStopPoint', {});
					},
					function () { $state.go('mainPageMenu', {}); }//登入失敗動作
				);
			}
			$scope.click4 = function () {
				sysCtrl.loging(
					function () {	//登入後動作
						$state.go('fundTermsNoticeType', {});
					},
					function () { $state.go('mainPageMenu', {}); }//登入失敗動作
				);
			}

			$scope.clickDisAgree = function () {
				$state.go('mainPageMenu', {});
			}
			//點選返回
			$scope.clickBack = $scope.clickDisAgree;


		});
	//=====[ END]=====//


});