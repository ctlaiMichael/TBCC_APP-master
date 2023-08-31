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
	MainApp.register.controller('SearchResultCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $css, $log
			, qrcodeTelegramServices
			, qrcodePayServices
			, qrCodePayTelegram
		) {
			//==參數設定==//
			$css.add('ui/newMainPage/css/main.css');
			var DebugMode = framework.getConfig("OFFLINE", 'B');
			var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
			
			
			$scope.form9 = $stateParams.form9;
			var trnsToken;
			//FB000201-匯率查詢 
			function getF5000106() {
				var form = {};
				form.custId = $scope.form9.custId;
				form.exchangeType = $scope.form9.type;
				form.startDate = $scope.form9.startdate;
				form.startDate = form.startDate.replace(/[-]/g ,'');
				//alert(form.startDate);
				form.endDate = $scope.form9.endtdate;
				form.endDate = form.endDate.replace(/[-]/g ,'');
				form.trnsfrOutAccnt = "";
				

				var rates = [];
				
				//$log.debug("fi000701 req:" + JSON.stringify(form));
				qrCodePayTelegram.send('qrcodePay/f5000106', form, function (res, error) {
					$log.debug("f5000106 res:" + JSON.stringify(res));
					trnsToken = res.trnsToken;
					if (res) {
						if (res.details == null) {
							chkReturnStatus(res.respCodeMsg);
							return;
						}
                       rates = res.details.detail;
						rates = qrcodeTelegramServices.modifyResDetailObj(res.details.detail);
						
						$scope.ratess = [];
						//var a=1;
						for(var key in rates){
						
							$scope.ratess.push(rates[key]);
							
						
						}
						//alert("111"+JSON.stringify(rates));
						
                        }else{
                            framework.alert(resultHeader.respCodeMsg, function(){
                                qrcodePayServices.closeActivity();
                            });
                        }
						
                    });
            }

            
			

			//main
			qrcodePayServices.getLoginInfo(function (res) {
				//保留 custId
				//alert("aaa");
				$scope.custId = res.custId;
				getF5000106();
				
			});
			


			

			

			function chkReturnStatus(msg) {
				var errorMsg = (msg != "") ? msg : "查無相關資料";
				framework.alert(errorMsg, function () {
					framework.backToNative();
					return;
				}, "");
			}

			$scope.clickDisAgree = function () {
				//framework.backToNative();
				var params = {
				};
				$state.go('Search', params, {});
			}
			//點選返回
			$scope.clickBack = $scope.clickDisAgree;


			//註銷
			$scope.clickSubmit =function(aa,bb,cc,dd,ee,ff,gg,hh){
				//alert(JSON.stringify(dd));
				//alert(JSON.stringify(ppp));
				//alert(trnsToken);
				$scope.form9 = {};
				$scope.form9.trnsfrDate = aa;
				$scope.form9.orderNo = bb;
				$scope.form9.trnsfrOutAccnt=cc;
				$scope.form9.trnsfrInAccnt=dd;
				$scope.form9.trnsfrCurr=ee;
				$scope.form9.trnsfrAmount=ff;
				$scope.form9.subType=gg;
				$scope.form9.note=hh;
				$scope.form9.trnsToken = trnsToken;
				//$scope.form9.defaultSecurityType = $scope.defaultSecurityType;

				var params = {
					form9 : $scope.form9
					
				};
				$state.go('SearchAndWriteOffCheck', params, {});
			}






		});
	//=====[ END]=====//


});