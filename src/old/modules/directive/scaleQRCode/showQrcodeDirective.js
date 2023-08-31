/**
 * QRCode等寬顯示 directive
 */
define([
	'app'
], function (MainApp) {

	MainApp.register.directive('showQrcodeDirective', function (
		$window, $log, framework
	) {
		var linkFun = function ($scope, iElm, iAttrs, controller) {

			const DebugMode = framework.getConfig("OFFLINE", 'B');
			const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');

			iElm.find('qr canvas').click(function () {
				$scope.onBigQRCode = true;
				var image = new Image();
				//找到canvas.轉成png.取得base64
				var tmp = iElm.find('qr canvas')[0].toDataURL("image/png").split('base64,');
				image_str = (typeof tmp[1] !== 'undefined') ? tmp[1] : '';
				$scope.outimg = image_str;
			});

			
			$scope.clickBigQRCode = function (show) {
				$scope.onBigQRCode = show;
			}
			$scope.closeBigQRCode = function () {
				$scope.onBigQRCode = false;
			}
		};
		return {
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			replace: false,
			templateUrl: 'modules/directive/scaleQRCode/showQrcode.html',
			link: linkFun
		};
	});
	//=====[checkCaptchaDirective END]=====//

});