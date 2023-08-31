/**
 * []
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
	MainApp.register.controller('SearchCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $sce, $log
			, qrcodePayServices,$window
			, qrcodeTelegramServices
			, qrCodePayTelegram
			, securityServices
			, $css
		) {
			//==參數設定==//

			$css.add('ui/newMainPage/css/main.css');
			$css.add('ui/newMainPage/css/fund.css');
			
			// var CDate =new Date();
			// CDate = $scope.GetDate11;
			// alert(JSON.stringify(CDate));
			//if(CDate != null){alert(CDate.getDay)}
			// var date11 = new Date();
			// $scope.GetDate11 = date11.getFullYear() + '-' + ('0' + (date11.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
			// alert(date11);

			$scope.example = {value: new Date};
			
			$("#birthday").on("input",function(){
				if($(this).val().length>0){
				$(this).addClass("full");
			 }
			 else{
			   $(this).removeClass("full");
			   } 
			  });
			
			$("#birthday1").on("input",function(){
				if($(this).val().length>0){
				$(this).addClass("full");
			 }
			 else{
			   $(this).removeClass("full");
			   } 
			  });
			
			//   $scope.minDate = new Date(Date.now() + 3600 * 48 * 1000);
			//   $scope.maxDate = new Date(Date.now() + 3600 * 48 * 1000);
			  $scope.checkDate = function () {
				if (!$scope.message && $("#birthday").val()) {
					setTimeout(function () {
						$("#birthday").val(null);
						framework.alert("起日為明日起至未來六個月內");
					}, 1000) // 延时是为了等日期选择框消去，避免页面跳动
				}
				if (!$scope.message1 && $("#birthday1").val()) {
					setTimeout(function () {
						$("#birthday1").val(null);
						framework.alert("迄日為明日起至未來六個月內");
					}, 1000) // 延时是为了等日期选择框消去，避免页面跳动
				}
				};

			
			//$scope.example = $stateParams.example;
			//var nn=value
			//alert($scope.example.value);
			//var aa=$scope.example.value;
			//alert(JSON.stringify($scope.example));
			
			
			// var bb = JSON.stringify($scope.example.value.getDay());
			// //alert($scope.example22);
			// alert(bb);
			// if(JSON.stringify($scope.example.value.getDay()) =="0"){alert("星期日非交易日，請選擇其它日期")}
			//設定6個月交易期限
			$scope.date1 = new Date(); 
			$scope.date1.setMonth($scope.date1.getMonth()+6); 
			$scope.date1 = getToday($scope.date1);
			//alert($scope.date1);
			function getToday(srcDate) {

                var dateSplitFlag = "-";

                var rtnDate = srcDate.getFullYear() + dateSplitFlag +

                    stringUtil.padLeft(srcDate.getMonth() + 1, 2) + dateSplitFlag +

                    stringUtil.padLeft(srcDate.getDate(), 2);

                return rtnDate;

			}
			//設定最小交易時間為今天
			$scope.date2 = new Date();
			$scope.date2.setDate($scope.date2.getDate()+1);
			
			//alert(2+$scope.date2);
			//$scope.date1.setDay
			$scope.date2 = getToday($scope.date2);
			//$scope.example.value = $scope.date2;
			//alert(2+$scope.date2);
			//  alert(date1);
			//  alert(JSON.stringify(date1));
			//  var input1 = document.querySelector('.content_input');
			// //  var tDate  = (function(){
			// // 	var date = new Date();
			// //    var seperator1 = "-";
			// //    var month = date.getMonth() + 1;//月
			// //    var strDate = date.getDate();//日
			// //    if (month >= 1 && month <= 9) {
			// // 	   month = "0" + month;
			// //    }
			// //    if (strDate >= 0 && strDate <= 9) {
			// // 	   strDate = "0" + strDate;
			// //    }
			// //    return date.getFullYear() + seperator1 + month + seperator1 + strDate
			// //    })
			// //    alert(tDate);
			//  input1.setAttribute('max',JSON.stringify(date1));




			//設定預約6個月
			//var c1 =$scope.example.value;
			//https://blog.csdn.net/rnzuozuo/article/details/19335721
			//http://yucccc.com/2016/04/10/%E9%99%90%E5%88%B6H5inputtype-date%E6%97%A5%E6%9C%9F%E6%8E%A7%E4%BB%B6%E6%89%80%E9%80%89%E6%97%A5%E6%9C%9F%E4%B8%8D%E8%83%BD%E6%99%9A%E4%BA%8E%E5%BD%93%E5%89%8D%E6%97%A5%E6%9C%9F/
			//c1.setMonth(c1.getMonth()+9);
			//alert(c1);
			//alert(JSON.stringify(c1));
			//var input1 = document.querySelector('.content_input');
			//input1.setAttribute('max',JSON.stringify(c1));
			

			$scope.noSSL = false;
			$scope.noOTP = true;
			const DebugMode = framework.getConfig("OFFLINE", 'B');
			const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');

			$scope.color = {
				name: '1',
				aa: "3"
			  };

			  

			// $scope.note = {
			// 	name: '1'
			//   };
			// $scope.numFmt = stringUtil.formatNum;
			// $scope.funds = $stateParams.paymentData;
			// $scope.OutAC = $stateParams.OutAC;
			// $scope.InAC = $stateParams.InAC;
			// $scope.reqfi000702Param = $stateParams.reqfi000702Param;
			// $scope.tempName = $scope.reqfi000702Param.transCode + '<br>' + $scope.reqfi000702Param.fundName;
			// $scope.fundTarget = $sce.trustAsHtml($scope.tempName);

			// //扣款狀態
			// $scope.payTypeFlagMenu = [
			// 	{
			// 		DebitStatusFlag: "N",
			// 		DebitStatus: '不變更'
			// 	},
			// 	{
			// 		DebitStatusFlag: "S",
			// 		DebitStatus: '暫停扣款'
			// 	},
			// 	{
			// 		DebitStatusFlag: "R",
			// 		DebitStatus: '恢復扣款'
			// 	}
			// ];

			//main main main
			qrcodePayServices.getLoginInfo(function (res) {
				//保留 custId
				$scope.custId = res.custId;
				
				getF5000101($scope.reqfi000702Param);
			});
			

			//---[日期格式:YYYMMDD(民國年)]---//
			// function TWYearFormat() {
			// 	var dt = new Date();
			// 	var timestamp = dt.getTime();
			// 	if (timestamp) {
			// 		$scope.month = dt.getMonth() + 1;
			// 		$scope.month = ('0' + $scope.month).substr(-2);
			// 		$scope.date = ('0' + dt.getDate()).substr(-2);
			// 		$scope.year = dt.getFullYear() - 1911;
			// 		$scope.year = ('00' + $scope.year).substr(-3);
			// 		$scope.YYYMMDD =  $scope.year + $scope.month + $scope.date;
			// 		return $scope.year + '/' + $scope.month + '/' + $scope.date;
			// 	}
			// }

			//日期陣列元素整理(value無值則移除)
			function removeLenZero(tempArr) {
				var j = 0;
				var outArr = [];
				for (i = 0; i < tempArr.length; i++) {
					if (tempArr[i].length != 0) {
						outArr[j] = tempArr[i];
						j += 1;
					}
				}
				return outArr;
			}

			//日期字串處理：加入日
			function addDayWroding(str) {
				if (str.indexOf(",") > -1){
					str = str.split(",").join("日,");
					str = str + "日";
				}else{
					str = str + "日";
				}
				return str;
			}


			var coin =[];
			$scope.coin = ["USD","HKD","GBP","AUD","SGD","CHF","CAD","JPY","SEK","EUR","NZD","THB","ZAR","CHY"];
			//	$scope.coin = [1,2,,34,5,"aa"];
			var config =[];
			$scope.config =["0000單純結購外匯存款不再匯出",
			"111E海運貨運費支出","115E航空貨運費支出","121E財產保險支出","131E商務支出","132E觀光支出","133E探親支出" ,"134E留學支出","135E信用卡支出","191E文化及休閒支出","192E貿易佣金及代理費支出","195E使用智慧財產權支出","19AE郵務與快遞支出","19BE電腦與資訊支出","19CE營業租賃支出","19DE專業技術事務支出","19EE視聽支出","19FE外國政府機構之勞務收入匯出款","210A對外股本投資","220B對外貸款投資","250A存放國外銀行","262A投資國外股權證券","263A投資國外長期債票券","264A投資國外短期債票券","266A國外有本金交割的遠匯及換匯之資金匯出","267A國外無本金交割的衍生金融商品之資金匯出","270A投資國外不動產","280B對外融資貸款","340B償還國外借款","440C國外借款利息","510F贍家匯款支出","511G工作者匯款支出","520F捐贈匯款支出","530F移民支出","540F購買自然資源與非研發成果資產支出","70AI付款人已自行辦理進口通關的貨款","701I尚未進口之預付貨款","702I燃油費及補給支出","704I樣品費支出","710D委外加工貿易支出","711D商仲貿易支出"];

			var applyBarcode_URL="http://210.200.4.11/MobileBankDev_P4/AppView/msg/F5000103_3.html";

			$scope.openWindow = function() {
				//$window.open ("http://210.200.4.11/MobileBankDev_P4/AppView/msg/F5000103_3.html","mywindow","menubar=1,resizable=1,width=350,height=250");
				//plugin.main.bannerWeb(applyBarcode_URL,function () { }, function () { });
				plugin.main.bannerWeb(applyBarcode_URL, function () { }, function () { });
			}
			//扣款狀態對應
			// function getPayTypeFlag(status) {
			// 	for (var i in $scope.payTypeFlagMenu) {
			// 		if ( ($scope.payTypeFlagMenu[i].DebitStatusFlag == status) && (status != "N") ) {
			// 			return $scope.payTypeFlagMenu[i].DebitStatus;
			// 		}
			// 	}
			// 	return "正常";
			// }
			//顯示請輸入日期
			// var textbox = document.getElementById('birthday')
			// 	textbox.onfocus = function(event){
			// 		this.type ='date';
			// 		this.focus();
			// 	}

			// var textbox = document.getElementById('birthday1')
			// 	textbox.onfocus = function(event){
			// 		this.type ='date';
			// 		this.focus();
			// 	}


			//F5000101-台幣活存約定轉出及轉入帳號查詢
			function getF5000101() {
				var temp_INCurrency = "TWD"
				var currencyType = "B"; //台幣
				// if ($scope.resfi000702Param.INCurrency == "NTD") {
				// 	temp_INCurrency = "TWD"
				// 	currencyType = "B"; //台幣
				// }else{
				// 	temp_INCurrency = $scope.resfi000702Param.INCurrency;
				// 	currencyType = "1"; //外幣
				// }
				//currencyType = "B"; //台幣
				var form = {};
				form.custId = $scope.custId; //$scope.resfi000702Param.custId;
				form.type = currencyType;

				qrCodePayTelegram.send('qrcodePay/f5000101', form, function (res, error) {
					 //$log.debug("f5000101:"+JSON.stringify(res));
					 //alert(JSON.stringify(res));
					if (res) {
						//$scope.trnsToken = res.trnsToken; //先用702明細的token

						var actsOut = qrCodePayTelegram.toArray(res.trnsOutAccts.trnsOutAcct);
						//alert(JSON.stringify(actsOut));
						$scope.InAC = [];
						for (key in actsOut) {
							
								if(actsOut[key].trnsOutCurr.indexOf("TWD") != -1){
									var tempIn = {};
									tempIn.acctNo = actsOut[key].trnsfrOutAccnt;
									$scope.InAC.push(tempIn);
								}
							
						}
						
						$log.debug(JSON.stringify($scope.InAC));
						$log.debug("in:" + $scope.InAC.length);

						//現金收益帳號
						// var orgCreditAcct = $scope.resfi000702Param.profitAcnt; //現金收益帳號對應
						// $scope.orgCreditAcct = $scope.resfi000702Param.profitAcnt;
						// $scope.SelectCreditAcctSelected = orgCreditAcct;
						// //for fi000704 電文	
						// genfi000704param($scope.resfi000702Param);
						// //for 結果頁 欄位顯示	
						// gendisplayParam($scope.resfi000702Param);

						var actsIn = qrCodePayTelegram.toArray(res.trnsInAccts.trnsInAcct);
						//alert(JSON.stringify(actsOut));
						$scope.InAC11 = [];
						for (key in actsIn) {
							
								if(actsIn[key].trnsInCurr.indexOf("TWD") == -1){
									var tempIn11 = {};
									tempIn11.acctNo = actsIn[key].trnsfrInAccnt;
									$scope.InAC11.push(tempIn11);
								} 
							
						}
						
						$log.debug(JSON.stringify($scope.InAC));
						$log.debug("in:" + $scope.InAC.length);
					} else {
						framework.alert(error.respCodeMsg, function () {
							framework.backToNative();
						});
					}
				}, null, false);
			}
			
			$scope.clickrate =function(){
				var params = {
				};
				$state.go('ForeignRate', params, {});

			}

			




			$scope.form9 = {};
			//確定變更
			
			$scope.clickSubmit = function () {
				//CH1檢查交易日期是否為星期日
				//alert(JSON.stringify($scope.example.value.getDay()));
				//alert(JSON.stringify($scope.example.value));
				var loIsDate = new Date(birthday.value);
				var loIsDate1 = new Date(birthday1.value);

				var start = document.getElementById("birthday").value; 
				var end = document.getElementById("birthday1").value; 
				//alert(loIsDate== "Invalid Date");
				//檢查是否選擇交易日期
				if(loIsDate== "Invalid Date") {framework.alert("請選擇扣款期間起日");}
				else if(loIsDate1== "Invalid Date") {framework.alert("請選擇扣款期間迄日");}
				//檢查交易日是否為星期日
				// else if(loIsDate.getDay()=="0")
				// {framework.alert("星期日非交易日，請選擇其它日期");}

				
				else if(end<start){framework.alert("選擇扣款期間迄日需大於起日");}

				//檢查備註
				//alert($scope.status);
				else if(($scope.color.aa == 4) && ($scope.status==undefined ||$scope.status=="")) {framework.alert("請輸入備註");}

				//alert($scope.coin[$scope.life2]);
				//alert($scope.InAC[$scope.life].acctNo);
				//alert($scope.InAC11[$scope.life1].acctNo);
				
				//alert(birthday.value);
				//alert($scope.qrcode.trnsAmountStr1+"."+$scope.qrcode.trnsAmountStr2);

				// $scope.form9 = {};
				// $scope.form9.OutacctNo = $scope.InAC[$scope.life].acctNo;
				// $scope.form9.InacctNo = $scope.InAC11[$scope.life1].acctNo;
				// $scope.form9.coin = $scope.coin[$scope.life2];
				// $scope.form9.date = birthday.value;
				
				else if($scope.life==undefined){framework.alert("請選擇交易類型");}

				// alert($scope.custId);
				// alert($scope.life);
				// alert(birthday.value);
				// alert(birthday1.value);

				//注意事項
				//var message = '除每年5月綜合所得稅結算申報自繳稅款案件，得於法定(或依法展延)申報截止日前取消授權外，其餘案件一經授權成功，不得取消或更正。\n您可按「確認」繼續繳款，或按「取消」放棄繳款';
				//framework.confirm(message, function(ok){
					//if(ok){
				else{		
					$scope.form9 = {};
							$scope.form9.custId = $scope.custId;
							$scope.form9.type = $scope.life;
							$scope.form9.startdate = birthday.value;
							$scope.form9.endtdate = birthday1.value;
							
					var params = {
							
							form9: $scope.form9

						};
						
						//alert(JSON.stringify($scope.form9));
						//debugger;
						$state.go('SearchResult',params,{location: 'replace'});
					
				
			}
		}

			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				// var params = {
				// 	'paymentData': $scope.funds
				// 	, 'keepData' : $scope.reqfi000702Param
				// 	, 'securityType': {}
				// };
				// $state.go('fundTermsProfitAcnt', params, {});
			}
			
			// $scope.clickDisAgree = function () {
			// 	var params = {
			// 		'paymentData': $scope.funds
			// 		, 'keepData' : $scope.reqfi000702Param
			// 		, 'securityType': {}
			// 	};
			// 	$state.go('fundTermsProfitAcnt', params, {});
			// }

			$scope.clickBack = function () {
				//alert(JSON.stringify($scope.example.value.getDay()));
				
				framework.backToNative();

				
			}
			//回上頁
			//$scope.clickCancel = $scope.clickDisAgree;
			//點選返回
			//$scope.clickBack = $scope.clickDisAgree;

		});
	//=====[ END]=====//


});
