/**
 * [繳卡費Ctrl]
 */
define([
	'app'
	,'modules/service/qrcodePay/qrcodePayServices'
	,'modules/service/qrcodePay/securityServices'
	,'modules/telegram/qrcodePay/qrcodePayTelegram'
	,'modules/service/common/openAppUrlServices'
],function(MainApp){

//=====[payCardFeeCtrl 自行輸入繳卡費 START]=====//
MainApp.register.controller('qrcodePayMenuCtrl',
function(
	$scope,$stateParams,$state,$element,$compile,i18n, sysCtrl
	,$rootScope,$timeout, framework, $window,$log
	,stringUtil
	,qrcodePayServices
	,securityServices
	,qrCodePayTelegram
	,openAppUrlServices
){
	//==參數設定==//
	var DebugMode = framework.getConfig("OFFLINE", 'B');
	var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
	sessionStorage.setItem('goFromTaiwanpay','1')
	localStorage.setItem('pay_method','')
	var element = document.getElementById("setting_body");
    if(element != null){    
        element.removeAttribute("class");
    }


	qrcodePayServices.requireLogin();



	$scope.menu = [
		{
			url:"qrcodePayScanNew",
			name:"掃描QRCode"
		}
		,
		{
			url:"qrcodePayBeScanEdit",
			name:"出示付款碼"
		}
		,
		{
			url:"qrcodeGetBeScanEdit",
			name:"出示收款碼"
		}
		,
		{
			url:"referenceEdit",
			name:"推薦人設定"
		},
		{
			url:"qrcodePayTerms",
			name:"開通SmartPay使用條款/設定帳號"
		}
		// ,{
		// 	url:"cardAdd",
		// 	name:"信用卡新增/變更預設"
		// }
		,{
			url:"qrcodePayStores",
			name:"台灣Pay消費據點查詢"
		}
		,{
			url:"getBarcodeShow",
			name:"發票載具號碼"
		},{
			url:"transQueryTerms",
			name:"交易紀錄/退貨"
		},
		{
			url:"setting",
			name:"快速登入/交易設定"
		}
	];


	// {
	// 	url:"referenceEdit",
	// 	name:"推薦人設定"
	// }
	// {
	// 	url:"microPaymentTerms",
	// 	name:"小額支付免輸密碼設定"
	// }

	//登出
	$scope.logout = function(){

		sysCtrl.logout();
		framework.mainPage();
		
	}
	

	var hasSecurityType = function(securityTypes){
		if (securityTypes.length > 0) {
			return true;
		} else {
			return false;
		}
	}

	if ($window.localStorage.getItem("firstLoginTaiwanPay") == "Y") {
		$window.localStorage.setItem("firstLoginTaiwanPay", "");

		//android實體鍵盤返回鍵
		document.addEventListener("backbutton", onBackKeyDown, false);
		function onBackKeyDown() {
			// alert("onBackKeyDown");
			qrcodePayServices.closeActivity();
		}
		
		qrcodePayServices.getLoginInfo(function(res){
			var securityTypes = [];
			var url= "qrcodePayScanNew"; //'qrcodePay';
			
			if ( res.AuthType.indexOf('2') > -1 ){
				var cnEndDate = stringUtil.formatDate(res.cnEndDate);
				var todayDate = stringUtil.formatDate(new Date());
				if( res.cn==null || res.cn=='' || stringUtil.compareDate(todayDate, cnEndDate) == -1 ) {	
				}else{
					securityTypes.push({name:'憑證', key:'NONSET'});
				}
			} 
			if (res.AuthType.indexOf('3') > -1){
				if (res.BoundID == 4 && res.OTPID == 2 && res.AuthStatus == 0 && res.PwdStatus == 0 ){
					securityTypes.push({name:'OTP', key:'OTP'});	
				}
			}
			// 確認securityTypes是否有轉帳機制可以用
			if (hasSecurityType(securityTypes)) {
				// if(OpenNactive && device.platform=='Android'){
				// 	plugin.bank.scan(function(){} ,function(){});
				// }else{
				// 	$state.go(url,{});	
				// }
				$state.go(url,{});
			}else {
				framework.alert('您的行動裝置無合庫行動網銀轉帳機制，請洽營業單位申請。',function(){
					qrcodePayServices.closeActivity();
					return;
				});
			}
		});
	}

	var qrcodePayStores_URL = "https://www.taiwanpay.com.tw/content/info/use.aspx";

	/**
	 * 點選功能換頁
	 */
	$scope.clickMenu = function(url){
		if(url =='setting'){  //Add by Ivan 2018.5.23
			localStorage.setItem("goFromTaiwanpay","1");
			location.href='../index.html#/security/ftloginset';
		}
		if(url=='qrcodePayStores'){
			if(url=='qrcodePayStores'){
				// openAppUrlServices.openWeb(qrcodePayStores_URL); //開啟Web
				window.location=qrcodePayStores_URL;
				return;
			}
			return;
		}
		if (url=='cardAdd') {
			url='qrcodePayCardTerms';
			qrcodePayServices.getLoginInfo(function(res){
				var securityTypes = [];
				if ( res.AuthType.indexOf('2') > -1 ){
					var cnEndDate = stringUtil.formatDate(res.cnEndDate);
					var todayDate = stringUtil.formatDate(new Date());
					if( res.cn==null || res.cn=='' || stringUtil.compareDate(todayDate, cnEndDate) == -1 ) {	
					}else{
						securityTypes.push({name:'憑證', key:'NONSET'});
					}
				} 
				if (res.AuthType.indexOf('3') > -1){
					if (res.BoundID == 4 && res.OTPID == 2 && res.AuthStatus == 0 && res.PwdStatus == 0 ){
						securityTypes.push({name:'OTP', key:'OTP'});	
					}
				}
				// 確認securityTypes是否有轉帳機制可以用
				if (hasSecurityType(securityTypes)) {
					$state.go(url,{});
				}else {
					framework.alert('您的行動裝置無合庫行動網銀轉帳機制，請洽營業單位申請。',function(){
						qrcodePayServices.closeActivity();
					});
				}
			});
			// $state.go(url,{});
			return;
		}
		//檢查securityTypes
		qrcodePayServices.getLoginInfo(function(res){
			$scope.custId = res.custId;
			if (url == "microPaymentTerms" && res.BoundID != 4){
				framework.alert('您的裝置尚未綁定，請至行動網銀進行裝置綁定服務。',function(){
					qrcodePayServices.closeActivity();
					return;
				});
			}

			var securityTypes = [];

			if (localStorage.getItem('pay_setting') == '1' && (localStorage.getItem("loginname") == localStorage.getItem("comparename"))){
				securityTypes.push({name:'快速交易', key:'Biometric'});
			}
			
			if ( res.AuthType.indexOf('2') > -1 ){
				var cnEndDate = stringUtil.formatDate(res.cnEndDate);
				var todayDate = stringUtil.formatDate(new Date());
				if( res.cn==null || res.cn=='' || stringUtil.compareDate(todayDate, cnEndDate) == -1 ) {	
				}else{
					securityTypes.push({name:'憑證', key:'NONSET'});
				}
			} 
			if (res.AuthType.indexOf('3') > -1){
				if (res.BoundID == 4 && res.OTPID == 2 && res.AuthStatus == 0 && res.PwdStatus == 0 ){
					securityTypes.push({name:'OTP', key:'OTP'});	
				}
			}
			// 確認securityTypes是否有轉帳機制可以用
			if(!hasSecurityType(securityTypes) && (url == "qrcodePayScanNew")){
				framework.alert('您的行動裝置無合庫行動網銀轉帳機制，請洽營業單位申請。',function(){
					framework.closeEmbedQRCodeReader(function(){});
					qrcodePayServices.closeActivity();
				});
				return;
			}

			if(hasSecurityType(securityTypes) && url == "referenceEdit"){
				securityServices.setSecurityTypes(securityTypes);

				//alert(JSON.stringify(res.custId));
				qrcodePayServices.getLoginInfo(function (res) {
					var form = {};
					form.custId = res.custId;
					//form.employNo = $scope.referenceNo;
					//form.employNo = "123456";
					qrCodePayTelegram.send('qrcodePay/fq000109', form, function (res) {
						//alert(JSON.stringify(res));
						if (res) {
							var params = {
								result:res
							};
							//res.referenceNo = $scope.referenceNo;
							$state.go(url,params,{location: 'replace'});
						} 
					}, null, false);
				});

				
			}
			else if (hasSecurityType(securityTypes) && url == "qrcodePayBeScanEdit"){
				//安控
				securityServices.setSecurityTypes(securityTypes);
				var securityTypes = securityServices.getSecurityTypes();
				// console.log(securityTypes)
				if(localStorage.getItem('defaultType') != null && localStorage.getItem('defaultType') != ""){
					$scope.defaultSecurityType = JSON.parse(localStorage.getItem('defaultType'))
				}else{
					$scope.defaultSecurityType = securityTypes[0];
				}
				// console.log($scope.defaultSecurityType.key)
				
				var form = { txnType: 'T' };
				form.custId = $scope.custId;
				qrCodePayTelegram.send('qrcodePay/fq000101', form, function (res, resultHeader) {
					// console.log(JSON.stringify(res));
					if (res) {
						if (typeof res.defaultTrnsOutAcct == "undefined" || res.defaultTrnsOutAcct == "") {
							framework.alert('取得預設轉出帳號失敗!', function () {return;});
						} else {
							var form302 = {};
							form302.custId = $scope.custId;
							form302.trnsfrOutAcct = res.defaultTrnsOutAcct;
							form302.trnsToken = "";
							securityServices.send('qrcodePay/fq000302', form302, $scope.defaultSecurityType, function (res, error) {
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
					} else {
						framework.alert(resultHeader.respCodeMsg, function () {
							qrcodePayServices.closeActivity();
							return;
						});
					}
				}, null, false);
			}



			else if (hasSecurityType(securityTypes)||(url!='qrcodePayScanNew'&&url!='qrcodePayBeScanEdit')) {
				securityServices.setSecurityTypes(securityTypes);
				// if(OpenNactive && url=='qrcodePay' && device.platform=='Android'){
				// 	plugin.bank.scan(function(){} ,function(){});
				// 	qrcodePayServices.closeActivity();
				// }else{
				// 	$state.go(url,{});	
				// }

				if (url!='qrcodePayBeScanEdit') {
					$state.go(url,{});
				}
			}else {
				framework.alert('您的行動裝置無合庫行動網銀轉帳機制，請洽營業單位申請。',function(){
					qrcodePayServices.closeActivity();
					return;
				});
				
			}
		});
	}


	
	/**
	 * 點選取消
	 */
	$scope.clickBack = function(){
		qrcodePayServices.closeActivity();
	}
	$scope.clickBackTomainPage = function(){
		framework.mainPage();
	}
	if($stateParams.redirect==='qrcodePayBeScanEdit'){
		$scope.clickMenu('qrcodePayBeScanEdit');
	}

});
//=====[payCardFeeCtrl 自行輸入繳卡費 END]=====//


});
//=====[payCardFeeCtrl END]=====//
