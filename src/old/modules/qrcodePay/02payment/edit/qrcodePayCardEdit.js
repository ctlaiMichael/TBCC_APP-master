/**
 * [繳卡費Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/service/qrcodePay/securityServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('qrCodePayFormCardCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework,$css,boundle,stringUtil
			, qrcodePayServices
			, qrCodePayTelegram
			, securityServices
		) {
			// 廢除程式刪除
			
		});
	//=====[END]=====//

	
});
