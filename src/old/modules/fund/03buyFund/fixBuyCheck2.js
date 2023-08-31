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
	MainApp.register.controller('fixBuyCheck2Ctrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $css, $log
			, qrcodeTelegramServices
			, qrcodePayServices
			, qrCodePayTelegram
			, securityServices
			
		) {
			//==參數設定==//
			$css.add('ui/newMainPage/css/main.css');
			$css.add('ui/newMainPage/css/fund.css');
			$scope.noSSL = false;
			$scope.noOTP = true;
			const DebugMode = framework.getConfig("OFFLINE", 'B');
			const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			
			//$scope.form6 = $stateParams.form6;
			
			
			
			//android實體鍵盤返回鍵
			// document.addEventListener("backbutton", onBackKeyDown, false);
			// function onBackKeyDown() {}

			$scope.result1 = $stateParams.result1;//resFi000709
			
			$scope.result = $stateParams.result; // 使用者填入資料

			
			//日期轉換
			
            //rtnDate = srcDate.replace(/(\d{3})(\d{2})(\d{2})/, '$1/$2/$3');
			$scope.result1.enrollDate11=$scope.result1.enrollDate.replace(/(\d{3})(\d{2})(\d{2})/, '$1/$2/$3');

			$scope.numFmt = stringUtil.formatNum11;
			if(($scope.result1.respCode == null|| $scope.result1.respCode == '') && $scope.result1.trnsRsltCode!=null){
				$scope.result1.respCode = $scope.result1.trnsRsltCode;
			}
			if(($scope.result1.respCodeMsg == null || $scope.result1.respCodeMsg == '') && $scope.result1.trnsRsltCodeMsg!=null){
				$scope.result1.respCodeMsg = $scope.result1.trnsRsltCodeMsg;
			}
			if(($scope.result1.respCodeMsg == null || $scope.result1.respCodeMsg == '') && $scope.result1.hostCodeMsg!=null){
				$scope.result1.respCodeMsg = $scope.result1.hostCodeMsg;
			}

			//總金額
			$scope.result1.totalMoney = parseInt($scope.result1.serviceFee) + parseInt($scope.result1.amount);
			//alert(parseInt("3")+parseInt("6"));
			//停價方式
			if($scope.result1.code == "1"){$scope.result1.eva ="前五日平均淨值/年平均淨值";}
			else if($scope.result1.code == "2"){$scope.result1.eva ="前五營業日淨值/平均成本";}

			//通知出場顯示
			if($scope.result1.notiCD == "1" && $scope.result1.continue == "Y"){$scope.result1.notiCD11="自動贖回,續扣";}
			else if($scope.result1.notiCD == "1" && $scope.result1.continue == "N"){$scope.result1.notiCD11="自動贖回,不續扣";}
			else if($scope.result1.notiCD == "2"){$scope.result1.notiCD11="即時畫面警示";}
			else if($scope.result1.notiCD == "3"){$scope.result1.notiCD11="Ｅ-mail";}
			else if($scope.result1.notiCD == "4"){$scope.result1.notiCD11="即時畫面警示+Ｅ-mail";}
			else{$scope.result1.notiCD11="不設定";}
			// alert($scope.result1.payDate5W);//[object Object]
			// alert($scope.result1.code);//[object Object]

			//if($scope.result1.code == '[object Object]'){}

			var form4 = {};
			function setFi000710(){
				//20190409
				form4.branchName = $scope.result.branchName;
				form4.unitCall = $scope.result.unitCall;
				
				form4.custId = $scope.custId;
				form4.trnsToken = $scope.result1.trnsToken;
				form4.trustAcnt = $scope.result1.trustAcnt;
				form4.fundCode = $scope.result1.fundCode;
				form4.enrollDate = $scope.result1.enrollDate;
				form4.currency = $scope.result1.currency;
				form4.amount = $scope.result1.amount;
				form4.payAcnt = $scope.result1.payAcnt;
				form4.effectDate = $scope.result1.effectDate;
				form4.baseRate = $scope.result1.baseRate;
				form4.favorRate = $scope.result1.favorRate;
				form4.serviceFee = $scope.result1.serviceFee;
				form4.fundType = $scope.result.fundType;
				form4.investAttribute = $scope.result.investAttribute;
				form4.riskLvl = $scope.result.riskLvl;
				form4.okCode = "Y";
				form4.prospectus = "1";
				form4.payDateS = $scope.result1.payDateS;
				form4.salesId = (typeof $scope.result1.salesId).toString() === "object" ? "" : $scope.result1.salesId;
				form4.salesName = (typeof $scope.result1.salesName).toString() === "object" ? "" : $scope.result1.salesName;
				form4.introId = (typeof $scope.result1.introId).toString() === "object" ? "" : $scope.result1.introId;
				form4.introName = (typeof $scope.result1.introName).toString() === "object" ? "" : $scope.result1.introName;
				form4.code = (typeof $scope.result1.code).toString() === "object" ? "" : $scope.result1.code;
				form4.payDate31 = (typeof $scope.result1.payDate31).toString() === "object" ? "" : $scope.result1.payDate31;
				form4.payDate5W = (typeof $scope.result1.payDate5W).toString() === "object" ? "" : $scope.result1.payDate5W;
				form4.notiCD = (typeof $scope.result1.notiCD).toString() === "object" ? "" : $scope.result1.notiCD;
				form4.sLossCD = (typeof $scope.result1.sLossCD).toString() === "object" ? "" : $scope.result1.sLossCD;
				form4.sLoss = $scope.result1.sLoss;
				form4.sProCD = (typeof $scope.result1.sProCD).toString() === "object" ? "" : $scope.result1.sProCD;
				form4.sPro = $scope.result1.sPro;
				form4.continue = $scope.result1.continue;
				// $scope.resfi000702Param.decline1Cd = (typeof $scope.resfi000702Param.decline1Cd).toString() === "object" ? "-" : $scope.resfi000702Param.decline1Cd;
				
				form4.decline1Cd = (typeof $scope.result1.decline1Cd).toString() === "object" ? "" : $scope.result1.decline1Cd;
				form4.decline1 = (typeof $scope.result1.decline1).toString() === "object" ? "" : $scope.result1.decline1;
				form4.decline2Cd = (typeof $scope.result1.decline2Cd).toString() === "object" ? "" : $scope.result1.decline2Cd;
				form4.decline2 = (typeof $scope.result1.decline2).toString() === "object" ? "" : $scope.result1.decline2;
				form4.decline3Cd = (typeof $scope.result1.decline3Cd).toString() === "object" ? "" : $scope.result1.decline3Cd;
				form4.decline3 = (typeof $scope.result1.decline3).toString() === "object" ? "" : $scope.result1.decline3;
				form4.decline4Cd = (typeof $scope.result1.decline4Cd).toString() === "object" ? "" : $scope.result1.decline4Cd;
				form4.decline4 = (typeof $scope.result1.decline4).toString() === "object" ? "" : $scope.result1.decline4;
				form4.decline5Cd = (typeof $scope.result1.decline5Cd).toString() === "object" ? "" : $scope.result1.decline5Cd;
				form4.decline5 = (typeof $scope.result1.decline5).toString() === "object" ? "" : $scope.result1.decline5;
				form4.gain1Cd = (typeof $scope.result1.gain1Cd).toString() === "object" ? "" : $scope.result1.gain1Cd;
				form4.gain1 = (typeof $scope.result1.gain1).toString() === "object" ? "" : $scope.result1.gain1;
				form4.gain2Cd = (typeof $scope.result1.gain2Cd).toString() === "object" ? "" : $scope.result1.gain2Cd;
				form4.gain2 = (typeof $scope.result1.gain2).toString() === "object" ? "" : $scope.result1.gain2;
				form4.gain3Cd = (typeof $scope.result1.gain3Cd).toString() === "object" ? "" : $scope.result1.gain3Cd;
				form4.gain3 = (typeof $scope.result1.gain3).toString() === "object" ? "" : $scope.result1.gain3;
				form4.gain4Cd = (typeof $scope.result1.gain4Cd).toString() === "object" ? "" : $scope.result1.gain4Cd;
				form4.gain4 = (typeof $scope.result1.gain4).toString() === "object" ? "" : $scope.result1.gain4;
				form4.gain5Cd = (typeof $scope.result1.gain5Cd).toString() === "object" ? "" : $scope.result1.gain5Cd;
				form4.gain5 = (typeof $scope.result1.gain5).toString() === "object" ? "" : $scope.result1.gain5;
			}
			

			function getFi000710() {
				
				setFi000710();

				//alert(JSON.stringify(form4));
				// qrCodePayTelegram.send('qrcodePay/fi000710', form4, function (res, error) {
				securityServices.send('qrcodePay/fi000710', form4, $scope.defaultSecurityType, function(res, error){
					$log.debug("f1000710 res:" + JSON.stringify(res));
					
					if (res) {
						var params = {
							
							result2:res,
							result1:$scope.result1,
							result:$scope.result,
						};
						//alert(JSON.stringify(res));
						$state.go('fixBuyResult',params,{location: 'replace'});
					}

					else{
						framework.alert(error.respCodeMsg, function () {
							//framework.backToNative();
						})
						

					}


				}, $scope.sslkey);

			}
			

			qrcodePayServices.getLoginInfo(function (res) {
				//保留 custId
				//alert("aaa");
				$scope.custId = res.custId;
				//getF5000107();
				
			});

			$scope.clickSubmit = function () {	
				// alert(JSON.stringify("99"+$scope.defaultSecurityType));
				// alert("99"+$scope.defaultSecurityType);
				// alert(JSON.stringify("88"+$scope.sslkey));
				// alert("88"+$scope.sslkey);

				getFi000710();

			}

			$scope.clickBack = function () {
				//alert(JSON.stringify($scope.example.value.getDay()));
				var params = {
				};
				$state.go('fixBuyCheck',params,{});
				
			}

			// qrcodePayServices.getLoginInfo(function (res) {
			// 	//保留 custId
			// 	//alert("aaa");
			// 	$scope.custId = res.custId;
				
			// });

			$scope.changeCategory1 = function(){
				// other stuff
				if($scope.aaa==true ){$scope.aaa=false;}
				else if($scope.aaa==false){$scope.aaa=true }
				
					
			  }
			$scope.changeCategory2 = function(){
				// other stuff
				
				if($scope.bbb==true){$scope.bbb=false }
				else if($scope.bbb==false){$scope.bbb=true }
					
			  }

			//   $('.confirm_bt_R_off').on('click', function(){
			// 	$('.confirm_bt_R_off').removeClass('confirm_bt_R_off');
			// 	$(this).addClass('confirm_bt_R_on');
			// 	$('.confirm_bt_L_on').removeClass('confirm_bt_L_on');
			// 	$(this).addClass('confirm_bt_L_off');
			// });
			$scope.clickCancel = function () {
				//alert(JSON.stringify($scope.example.value.getDay()));
				
				$state.go('fixBuy', {});
				
			}
			//clickCancel
		});
	//=====[ END]=====//


});