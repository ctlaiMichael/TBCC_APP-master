/**
 * [QR Code 繳卡費Ctrl]
 * qrCode4FeeCtrl : QR Code 繳卡費
 */
define([
	'app'
	//==Services==//
	,'service/qrCode4FeeServices'
	,'modules/service/qrcodePay/qrcodePayServices'
	,'modules/service/qrcodePay/securityServices'
	,'modules/telegram/qrcodePay/qrcodePayTelegram'],function(MainApp){

/**
 * [qrCode4FeeCtrl] QR Code 繳卡費
 * @param  {[type]} $scope			[description]
 * @param  {[type]} $state			[description]
 */
MainApp.register.controller('qrcodePayScan',function(
	$scope,$state,framework
	,qrcodePayServices
	,securityServices
	,qrCodePayTelegram
	,qrCode4FeeServices,
	stringUtil
){
	qrcodePayServices.requireLogin();
	var fq000101Req = {txnType:'T'};


	/**
	 * QRCode
	 * @param {*} success 
	 * @param {*} resultObj 
	 */
	var callback_method = function(success,resultObj){
		if(!success || !resultObj.status){
			// payCardFeeServices.getErrorMsg(resultObj.msg_code,resultObj.msg);
			//錯誤時動作
			//qrcodePayServices.scanQRCode(callback_method);	//重新掃描
			//qrcodePayServices.exit();	//結束流程
			if(resultObj.msg!=null && resultObj.msg!=''){
				framework.alert(resultObj.msg, function(){
					qrcodePayServices.closeActivity();
				});
			}else if(resultObj.msg_code == 'FC0004_302'){ // QR Code掃描取消
				qrcodePayServices.closeActivity();
			}
			
			return false;
		}
		console.log(resultObj);
		
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
					$state.go('qrCodeGetForm',{
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
		//securityServices.setSecurityTypes(res.AuthType, res.AuthStatus, res.PwdStatus);
		
		// alert(JSON.stringify(res));
		fq000101Req.custId = res.custId;
		/**
		 * 載入帳號和使用者設定
		 */
		// alert(JSON.stringify(fq000101Req));
		qrCodePayTelegram.send('qrcodePay/fq000101', fq000101Req, function(res, error){
			if(res){
				// alert('success:'+JSON.stringify(res));
				//取得預設帳號，若無則導向設定頁
				if(res.defaultTrnsOutAcct==null||res.defaultTrnsOutAcct==''||typeof(res.defaultTrnsOutAcct)=='object'){
					$state.go('qrcodePayTerms',{},{location: 'replace'});
				}else{
					$scope.defaultTrnsOutAcct =res.defaultTrnsOutAcct;
					$scope.trnsLimitAmt = res.trnsLimitAmt;
					//檢查完成開始掃描QRCode
					qrcodePayServices.scanQRCode(callback_method);
				}
			}else{
				framework.alert('連線失敗', function(){
					qrcodePayServices.closeActivity();
				});
				// alert('error:'+JSON.stringify(res));
				// alert('error:'+JSON.stringify(error));
				
			}
			
		});
	});
	
	
	//qrcodePayServices.scanQRCode(callback_method);

	
	

	

});
//=====[qrCode4FeeCtrl END]=====//


});
