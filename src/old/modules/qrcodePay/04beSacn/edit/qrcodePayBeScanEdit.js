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
	MainApp.register.controller('qrcodePayBeScanEditCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework,$css
			, qrcodePayServices
			, qrCodePayTelegram
			, securityServices
			, qrcodeTelegramServices
		) {

			var myFunction = function (e) {
				$scope.button_disable = false
				//window.removeEventListener("cancelBiometric", myFunction);
			}
			window.addEventListener('cancelBiometric', myFunction);
			
			const DebugMode = framework.getConfig("OFFLINE", 'B');
			const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');

			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				qrcodePayServices.closeActivity();
			}

			//扣款帳號
			qrcodePayServices.getLoginInfo(function (res) {
				$scope.custId = res.custId; //保留 custId

				var form = { txnType: 'T' };
				form.custId = $scope.custId;
				qrCodePayTelegram.send('qrcodePay/fq000101', form, function (res, resultHeader) {
					// console.log(JSON.stringify(res));
					if (res) {
						if (typeof res.defaultTrnsOutAcct == "undefined" || res.defaultTrnsOutAcct == "") {
							framework.alert('取得預設轉出帳號失敗!', function () {
								qrcodePayServices.closeActivity();
								return;
							});
						} else {
							$scope.defaultTrnsOutAcct = res.defaultTrnsOutAcct;
						}
					} else {
						framework.alert(resultHeader.respCodeMsg);
					}

				}, null, false);
			});
			
			// var securityTypes = [];
			// securityTypes.push({name:'快速交易', key:'Biometric'});
			// securityServices.setSecurityTypes(securityTypes);

			//安控
			var securityTypes = securityServices.getSecurityTypes();
			console.log(securityTypes)
			if(localStorage.getItem('defaultType') != null && localStorage.getItem('defaultType') != ""){
				$scope.defaultSecurityType = JSON.parse(localStorage.getItem('defaultType'))
			}
			else{
				$scope.defaultSecurityType = securityTypes[0];
			}
			console.log($scope.defaultSecurityType.key)
			//$css.add('ui/css/fix-back.css');

			$scope.Type_border = function(last){
					return {
						"border-bottom":"none"
					}
			}
			$scope.popup_Height = {
				"height": "24px" 
			}
			//$('.pop_securityType').css({"height":"24px"})
			if(securityTypes.length == 2){
				if(localStorage.getItem('pay_setting')=='1'){
					if($scope.defaultSecurityType.key == 'NONSET'){
						$scope.anotherSecurityType = [securityTypes[1]];
						
					}
					else if($scope.defaultSecurityType.key == 'OTP'){
						if(securityTypes[1].key == 'OTP'){
							$scope.anotherSecurityType = [securityTypes[0]];
						}
						else{
							$scope.anotherSecurityType = [securityTypes[1]];
						}
					}
					else{
						$scope.anotherSecurityType = [securityTypes[0]];						
					}
				}
				else{
					if($scope.defaultSecurityType.key == 'NONSET'){
						$scope.anotherSecurityType = [securityTypes[1]];
						
					}
					else if($scope.defaultSecurityType.key == 'OTP'){
							$scope.anotherSecurityType = [securityTypes[0]];
						
					}				
				}

			}
			else if (securityTypes.length == 3) {
				if($scope.defaultSecurityType.key == 'NONSET'){
					$scope.anotherSecurityType = [securityTypes[1],securityTypes[2]];
				}
				else if($scope.defaultSecurityType.key == 'OTP'){
					$scope.anotherSecurityType = [securityTypes[0],securityTypes[2]];

				}
				else if($scope.defaultSecurityType.key == 'Biometric'){
					$scope.anotherSecurityType = [securityTypes[0],securityTypes[1]];
				}
				// $css.add('ui/css/fix.css');
				$scope.Type_border = function(last){
					if(last){
						return {
							"border-bottom":"none"
						}
					}
					else{
						return {
							"border-bottom":"1px solid #999999"
						}
					}
				}
				$scope.popup_Height = {
					"height": "48px" 
				}
				

			}
			$scope.changeSecurity = function (key){
				if(securityTypes.length == 2){
					if(localStorage.getItem('pay_setting')=='1'){
						if (key == 'NONSET' || key == 'OTP') {
							$scope.defaultSecurityType = securityTypes[0];
							$scope.anotherSecurityType = [securityTypes[1]];
						} 
						else {
							$scope.defaultSecurityType = securityTypes[1];
							$scope.anotherSecurityType = [securityTypes[0]];
						}
					}
					else{
						if (key == 'NONSET') {
							$scope.defaultSecurityType = securityTypes[0];
							$scope.anotherSecurityType = [securityTypes[1]];
						}
						else {
							$scope.defaultSecurityType = securityTypes[1];
							$scope.anotherSecurityType = [securityTypes[0]];
						}
					}
				}
				if(securityTypes.length == 3){
					if (key == 'NONSET') {
						$scope.defaultSecurityType = securityTypes[0];
						$scope.anotherSecurityType = [securityTypes[1],securityTypes[2]];
					} 
					else if(key == 'OTP'){
						$scope.defaultSecurityType = securityTypes[1];
						$scope.anotherSecurityType = [securityTypes[0],securityTypes[2]];
					}
					else {
						$scope.defaultSecurityType = securityTypes[2];
						$scope.anotherSecurityType = [securityTypes[0],securityTypes[1]];
					}
				}
				$scope.onChangeSecurityType = false;

			}

			$scope.clickChangeSceurityType = function (show) {
				$scope.onChangeSecurityType = show;
			}

			/**
			 * 點選確認
			 */
			$scope.clickSubmit = function () {
				//取得交易 一/二維條碼
				var form = {};
				form.custId = $scope.custId;
				form.trnsfrOutAcct = $scope.defaultTrnsOutAcct;
				form.trnsToken = "";
				$scope.button_disable = true

				securityServices.send('qrcodePay/fq000302', form, $scope.defaultSecurityType, function (res, error) {
					// console.log(JSON.stringify(res));
					if (res) {
						$state.go('qrcodePayBeScanShow', { result: res });
					} else {
						framework.alert(error.respCodeMsg, function () {
							qrcodePayServices.closeActivity();
							return;
						});
					}
				});
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
	//=====[END]=====//
});
