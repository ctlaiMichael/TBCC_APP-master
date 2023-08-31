/**
 * [playBanner Directive] 輪播banner directive
 */
define([
	'app'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
], function (MainApp) {

	MainApp.register.directive('mainPageBannerDirective', function (
		$window, $log, qrCodePayTelegram, framework
	) {
		var linkFun = function ($scope, iElm, iAttrs, controller) {

			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			//<-- 首頁廣告 BEG -->
			$scope.BannerInfo = [];
			$scope.totalAdImg = [];
			$scope.adimg = [];
			//呼叫getBannerInfo取得id/url	
			var getdt = function () {
				//for test
				//console.log("TTTTT 1:"+getdt());
				return new Date();
			}
			//取得廣告Banner內容
			if(OpenNactive){
				plugin.tcbb.getBannerInfo(function (res) {
					//console.log("EEEEE getBannerInfo:"+JSON.stringify(res)); 
					var banner = res.banner;
					$scope.banner = banner.map(function (x) {
						return { 'BANNER_ID': x.Banner_ID, 'Banner_URL': x.Banner_URL };
					});
					var form = {};
					form.BannerDetails = {}
					form.BannerDetails.detail = banner.map(function (x) {
						return { 'BANNER_ID': x.Banner_ID };
					});
					// console.log(JSON.stringify(form));

					//重試三次
					$scope.retryCount = 3;
					$scope.query503 = function( form , count ) {
						if (count >= $scope.retryCount) {
							return;
						}
						//test
						// if (count > 0) {
						// 	alert("count>0");
						// 	return;
						// }
						// console.log("query503");
						qrCodePayTelegram.send('qrcodePay/fb000503', form, function (res) {
							if (res.BannerDetails) {
								$scope.tempBannerImgs = res.BannerDetails.BannerDetail;
								$scope.displayBanner();
							}else{
								count = count + 1;
								// console.log(count);
								$scope.query503(form, count);
							}
						}, null, true);
					}
					$scope.query503(form,0);
					//fb000503取得banner圖檔,
					//HTML base64處理:ng-src="data:image/png;base64,{{item.BANNER_IMG}}"
					$scope.displayBanner = function() {
					// qrCodePayTelegram.send('qrcodePay/fb000503', form, function (res) {
						// console.log("EEEEE qrCodePayTelegram:"+JSON.stringify(res));
						var bannerImgs = $scope.tempBannerImgs; //res.BannerDetails.BannerDetail;
						//console.log(JSON.stringify(bannerImgs));
						//因為getBannerInfo取得的banner_id 與fb000503取得的banner_id長度不一樣 --> 先用indexOf判斷
						var imgIdx = 0;
						var tmp_value = "";
						var tmp_exit = "";
						for (var key in bannerImgs) {
							tmp_value = bannerImgs[key];
							// console.log(JSON.stringify(tmp_value));
							// console.log("beg for bannerImgs");
	
							if (typeof tmp_value === 'object') {
								// console.log('BANNER_ID:'+ bannerImgs[key].BANNER_ID);
								// console.log('BANNER_IMG:'+ bannerImgs[key].BANNER_IMGE);
								// console.log('IMG_TYPE:'+ bannerImgs[key].IMG_TYPE);
								var tempObj = {};
								tempObj.seq = imgIdx;
								//console.log(JSON.stringify($scope.banner));
								var ok_flag = "";
								for (var name in $scope.banner) {
									var bannerx = $scope.banner[name];
									if (bannerx.BANNER_ID.indexOf(bannerImgs[key].BANNER_ID) > -1 || ok_flag == "") {
										tempObj.Banner_URL = $scope.banner[key].Banner_URL;
										//console.log('Banner_URL1:'+ bannerx.Banner_URL);	
										ok_flag = "y";
									} else {
										tempObj.Banner_URL = "https://www.tcb-bank.com.tw";
									}
									if (ok_flag == "y") { break; };
								}
								tempObj.BANNER_IMG = bannerImgs[key].BANNER_IMG;
								$scope.totalAdImg[imgIdx] = tempObj;
								imgIdx = imgIdx + 1;
							} else {
								//只有一筆banner
								// console.log('BANNER_ID:'+ bannerImgs.BANNER_ID);
								// console.log('BANNER_IMG:'+ bannerImgs.BANNER_IMGE);
								// console.log('IMG_TYPE:'+ bannerImgs.IMG_TYPE);
								var tempObj = {};
								tempObj.seq = imgIdx;
								//console.log("$scope.banner:"+JSON.stringify($scope.banner));
								var bannerx = $scope.banner[0];
								if (bannerx.BANNER_ID.indexOf(bannerImgs.BANNER_ID) > -1) {
									tempObj.Banner_URL = bannerx.Banner_URL;
									//console.log('Banner_URL:'+ bannerx.Banner_URL);				
								} else {
									tempObj.Banner_URL = "https://www.tcb-bank.com.tw";
								}
								tempObj.BANNER_IMG = bannerImgs.BANNER_IMG;
								$scope.totalAdImg[imgIdx] = tempObj;
								tmp_exit = "y";
							}
							if (tmp_exit == "y") { break; }
						}
						//console.log("EEEEE $scope.totalAdImg:"+JSON.stringify($scope.totalAdImg));
						$scope.reset(-1);
						$scope.showimg();
					// }, null, true);
					}
				}, function (err) {
					//console.log(JSON.stringify(err));
				});
			}
			

			//廣告輪播
			var bannerRunCount = 1; //計數
			var everyTimeShowBanner = 5; //每次筆數
			var bannerTotalCount = 0; // 圖片總數 
			var itemsCount = 0; // 圖片每次個數 

			$scope.showimg = function () {
				// $log.debug('EEEEE totalAdImg ------> cnt:'+$scope.totalAdImg.length);
				// $log.debug('EEEEE adimg ------> cnt:'+$scope.adimg.length);
				bannerTotalCount = $scope.totalAdImg.length; // 圖片總數 
				everyTimeShowBanner = bannerTotalCount + 1;
				itemsCount = $scope.adimg.length; // 圖片每次個數
				//console.log("TTTTT 6:"+getdt());
				var swiper1 = new Swiper('.module01 .swiper-container', {
					pagination: {
						el: '.module01 .swiper-pagination',
					},
					autoplay: {
						delay: 5000,
						stopOnLast: true,
						disableOnInteraction: false,
					},
					observer: true,//修改swiper自己或子元素時，自動初始化swiper
					observeParents: true,//修改swiper的父元素時，自動初始化swiper
				});

				//console.log("TTTTT 7:"+getdt());
				var swiperExec = function (cnt) {
					swiper1.autoplay.stop();
					$scope.reset(cnt);
					swiper1.activeIndex = 0;
					swiper1.autoplay.start();
				}

				swiper1.on('slideChange', function () {
					//console.log("TTTTT a1:"+getdt());
					bannerRunCount = bannerRunCount + 1;
					//console.log('slide activeIndex:'+swiper1.activeIndex+' [slide changed] bannerRunCount:'+bannerRunCount);
					if (swiper1.isEnd) {
						//console.log('slide isEnd:'+swiper1.isEnd+' bannerTotalCount1:'+bannerTotalCount+' bannerRunCount1:'+bannerRunCount);
						//本批廣告總筆數 > 每次限額筆數 
						if (bannerTotalCount > everyTimeShowBanner) {
							itemsCount = $scope.adimg.length;// 圖片每次個數
							//console.log('bannerTotalCount2:'+bannerTotalCount+' bannerRunCount2:'+bannerRunCount+' itemsCount:'+itemsCount);
							//總計數 > 本批廣告總筆數 要 reset
							if (bannerRunCount >= bannerTotalCount) {
								bannerRunCount = 0;
								swiperExec(-1);
							} else {
								//總計數 % 每次限額筆數 => 換下一輪
								if (bannerRunCount % everyTimeShowBanner == 0) {
									swiperExec(bannerRunCount);
								}
							}
						}
					}
					//console.log("TTTTT a2:"+getdt());
				});
				swiper1.on('reachBeginning', function () {
					//console.log("TTTTT b1:"+getdt());
					if (bannerTotalCount > everyTimeShowBanner) {
						bannerRunCount = bannerRunCount + 1;
						if ((bannerRunCount % everyTimeShowBanner == 1) && (bannerRunCount == bannerTotalCount)) {
							bannerRunCount = 1;
							swiperExec(-1);
						} else {
							swiper1.autoplay.stop();
							swiper1.autoplay.start();
						}
					} else {
						bannerRunCount = 0;
					}
					//console.log("TTTTT b2:"+getdt());
				});
			}

			//menu重設
			$scope.reset = function (runcount) {
				//console.log("$scope.reset:"+runcount);
				var totalAdImgCount = $scope.totalAdImg.length;
				$scope.adimg.length = 0;
				var checkCount = 0;
				var j = 0

				if (runcount > 0) {
					checkCount = runcount + everyTimeShowBanner;
					// console.log("$runcount:"+runcount);
					// console.log("$everyTimeShowBanner:"+everyTimeShowBanner);
					// console.log("$checkCount:"+checkCount);
					if (checkCount < totalAdImgCount) {
						for (var i = runcount; i < checkCount; i++) {
							$scope.adimg[j] = $scope.totalAdImg[i];
							j++;
						}
					} else {
						//最後一輪
						for (var i = runcount; i < totalAdImgCount; i++) {
							$scope.adimg[j] = $scope.totalAdImg[i];
							j++;
						}
					}
					// console.log("AAAAA $scope.adimg.length a:"+$scope.adimg.length);
					// console.log("AAAAA $scope.totalAdImg.length a:"+$scope.totalAdImg.length);
				} else {
					//初始化：runcount=-1
					if (totalAdImgCount > everyTimeShowBanner) {
						//copy 1-5
						for (var i = 0; i < everyTimeShowBanner; i++) {
							$scope.adimg[i] = $scope.totalAdImg[i];
						}
					} else {
						//copy all
						for (var i = 0; i < totalAdImgCount; i++) {
							$scope.adimg[i] = $scope.totalAdImg[i];
						}
					}
					// console.log("AAAAA $scope.adimg.length b:"+$scope.adimg.length);
					// console.log("AAAAA $scope.totalAdImg.length b:"+$scope.totalAdImg.length);
				}
			}

			//click ad & popup
			$scope.clickMenu_ad = function (url) {
				//console.log("bannerWeb:"+url);
				if (url != "") {
					plugin.main.bannerWeb(url, function () { }, function () { });
				}
			}
			//<-- 首頁廣告 END -->

			//console.log("TTTTT 8:"+getdt());
		};
		return {
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			replace: false,
			templateUrl: 'modules/directive/banner/display_banner.html',
			link: linkFun
		};
	});
	//=====[checkCaptchaDirective END]=====//

});