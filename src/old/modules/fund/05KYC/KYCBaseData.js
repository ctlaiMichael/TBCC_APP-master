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
	MainApp.register.controller('KYCBaseDataCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $css, $log
			, qrcodeTelegramServices
			, qrcodePayServices,$window
			, qrCodePayTelegram
			
		) {
			//==參數設定==//
			$css.add('ui/newMainPage/css/main.css');
			$css.add('ui/newMainPage/css/fund.css');
			qrcodePayServices.getLoginInfo(function (res) {
				$scope.custId = res.custId;
			});
			$scope.result = $stateParams.result;
			
			
			// $scope.resultt.resultList.detail[0].rcIndex = '6666';
			// alert($scope.resultt.resultList.detail[0].rcIndex);
			$scope.clickBack = function () {
				framework.confirm('是否離開風險承受度測驗。',function(ok){
					if(ok){framework.backToNative()};
					//return;
				});
			}

			$scope.clickSubmit = function () {	
				
				// qrCodePayTelegram.send('qrcodePay/fi000603', form, function (res, error) {
					if($scope.child == null){framework.alert("請輸入子女數")}
					else if($scope.sick == null){framework.alert("請輸入是否領有全民健保重大傷病證明")}
					//$log.debug("fi000608 res:" + JSON.stringify(res));
					// res = {"@xmlns:fi0":"http://mnb.hitrust.com/service/schema/fi000603","@xsi:type":"fi0:fi000603ResultType","custId":"B121194483","age":"26","vipFlag":"Y","count":"14","topicLists":
					// {"topic":{"0":{"rtIndex":"13","rtName":"1.請問您的年齡？","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"6","rcName":"19歲以下/76歲以上","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"7","rcName":"20~45歲","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"8","rcName":"46~55歲","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"9","rcName":"56~65歲","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"299","rcName":"66~75歲","linkRtIndex":{},"linkRcIndex":{}}}}},
					// "1":{"rtIndex":"14","rtName":"2.您的學歷為","multi":"Y","ansLists":{"answer":{"0":{"rcIndex":"11","rcName":"國中以下","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"12","rcName":"高中職","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"13","rcName":"大學/專科","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"32","rcName":"研究所以上","linkRtIndex":{},"linkRcIndex":{}}}}},
					// "2":{"rtIndex":"15","rtName":"3.您的職業為","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"17","rcName":"無（含家管、學生等）","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"18","rcName":"法律及會計業","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"33","rcName":"非金融保險業（法律及會計業除外）","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"325","rcName":"金融保險業","linkRtIndex":{},"linkRcIndex":{}}}}},
					// "3":{"rtIndex":"16","rtName":"4.您的個人/家庭年收入為（若為未成年人，請依其實際狀況填答）","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"19","rcName":"500萬元以上","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"20","rcName":"300萬元以上未達500萬元","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"21","rcName":"100萬元以上未達300萬元","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"22","rcName":"50萬元以上未達100萬元","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"311","rcName":"未達50萬元","linkRtIndex":{},"linkRcIndex":{}}}}},
					// "4":{"rtIndex":"17","rtName":"5.可供投資資金主要來源（單選）（若為未成年人，請依其實際狀況填答）","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"23","rcName":"退休金/儲蓄","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"24","rcName":"利息/租金收入/遺產繼承","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"25","rcName":"經營事業/餽贈","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"310","rcName":"投資收益","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"312","rcName":"薪資收入","linkRtIndex":{},"linkRcIndex":{}}}}},
					// "5":{"rtIndex":"18","rtName":"6.收入或資產可用於投資理財比例（不含自用住宅）","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"27","rcName":"未達10%","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"28","rcName":"10%以上未達25%","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"29","rcName":"25%以上未達50%","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"30","rcName":"50%以上","linkRtIndex":{},"linkRcIndex":{}}}}},
					// "6":{"rtIndex":"20","rtName":"7.預期未來一年的收入情形","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"34","rcName":"收入可能減少","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"35","rcName":"收入可能增加","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"36","rcName":"收入持平","linkRtIndex":{},"linkRcIndex":{}}}}},
					// "7":{"rtIndex":"21","rtName":"8.曾投資過的商品 (可複選)(未滿7歲者，僅可選填無投資經驗）","multi":"Y","ansLists":{"answer":{"0":{"rcIndex":"38","rcName":"無投資經驗","linkRtIndex":"22","linkRcIndex":"42"},"1":{"rcIndex":"39","rcName":"選擇權/期貨/衍生性金融商品/不保本之結構型商品","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"40","rcName":"保本型商品/儲蓄型保險/定存/貨幣型基金","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"41","rcName":"投資等級債券基金/債券/黃金/保本之結構型商品","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"313","rcName":"股票/股票型基金","linkRtIndex":{},"linkRcIndex":{}},"5":{"rcIndex":"314","rcName":"平衡型基金/投資型保單/高收益（非投資等級）債券基金/房地產","linkRtIndex":{},"linkRcIndex":{}}}}},
					// "8":{"rtIndex":"22","rtName":"9.投資理財經驗  (未滿7歲者，僅可選填無投資經驗）","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"42","rcName":"無投資經驗","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"43","rcName":"未達1年","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"44","rcName":"1年以上未達3年","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"286","rcName":"3年以上未達5年","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"306","rcName":"5年以上","linkRtIndex":{},"linkRcIndex":{}}}}},
					// "9":{"rtIndex":"106","rtName":"10.假設您的投資因市場波動出現虧損時，當虧損「持續」多久時間，您會調整投資金額？","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"121","rcName":"1年以上","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"122","rcName":"6個月～1年","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"123","rcName":"3～6個月","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"124","rcName":"1～3個月","linkRtIndex":{},"linkRcIndex":{}}}}},
					// "10":{"rtIndex":"155","rtName":"11.假設您的投資因市場波動出現虧損時，您會採取下列何種方式處理？","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"291","rcName":"立即賣出","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"292","rcName":"依自身停損點賣出不到一半","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"293","rcName":"依自身停損點賣出一半以上","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"315","rcName":"加碼買進","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"316","rcName":"繼續持有","linkRtIndex":{},"linkRcIndex":{}}}}},
					// "11":{"rtIndex":"156","rtName":"12.資金預計投資期限","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"295","rcName":"未達1年","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"296","rcName":"1年以上未達2年","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"297","rcName":"2年以上未達3年","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"307","rcName":"3年以上未達5 年","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"308","rcName":"5年以上","linkRtIndex":{},"linkRcIndex":{}}}}},
					// "12":{"rtIndex":"157","rtName":"13.投資「最主要」目的(可複選)","multi":"Y","ansLists":{"answer":{"0":{"rcIndex":"317","rcName":"節稅規劃/ 子女教育/退休準備/購置不動產","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"318","rcName":"追求較高投資報酬（可承受較高的投資風險）","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"319","rcName":"資產配置/累積資產/追求長期穩定報酬","linkRtIndex":{},"linkRcIndex":{}}}}},
					// "13":{"rtIndex":"158","rtName":"14.假設期間為一年，您期望的投資報酬率與承擔的相對風險為何？","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"320","rcName":"-5%～5%","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"321","rcName":"-10%～10%","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"322","rcName":"-15%～15%","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"323","rcName":"-20%～20%","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"324","rcName":"-25%～25%","linkRtIndex":{},"linkRcIndex":{}}}}}}},
					// "result":"0","respCode":"","respCodeMsg":""};
					// alert(JSON.stringify(res));
					else{
						$scope.result.child =$scope.child;
						$scope.result.sick = $scope.sick;
					//console.log(JSON.stringify(res));
					
						var params = {
							result:$scope.result
						};
						$state.go('KYCExam',params,{location: 'replace'});
							
					
					// else {
					// 	framework.alert(error.respCodeMsg, function(){
					// 		//qrcodePayServices.closeActivity();
					// 		framework.backToNative();
					// 	});
					//  }
					}
				//}, null, false);
			}

			

		});
	//=====[ END]=====//


});