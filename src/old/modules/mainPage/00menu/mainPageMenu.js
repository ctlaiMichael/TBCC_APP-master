/**
 * [首頁Ctrl]
 */
define([
	'app'
	, 'modules/directive/banner/mainPageBannerDirective'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'service/formServices'
	, 'service/messageServices'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/service/qrcodePay/securityServices'
	, 'modules/service/common/openAppUrlServices'
	, 'components/hitrust/HtStartApp'
	//, 'modules/telegram/qrcodePay/qrcodePayTelegram'
], function (MainApp) {

	//=====[START]=====//
	MainApp.register.controller('mainPageMenuCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n, sysCtrl
			, $rootScope, $timeout, framework, $sce
			, stringUtil
			, $window
			, $log
			, telegram
			, formServices, messageServices, qrCodePayTelegram
			, qrcodePayServices
			, securityServices
			, openAppUrlServices
			, $css
			//,qrCodePayTelegram
		) {
			$css.add('ui/newMainPage/css/main.css');
			$scope.trustAsHtml = $sce.trustAsHtml;
			//==參數設定==//
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			var prefix = location.href;
			prefix = prefix.substring(0, prefix.indexOf('/www/')) + '/www/';
			localStorage.setItem("noSelect","0");
			localStorage.setItem("twPay",'0')
			localStorage.setItem("mBank",'0')

			// alert(localStorage.getItem("custId"));
			
			// if( localStorage.getItem("custId")=="F121374529" ){
					
			// 	$state.go('9700',{});
				
				   
			// }
			
			//$state.go('9700',{});
			//model=iPad 縮圖
			//apple refer:Identifier  https://www.theiphonewiki.com/wiki/Models
			
			$scope.imageClass = "";
			$scope.bannerClass = "home_ad_banner";
			$scope.bannerImageClass = "swiperslide";
			if(OpenNactive){
				var model = device.model;
				if (model.indexOf("iPad") > -1) {
					$scope.imageClass = "image_iPad";
					$scope.bannerClass = "home_ad_banner_ipad";
					$scope.bannerImageClass = "swiperslide_ipad";
				}
			}

			//check screen
			var windowHeight = 0, windowWidth = 0;
			var checkScreenSize = function () {
				if (typeof (window.innerWidth) == 'number') {
					windowHeight = window.innerHeight;
					windowWidth = window.innerWidth;
				} else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
					windowHeight = document.documentElement.clientHeight;
					windowWidth = document.documentElement.clientWidth;
				} else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
					windowHeight = document.body.clientHeight;
					windowWidth = document.body.clientWidth;
				}
				return [windowWidth, windowHeight];
			}

			var aaa = 2 ; 
			$scope.bbb = aaa;
			//if(device.platform == "iOS") $scope.bbb = 1 ;

			var screenSize = checkScreenSize();
			var screenWidth = screenSize[0];
			var screenHeight = screenSize[1];
			

			//分頁 點點點 的位置
			// var siteH = screenHeight - Math.round(screenHeight*0.175) - 16;
			// // console.log(screenHeight + ' ' + Math.round(screenHeight*0.175));
			// $scope.myPagination = {
			// 	"position" : "absolute",
			// 	"top" : siteH+"px"
			// }

			//首頁menu
			var iconPath = "ui/newMainPage/image/";
			$scope.basemenu = [
				{
					group: 1,
					url: "latestNews",
					itemName: "最新消息",
					iconName: iconPath + "1.png",
					iconClass: "icon_news"
				}, {
					group: 1,
					url: "financialInformation",
					itemName: "金融資訊",
					iconName: iconPath + "2.png",
					iconClass: "icon_finance"
				}, {
					group: 1,
					url: "financialTreasury",
					itemName: "理財金庫",
					iconName: iconPath + "3.png",
					iconClass: "icon_money"
				}, {
					group: 2,
					url: "medicalService",
					itemName: "醫療服務",
					iconName: iconPath + "4.png",
					iconClass: "icon_medical"
				}, {
					group: 2,
					url: "mBank",
					itemName: "行動網銀",
					iconName: iconPath + "5.png",
					iconClass: "icon_bank"
				}, {
					group: 2,
					url: "servicePoint",
					itemName: "服務據點",
					iconName: iconPath + "6.png",
					iconClass: "icon_service"
				}, {
					group: 3,
					url: "insuranceServices",
					itemName: "產壽險服務",
					iconName: iconPath + "7.png",
					iconClass: "icon_insurance"
				}, {
					group: 3,
					url: "twPay",
					itemName: "合庫E Pay",
					iconName: iconPath + "8.png",
					iconClass: "icon_pay"
				}, {
					group: 3,
					url: "robot",
					itemName: "智能客服",
					iconName: iconPath + "robot-icon.png",
					iconClass: "icon_robot"
				}, {
					group: 4,
					url: "creditCard",
					itemName: "信用卡",
					iconName: iconPath + "10.png",
					iconClass: "icon_creditcard"
				}, {
					group: 4,
					url: "stock",
					itemName: "下單開戶",
					iconName: iconPath + "11.png",
					iconClass: "icon_stock"
				},{
				 	group: 4,
				 	url: "reservation",
					
					itemName: "線上取號",
				 	
				 	iconName: iconPath + "15.png",
				 	iconClass: "icon_reservation"
				},{group: 5,
					url: "einvoice",
					itemName: "雲端發票",
					iconName: iconPath + "13.png",
					iconClass: "icon_einvoice"
				}, 
				{
					group: 5,
					url: "t-wallet",
					itemName: "HCE",
					iconName: iconPath + "14.png",
					iconClass: "icon_stock"
				}
				// [20190508 需求單移除]
				// {
				// 	group: 5,
				//     url: "lifeInformation",
                // 	itemName: "生活資訊",
                // 	iconName: iconPath + "9.png",
                // 	iconClass: "icon_life"
				// }
			];
			//首頁icon
			$scope.page = [];                            //第1頁menu
			$scope.showPage = false;                    //點點點顯示
			var totalIconCount = $scope.basemenu.length; //總數量
			var limitPageIcon = 12;                      //每頁icon數, default 12
			var limetScreen = 500;                       //螢幕小於該值,變更icon數量, default 500
			if ((screenHeight >= limetScreen) || ($scope.imageClass == "image_iPad")) {
				limitPageIcon = 12;                      //每頁icon數
			} else {
				limitPageIcon = 9;                       //每頁icon數
			}
			//icon分頁
			//產生分頁
			pageLength = Math.ceil($scope.basemenu.length / limitPageIcon);
			for (var i = 0; i < pageLength; i++) {
				var menu = [];
				$scope.page.push(menu);
			}
			//將icon放入分頁
			for (i in $scope.basemenu) {
				var pageIndex = Math.floor(i / limitPageIcon);
				$scope.basemenu[i].group = Math.floor((i % limitPageIcon) / 3) + 1;
				$scope.page[pageIndex].push($scope.basemenu[i]);
			}

			//台灣Pay
			var errorCallback = function () {
				//console.log("DDDDD ERROR");
				$state.go('mainPageMenu',{});
			}

			//檢查是否已登入
			var dt = stringUtil.formatDate(new Date());
			var loginStatus = false;
			$scope.onTimeout = function(){
				loginStatus = sysCtrl.isLogined();
				// $log.debug("main... isLogined  Date0:"+dt + " status:"+ loginStatus );
				mytimeout = $timeout($scope.onTimeout,300);
			};
			var mytimeout = $timeout($scope.onTimeout,300);
			$scope.isLogined = function () {
				// $log.debug("main... isLogined  Date1:"+dt + " status:"+ loginStatus );
				return loginStatus;
				// return sysCtrl.isLogined();
			}

			//登出
			$scope.logout = function () {
				sysCtrl.logout();
				$scope.isLogined();
			}

			// if(loginStatus == true && localStorage.getItem("9700")=='0'){
				
			// 	$state.go('9700',{});
			// 	localStorage.setItem("9700","1");
			// }
			
			/**
			 * 點選功能換頁
			 */
			$scope.clickMenu = function (url) {
				
				//最新消息
				if (url == 'latestNews') {
					plugin.main.news(function () { }, function () { });
				}
				//金融資訊
				if (url == 'financialInformation') {
					//alert(url);
					plugin.main.financeinfo(function () { }, function () { });
				}
				//理財金庫
				if (url == 'financialTreasury') {
					//alert(url);
					plugin.main.funds(function () { }, function () { });
				}
				//醫療服務
				if (url == 'medicalService') {
					plugin.main.hospital(function () { }, function () { });
				}
				//行動網銀
				if (url == 'mBank') {	
					if(localStorage.getItem("mBank")!='1'){
						plugin.main.mobliebank(function () { }, function () { });
					}

				}
				//服務據點
				if (url == 'servicePoint') {
					plugin.main.servicesite(function () { }, function () { });
				}
				//產壽險服務
				if (url == 'insuranceServices') {
					plugin.main.insurance(function () { }, function () { });
				}
				//台灣Pay
				if (url == 'twPay') {
					if(localStorage.getItem("twPay")!='1'){
					if (OpenNactive) {
						sysCtrl.loging(
							function () {	//登入後動作
								$window.localStorage.setItem("firstLoginTaiwanPay", "Y");
								// location.href = prefix + 'taiwan_pay.html';
								plugin.main.taiwanPay(function () { }, function () { })
							},
							errorCallback//登入失敗動作
						);
						// plugin.tcbb.getSessionID(function (rtnSession) {
						// 	if (rtnSession.value == null || rtnSession.value == '') {
						// 		var onSuccess = function (aa) {
						// 			$window.localStorage.setItem("firstLoginTaiwanPay", "Y");
						// 			plugin.main.taiwanPay(function () { }, function () { });
						// 		};
						// 		var onError = function (error) {
						// 			//console.log("DDDDD failed: " + error.error);
						// 		}
						// 		plugin.tcbb.doLogin(onSuccess, onError);
						// 	} else {
						// 		$window.localStorage.setItem("firstLoginTaiwanPay", "Y");
						// 		plugin.main.taiwanPay(function () { }, function () { });
						// 	}
						// }
						// 	, errorCallback);
					}
					}
				}
				//生活資訊
				if (url == 'lifeInformation') {
					plugin.main.easy(function () { }, function () { });
				}
				//信用卡
				if (url == 'creditCard') {
					// location.href = prefix + 'card.html';
					plugin.main.creadit(function () { }, function () { });
				}
				//合庫證券
				if (url == 'stock') {
					//openAppUrlServices.openApp("tcbb_securities"); //開啟app, 如果不存在則顯示store
					// var stock_URL="http://luckydraw.tcfhc-sec.com.tw/websites/web20181015/index.html";
					// if (url == 'stock') {
					// 	plugin.main.bannerWeb(stock_URL, function () { }, function () { });

					// }
					var stock_URL="http://luckydraw.tcfhc-sec.com.tw/websites/web20181015/index.html";
					openAppUrlServices.openWeb(stock_URL);
				}
				//線上預約
				var onlineReservation_URL="https://otn.tcb-bank.com.tw/Acweb/";
				if (url == 'reservation') {
					plugin.main.bannerWeb(onlineReservation_URL, function () { }, function () { });
								
				}
				//行動支付
				if (url == 't-wallet') {
					openAppUrlServices.openApp("twmp"); //開啟app, 如果不存在則顯示store
				}
				//雲端發票-手機載具申請
				if (url == 'einvoice') {
					var title = '將啟動手機瀏覽器，連線到財政部電子發票整合服務平台';
					var message = '是否要申請雲端發票載具(手機條碼)？';
					framework.confirm(message, function (ok) {
						if (ok) {
							var applyBarcode_URL = "https://www.einvoice.nat.gov.tw/APMEMBERVAN/GeneralCarrier/generalCarrier";
							openAppUrlServices.openWeb(applyBarcode_URL); //開啟Web
						}
					}, title);

				}
				// 智能客服
				if (url == 'robot') {
					var robotUrl = framework.getConfig("ROBOT_URL");
					if (device.platform == "iOS") {
						plugin.main.openUrl(function () { }, function () { }, "https://robot.tcb-bank.com.tw:8443/wise?ch=app", "智能客服");
					} else {
						plugin.main.bannerWeb(robotUrl, function () { }, function () { });
					}
				}

			}

			//<-- 首頁廣告 BEG -->
			// 改由 'directive/mainPageBannerDirective' 處理
			//<-- 首頁廣告 END -->

			//<-- Initialize Swiper -->
			var swiper = new Swiper('.swiper-container', {
				pagination: {
					el: '.swiper-pagination',
				},
				observer: true,//修改swiper自己或子元素時，自動初始化swiper
				observeParents: true,//修改swiper的父元素時，自動初始化swiper
			});


		});
	//=====[END]=====//


});
//=====[首頁 END]=====//
