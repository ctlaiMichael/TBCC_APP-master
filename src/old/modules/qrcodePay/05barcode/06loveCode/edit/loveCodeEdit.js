/**
 * [捐贈碼 Ctrl]
 */
define([
	'app'
	, 'modules/directive/barcodeLeftMenu/barcodeLeftMenuDirective.js'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'service/formServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('loveCodeEditCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n, 
			$rootScope, $timeout, framework, 
			qrcodePayServices, 
			qrCodePayTelegram, 
			qrcodeTelegramServices, 
			formServices
		) {
			const DebugMode = framework.getConfig("OFFLINE", 'B');
			const OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			$scope.showLoveCode = false;
			$scope.ShowList = "N";
			let mobileBarcode = "";
			let defaultBarcode = "";

			//取得捐贈碼
			qrcodePayServices.getLoginInfo(function (res) {
				var form = {
					txnType: 'T'
				};
				form.custId = res.custId;
				qrCodePayTelegram.send('qrcodePay/fq000101', form, function (res) {
					// console.log(JSON.stringify(res));
					if (res) {
						$scope.showLoveCode = true;
						if (typeof res.loveCode == "undefined" || res.loveCode == "") {
							$scope.keyword = "";
							$scope.orgLoveCode = "未設定捐贈碼";
						} else {
							$scope.orgLoveCode = res.loveCode; 
							$scope.orgSocialWelfareName = res.loveCodeName; 
						}
						if (typeof res.mobileBarcode == "undefined" || res.mobileBarcode == "") {
							mobileBarcode = "";
						} else {
							mobileBarcode = res.mobileBarcode;
						}
						if (localStorage.getItem("defaultBarcode") != null) {
							defaultBarcode = localStorage.getItem("defaultBarcode");
						} else if (mobileBarcode !== "") {
							defaultBarcode = "1";
						} else if ($scope.orgLoveCode !== "未設定捐贈碼"){
							defaultBarcode = "2";
						}
					} else {
						framework.alert("捐贈碼讀取失敗", function () {
							// qrcodePayServices.closeActivity();  //back to 台灣Pay
							return;  //停留原頁
						});
					}
				}, null, false);
			});


			//點選搜尋按鈕
			$scope.clickSearch = function () {
				//清空已選擇的捐贈碼
				$scope.selectedLV = "";
				
				//檢查關鍵字
				if (($scope.keyword == "") || (typeof $scope.keyword == 'undefined')) {
					framework.alert("請輸入關鍵字  ");
					return;
				}
				//關鍵字須為數字或英文字母或中文字
				// var res = /^[A-Za-z|0-9|\u4E00-\u9FA5]+$/;
				// if (!res.test($scope.keyword)) {
				// 	framework.alert("關鍵字須為數字或英文字母或中文字  ");
				// 	return;
				// }

				//檢核無誤送出電文
				var form = {};
				form.keyword = $scope.keyword;
				// console.log(JSON.stringify(form));
				qrCodePayTelegram.send('qrcodePay/fq000406', form, function (res,error) {
					// console.log(JSON.stringify(res));
					if (res) {
						var newres = qrcodePayServices.convertRes(res);
						// console.log(JSON.stringify(newres));
						if (typeof newres == "string") {
							framework.alert(newres, function () {
								$state.go('loveCodeEdit', {});
								return;
							});
						} else {
							//開啟查詢清單
							$scope.ShowList = "Y";

							if (typeof newres.details == 'undefined') {
								$scope.loveCodeCount = 0;
							}else {
								$scope.loveCodeCount = newres.details.length;
							}
							
							if ($scope.loveCodeCount > 0) {
								$scope.queryLV = {};
								$scope.queryLV = newres.details.map(function (inp) {
									var newinp = {};
									newinp.rowNum = inp.rowNum;
									newinp.SocialWelfareBAN = inp.SocialWelfareBAN;
									newinp.LoveCode = inp.LoveCode;
									newinp.SocialWelfareName = inp.SocialWelfareName;
									newinp.SocialWelfareAbbrev = inp.SocialWelfareAbbrev;
									newinp.lvClassType = inp.rowNum % 2 == 0 ? 'invest':'invest2'
									return newinp;
								});
								// console.log(JSON.stringify($scope.queryLV));
							}
						}
					} else {
						framework.alert(error.respCodeMsg, function () {
							$state.go('loveCodeEdit', {});  //搜尋失敗,停留在捐贈碼編輯頁
							return;
						});
					}
				}, null, false);
			}
			
			//點選確認
			$scope.clickSubmit = function () {
				// console.log(typeof $scope.selectedLV);
				if ((typeof $scope.selectedLV == 'undefined') || ($scope.selectedLV == '') ) {
					framework.alert("請選擇捐贈碼喔！ ");
					return;
				}

				//關閉查詢清單
				$scope.ShowList = "N";

				//儲存捐贈碼到中台
				qrcodePayServices.getLoginInfo(function (res) {
					var form = {};
					form.custId = res.custId;
					form.loveCode = $scope.selectedLV.LoveCode; 
					form.socialWelfareName = $scope.selectedLV.SocialWelfareName; 
					form.mobileBarcode = mobileBarcode;
					form.defaultBarcode = (defaultBarcode === "" ? "2" : defaultBarcode);
					// console.log(JSON.stringify(form));
					qrCodePayTelegram.send('qrcodePay/fq000305', form, function (res) {
						// console.log(JSON.stringify(res));
						if (res) {
							$scope.keyword = $scope.selectedLV.LoveCode;
							$scope.orgLoveCode = $scope.selectedLV.LoveCode;
							$scope.orgSocialWelfareName = $scope.selectedLV.SocialWelfareName;
							framework.alert('捐贈碼儲存成功', function() {
								$state.go('getBarcodeShow', {});
							});
						} else {
							$scope.keyword = "";
							framework.alert("捐贈碼儲存失敗", function () {
								// qrcodePayServices.closeActivity();  //back to 台灣Pay
								return;  //停留原頁
							});
						}
					}, null, true);
				});
			}

			// 帶入關鍵字搜尋
			$scope.keyword = $stateParams.loveCodeKeyword;
			if ((typeof $scope.keyword == 'string') && ($scope.keyword.length > 0)) {
				$scope.clickSearch();
			}

			//隱藏清單
			$scope.hideLvList = function () {
				$scope.ShowList = "N";
			}

			//點選捐贈碼
			$scope.selectLV = function (inp) {
				$scope.selectedLV = inp;
			}

			//手機條碼
			$scope.clickGoToMobileBarcode = function () {
				$state.go('getBarcodeTerm', {});
			}

			/**
			 * 點選取消
			 */
			$scope.clickCancel = function () {
				qrcodePayServices.closeActivity();  //back to 台灣Pay
			}
			//點選返回
			$scope.clickBack = $scope.clickCancel;
			// document.addEventListener("backbutton", $scope.clickBack, false);

		});
	//=====[END]=====//
});