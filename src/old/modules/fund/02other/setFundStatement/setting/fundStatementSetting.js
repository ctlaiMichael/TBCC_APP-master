/**
 * [使用條款Ctrl]
 */
define([
	'app'
	, 'modules/directive/security/securitySelectorDirective.js'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/telegram/qrcodePay/telegramServices'
	, 'modules/service/qrcodePay/securityServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('fundTermsNoticeTypeCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil
			, qrcodePayServices
			, qrCodePayTelegram
			, securityServices
			, $css
		) {
			$css.add('ui/newMainPage/css/main.css');
			$css.add('ui/newMainPage/css/fund.css');
			$scope.noSSL = false;
			$scope.noOTP = true;
			const DebugMode = framework.getConfig("OFFLINE", 'B');
			const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			$scope.oriType;
			$scope.fundNoticeTypeList = [
				{
					id: 2,
					Name: '寄發紙本'
				},
				{
					id: 3,
					Name: '寄發電子郵件'
				}];

			var getNoticeTypeById = function (id) {
				for (var i in $scope.fundNoticeTypeList) {
					if ($scope.fundNoticeTypeList[i].id == id) {
						return $scope.fundNoticeTypeList[i];
					}
				}
				return $scope.fundNoticeTypeList[0];
			}

			function chkReturnStatus(msg) {
				var errorMsg = (msg != "") ? msg : "查無相關資料";
				framework.alert(errorMsg, function () {
					framework.backToNative();
					return;
				}, "");
			}

			qrcodePayServices.getLoginInfo(function (res) {
				$scope.custId = res.custId;

				//取得已設定狀態
				var form = {};
				form.custId = $scope.custId;
				qrCodePayTelegram.send('qrcodePay/fi000707', form, function (res, error) {
					if (res) {
						if (res.respCode == '1') {
							chkReturnStatus(res.respCodeMsg);
							return;
						} else {
							$scope.fundNoticeTypeSelected = getNoticeTypeById(res.mailOut);
							$scope.oriType = JSON.parse(JSON.stringify($scope.fundNoticeTypeSelected));
							//Object.assign({},$scope.fundNoticeTypeSelected) ;
							$scope.trnsToken = res.trnsToken;
						}
					} else {
						framework.alert(error.respCodeMsg, function () {
							framework.backToNative();
						});
					}
				});
			});


			$scope.clickSubmit = function () {
				if ($scope.oriType.id == $scope.fundNoticeTypeSelected.id) {
					framework.alert('您未變更任何資料');
					return;
				}
				var form = {};
				form.custId = $scope.custId;
				form.mailOut = $scope.fundNoticeTypeSelected.id;
				form.trnsToken = $scope.trnsToken;
				securityServices.send('qrcodePay/fi000708', form, $scope.defaultSecurityType, function (res, error) {
					if (res) {
						var form = {};
						form.trnsRsltCode = res.trnsRsltCode;
						form.hostCode = res.hostCode;
						form.hostCodeMsg = res.hostCodeMsg;
						form.mailOut = res.mailOut;
						form.result = res.result;
						form.respCode = res.respCode;
						form.respCodeMsg = res.respCodeMsg;
						$state.go('fundResultNoticeType', { result: form }, { location: 'replace' });
					} else {
						framework.alert(error.respCodeMsg, function () {
							framework.backToNative();
						});
					}
				}, $scope.sslkey);

			}


			//點選返回或取消
			$scope.clickBack = function () {
				framework.backToNative();
			}


		});
	//=====[ END]=====//


});