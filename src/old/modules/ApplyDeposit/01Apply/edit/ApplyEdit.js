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
	, 'modules/service/card/branchServices'
	, 'modules/service/card/areaServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('ApplyEditCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $sce, $log
			, qrcodePayServices,$window
			, qrcodeTelegramServices
			, qrCodePayTelegram
			, securityServices
			, $css, branchServices, areaServices
		) {
			//==參數設定==//

			$css.add('ui/newMainPage/css/main.css');
			$css.add('ui/newMainPage/css/fund.css');

			$scope.noSSL = false;
			$scope.noOTP = true;

			const DebugMode = framework.getConfig("OFFLINE", 'B');
			const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			//$scope.form6 = $stateParams.form6;

			var textbox = document.getElementById('birthday')
			textbox.onfocus = function(event){
				this.type ='date';
				this.focus();
			}
			
			//$scope.life1 ='';
			// var origin = [1, 2, 'a', 3, 1, 'b', 'a'];
			// var result = origin.filter(function(element, index, arr){
			// 	return arr.indexOf(element) === index;
			// });
			// var repeat = origin.filter(function(element, index, arr){
			// 	return arr.indexOf(element) !== index;
			// });
			// console.log(result); // [1, 2, "a", 3, "b"]
			// console.log(repeat); // [1, "a"]
			
			$scope.hasChangedCopy = function () {
			if($scope.copy == 1){$scope.fee = 50}
			else{$scope.fee = 50+(20*($scope.copy-1))};
			}

			$scope.post11 = function () {
			if($scope.life44 == 5){$scope.postFee = 0}
			else{$scope.postFee =25};
			}
			//$scope.custChName = "王大樹";

			//最小日期為前2個月
			$scope.date1 = new Date(); 
			$scope.date1.setMonth($scope.date1.getMonth()-2); 
			$scope.date1 = getToday($scope.date1);

			$scope.date3 = new Date(); 
			$scope.date3.setMonth($scope.date3.getMonth()-12); 
			$scope.date3 = getToday($scope.date3);

			//設定最大日期為今天
			$scope.date2 = new Date();
			$scope.date2.setDate($scope.date2.getDate());
			$scope.date2 = getToday($scope.date2);

			$scope.date4 = new Date();
			$scope.date4.setDate($scope.date4.getDate());
			$scope.date4 = getToday($scope.date4);
			

			function getToday(srcDate) {
				
				var dateSplitFlag = "-";

				var rtnDate = srcDate.getFullYear() + dateSplitFlag +

					stringUtil.padLeft(srcDate.getMonth() + 1, 2) + dateSplitFlag +

					stringUtil.padLeft(srcDate.getDate(), 2);

				return rtnDate;
				
			}
			
			$scope.checkDate = function () {
				if (!$scope.message && $("#birthday").val()) {
					setTimeout(function () {
						$("#birthday").val(null);
						framework.alert("日期為今日起至前2個月內");
					}, 1000) // 延时是为了等日期选择框消去，避免页面跳动
				}
				
				
				
				};

			$scope.checkDate1 = function () {
				if (!$scope.message1 && $("#birthday1").val()) {
					setTimeout(function () {
						$("#birthday1").val(null);
						framework.alert("日期為今日起至前一年內");
					}, 1000) // 延时是为了等日期选择框消去，避免页面跳动
				}
				
				};

			var textbox = document.getElementById('birthday')
			textbox.onfocus = function(event){
				this.type ='date';
				this.focus();
			}

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

			//main 
			
			
			

			
			//F5000101-存款餘額申請資料查詢
			function getFJ000102() {
				
				
				var form = {};
				form.custId = $scope.custId; //$scope.resfi000702Param.custId;
				

				qrCodePayTelegram.send('qrcodePay/fj000102', form, function (res, error) {
					// $log.debug("alex"+JSON.stringify(res));
					//  alert(JSON.stringify(res));
					if (res) {
						//res = {"@xmlns:fj0":"http://mnb.hitrust.com/service/schema/fj000102","@xsi:type":"fj0:fj000102ResultType","applyAcnts":{"applyAcnt":{"0":{"acctNo":"0796765519836","curr":"TWD"},"1":{"acctNo":"0560188000211","curr":"USD,ZAR,CNY"},"2":{"acctNo":"0560188001225","curr":"USD,ZAR"},"3":{"acctNo":"0796899300865","curr":"TWD,USD,GBP,JPY,EUR,CNY"},"4":{"acctNo":"9997766500711","curr":"TWD"},"5":{"acctNo":"9997227631527","curr":"TWD"}}},"custName":"合庫７２０４７","residenceAddr":"台北市大安區信義路四段","noticeAddr":"地上爬","companyAddr":"草上飛","contactPhone":"123456789","trnsOutAcnts":{"trnsOutAcnt":{"0":{"acctNo":"0796765519836"},"1":{"acctNo":"0796899300865"},"2":{"acctNo":"9997227631527"},"3":{"acctNo":"9997766500711"}}},"branches":{"branch":{"0":{"branchId":"0020","branchName":"0020(中山路分行)","city":"台北市"},"1":{"branchId":"0030","branchName":"0030(西門分行)","city":"台北市"},"2":{"branchId":"0040","branchName":"0040(延平分行)","city":"台北市"},"3":{"branchId":"0050","branchName":"0050(大稻埕分行)","city":"台北市"},"4":{"branchId":"0060","branchName":"0060(東門分行)","city":"台北市"},"5":{"branchId":"0070","branchName":"0070(松山分行)","city":"台北市"},"6":{"branchId":"0080","branchName":"0080(新店分行)","city":"新北市"},"7":{"branchId":"0090","branchName":"0090(永和分行)","city":"新北市"},"8":{"branchId":"0100","branchName":"0100(三重分行)","city":"新北市"},"9":{"branchId":"0110","branchName":"0110(板橋分行)","city":"新北市"},"10":{"branchId":"0120","branchName":"0120(基隆分行)","city":"基隆市"},"11":{"branchId":"0130","branchName":"0130(宜蘭分行)","city":"宜蘭縣"},"12":{"branchId":"0140","branchName":"0140(蘇澳分行)","city":"宜蘭縣"},"13":{"branchId":"0150","branchName":"0150(桃園分行)","city":"桃園市"},"14":{"branchId":"0160","branchName":"0160(中壢分行)","city":"桃園市"},"15":{"branchId":"0170","branchName":"0170(新竹分行)","city":"新竹市"},"16":{"branchId":"0180","branchName":"0180(苗栗分行)","city":"苗栗縣"},"17":{"branchId":"0190","branchName":"0190(頭份分行)","city":"苗栗縣"},"18":{"branchId":"0200","branchName":"0200(豐原分行)","city":"台中市"},"19":{"branchId":"0210","branchName":"0210(沙鹿分行)","city":"台中市"},"20":{"branchId":"0220","branchName":"0220(台中分行)","city":"台中市"},"21":{"branchId":"0230","branchName":"0230(彰化分行)","city":"彰化縣"},"22":{"branchId":"0240","branchName":"0240(員林分行)","city":"彰化縣"},"23":{"branchId":"0250","branchName":"0250(南投分行)","city":"南投縣"},"24":{"branchId":"0260","branchName":"0260(斗六分行)","city":"雲林縣"},"25":{"branchId":"0270","branchName":"0270(北港分行)","city":"雲林縣"},"26":{"branchId":"0280","branchName":"0280(嘉義分行)","city":"嘉義市"},"27":{"branchId":"0290","branchName":"0290(新營分行)","city":"台南市"},"28":{"branchId":"0300","branchName":"0300(台南分行)","city":"台南市"},"29":{"branchId":"0310","branchName":"0310(成功分行)","city":"台南市"},"30":{"branchId":"0320","branchName":"0320(鳳山分行)","city":"高雄市"},"31":{"branchId":"0330","branchName":"0330(岡山分行)","city":"高雄市"},"32":{"branchId":"0340","branchName":"0340(高雄分行)","city":"高雄市"},"33":{"branchId":"0350","branchName":"0350(新興分行)","city":"高雄市"},"34":{"branchId":"0360","branchName":"0360(屏東分行)","city":"屏東縣"},"35":{"branchId":"0370","branchName":"0370(潮州分行)","city":"屏東縣"},"36":{"branchId":"0380","branchName":"0380(花蓮分行)","city":"花蓮縣"},"37":{"branchId":"0390","branchName":"0390(台東分行)","city":"台東縣"},"38":{"branchId":"0400","branchName":"0400(澎湖分行)","city":"澎湖縣"},"39":{"branchId":"0410","branchName":"0410(南京東路分行)","city":"台北市"},"40":{"branchId":"0420","branchName":"0420(北高雄分行)","city":"高雄市"},"41":{"branchId":"0430","branchName":"0430(大同分行)","city":"台北市"},"42":{"branchId":"0440","branchName":"0440(和平分行)","city":"基隆市"},"43":{"branchId":"0450","branchName":"0450(忠孝分行)","city":"台北市"},"44":{"branchId":"0460","branchName":"0460(景美分行)","city":"台北市"},"45":{"branchId":"0470","branchName":"0470(士林分行)","city":"台北市"},"46":{"branchId":"0480","branchName":"0480(汐止分行)","city":"新北市"},"47":{"branchId":"0490","branchName":"0490(新莊分行)","city":"新北市"},"48":{"branchId":"0500","branchName":"0500(中興分行)","city":"台中市"},"49":{"branchId":"0510","branchName":"0510(苓雅分行)","city":"高雄市"},"50":{"branchId":"0540","branchName":"0540(台北分行)","city":"台北市"},"51":{"branchId":"0560","branchName":"0560(營業部)","city":"台北市"},"52":{"branchId":"0570","branchName":"0570(南豐原分行)","city":"台中市"},"53":{"branchId":"0580","branchName":"0580(羅東分行)","city":"宜蘭縣"},"54":{"branchId":"0590","branchName":"0590(三民分行)","city":"高雄市"},"55":{"branchId":"0600","branchName":"0600(城東分行)","city":"台北市"},"56":{"branchId":"0610","branchName":"0610(佳里分行)","city":"台南市"},"57":{"branchId":"0620","branchName":"0620(中和分行)","city":"新北市"},"58":{"branchId":"0630","branchName":"0630(南高雄分行)","city":"高雄市"},"59":{"branchId":"0640","branchName":"0640(南嘉義分行)","city":"嘉義市"},"60":{"branchId":"0650","branchName":"0650(竹東分行)","city":"新竹縣"},"61":{"branchId":"0670","branchName":"0670(東三重分行)","city":"新北市"},"62":{"branchId":"0680","branchName":"0680(南興分行)","city":"台南市"},"63":{"branchId":"0690","branchName":"0690(五權分行)","city":"台中市"},"64":{"branchId":"0700","branchName":"0700(埔里分行)","city":"南投縣"},"65":{"branchId":"0710","branchName":"0710(大順分行)","city":"高雄市"},"66":{"branchId":"0720","branchName":"0720(南勢角分行)","city":"新北市"},"67":{"branchId":"0730","branchName":"0730(朴子分行)","city":"嘉義縣"},"68":{"branchId":"0760","branchName":"0760(大安分行)","city":"台北市"},"69":{"branchId":"0770","branchName":"0770(民權分行)","city":"台北市"},"70":{"branchId":"0780","branchName":"0780(東高雄分行)","city":"高雄市"},"71":{"branchId":"0796","branchName":"0796(東台北分行)","city":"台北市"},"72":{"branchId":"0800","branchName":"0800(城內分行)","city":"台北市"},"73":{"branchId":"0811","branchName":"0811(建國分行)","city":"台北市"},"74":{"branchId":"0822","branchName":"0822(圓山分行)","city":"台北市"},"75":{"branchId":"0833","branchName":"0833(信義分行)","city":"台北市"},"76":{"branchId":"0844","branchName":"0844(長春分行)","city":"台北市"},"77":{"branchId":"0855","branchName":"0855(仁愛分行)","city":"台北市"},"78":{"branchId":"0866","branchName":"0866(玉成分行)","city":"台北市"},"79":{"branchId":"0877","branchName":"0877(古亭分行)","city":"台北市"},"80":{"branchId":"0888","branchName":"0888(長安分行)","city":"台北市"},"81":{"branchId":"0899","branchName":"0899(松興分行)","city":"台北市"},"82":{"branchId":"0903","branchName":"0903(民族分行)","city":"台北市"},"83":{"branchId":"0914","branchName":"0914(復興分行)","city":"台北市"},"84":{"branchId":"0925","branchName":"0925(雙連分行)","city":"台北市"},"85":{"branchId":"0936","branchName":"0936(民生分行)","city":"台北市"},"86":{"branchId":"0947","branchName":"0947(新生分行)","city":"台北市"},"87":{"branchId":"0958","branchName":"0958(松江分行)","city":"台北市"},"88":{"branchId":"0969","branchName":"0969(永吉分行)","city":"台北市"},"89":{"branchId":"0981","branchName":"0981(東新莊分行)","city":"新北市"},"90":{"branchId":"0992","branchName":"0992(北三重分行)","city":"新北市"},"91":{"branchId":"1003","branchName":"1003(前金分行)","city":"高雄市"},"92":{"branchId":"1014","branchName":"1014(成大分行)","city":"台南市"},"93":{"branchId":"1025","branchName":"1025(大里分行)","city":"台中市"},"94":{"branchId":"1036","branchName":"1036(海山分行)","city":"新北市"},"95":{"branchId":"1070","branchName":"1070(南台中分行)","city":"台中市"},"96":{"branchId":"1081","branchName":"1081(埔墘分行)","city":"新北市"},"97":{"branchId":"1092","branchName":"1092(慈文分行)","city":"桃園市"},"98":{"branchId":"1106","branchName":"1106(北寧分行)","city":"台北市"},"99":{"branchId":"1117","branchName":"1117(迴龍分行)","city":"桃園市"},"100":{"branchId":"1128","branchName":"1128(太平分行)","city":"台中市"},"101":{"branchId":"1139","branchName":"1139(彰營分行)","city":"彰化縣"},"102":{"branchId":"1140","branchName":"1140(彰儲分行)","city":"彰化縣"},"103":{"branchId":"1151","branchName":"1151(虎尾分行)","city":"雲林縣"},"104":{"branchId":"1162","branchName":"1162(南屯分行)","city":"台中市"},"105":{"branchId":"1173","branchName":"1173(西台中分行)","city":"台中市"},"106":{"branchId":"1184","branchName":"1184(溪湖分行)","city":"彰化縣"},"107":{"branchId":"1195","branchName":"1195(烏日分行)","city":"台中市"},"108":{"branchId":"1209","branchName":"1209(和美分行)","city":"彰化縣"},"109":{"branchId":"1210","branchName":"1210(南桃園分行)","city":"桃園市"},"110":{"branchId":"1221","branchName":"1221(屏南分行)","city":"屏東縣"},"111":{"branchId":"1232","branchName":"1232(東台南分行)","city":"台南市"},"112":{"branchId":"1243","branchName":"1243(北新竹分行)","city":"新竹市"},"113":{"branchId":"1254","branchName":"1254(復旦分行)","city":"台北市"},"114":{"branchId":"0251","branchName":"0251(竹山分行)","city":"南投縣"},"115":{"branchId":"0341","branchName":"0341(前鎮分行)","city":"高雄市"},"116":{"branchId":"1287","branchName":"1287(灣內分行)","city":"高雄市"},"117":{"branchId":"0331","branchName":"0331(路竹分行)","city":"高雄市"},"118":{"branchId":"0351","branchName":"0351(憲德分行)","city":"高雄市"},"119":{"branchId":"1313","branchName":"1313(竹北分行)","city":"新竹縣"},"120":{"branchId":"0081","branchName":"0081(六合分行)","city":"新北市"},"121":{"branchId":"0411","branchName":"0411(五洲分行)","city":"台北市"},"122":{"branchId":"1346","branchName":"1346(臺大分行)","city":"台北市"},"123":{"branchId":"0152","branchName":"0152(龜山分行)","city":"桃園市"},"124":{"branchId":"0151","branchName":"0151(大溪分行)","city":"桃園市"},"125":{"branchId":"0161","branchName":"0161(龍潭分行)","city":"桃園市"},"126":{"branchId":"1391","branchName":"1391(中原分行)","city":"桃園市"},"127":{"branchId":"1405","branchName":"1405(三興分行)","city":"台北市"},"128":{"branchId":"1416","branchName":"1416(敦化分行)","city":"台北市"},"129":{"branchId":"1427","branchName":"1427(石牌分行)","city":"台北市"},"130":{"branchId":"1438","branchName":"1438(西屯分行)","city":"台中市"},"131":{"branchId":"1449","branchName":"1449(雙和分行)","city":"新北市"},"132":{"branchId":"1450","branchName":"1450(土城分行)","city":"新北市"},"133":{"branchId":"1461","branchName":"1461(光華分行)","city":"高雄市"},"134":{"branchId":"1472","branchName":"1472(北台南分行)","city":"台南市"},"135":{"branchId":"1483","branchName":"1483(興鳳分行)","city":"高雄市"},"136":{"branchId":"1494","branchName":"1494(北屯分行)","city":"台中市"},"137":{"branchId":"1508","branchName":"1508(一心路分行)","city":"高雄市"},"138":{"branchId":"1519","branchName":"1519(三峽分行)","city":"新北市"},"139":{"branchId":"1520","branchName":"1520(北嘉義分行)","city":"嘉義市"},"298":{"branchId":"9998","branchName":"9998(9998分行)","city":"台北市"}}},"trnsToken":"9f0f70b04c6d41b28e9ac8f5f2e2fa9f","result":"0","respCode":"","respCodeMsg":""};
						$scope.trnsToken = res.trnsToken;

						$scope.residenceAddr = res.residenceAddr;
						$scope.noticeAddr = res.noticeAddr;
						$scope.companyAddr = res.companyAddr;
						$scope.contactPhone = res.contactPhone;
						$scope.custChName = res.custName;

						//alert(JSON.stringify(res));
						var applyAcctOut = qrCodePayTelegram.toArray(res.applyAcnts.applyAcnt);
						
						$scope.applys = [];
						
							for (key in applyAcctOut) {
								var tempIn2 = {};
								//申請帳號
								tempIn2.acctNo = applyAcctOut[key].acctNo;		
								//申請幣別
								tempIn2.curr = applyAcctOut[key].curr;
								$scope.applys.push(tempIn2);
							
							}
						
						$log.debug(JSON.stringify($scope.applys));
						$log.debug("in:" + $scope.applys.length);

						var trnsOutAcctOut = qrCodePayTelegram.toArray(res.trnsOutAcnts.trnsOutAcnt);
						$scope.trns = [];
						
							for (key in trnsOutAcctOut) {
								var tempIn2 = {};
								//轉出帳號
								tempIn2.acctNo = trnsOutAcctOut[key].acctNo;		
								
								$scope.trns.push(tempIn2);
							
							}
						
						$log.debug(JSON.stringify($scope.trns));
						$log.debug("in:" + $scope.trns.length);

						var branchtOut = qrCodePayTelegram.toArray(res.branches.branch);
						$scope.bras = [];
						$scope.city= [];
						
							for (key in branchtOut) {
								var tempIn2 = {};
								//分行代碼
								tempIn2.branchId = branchtOut[key].branchId;
								//分行名稱	
								tempIn2.branchName = branchtOut[key].branchName;
								//所在縣市	
								tempIn2.city = branchtOut[key].city;
								$scope.city.push(branchtOut[key].city);
								$scope.bras.push(tempIn2);
							
							}
						
						$scope.city = $scope.city.filter(function(element, index, arr){
							return arr.indexOf(element) === index;
						});
						// var yy=[];
						//  yy=(JSON.stringify($scope.bras)).split(',');
						//var ww= $scope.applys[$scope.life1].curr.split(',');
						// alert(yy);
						// alert(yy[1]);
						//var people1 = [{'id':'73','foo':'bar'},{'id':'45','foo':'bar20'},{'id':'45','foo':'bar3'}];

						// var filterDouble = $scope.bras.filter(function(item, index, array){
						//   return item.city === "桃園市";    
						// });
						// alert(filterDouble[1].branchName); 
						// $log.debug(JSON.stringify($scope.trns));
						// $log.debug("in:" + $scope.trns.length);

					} else {
						framework.alert(error.respCodeMsg, function () {
							//framework.backToNative();
						});
					}

				// if( $scope.trns.length == 0){
				// 	framework.alert("您未申請約定轉出帳號，請洽本行營業單位辦理。", function () {
				// 		framework.backToNative();
				 	});
				// }
				//}, null, false);
			}
			
			function isCherries(fruit) { 
				return fruit.city === '台北市';
			}
			
			


			function getFJ000103() {
				var form = {};
				form.custId = $scope.custId;
				//form.applyAcct =$scope.applys[$scope.life].applyAcnt; 
				form.applyAcct = $scope.applys[$scope.life1].acctNo;
				//alert($scope.applys[$scope.life1].acctNo);
				form.applyCurr = $scope.coin[$scope.life22];
				//alert($scope.coin[$scope.life2]);
				form.custChName = $scope.custChName;
				form.custEnName = $scope.custEnName;
				if(($scope.life2 == 1 )|| ($scope.life2 == 3)){
					var ymd =birthday.value.split('-')
					form.certDate = ((ymd[0]-1911)+ymd[1]+ymd[2]);}
				else{
					var ymd1 =birthday1.value.split('-')
					form.certDate = ((ymd1[0]-1911)+ymd1[1]+ymd1[2]);}

				
				form.chooseAmt = $scope.life2;
				form.applyAmount = $scope.applyAmount;
				form.amountLang = $scope.life3;

				if($scope.life5 == 4){form.amountPurpose = $scope.amountPurpose}
				else{form.amountPurpose = $scope.life5;}
				form.addrItem= $scope.life44;

				if($scope.life44 == 1){form.sendAddr=$scope.residenceAddr;}
				else if($scope.life44 == 2){form.sendAddr=$scope.noticeAddr;}
				else if($scope.life44 == 3){form.sendAddr=$scope.companyAddr;}
				else if($scope.life44 == 4){form.sendAddr=$scope.sendAddr;}
				//else{form.sendAddr=$scope.bras[$scope.life6].branchId+'('+$scope.bras[$scope.life6].branchName+')';}
				else{form.sendAddr=$scope.resu[$scope.life7]}

				form.contactPhone = $scope.contactPhone;
				form.mobilePhone = $scope.mobilePhone;
				
				form.fee = $scope.fee.toString();
				form.postFee = $scope.postFee.toString();
				form.copy = $scope.copy.toString();
				form.trnsOutAcct = $scope.trns[$scope.life8].acctNo;
				form.email = $scope.email;
				form.trnsToken = $scope.trnsToken;
				//紀錄收件地址
				form.life44 = $scope.life44;
				//防呆......
				console.log(JSON.stringify(form));
				//alert(JSON.stringify(form));
				
				//$log.debug("fi000701 req:" + JSON.stringify(form));
				//qrCodePayTelegram.send('qrcodePay/f5000105', form, function (res, error) {
				securityServices.send('qrcodePay/fj000103', form, $scope.defaultSecurityType, function(res, error){
				$log.debug("fj000103 res:" + JSON.stringify(res));
					if (res) {
						// if (res.cardTime == null) {
						// 	chkReturnStatus(res.respCodeMsg);
						// 	return;
						// }
						var params = {
							form9:form,
							result:res
							// result:fq000201res
						};
						$state.go('ApplyResult',params,{location: 'replace'});
						
						
					} else {
						framework.alert(error.respCodeMsg, function () {
							$state.go('ApplyResult',params,{location: 'replace'});
							//framework.backToNative();
						});
					 }
				
			}, $scope.sslkey);
			}

			qrcodePayServices.getLoginInfo(function (res) {
				//保留 custId
				$scope.custId = res.custId;
				//$log.debug("f5000101:"+JSON.stringify(res));
				//alert(JSON.stringify(res));
				
				getFJ000102();
			});

			$scope.clickSubmit = function () {
				//getFJ000103();
				// alert("999"+$scope.defaultSecurityType);
				// alert("999"+JSON.stringify($scope.defaultSecurityType));

				// var loIsDate = new Date(birthday.value);
				// var loIsDate1 = new Date(birthday1.value);
				// alert($scope.life5);
				// if((loIsDate == "Invalid Date")||(loIsDate1 == "Invalid Date")) {framework.alert("請選擇交易日期");}
				//alert($scope.custEnName);
				if($scope.defaultSecurityType.key=='SSL' && $scope.sslkey == ""){framework.alert("請輸入SSL密碼");}
				else if ($scope.life1 == null ){framework.alert("請輸入申請帳號");}
				else if (($scope.custEnName == null ||$scope.custEnName =="")&& $scope.life3 ==2){framework.alert("請輸入英文姓名");}
				else if ($scope.life22 == null ){framework.alert("請輸入幣別");}
				else if ($scope.life3 == null ){framework.alert("請輸入金額表示方式");}
				else if ($scope.applyAmount == null && ($scope.life2 ==2 || $scope.life2 == 4)){framework.alert("請輸入申請金額");}
				else if ($scope.life2 == null ){framework.alert("請輸入餘額表示方式");}
				else if ($scope.life2 == (1||3) && $scope.message == null){framework.alert("請輸入申請日期");}
				else if ($scope.life2 == (2||3) && $scope.message1 == null){framework.alert("請輸入申請日期");}
				else if ($scope.life5 == null ){framework.alert("請輸入申請金額用途");}
				else if ($scope.life5 == 4 && ($scope.amountPurpose == null ||$scope.amountPurpose == "")){framework.alert("請輸入申請金額用途其他");}
				else if ($scope.life44 == null ){framework.alert("請輸入指定收件地址");}
				else if ($scope.life44 == 5 && $scope.life6 == null){framework.alert("請輸入自取縣市");}
				else if ($scope.life44 == 5 && $scope.life7 == null){framework.alert("請輸入自取分行");}
				else if ($scope.life44 == 4 && ($scope.sendAddr == null || $scope.sendAddr =="")){framework.alert("請輸入地址");}
				else if ($scope.mobilePhone == null ){framework.alert("請輸入行動電話");}
				else if ($scope.contactPhone == null ){framework.alert("請輸入聯絡電話");}
				else if ($scope.copy == null ){framework.alert("請輸入份數");}
				else if ($scope.life8 == null ){framework.alert("請輸入扣款帳號");}
				else if ($scope.email == null ){framework.alert("請輸入Email");}
				else if ($scope.copy > 20 ){framework.alert("請輸入份數為小於20");}
				else if (!validateEmail($scope.email)){framework.alert("請輸入正確email格式");}
				else {getFJ000103();}
				

				
				// var params = {
				// 	// form9:$scope.form,
				// 	// result:res
				// 	// result:fq000201res
				// };
				// $state.go('ApplyResult',params,{location: 'replace'});
				
			}
				
			function validateEmail(email) {
				var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(String(email).toLowerCase());
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
			
			$scope.wwee =function(){
				if($scope.life2 == '1'|| $scope.life2 =='3'){
					$scope.ppp=1;
					//alert($scope.ppp);
				}
				else if($scope.life2 == '2'||$scope.life2 =='4'){
					$scope.ppp=2;
					//alert($scope.ppp);
				}
			}

			$scope.clickBack = function () {
				//alert(JSON.stringify($scope.example.value.getDay()));
				//alert("gggg"+$scope.life1);
				//alert("ffff"+$scope.applys[$scope.life1].curr);
				framework.backToNative();
			}

			$scope.clickBack2 = function () {
				//alert(JSON.stringify($scope.example.value.getDay()));
				//alert("gggg"+$scope.life1);
				//alert("ffff"+$scope.applys[$scope.life1].curr);
				var ww= $scope.applys[$scope.life1].curr.split(',');
					$scope.coin =ww ;
					//framework.backToNative();
			}
			//回上頁
			//$scope.clickCancel = $scope.clickDisAgree;
			//點選返回
			//$scope.clickBack = $scope.clickDisAgree;

			$scope.clickBack3 = function () {
				//alert(JSON.stringify($scope.example.value.getDay()));
				//alert("gggg"+$scope.life6);
				//alert("ffff"+$scope.city[$scope.life6]);
				var filterDouble = $scope.bras.filter(function(item, index, array){
					return item.city === $scope.city[$scope.life6];    // 取得陣列中雙數的物件
				  });
				  //alert(filterDouble[1].branchName);
				  $scope.resu= filterDouble.map(a =>a.branchName);
				  //alert($scope.resu);
				  $scope.resu1 = filterDouble.map(b =>b.branchId);
				
			}

			$scope.clickBack4 = function () {
			//alert($scope.resu1[$scope.life7]);

			}
	//=====[ END]=====//
})

});