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
	MainApp.register.controller('fixBuyResultCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $css, $log
			, qrcodeTelegramServices
			, qrcodePayServices
			, qrCodePayTelegram
		) {
			//==參數設定==//
			$css.add('ui/newMainPage/css/main.css');
			$css.add('ui/newMainPage/css/fund.css');
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			
			$scope.result2 = $stateParams.result2;
			$scope.result1 = $stateParams.result1;
			$scope.result = $stateParams.result;
			$scope.numFmt = stringUtil.formatNum;

			$scope.result2.effectDate11=$scope.result2.effectDate.replace(/(\d{3})(\d{2})(\d{2})/, '$1/$2/$3');
			//alert('aaa'+JSON.stringify($scope.result2));
			//alert('bbb'+$scope.result2);
			// if(($scope.result2.respCode == null|| $scope.result2.respCode == '') && $scope.result2.trnsRsltCode!=null){
			// 	$scope.result2.respCode = $scope.result2.trnsRsltCode;
			// }
			// if(($scope.result2.respCodeMsg == null || $scope.result2.respCodeMsg == '') && $scope.result2.trnsRsltCodeMsg!=null){
			// 	$scope.result2.respCodeMsg = $scope.result2.trnsRsltCodeMsg;
			// }
			// if(($scope.result2.respCodeMsg == null || $scope.result2.respCodeMsg == '') && $scope.result2.hostCodeMsg!=null){
			// 	$scope.result2.respCodeMsg = $scope.result2.hostCodeMsg;
			// }

			
			//總金額
			// $scope.result2.totalMoney = parseInt($scope.result2.serviceFee) + parseInt($scope.result2.amount);
			// $scope.form9 = $stateParams.form9;
			// $scope.formatDate = stringUtil.formatDate;

			//通知出場顯示
			//if($scope.result2.notiCD == "1"){$scope.result2.notiCD11="自動贖回";}
			// if($scope.result2.notiCD == "1" && $scope.result2.continue == "Y"){$scope.result2.notiCD11="自動贖回,續扣";}
			// else if($scope.result2.notiCD == "1" && $scope.result2.continue == "Ｎ"){$scope.result2.notiCD11="自動贖回,不續扣";}
			// else if($scope.result2.notiCD == "1"){$scope.result2.notiCD11="即時畫面警示";}
			// else if($scope.result2.notiCD == "1"){$scope.result2.notiCD11="Ｅ-mail";}
			// else if($scope.result2.notiCD == "1"){$scope.result2.notiCD11="即時畫面警示+Ｅ-mail";}
			// else{$scope.result2.notiCD11="不設定";}

			
			
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
			
			$scope.clickSubmit = function(){
				// var params = {
				// };
				plugin.tcbb.returnHome(function () {}, function () {});
				//qrcodePayServices.closeActivity();
				//$state.go('mainPageMenu',params,{}); //返回首頁
				// framework.backToNative();
			}

			
			$scope.clickBack = function () {
				//alert(JSON.stringify($scope.example.value.getDay()));
				var params = {
				};
				$state.go('fixBuyCheck2',params,{});
				
			}
			

			// function chkReturnStatus(msg) {
			// 	var errorMsg = (msg != "") ? msg : "查無相關資料";
			// 	framework.alert(errorMsg, function () {
			// 		framework.backToNative();
			// 		return;
			// 	}, "");
			// }

			$scope.clickDisAgree = function () {
				//framework.backToNative();
				var params = {
				};
				$state.go('TwToForeignEdit', params, {});
			}
			//點選返回
			// $scope.clickBack = $scope.clickDisAgree;


		});




		
	//=====[ END]=====//


});