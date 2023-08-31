/**
 * []
 */
define([
	'app'
	,'modules/service/qrcodePay/qrcodePayServices'
	,'modules/telegram/qrcodePay/qrcodePayTelegram'
],function(MainApp){

//=====[ START]=====//
MainApp.register.controller('transQueryDetailCtrl',
function(
	$scope,$stateParams,$state,$element,$compile,i18n
	,$rootScope,$timeout, stringUtil, framework, sysCtrl
	,qrcodePayServices
	,qrCodePayTelegram
){
	//==參數設定==//
	var DebugMode = framework.getConfig("OFFLINE", 'B');
	var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
	$scope.formatDate = stringUtil.formatDate;
	$scope.formatAcct = stringUtil.formatAcct;
	$scope.numFmt = stringUtil.formatNum;
	$scope.result = $stateParams.result.QR;
	// console.log(JSON.stringify($scope.result));
	//現行只有主掃會有信用卡先多加一個判斷,之後可能會改電文格式來判斷信用卡還金融卡
	if($scope.result.mode == 0){
		if($scope.result.trnsAcct.length == 13){
			$scope.isCard = false;
		}else{
			$scope.isCard = true;
		}
	}else{
		$scope.isCard = false;
	}

	var model = device.model;
	if (model.indexOf("iP") > -1 || model.indexOf("x86_64") > -1) {
		$scope.titleStyle = "titleStyleI";
		$scope.contentStyle = "contentStyleI";
	}else{
		$scope.titleStyle = "titleStyleA";
		$scope.contentStyle = "contentStyleA";
	}

	$scope.trnsAcctReFmt = $scope.result.trnsAcct;
	if($scope.result.mode == 0){
		if ($scope.trnsAcctReFmt.length!=13) {
			$scope.trnsAcctReFmt = "*" + $scope.trnsAcctReFmt.substr(-6,6);
		}
	}

	function trnsTypeDesc(srcTrnsType) {
		var rtnTrnsType = '';
		if (srcTrnsType == null || srcTrnsType === '') {
			return rtnTrnsType;
		}

		switch(srcTrnsType) {
			case '1':
				rtnTrnsType = '支付';
				break;
			case '2':
				rtnTrnsType = '繳費';
				break;
			case '3':
				rtnTrnsType = '繳稅';
				break;
			case '4':
				rtnTrnsType = '轉帳';
				break;
			case '5':
				rtnTrnsType = '退貨';
				break;
			case '6':
				rtnTrnsType = '轉帳購物';
				break;
			default:
				rtnTrnsType = '';
		}
		return rtnTrnsType;
	}
	function statusDesc(srcStatus) {
		var rtnStatus = '';
		if (srcStatus == null || srcStatus === '') {
			return rtnStatus;
		}
		
		switch(srcStatus) {
			case '0':
				rtnStatus = '交易成功';
				break;
			case '1':
				rtnStatus = '交易失敗';
				break;
			case '2':
				rtnStatus = '處理中';
				break;
			case '3':
				rtnStatus = '已退款';
				break;
			default:
				rtnStatus = '';
		}
		return rtnStatus;
	}

	if ($scope.result.trnsType=="3") {
		$scope.storeNameTitle = "繳款類別：";
	}else{
		$scope.storeNameTitle = "店家名稱：";
	}

	if ($scope.result.trnsType=="5") {
		$scope.trnsStatus = '已退款';
	}else{
		$scope.trnsStatus = statusDesc($scope.result.status);
	}
	
	if ($scope.result.mode=="0") {
		$scope.notBeScan='Y'; //主掃
	}else {
		$scope.notBeScan='N'; //被掃
	}
	

	$scope.clickRefund = function() {
		//取得交易 一/二維條碼
		qrcodePayServices.getLoginInfo(function (res) {
			var form = {};
			form.custId = res.custId;
			form.logId = $scope.result.logId;
			form.mode = $scope.result.mode;
			// console.log(JSON.stringify(form));
			qrCodePayTelegram.send('qrcodePay/fq000306', form, function (res, error) {
				// console.log(JSON.stringify(res));
				if (res) {
					res.keepData = $stateParams.result.keepData;
					res.QR = $stateParams.result.QR;
					// console.log(JSON.stringify(res));
					$state.go('transQueryRefund', { result: res });
				} else {
					framework.alert(error.respCodeMsg, function () {
						$scope.clickCancel();
						return;
					});
				}
			});
		});
	}

	/**
	 * 點選取消
	 */
	$scope.clickCancel = function(){
		var form = {};
		form.keepData = $stateParams.result.keepData;
		// console.log(JSON.stringify(form));
		qrcodePayServices.backToQRTransList(form);
	}
	//點選返回
	$scope.clickBack = $scope.clickCancel;
	document.addEventListener("backbutton", $scope.clickBack, false);

});
//=====[ END]=====//


});
