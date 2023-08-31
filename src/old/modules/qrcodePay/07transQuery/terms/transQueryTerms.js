/**
 * [查詢手機條碼 Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/telegram/qrcodePay/telegramServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('transQueryTermsCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $log
			, qrcodeTelegramServices
			, qrcodePayServices
			, qrCodePayTelegram
		) {
			//==參數設定==//
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			const orderByDescSymbol = "↑";
			const orderByAscSymbol = "↓";

			// alert(device.model +"  "+device.version);
			$scope.dateHHMMSS = " 00:00:00";
			$scope.btnStyle = "";
			var model = device.model;
			if (model.indexOf("iP") > -1 || model.indexOf("x86_64") > -1) {
				$scope.dateHHMMSS = "T00:00:00";
				$scope.dateStyle = "inputDateiOS";
				$scope.btnStyle = "btnStyle";
				$scope.amtfontsize = "fontSize10";
				$scope.listStyle = "listStyleForI";
			}else {
				$scope.dateStyle = "inputDateAndroid";
				$scope.amtfontsize = "fontSize12";
				$scope.listStyle = "listStyleForA";
			}		

			$scope.numFmt = stringUtil.formatNum;
			$scope.acctFmt = function (srcAcct,mode) {
				var rtnAcct = '';
				if (srcAcct == null || srcAcct === '') {
					return rtnDate;
				}

				if (srcAcct.length > 6) {
					if(mode == 0){
						if(srcAcct.length == 13){
							rtnAcct = srcAcct.substr(-6,6);
							return rtnAcct;
						}else{
							rtnAcct = "*" + srcAcct.substr(-6,6);
							return rtnAcct;
						}
					}else{
						rtnAcct = srcAcct.substr(-6,6);
							return rtnAcct;
					}
				}else{
					rtnAcct = srcAcct;
					return rtnAcct;
				}
			}
			$scope.dateFmt = function (srcDate){
				var rtnDate = '';
				if (srcDate == null || srcDate === '') {
					return rtnDate;
				}
		
				if (srcDate !== '') {
					rtnDate = srcDate.substring(0,8);
					return rtnDate;
				}
				return rtnDate;
			};
			$scope.trnsTypeDesc = function (srcTrnsType) {
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
			$scope.modeDesc = function (srcMode) {
				var rtnMode = '';
				if (srcMode == null || srcMode === '') {
					return rtnMode;
				}

				switch(srcMode) {
					case '0':
						rtnMode = '主掃';
						break;
					case '1':
						rtnMode = '被掃';
						break;
					default:
						rtnMode = '';
				}
				return rtnMode;
			}
			$scope.statusDesc = function (srcStatus) {
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
			function storeNameFmt(srcStoreName) {
				var rtnStoreName = '';
				// console.log(JSON.stringify(srcStoreName));
				// console.log(srcStoreName + " " + typeof srcStoreName);
				if (srcStoreName == null || srcStoreName === '' || typeof srcStoreName==="object") {
					return rtnStoreName;
				}

				if (srcStoreName.length > 8) {
					rtnStoreName = srcStoreName.substr(0,8);
					return rtnStoreName;
				}else{
					rtnStoreName = srcStoreName;
					return rtnStoreName;
				}
				return rtnStoreName;
			}
			
			//隱藏清單
			$scope.showQRList = function (inp) {
				if(inp == 'Y'){
					$element.find('#infoList').css('display','table');
				}
				$scope.ShowList = inp;
				if (inp == 'N') {
					$scope.qrTransList = {};
					$scope.qrcodeTransCount = 0;
					$element.find('#infoList').css('display','none');
				}
			}
			
			//排序
			$scope.orderByDesc = "-trnsDate"; //預設值 desc
			$scope.orderByTrnsDateSymbol = orderByDescSymbol; //預設值 desc
			$scope.orderByTrnsAcctSymbol = "";
			
			$scope.clickOrderBy = function (item) {
				if ($scope.qrcodeTransCount <= 1) {
					return;
				}
				$scope.orderByTrnsDateSymbol = "";
				$scope.orderByTrnsAcctSymbol = "";

				if (item == "DT") {
					if ($scope.orderByDesc == "" || $scope.orderByDesc == "undefined" || $scope.orderByDesc != "trnsDate") {
						$scope.orderByDesc = "trnsDate";
						$scope.orderByTrnsDateSymbol = orderByAscSymbol;
					}else if ($scope.orderByDesc == "trnsDate") {
						$scope.orderByDesc = "-trnsDate";
						$scope.orderByTrnsDateSymbol = orderByDescSymbol;
					}
				}else if (item == "AC") {
					if ($scope.orderByDesc == "" || $scope.orderByDesc == "undefined" || $scope.orderByDesc != "trnsAcct") {
						$scope.orderByDesc = "trnsAcct";
						$scope.orderByTrnsAcctSymbol = orderByAscSymbol;
					}else if ($scope.orderByDesc == "trnsAcct") {
						$scope.orderByDesc = "-trnsAcct";
						$scope.orderByTrnsAcctSymbol = orderByDescSymbol;
					}
				}
			}
			
			//類別
			$scope.qrTrnsType = [
				{
					Name: '全部',
					Type: "0"
				},
				{
					Name: '支付',
					Type: "1"
				},
				{
					Name: '轉帳購物',
					Type: "6"
				},
				{
					Name: '繳費',
					Type: "2"
				},
				{
					Name: '繳稅',
					Type: "3"
				},
				{
					Name: '轉帳',
					Type: "4"
				},
				{
					Name: '退貨',
					Type: "5"
				}
			];
			$scope.qrTrnsTypeSelected = $scope.qrTrnsType[0].Type;

			//取得次一日
			function getNextDay(srcDate){
				var inpdt = new Date(srcDate + $scope.dateHHMMSS);
				var rtnDate = '';
				if(inpdt instanceof Date){
					var sDate = angular.copy(inpdt);
					rtnDate = stringUtil.getDateRange(sDate, 1);
				}
				return rtnDate;
			};
			//年月日加入分隔符號  YYYYMMDD > YYYY-MM-DD
			function getToday8(srcDate) {
				var dateSplitFlag = "-";
				var rtnDate = srcDate.substr(0, 4) + dateSplitFlag +
					srcDate.substr(4, 2) + dateSplitFlag +
					srcDate.substr(6, 2) ;
				return rtnDate;
			}
			//Today new Date() > YYYY-MM-DD
			function getDayFmt(srcDate) {
				var dateSplitFlag = "-";
				var rtnDate = srcDate.getFullYear() + dateSplitFlag +
					stringUtil.padLeft(srcDate.getMonth() + 1, 2) + dateSplitFlag +
					stringUtil.padLeft(srcDate.getDate(), 2);
				return rtnDate;
			}
			//Today new Date() > YYYYMMDD
			function getDayFmtNoSplit(srcDate) {
				var rtnDate = srcDate.getFullYear() + 
					stringUtil.padLeft(srcDate.getMonth() + 1, 2) + 
					stringUtil.padLeft(srcDate.getDate(), 2);
				return rtnDate;
			}
			//點選近一週
			$scope.submitPreWeek = function () {
				$scope.showQRList('N');
				var now = new Date();
				var enddt = getDayFmt(now);
				var begdt = getToday8(getNextDay(getToday8(stringUtil.getPreWeek(now,1))));
				// console.log("1Week:" + begdt + ' - ' + enddt);
				$scope.begdt = new Date(begdt + $scope.dateHHMMSS);
				$scope.enddt = new Date(enddt + $scope.dateHHMMSS);
			}
			//點選近一個月
			$scope.submitPreMonth = function () {
				$scope.showQRList('N');
				var now = new Date();
				var enddt = getDayFmt(now);
				var begdt = getToday8(getNextDay(getToday8(stringUtil.getPreMonth(now,1))));
				// console.log("1Month:" + begdt + ' - ' + enddt);
				$scope.begdt = new Date(begdt + $scope.dateHHMMSS);
				$scope.enddt = new Date(enddt + $scope.dateHHMMSS);
			}
			//起訖區間二個月
			function between2Month(inpDT) {
				// console.log(typeof inpDT + " " +inpDT);
				var now = inpDT;
				var begdt = getToday8(getNextDay(getToday8(stringUtil.getPreMonth(now,2))));
				$scope.twoMonthDT = new Date(begdt + $scope.dateHHMMSS);
				// console.log("2Month:" + $scope.twoMonthDT);
			}
			//今日往前推一年
			function between1Year() {
				var now = new Date();
				var begdt = getToday8(getNextDay(getToday8(stringUtil.getPreMonth(now,12))));
				$scope.oneYearDTShow = begdt;
				$scope.oneYearDT = new Date(begdt + $scope.dateHHMMSS);
				// console.log("1Y:" + $scope.oneYearDT);
			}

			//取得今日日期
			var now = new Date();
			$scope.today = getDayFmt(now);
			//起迄日預設值
			if (typeof $scope.enddt=="undefined" || $scope.enddt=="") {
				$scope.enddt = new Date($scope.today + $scope.dateHHMMSS);
			}
			if (typeof $scope.begdt=="undefined" || $scope.begdt=="") {
				$scope.begdt = new Date($scope.today + $scope.dateHHMMSS);
			}
			//推算一年前日期
			between1Year();
			


			//點選查詢
			$scope.submit = function () {
				//隱藏&清空list
				$scope.showQRList('N');

				if (typeof $scope.enddt=="undefined" || $scope.enddt=="") {
					framework.alert('查詢迄日有誤，請重新選擇！！');
					// console.log("DT xx:" + $scope.enddt);
					return;
				}
				if (typeof $scope.begdt=="undefined" || $scope.begdt=="") {
					framework.alert('查詢起日有誤，請重新選擇！！');
					// console.log("DT xx:" + $scope.begdt);
					return;
				}

				var now = new Date();
				now = getDayFmt(now);
				// var enddt = getDayFmt(now);
				// var begdt = getDayFmt(now);
				// if ($scope.enddt instanceof Date) {
				// 	enddt = $scope.enddt;
				// }else {
				// 	$scope.enddt = new Date(enddt + $scope.dateHHMMSS);
				// }
				// if ($scope.begdt instanceof Date) {
				// 	begdt = $scope.begdt;
				// }else {
				// 	$scope.begdt = new Date(begdt + $scope.dateHHMMSS);
				// }
				// // console.log("DT 1:" + begdt + ' - ' + enddt);
				// alert("DT 1:" + begdt + ' - ' + enddt);
				// alert("DT 2:" + $scope.begdt + ' - ' + $scope.enddt);

				//chk 起>enddt往前一年
				between1Year();
				if (stringUtil.compareDate($scope.oneYearDT, $scope.begdt) == -1) {
					framework.alert('查詢最久時間為1年!');
					// console.log("DT A1:" + $scope.begdt + ' - ' + $scope.enddt);
					return;
				}
				if (stringUtil.compareDate(now, $scope.begdt) == 1) {
					framework.alert('查詢起日不可以大於今日!');
					// console.log("DT A12:" + now + ' - ' + $scope.begdt);
					return;
				}
				//chk 訖>往前一年
				if (stringUtil.compareDate($scope.oneYearDT, $scope.enddt) == -1) {
					framework.alert('查詢最久時間為1年!!');
					// console.log("DT A2:" + $scope.begdt + ' - ' + $scope.enddt);
					return;
				}
				if (stringUtil.compareDate(now, $scope.enddt) == 1) {
					framework.alert('查詢迄日不可以大於今日!!');
					// console.log("DT A22:" + now + ' - ' + $scope.enddt);
					return;
				}
				//chk 起~訖>2個月
				between2Month($scope.enddt);
				if (stringUtil.compareDate($scope.twoMonthDT, $scope.begdt) == -1) {
					framework.alert('資料查詢區間最大為2個月!');
					// console.log("DT B:" + $scope.begdt + ' - ' + $scope.enddt);
					return;
				}
				//chk 起>訖
				if (stringUtil.compareDate($scope.begdt, $scope.enddt) == -1) {
					framework.alert('查詢迄日須大於查詢起日!');
					// console.log("DT C:" + $scope.begdt + ' - ' + $scope.enddt);
					return;
				}else {
					// console.log("DT OK:" + $scope.begdt + ' - ' + $scope.enddt);
				}
				
				
				//main main main
				//取得交易明細
				qrcodePayServices.getLoginInfo(function (res) {
					var form = {};
					form.custId = res.custId;
					form.startDate = getDayFmtNoSplit($scope.begdt);
					form.endDate = getDayFmtNoSplit($scope.enddt);
					form.type = $scope.qrTrnsTypeSelected; 
					// console.log(JSON.stringify(form));
					// alert(JSON.stringify(form));
					qrCodePayTelegram.send('qrcodePay/fq000304', form, function (res) {
						// alert(JSON.stringify(res));
						// console.log(JSON.stringify(res));
						if (res) {
							// console.log("okokok");
							$scope.showQRList('Y');
							
							//預先篩選 
							function prefilter(inp) {
								return inp.status == "0" || inp.status == "3" ;
							}
							// var tempList = qrCodePayTelegram.toArray(res.details.detail).filter(prefilter);
							var tempList = res.details.detail;
							// console.log("tempList:"+JSON.stringify(tempList));

							//處理篩選後資料
							$scope.qrTransList = {};
							function mapping(inp) {
								var newinp = {};
								newinp.authCode = inp.authCode;
								newinp.logId = inp.logId;
								newinp.trnsAcct = inp.trnsAcct;
								newinp.trnsDate = inp.trnsDate;
								var tempAmt = inp.trnsAmount.replace(/,/g, "");
								newinp.trnsAmount = parseInt(tempAmt); //parseInt(inp.trnsAmount) / 100;
								newinp.trnsType = inp.trnsType;
								newinp.trnsTypeDesc = $scope.trnsTypeDesc(inp.trnsType);
								newinp.mode = inp.mode;
								newinp.modeDesc = $scope.modeDesc(inp.mode);
								newinp.status = inp.status;
								newinp.statusDesc = $scope.statusDesc(inp.status);
								newinp.storeName = typeof inp.storeName=="object"?"":decodeURI(inp.storeName);
								newinp.storeNameDesc = typeof inp.storeName=="object"?"":storeNameFmt(decodeURI(inp.storeName));
								newinp.orderNo = typeof inp.orderNo=="object"?"":inp.orderNo; //inp.orderNo;
								newinp.trnsNo = inp.trnsNo;
								if (inp.trnsType == "1" && inp.mode == "1") {
									newinp.trnsTypeDesc = newinp.trnsTypeDesc + "*"; //消費扣款&&被掃
								}
								return newinp;
							}
							$scope.qrTransList = qrCodePayTelegram.toArray(tempList).map(mapping);
							// console.log("$scope.qrTransList:"+JSON.stringify($scope.qrTransList));
							$scope.qrcodeTransCount = $scope.qrTransList.length;
							if ($scope.qrcodeTransCount <= 1) {
								$scope.orderByTrnsDateSymbol = "";
								$scope.orderByTrnsAcctSymbol = "";
								// console.log("a1:"+$scope.orderByDesc+$scope.qrcodeTransCount+" "+$scope.orderByTrnsDateSymbol+" "+$scope.orderByTrnsAcctSymbol);
							}else {
								$scope.orderByDesc = "-trnsDate";
								$scope.orderByTrnsDateSymbol = orderByDescSymbol; 
								$scope.orderByTrnsAcctSymbol = "";
								// console.log("a2:"+$scope.orderByDesc+$scope.qrcodeTransCount+" "+$scope.orderByTrnsDateSymbol+" "+$scope.orderByTrnsAcctSymbol);
							}
						} else {
							framework.alert("交易明細查詢失敗", function () {
								qrcodePayServices.closeActivity();
								return;
							});
						}
					}, null, true);

				});
			}
			
			//次頁返回,從keepData取得
			if (typeof $stateParams.result.keepData !== "undefined"){
				$scope.keepData = $stateParams.result.keepData;
				// console.log(JSON.stringify($stateParams.result));
				// console.log(typeof $stateParams.result);
				// console.log(JSON.stringify($stateParams.result.keepData));
				// console.log(typeof $stateParams.result.keepData);
				// console.log(typeof $scope.keepData);
				
				$scope.qrTransList = $scope.keepData.qrTransList;
				if ($scope.qrTransList.length > 0) {
					$scope.showQRList('Y');
				}
				$scope.qrcodeTransCount = $scope.keepData.qrTransList.length;
				$scope.begdt = new Date($scope.keepData.startDate + $scope.dateHHMMSS);
				$scope.enddt = new Date($scope.keepData.endDate + $scope.dateHHMMSS);
				$scope.qrTrnsTypeSelected = $scope.keepData.type;
				//排序
				if ($scope.keepData.orderByDesc == "" || $scope.keepData.orderByDesc == "undefined")  {
					$scope.orderByDesc = "-trnsDate";
					$scope.orderByTrnsDateSymbol = orderByDescSymbol; 
				}else {
					$scope.orderByDesc = $scope.keepData.orderByDesc;
					$scope.orderByTrnsDateSymbol = "";
					$scope.orderByTrnsAcctSymbol = "";
					
					if ($scope.keepData.orderByDesc.indexOf("-trnsDate") !== -1 && $scope.qrTransList.length > 1) {
						$scope.orderByTrnsDateSymbol = orderByDescSymbol;
					}else if ($scope.keepData.orderByDesc.indexOf("trnsDate") !== -1 && $scope.qrTransList.length > 1) {
						$scope.orderByTrnsDateSymbol = orderByAscSymbol;
					}else if ($scope.keepData.orderByDesc.indexOf("-trnsAcct") !== -1 && $scope.qrTransList.length > 1) {
						$scope.orderByTrnsAcctSymbol = orderByDescSymbol;
					}else if ($scope.keepData.orderByDesc.indexOf("trnsAcct") !== -1 && $scope.qrTransList.length > 1) {
						$scope.orderByTrnsAcctSymbol = orderByAscSymbol;
					}
				}
			}

			//qrcode detail顯示
			$scope.clickList = function (QR) {
				var keepData = {};
				keepData.startDate = getDayFmt($scope.begdt);
				keepData.endDate = getDayFmt($scope.enddt);
				keepData.type = $scope.qrTrnsTypeSelected;
				keepData.qrTransList = $scope.qrTransList;
				keepData.orderByDesc = $scope.orderByDesc;

				var form = {};
				form.QR = QR;
				form.keepData = keepData;
				// console.log("form:"+JSON.stringify(form));
				$state.go('transQueryDetail', {result:form});
			}

			
			$scope.clickDisAgree = function () {
				qrcodePayServices.closeActivity();
			}
			//點選返回
			$scope.clickBack = $scope.clickDisAgree;
			document.addEventListener("backbutton", $scope.clickBack, false);

		});
	//=====[ END]=====//
});
