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
	MainApp.register.controller('TwToForeignEditCtrl',
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

			var message = '注意事項：\n1.預約交易限次一營業日至六個月內。\n2.預約外匯結購/結售不提供匯率優惠，實際成交匯率依預約轉帳日(約上午9:30)本行牌告匯率為準。\n3.預約交易完成不代表交易已完成，可能因扣款帳號存款不足、逾限額、臨時停上營業或電腦系統等因素導致交易失敗，請務必於轉帳日上午10:00後，確認該筆交易扣款是否成功。\n4.結購+結售每日次數限30筆。\n5.依據主管機關規定，每日累計結購/結售金額分別達新台幣50萬以上者需申報。\n6.依中央銀行「外匯收支及交易申報辦法規定」申報義務人務請審慎據實申報，若申報義務人申報不實，依管理外匯條例規定懲處新台幣3萬以上六十萬元以下罰鍰。\n7.交易幣別為人民幣，每人每日結購累計金額限人民幣2萬元(與臨櫃併計)';
				
			framework.alert(message);
			
			//alert(message);
			
			// var CDate =new Date();
			// CDate = $scope.GetDate11;
			// alert(JSON.stringify(CDate));
			//if(CDate != null){alert(CDate.getDay)}
			// var date11 = new Date();
			// $scope.GetDate11 = date11.getFullYear() + '-' + ('0' + (date11.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
			// alert(date11);


			$("#birthday").on("input",function(){
				if($(this).val().length>0){
				$(this).addClass("full");
			 }
			 else{
			   $(this).removeClass("full");
			   } 
			  });


			$scope.example = {value: new Date};
			

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
			

			$scope.noSSL = false;
			$scope.noOTP = true;
			const DebugMode = framework.getConfig("OFFLINE", 'B');
			const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');

			$scope.color = {
				name: '1',
				aa: "3"
			  };

			  

			//main main main
			qrcodePayServices.getLoginInfo(function (res) {
				//保留 custId
				$scope.custId = res.custId;
				
				getF5000101($scope.reqfi000702Param);
			});
			


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

			$scope.checkDate = function () {
				if (!$scope.message && $("#birthday").val()) {
					setTimeout(function () {
						$("#birthday").val(null);
						framework.alert("日期為明日起至未來六個月內");
					}, 1000) // 延时是为了等日期选择框消去，避免页面跳动
				}
				
				};

			var coin =[];
			$scope.coin = ["USD","HKD","GBP","AUD","SGD","CHF","CAD","JPY","SEK","EUR","NZD","THB","ZAR","CNY"];
			//$scope.life1 ='';
			// if(typeof $scope.life1 != 'undefined'){
			// 	alert(123);
			// 	$scope.coin=$scope.InAC11[$scope.life1].accCurr;}
			// alert($scope.life1);
			// if($scope.life1 != ''){
			// alert($scope.InAC11[$scope.life1].accCurr);}
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
			
			var textbox = document.getElementById('birthday')
				textbox.onfocus = function(event){
					this.type ='date';
					this.focus();
				}



			var trnsToken;
			//F5000101-台幣活存約定轉出及轉入帳號查詢
			function getF5000101() {
				var temp_INCurrency = "TWD"
				var currencyType = "B"; //台幣
				
				var form = {};
				form.custId = $scope.custId; //$scope.resfi000702Param.custId;
				form.type = currencyType;

				qrCodePayTelegram.send('qrcodePay/f5000101', form, function (res, error) {
					 //$log.debug("f5000101:"+JSON.stringify(res));
					 //alert(JSON.stringify(res));
					if (res) {
						//$scope.trnsToken = res.trnsToken; //先用702明細的token
						trnsToken = res.trnsToken;
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

						

						var actsIn = qrCodePayTelegram.toArray(res.trnsInAccts.trnsInAcct);
						//alert(JSON.stringify(actsOut));
						$scope.InAC11 = [];
						for (key in actsIn) {
							
								if(actsIn[key].trnsInCurr.indexOf("TWD") == -1){
									var tempIn11 = {};
									tempIn11.acctNo = actsIn[key].trnsfrInAccnt;
									//tempIn11.accCurr = actsIn[key].trnsInCurr;
									$scope.InAC11.push(tempIn11);
								} 
							
						}
						
						$log.debug(JSON.stringify($scope.InAC11));
						$log.debug("in:" + $scope.InAC11.length);
					} else {
						framework.alert(error.respCodeMsg, function () {
							framework.backToNative();
						});
					}

				if( $scope.InAC11.length == 0){
					framework.alert("您未申請約定轉入帳號，請洽本行營業單位辦理。", function () {
						framework.backToNative();
					});
				}
				}, null, false);
			}
			
			
			$scope.form6 = {};
			//aa判斷返回頁面
			$scope.form6.aa= "1";
			$scope.clickrate =function(){
				
				var params = {	
					form6 : $scope.form6
				};
				$state.go('ForeignRate', params, {});

			}

			

			$scope.form9 = {};
			//確定變更
			
			$scope.clickSubmit = function () {
				// alert($scope.InAC11[$scope.life1].accCurr);
				// alert($scope.life1);
				//CH1檢查交易日期是否為星期日
				//alert(JSON.stringify($scope.example.value.getDay()));
				//alert(JSON.stringify($scope.example.value));
				// if($scope.status != null){
				// 	var num = $scope.status.replace(/[^\x00-\xff]/g, 'xx').length;
				// 	//alert(num);
				// 	if (num >18) {
				// 	alert("訊息長度有誤");
				// 	return;
				// 		}
				// }

				
				var loIsDate = new Date(birthday.value);
				//alert($scope.trnsAmountStr1);
				//alert(loIsDate== "Invalid Date");
				//檢查是否選擇交易日期
				if(loIsDate== "Invalid Date") {framework.alert("請選擇交易日期");}
				//檢查交易日是否為星期日
				else if(loIsDate.getDay()=="0")
				{framework.alert("星期日非交易日，請選擇其它日期");}

				//檢查轉出帳號是否輸入
				else if($scope.life == undefined) {framework.alert("請選擇轉出帳號");}

				//檢查轉入帳號是否輸入
				else if($scope.life1 == undefined) {framework.alert("請選擇轉入帳號");}

				//檢查轉出帳號是否輸入
				else if($scope.life2 == undefined) {framework.alert("請選擇幣別");}

				//檢查金額
				
				else if(($scope.trnsAmountStr1 == undefined)&&($scope.trnsAmountStr == undefined)) {framework.alert("請輸入轉帳金額");}
				else if(($scope.trnsAmountStr == "")&&($scope.trnsAmountStr1 == "")){framework.alert("請輸入轉帳金額");}
				else if(($scope.trnsAmountStr == undefined)&&($scope.trnsAmountStr1 == "")){framework.alert("請輸入轉帳金額");}
				else if(($scope.trnsAmountStr == "")&&($scope.trnsAmountStr1 == undefined)){framework.alert("請輸入轉帳金額");}
				

				
				//檢查結購用途
				else if($scope.life4 == undefined) {framework.alert("請選擇結購用途");}

				//檢查備註
				//alert($scope.status);
				else if(($scope.color.aa == 4) && ($scope.status==undefined ||$scope.status=="")) {framework.alert("請輸入備註");}

				else if($scope.status != null && ($scope.status.replace(/[^\x00-\xff]/g, 'xx').length >18)){
					//var num = $scope.status.replace(/[^\x00-\xff]/g, 'xx').length;
					//alert(num);
					
					framework.alert("訊息長度有誤");
				}
				
				//注意事項
				else {
				
					
						$scope.form9 = {};
						$scope.form9.OutacctNo = $scope.InAC[$scope.life].acctNo;
						$scope.form9.InacctNo = $scope.InAC11[$scope.life1].acctNo;
						$scope.form9.coin = $scope.coin[$scope.life2];
						$scope.form9.date = birthday.value;
						$scope.form9.config = $scope.config[$scope.life4];
						$scope.form9.trnsToken =trnsToken;
						if($scope.color.aa == 3){
							$scope.form9.status ="";
							$scope.form9.status9 = "成交匯率";}
						else{$scope.form9.status = $scope.status;
							$scope.form9.status9 = $scope.status;}
						
						if(($scope.trnsAmountStr2 == "")||($scope.trnsAmountStr2 == undefined)){$scope.trnsAmountStr2 = 00;}
						//alert($scope.status);
						if($scope.color.name== 1){$scope.form9.trnsAmount=$scope.trnsAmountStr;}
						else{$scope.form9.trnsAmount = $scope.trnsAmountStr1+"."+$scope.trnsAmountStr2;}
						if($scope.color.name==1){$scope.form9.tcoin="TWD";}
						else{$scope.form9.tcoin=$scope.form9.coin}
						var params = {
					
							//OutacctNo : $scope.InAC[$scope.life].acctNo,
							//InacctNo :	$scope.InAC11[$scope.life1].acctNo,
							form9: $scope.form9

						};
						
						$state.go('TwToForeignCheck',params,{location: 'replace'});
					
					
				
				
			}
				
				
				
				//發送查詢外幣匯率電文
				// function getF5000102() {
				// 	var form2 = {};
				// 	var rates = [];
				// 	form2.custId = $scope.custId;
				// 	form2.trnsOutCurr = "TWD";
				// 	form2.trnsfrOutAccnt = "10";
				// 	form2.trnsInCurr = $scope.coin[$scope.life2];
				// 	form2.trnsfrInAmount = "0";
				// 	//$log.debug("fi000701 req:" + JSON.stringify(form));
				// 	qrCodePayTelegram.send('qrcodePay/f5000102', form2, function (res, error) {
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
			
			

			$scope.clickBack = function () {
				//alert(JSON.stringify($scope.example.value.getDay()));
				
				framework.backToNative();
			}
			//回上頁
			//$scope.clickCancel = $scope.clickDisAgree;
			//點選返回
			//$scope.clickBack = $scope.clickDisAgree;

		
	//=====[ END]=====//
})

});