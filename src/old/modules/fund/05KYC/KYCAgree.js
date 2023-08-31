/**
 * [使用條款Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/telegram/qrcodePay/telegramServices'
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('KYCAgreeCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $css, $log
			, qrcodeTelegramServices,$window
			, qrcodePayServices
			, qrCodePayTelegram
			
		) {
			//==參數設定==//
			$css.add('ui/newMainPage/css/main.css');
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			//$scope.form6 = $stateParams.form6;

			// var coin =[];
			// $scope.item1 = ["就業中","退休","家管","學生","待業中","學齡前"];
			// $scope.item2 = ["軍警","政府機關","教育研究","經商","金融保險","電子資訊工程","建築營造","製造業","服務業","醫療","法律及會計業","自由業","博弈業","珠寶貴金屬業","武器戰爭設備","典當民間融資","其他：＿＿ "];
			// $scope.item3 = ["50萬元(未逾)","50萬以上～100萬元","100萬以上～300萬元","300萬以上～500萬元","500萬以上～1000萬元","1000萬以上～5000萬元","5000萬以上～1億元","1億以上～5億元","5億以上～10億元"];
			
			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				
			}

			$scope.clickSubmit = function () {	
				window.scrollTo(0, 0);
				var form = {};


				$scope.defaultSecurityType =[];
				var securityTypes = [];

				
				form.custId = $scope.custId;
				qrCodePayTelegram.send('qrcodePay/fi000603', form, function (res, error) {
					//res.isFirstKYC = "Y";
					console.log(JSON.stringify(res));
					
					if (res) {
						if(res.isFirstKYC == "Y"){
							//檢查是否有憑證與
							qrcodePayServices.getLoginInfo(function(res){
								$scope.tempCustid = res.custId;
								//安控
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
								if (!(securityTypes.length > 0)) {
									framework.alert('首次辦理KYC，您的行動裝置無合庫行動網銀轉帳機制，請洽營業單位申請。',function(){
										framework.backToNative();
									});
								}

								});
									var params = {
										result:res
									};
							$state.go('KYCBaseData',params,{location: 'replace'});
						}else {
							var params = {
								result:res
							};
							$state.go('KYCBaseData',params,{location: 'replace'});
						}
						
							
					} else {
						framework.alert(error.respCodeMsg, function(){
							//qrcodePayServices.closeActivity();
							framework.backToNative();
						});
					 }
					
				}, null, false);
				
			}

			$scope.clickBack = function () {
				
				framework.confirm('是否離開風險承受度測驗。',function(ok){
					if(ok){framework.backToNative()};
					//return;
				});
			}

			qrcodePayServices.getLoginInfo(function(res){
				$scope.custId = res.custId;
			});

		});
	//=====[ END]=====//


});