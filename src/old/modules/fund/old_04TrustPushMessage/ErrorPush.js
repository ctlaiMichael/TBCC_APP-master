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
	MainApp.register.controller('ErrorPushCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $css, $log
			, qrcodeTelegramServices
			, qrcodePayServices
			, qrCodePayTelegram
			
		) {
			//==參數設定==//
			$css.add('ui/newMainPage/css/main.css');
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			//$scope.form6 = $stateParams.form6;

			var coin =[];
			$scope.item1 = ["就業中","退休","家管","學生","待業中","學齡前"];
			$scope.item2 = ["軍警","政府機關","教育研究","經商","金融保險","電子資訊工程","建築營造","製造業","服務業","醫療","法律及會計業","自由業","博弈業","珠寶貴金屬業","武器戰爭設備","典當民間融資","其他：＿＿ "];
			$scope.item3 = ["50萬元(未逾)","50萬以上～100萬元","100萬以上～300萬元","300萬以上～500萬元","500萬以上～1000萬元","1000萬以上～5000萬元","5000萬以上～1億元","1億以上～5億元","5億以上～10億元"];
			
			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				
			}

			// function showKeyPress(evt) {
			// 	evt = (evt) ? evt : window.event
			// 	return checkSpecificKey(evt.keyCode);
			// 	}
			// function checkSpecificKey(trnsAmountStr1) {
			// 	var specialKey = "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";//Specific Key list
			// 	var realkey = String.fromCharCode(keyCode);
			// 	var flg = false;
			// 	flg = (specialKey.indexOf(realkey) >= 0);
			// 	if (flg) {
			// 	// alert('请勿输入特殊字符: ' + realkey);
			// 	return false;
			// 	}
			// 	return true;
			// 	}
			// 	document.onkeypress = showKeyPress;


			$scope.ww=1;//隱藏其他職業別
			$scope.qq=1;

			//alert($scope.item2[$scope.life2]);
			$scope.clickWork = function () {
				//alert($scope.item2[$scope.life2]);
				//alert($scope.life);
				//alert($scope.InAC[$scope.life].accCurr);
				if($scope.life2 == 16 ){$scope.ww=2;}
				else {$scope.ww=1;}
				//alert(ww[0]);
				if($scope.life1 == 1 || $scope.life1 ==2 || $scope.life1 ==3 ||$scope.life1 ==4 ||$scope.life1 ==5){
					$scope.qq = 2;
					
					$scope.item2 ="無";
					
					$scope.trnsAmountStr4 = "無";
					$scope.trnsAmountStr5 = "無";
					//alert($scope.trnsAmountStr2);
				}

				if($scope.life1 == 0){$scope.item2 = ["軍警","政府機關","教育研究","經商","金融保險","電子資訊工程","建築營造","製造業","服務業","醫療","法律及會計業","自由業","博弈業","珠寶貴金屬業","武器戰爭設備","典當民間融資","其他：＿＿ "];
				
				$scope.qq=1;}
				
				
			}
			
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
			// qrcodePayServices.getLoginInfo(function (res) {
			// 	//保留 custId
			// 	//alert("aaa");
			// 	$scope.custId = res.custId;
			// 	getFB000201();
				
			// });
			

			function getF1000110() {
				var form = {};
				//alert(localStorage.getItem("custId"));
				form.custId = $scope.custId;
				//form.custId =localStorage.getItem("custId");
				if($scope.life1 == 0){form.workingStatus = "4";}//工作狀態
				else if($scope.life1 == 1){form.workingStatus = "0";}
				else if($scope.life1 == 2){form.workingStatus = "1";}
				else if($scope.life1 == 3){form.workingStatus = "2";}
				else if($scope.life1 == 4){form.workingStatus = "3";}
				//form.workingStatus = $scope.life1;
				if($scope.life2 == 16){form.occupation = $scope.trnsStr1}    
				else{form.occupation = $scope.item2[$scope.life2]; }   //職業別
				form.annualIncome = $scope.life3;   //年收入
				if($scope.qq == 1){ 
				form.companyName = $scope.trnsAmountStr2;}   //任職公司名稱
				else{form.companyName = $scope.trnsAmountStr4;}
				if($scope.qq == 1){ 
					form.jobTitle = $scope.trnsAmountStr3;}
				else{form.jobTitle = $scope.trnsAmountStr5;}   //職稱

				//var rates = [];
				//$log.debug("fi000701 req:" + JSON.stringify(form));
				//frame.alert(JSON.stringify(form));
				qrCodePayTelegram.send('qrcodePay/f1000110', form, function (res, error) {
					$log.debug("f1000110 res:" + JSON.stringify(res));
					// localStorage.setItem("custId",""); 
					
					//plugin.tcbb.returnHome(function () {}, function () {});//framework.home();
					//framework.mainPage();
					//plugin.bank.LoginClose(function () {}, function () {});
					if (res) {
						
						//framework.alert("設定完成，將回到首頁");
						framework.alert('設定完成，將回到首頁。',function(){
							plugin.tcbb.returnHome(function () {}, function () {});
							return;
						});
						// setTimeout(function(){ 
						// 	framework.alert("設定完成，將回到首頁")
						// 	},2000);
						//framework.backToNative();
						//plugin.bank.LoginClose(function () {}, function () {});
						//qrcodePayServices.logout();
						//$state.go('mainPageMenu', {});
						//plugin.tcbb.returnHome(function () {}, function () {});
					} else {
						
						//$state.go('mainPageMenu', {});
						plugin.tcbb.returnHome(function () {}, function () {});
					 }
				}, null, false);
				//framework.mainPage();
				//framework.backToNative();
			}
			

			$scope.clickSubmit = function () {	
				//$scope.trnsAmountStr3;
				//alert(typeof $scope.life2);
				//alert($scope.trnsAmountStr3);
				
				if(typeof $scope.item2[$scope.life2]=='undefined'||$scope.item1[$scope.life1] == '請選擇'||$scope.item2[$scope.life2] == '請選擇'||typeof $scope.life1 == 'undefined' || typeof $scope.life2 == 'undefined' || typeof $scope.life3 == 'undefined'  ){framework.alert("您尚有資料未填寫、或資料有誤");}
				else if ($scope.qq == '1' && (typeof $scope.trnsAmountStr2 == 'undefined'||typeof $scope.trnsAmountStr3 == 'undefined')){framework.alert("您尚有資料未填寫、或資料有誤");}
				else if ($scope.qq == '1' && $scope.life2 == 16 && typeof $scope.trnsStr1 == 'undefined'){framework.alert("您尚有資料未填寫、或資料有誤");}
				else if ($scope.qq == '1' && $scope.trnsAmountStr2.replace(/[^\x00-\xff]/g, 'xx').length >26){framework.alert("您尚有資料未填寫、或資料有誤");}
				else if ($scope.qq == '1' && $scope.trnsAmountStr3.replace(/[^\x00-\xff]/g, 'xx').length >14){framework.alert("您尚有資料未填寫、或資料有誤");}

				// if($scope.trnsAmountStr2 != null){
				// 	var num = $scope.trnsAmountStr2.replace(/[^\x00-\xff]/g, 'xx').length;
				// 	//alert(num);
				// 	if (num >16) {
				// 	alert("訊息長度有誤");
				// 	return;
				// 		}
				// }else{
				
				// 		$scope.trnsAmountStr2 = "";}

				// if($scope.trnsAmountStr3 != null){
				// 	var num = $scope.trnsAmountStr3.replace(/[^\x00-\xff]/g, 'xx').length;
				// 	//alert(num);
				// 	if (num >16) {
				// 	alert("訊息長度有誤");
				// 	return;
				// 		}
				// }else{
				
				// 		$scope.trnsAmountStr3 = "";}


				
				//if((typeof $scope.trnsAmountStr2 == 'undefined' || typeof $scope.trnsAmountStr4 == 'undefined') || (typeof $scope.trnsAmountStr4 == 'undefined' || typeof $scope.trnsAmountStr5 == 'undefined')){}
				//if($scope.trnsAmountStr3.toString().length ==0 &&  $scope.trnsAmountStr3 !="無" ){alert("您尚有資料未填寫、或資料有誤");};

				else{
					//alert($scope.qq);
					//alert(typeof $scope.life2);

					//alert(typeof $scope.item2[$scope.life2]);
					getF1000110();
					//alert(typeof $scope.life3);
					//framework.mainPage();
					//plugin.bank.LoginClose(function () {}, function () {});
					//plugin.bank.close();
					//plugin.tcbb.returnHome(function () {}, function () {});
				}


				
			}

			qrcodePayServices.getLoginInfo(function (res) {
				//保留 custId
				//alert("aaa");
				$scope.custId = res.custId;
				
			});

			$scope.clickBack = function () {
				//alert(JSON.stringify($scope.example.value.getDay()));
				framework.confirm('設定未完成，請您務必於107年10月25日前完成『工作狀態、任職公司名稱、職業別、職稱、年收入』資料之鍵檔。\n按下確定，將回到首頁。',function(ok){
					if(ok){plugin.tcbb.returnHome(function () {}, function () {});};
					//return;
				});
				
			}

		});
	//=====[ END]=====//


});