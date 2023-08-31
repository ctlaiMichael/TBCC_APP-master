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
	MainApp.register.controller('ApplyResultCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $css, $log
			, qrcodeTelegramServices
			, qrcodePayServices
			, qrCodePayTelegram
		) {
			//==參數設定==//
			//$css.add('ui/newMainPage/css/main.css');
			//$css.add('ui/newMainPage/css/fund.css');
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			
			$scope.result = $stateParams.result;
			//$scope.result = {"result":"0","respCode":"","respCodeMsg":""}
			$scope.form9 = $stateParams.form9;
			//$scope.form9={"@xsi:type":"fj000103BodyType","co:custId":"A237772047","applyAcct":"0796765519836","applyCurr":"TWD","custChName":"李建榮","custEnName":"Alex","certDate":"1080303","chooseAmt":"1","applyAmount":"30000","amountLang":"1","amountPurpose":"財力證明","addrItem":"5","sendAddr":"5539(竹南分行)","contactPhone":"123456789","mobilePhone":"0982384227","fee":"90","postFee":"25","copy":"3","trnsOutAcct":"0796765519836","email":"Gjjbv@gmail.com","trnsToken":"f3498ad01d784d5ea8b4a0a2ea767127"};
			$scope.formatDate = stringUtil.formatDate;
			$scope.status9 = "jlkjfklsdj";

			
			if($scope.result.respCode == null|| $scope.result.respCode == ''){
				$scope.result.respCode = $scope.result.trnsRsltCode;
			}
			if(($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.trnsRsltCodeMsg!=null){
				$scope.result.respCodeMsg = $scope.result.trnsRsltCodeMsg;
			}
			if(($scope.result.respCodeMsg == null || $scope.result.respCodeMsg == '') && $scope.result.hostCodeMsg!=null){
				$scope.result.respCodeMsg = $scope.result.hostCodeMsg;
			}
			if(($scope.result.respCode == null|| $scope.result.respCode == '') && $scope.result.trnsRsltCode!=null){
				$scope.result.respCode = $scope.result.trnsRsltCode;
			}
		
			if($scope.form9.chooseAmt == 1){$scope.form9.chooseAmt ="單帳號／單幣別／全部餘額"}
			else if($scope.form9.chooseAmt == 2){
					$scope.form9.chooseAmt ="單帳號／單幣別／部分餘額";
					$scope.chooseAmt11=1;}
			else if($scope.form9.chooseAmt == 3){$scope.form9.chooseAmt ="全部餘額（帳號所屬ID／分行歸戶）"}
			else if($scope.form9.chooseAmt == 4){
					$scope.form9.chooseAmt ="部分餘額（帳號所屬ID／分行歸戶）"
					$scope.chooseAmt11=1;}
			
			if($scope.form9.amountLang == 1){$scope.form9.amountLang = "中文"}
			else if($scope.form9.amountLang == 2){$scope.form9.amountLang = "英文"}
			
			//FB000201-匯率查詢 
			// function getFB000201() {
			// 	var form = {};
			// 	var rates = [];
			// 	//$log.debug("fi000701 req:" + JSON.stringify(form));
			// 	qrCodePayTelegram.send('qrcodePay/fb000201', form, function (res, error) {
			// 		$log.debug("fb000201 res:" + JSON.stringify(res));
			// 		if (res) {
			// 			if (res.cardTime == null) {
			// 				chkReturnStatus(res.respCodeMsg);
			// 				return;
			// 			}

			// 			rates = res.details.detail;
			// 			rates = qrcodeTelegramServices.modifyResDetailObj(res.details.detail);
			// 			//alert("111"+JSON.stringify(rates));
			// 			$scope.ratess = [];
			// 			var a=1;
			// 			for(var key in rates){
			// 			//alert(rates[key].type);
			// 			if(rates[key].type == 0){
			// 				if(JSON.stringify(rates[key].promptEx) == "{}") {rates[key].promptEx = "...";}
			// 				if(JSON.stringify(rates[key].cashEx) == "{}" ) {rates[key].cashEx ="...";}
			// 				$scope.ratess.push(rates[key]);}
			// 			if(rates[key].type == 1){
			// 				//alert(JSON.stringify(rates[key].promptEx));
			// 				//alert(JSON.stringify(rates[key].promptEx) == "{}");
			// 				if(JSON.stringify(rates[key].promptEx) == "{}") {rates[key].promptEx = "...";}
			// 				if(JSON.stringify(rates[key].cashEx) == "{}" ) {rates[key].cashEx ="...";}
			// 				$scope.ratess[key-a].tenD=rates[key].promptEx;
			// 				$scope.ratess[key-a].thirtyD=rates[key].cashEx;

			// 				a=a+1;
			// 				//alert(JSON.stringify(rates[key].value));
							
			// 			}
			// 			//$scope.ratess.push(rates[key]);
						
			// 			}
						
						
			// 		} else {
			// 			framework.alert(error.respCodeMsg, function () {
			// 				framework.backToNative();
			// 			});
			// 		 }
			// 	}, null, false);
			// }

			//main
			qrcodePayServices.getLoginInfo(function (res) {
				//保留 custId
				//alert("aaa");
				$scope.custId = res.custId;
				//getFB000201();
				
			});
			
			$scope.clickBack = function(){
				
				framework.backToNative();
			}

			

			

			function chkReturnStatus(msg) {
				var errorMsg = (msg != "") ? msg : "查無相關資料";
				framework.alert(errorMsg, function () {
					framework.backToNative();
					return;
				}, "");
			}

			$scope.clickDisAgree = function () {
				//framework.backToNative();
				var params = {
				};
				$state.go('ApplyEdit', params, {});
			}
			//點選返回
			$scope.clickBack = $scope.clickDisAgree;


		});




		
	//=====[ END]=====//


});