/**
 * [Ctrl]
 */
define([
	'app'
	, 'modules/directive/epayLeftMenu/epayLeftMenuDirective.js'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/service/qrcodePay/securityServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('qrcodePayScanRedCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework,$css,stringUtil,boundle
			, qrcodePayServices
			, qrCodePayTelegram
			, securityServices
		) {
			(function () {
				//查看上次交易狀態沒有的話給預設值
				if(localStorage.getItem("lastTransaction") == null || localStorage.getItem("lastTransaction") == undefined ){
					localStorage.setItem("lastTransaction", "1");
				}
			}());

			//==參數設定==//
			$scope.nowScreen = "qrcodePayScanRed";
			
			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				$state.go("qrcodePayScanRed",{});
			}

			var model = device.model;
			if (model.indexOf("iP") > -1 || model.indexOf("x86_64") > -1) {
				$scope.scanIconPosition = "scanIconPosition_I";
				$scope.myAcctStyle = "myAcctStyle_I";
			}else {
				$scope.scanIconPosition = "scanIconPosition_A";
				$scope.myAcctStyle = "myAcctStyle_A";
			}





			qrcodePayServices.requireLogin();
			var fq000101Req = {txnType:'T'};
			/**
			 * QRCode
			 * @param {*} success 
			 * @param {*} resultObj 
			 */
			var callback_method = function(success,resultObj){
				if(!success || !resultObj.status){
					// console.log(JSON.stringify(resultObj));
					//錯誤時動作
					if (resultObj.msg_code == 'FC0004_301' && resultObj.msg!=null && resultObj.msg!='' && resultObj.msg!='SCAN_CANCELED') {
						var show_msg = resultObj.msg;
						if (show_msg === 'CAMERA_ACCESS_DENIED') {
							show_msg = '權限不足請至設定開啟';
						}
						framework.alert(show_msg, function(){
							qrcodePayServices.closeActivity();
							return ;
						});
					}else if(resultObj.msg!=null && resultObj.msg!='' && resultObj.msg!='SCAN_CANCELED'){
						var show_msg2 = resultObj.msg;
						if (show_msg2 === 'CAMERA_ACCESS_DENIED') {
							show_msg2 = '權限不足請至設定開啟';
						}
						framework.alert(show_msg2, function(){
							qrcodePayServices.closeActivity();
						});
					}else if(resultObj.msg_code == 'FC0004_302'){ // QR Code掃描取消
						qrcodePayServices.closeActivity();
					}
					
					return false;
				}
				// console.log(resultObj);
				
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
					if (localStorage.getItem('pay_setting') == '1' && (localStorage.getItem("loginname") == localStorage.getItem("comparename"))){
						securityTypes.push({name:'快速交易', key:'Biometric'});
					}
					
					if (securityTypes.length > 0) {
						securityServices.setSecurityTypes(securityTypes);	
						//edit by alex
						//if(resultObj.data.payCategory=='11331'){
						console.log('resultObj.isCard:'+resultObj.isCard);
						if(resultObj.isCard == undefined || resultObj.isCard == null){
							if(resultObj.data.payCategory=='15001'){
									//debugger;
									$state.go('qrCodePayFormTax4',{ 
									//$state.go('qrCodePayFormTax2',{
									trnsfrOutAcct:$scope.defaultTrnsOutAcct,
									trnsLimitAmt:$scope.trnsLimitAmt,
									qrcode:resultObj.data
								},{location: 'replace'});}
			
							else if(resultObj.data.PayType=='2'){
								//$state.go('qrCodePayFormTax',{
								$state.go('qrCodePayFormTax2',{ //新的UI格式
								//$state.go('qrcodePayTaxCardCheck',{
								trnsfrOutAcct:$scope.defaultTrnsOutAcct,
								trnsLimitAmt:$scope.trnsLimitAmt,
								qrcode:resultObj.data
							},{location: 'replace'});}
							//繳費網頁
							else if(resultObj.data.trnsType=='03'){
								//debugger;
								$state.go('qrCodePayFormCard',{
								//$state.go('qrCodePayFormTax2',{
								trnsfrOutAcct:$scope.defaultTrnsOutAcct,
								trnsLimitAmt:$scope.trnsLimitAmt,
								qrcode:resultObj.data
							},{location: 'replace'});}
							//P2P轉帳
							else if(resultObj.data.trnsType=='02'){
								//debugger;
								//$state.go('qrCodeGetForm',{
								$state.go('qrCodeRedEdit',{
								//$state.go('qrCodePayFormTax2',{
								trnsfrOutAcct:$scope.defaultTrnsOutAcct,
								trnsLimitAmt:$scope.trnsLimitAmt,
								qrcode:resultObj.data
							},{location: 'replace'});}
							//轉帳購物(01購物交易,收單行資訊acqinfo為51)
							else if(resultObj.data.trnsType=='01' && resultObj.data.acqInfo.substring(0,3)=='51,'){
								//debugger;
								$state.go('qrCodeBuyForm',{
								//$state.go('qrCodePayFormTax2',{
								trnsfrOutAcct:$scope.defaultTrnsOutAcct,
								trnsLimitAmt:$scope.trnsLimitAmt,
								qrcode:resultObj.data
							},{location: 'replace'});}					
							
							else{$state.go('qrCodePayForm',{   //resultObj.data.trnsType=='01'
								trnsfrOutAcct:$scope.defaultTrnsOutAcct,
								trnsLimitAmt:$scope.trnsLimitAmt,
								qrcode:resultObj.data
							},{location: 'replace'});}
							//edit by alex
						}else{
							$state.go('qrCodePayCardForm',{  
								trnsfrOutCard:'',
								qrcode:''
								// trnsfrOutCard:$scope.defaultTrnsOutAcct,
								// qrcode:resultObj.data
							},{location: 'replace'});
						}
					} else {
						framework.alert('您的行動裝置無合庫行動網銀轉帳機制，請洽營業單位申請。', function(){
							qrcodePayServices.closeActivity();
						});
						
						return;
					}
				});
		
				
			}

		
		
			var fq000101Req = {txnType:'T'};
			qrcodePayServices.getLoginInfo(function(res){
				fq000101Req.custId = res.custId;
				/**
				 * 載入帳號和使用者設定
				 */
				// alert(JSON.stringify(fq000101Req));
				qrCodePayTelegram.send('qrcodePay/fq000101', fq000101Req, function(res, error){
					if(res){
						boundle.remove('trnsfrOutCard');
						boundle.remove('trnsfrOutCardType');
						boundle.remove('fq000102Res');
						//取得預設帳號，若無則導向設定頁
						if(res.defaultTrnsOutAcct==null||res.defaultTrnsOutAcct==''||typeof(res.defaultTrnsOutAcct)=='object'){
							$state.go('qrcodePayTerms',{},{location: 'replace'});
						}else{
							// 帳號模糊化 ex:"0560-***-***456"
							var trnsAcctReFmt = res.defaultTrnsOutAcct;
							if (trnsAcctReFmt.length>13) {
								trnsAcctReFmt = trnsAcctReFmt.substr(-13,13);
							}
							trnsAcctReFmt = stringUtil.formatAcct(res.defaultTrnsOutAcct);
							trnsAcctReFmt = stringUtil.hideAcctInfo(trnsAcctReFmt); 
							boundle.setData('trnsfrOutCard',res.defaultTrnsCard);
							boundle.setData('trnsfrOutCardType',res.cardType);
							$scope.myAcct = trnsAcctReFmt;

							$scope.defaultTrnsOutAcct =res.defaultTrnsOutAcct;
							$scope.trnsLimitAmt = res.trnsLimitAmt;
							//檢查完成開始掃描QRCode
							console.log('檢查完成開始掃描QRCode');
							qrcodePayServices.scanQRCodeNew(callback_method);
						}
					}else{
						framework.alert('連線失敗', function(){
							qrcodePayServices.closeActivity();
						});
					}
					
				});
			});



            var readsuccess = function(readvalue){
				framework.closeEmbedQRCodeReader(function(){
                    // console.log("readsuccess:"+JSON.stringify(readvalue));
					qrcodePayServices.processQRCodeNew(readvalue,callback_method);
				});
            }

            var readfail = function(err){
				// console.log("readfail:"+JSON.stringify(err));
                if (err.name != 'SCAN_CANCELED') {
					if (err.name == 'ALBUM_ACCESS_DENIED') {
                        framework.alert('無法取到圖片');
                        return;
					}else if(err.name == 'CAMERA_ACCESS_DENIED'){
                        if(confirm('權限不足請至設定開啟')){
                            framework.openSettings();
                        }
                        return;
                    }else if(err.errorMsg=='decode Err'){
                        alert('QRCocd解析失敗');
                        //解碼錯誤重新開啟掃描
						// $scope.scanQRCode();
						qrcodePayServices.scanQRCodeNew(callback_method);
                        return;
                    }else if(err.name=='has no access to assets'){
                        // alert('請重新挑選圖片');
                        return;
                    }
                    // alert('fail'+JSON.stringify(err));
                }
            }

            //讀取圖片掃描QRCode 
            $scope.readFromAlbum = function(){
				// framework.closeEmbedQRCodeReader(function(){
                //     framework.readQRCodeFromFile(readsuccess, readfail);
				// });
				framework.readQRCodeFromFile(readsuccess, readfail);
            }

			//出示收款碼
            $scope.gotoGetBeScan = function () {
				framework.closeEmbedQRCodeReader(function(){
					$state.go('qrcodeGetBeScanEdit', {},{location: 'replace'});
				});
                return;
			}

			//出示付款碼
			$scope.gotoBeScan = function () {
				qrcodePayServices.getLoginInfo(function(res){
					$scope.tempCustid = res.custId;
					//安控
					var securityTypesInside = []; 
					if (localStorage.getItem('pay_setting') == '1' && (localStorage.getItem("loginname") == localStorage.getItem("comparename"))){
						securityTypesInside.push({name:'快速交易', key:'Biometric'});
					}
					if ( res.AuthType.indexOf('2') > -1 ){
						var cnEndDate = stringUtil.formatDate(res.cnEndDate);
						var todayDate = stringUtil.formatDate(new Date());
						if( res.cn==null || res.cn=='' || stringUtil.compareDate(todayDate, cnEndDate) == -1 ) {	
						}else{
							securityTypesInside.push({name:'憑證', key:'NONSET'});
						}
					} 
					if (res.AuthType.indexOf('3') > -1){
						if (res.BoundID == 4 && res.OTPID == 2 && res.AuthStatus == 0 && res.PwdStatus == 0 ){
							securityTypesInside.push({name:'OTP', key:'OTP'});	
						}
					}

					if (securityTypesInside.length < 0 && localStorage.getItem('defaultType')== null) {
						framework.alert('您的行動裝置無合庫行動網銀轉帳機制，請洽營業單位申請。',function(){
							return;
						});
					}

					if(localStorage.getItem('defaultType') != null && localStorage.getItem('defaultType') != ""){
						$scope.defaultSecurityTypeInside = JSON.parse(localStorage.getItem('defaultType'))
					}else{
						$scope.defaultSecurityTypeInside = securityTypesInside[0];
					}
					// alert(JSON.stringify($scope.defaultSecurityTypeInside));

					var form = { txnType: 'T' };
					form.custId = $scope.tempCustid;
					// console.log(JSON.stringify(form));
					qrCodePayTelegram.send('qrcodePay/fq000101', form, function (res, resultHeader) {
						// console.log(JSON.stringify(res));
						// console.log(JSON.stringify(resultHeader));
						if (res) {
							if (typeof res.defaultTrnsOutAcct == "undefined" || res.defaultTrnsOutAcct == "") {
								framework.alert('取得預設轉出帳號失敗!', function () {return;});
							} else {
								console.log("取得預設轉出帳號成功");
								var form302 = {};
								form302.custId = $scope.tempCustid;
								form302.trnsfrOutAcct = res.defaultTrnsOutAcct;
								form302.trnsToken = "";
								// console.log(JSON.stringify(form302));
								securityServices.send('qrcodePay/fq000302', form302, $scope.defaultSecurityTypeInside, function (res, error) {
									// console.log(JSON.stringify(res));
									// console.log(JSON.stringify(error));
									if (res) {
										//關閉相機
										framework.closeEmbedQRCodeReader(function(){
											$state.go('qrcodePayBeScanShow', { result: res },{location: 'replace'});
										});
									} else {
										framework.alert(error.respCodeMsg, function () {
											framework.closeEmbedQRCodeReader(function(){
												qrcodePayServices.closeActivity();
											});
											return;
										});
									}
								});
							}
						} else {
							framework.alert(resultHeader.respCodeMsg, function () {
								framework.closeEmbedQRCodeReader(function(){
									qrcodePayServices.closeActivity();
								});
								return;
							});
						}
					}, null, false);
				});
			}

			/**
			 * 點選取消
			 */
			$scope.clickCancel = function () {
				framework.closeEmbedQRCodeReader(function(){ });
				qrcodePayServices.closeActivity();
			}
			//點選返回
			$scope.clickBack = $scope.clickCancel;



		});
	//=====[END]=====//
});
