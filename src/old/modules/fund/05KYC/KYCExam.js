/**
 * [使用條款Ctrl]
 */
define([
	'app'
	, 'modules/service/qrcodePay/qrcodePayServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/service/qrcodePay/securityServices'
	
], function (MainApp) {

	//=====[ START]=====//
	MainApp.register.controller('KYCExamCtrl',
		function (
			$scope, $stateParams, $state, $element, $compile, i18n
			, $rootScope, $timeout, framework, stringUtil, $css, $log
			, qrcodePayServices
			, qrCodePayTelegram
			, securityServices
			, qrcodeTelegramServices
			
		) {
			//==參數設定==//
			 $css.add('ui/newMainPage/css/main.css');
			 $css.add('ui/newMainPage/css/fund.css');
			$css.add('ui/tcbbOldStyle/css/modify.css');
			$scope.result = $stateParams.result;
			//$scope.result = {"@xmlns:fi0":"http://mnb.hitrust.com/service/schema/fi000603","@xsi:type":"fi0:fi000603ResultType","custId":"B121194483","child":"3","trnsToken":"12345","sick":"Y","vipFlag":"N","isFirstKYC":"Y","custName":"丙一般本國人","custSex":"M","birthday":"0550505","age":"5","custTelOffice":"0227046032","custTelHome":"0222345678","custMobile":"0222345678","custFax":"","custAddr":"133 Ｔａｉｐｅｉ","custEmail":"12345@gmail.com","custJob":"019591","profession":"10003003","professionName":"非金融保險業（法律及會計業除外）","illnessCrd":"N","count":"14","topicLists":{"topic":{"0":{"rtIndex":"10001","rtName":"1.請問您的年齡？","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"10001001","rcName":"19歲以下/76歲以上","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"10001002","rcName":"20~45歲","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"10001003","rcName":"46~55歲","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"10001004","rcName":"56~65歲","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"10001005","rcName":"66~75歲","linkRtIndex":{},"linkRcIndex":{}}}}},"1":{"rtIndex":"10002","rtName":"2.您的學歷為","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"10002001","rcName":"國中以下","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"10002002","rcName":"高中職","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"10002003","rcName":"大學/專科","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"10002004","rcName":"研究所以上","linkRtIndex":{},"linkRcIndex":{}}}}},"2":{"rtIndex":"10003","rtName":"3.您的職業為","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"10003001","rcName":"無（含家管、學生等）","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"10003002","rcName":"法律及會計業","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"10003003","rcName":"非金融保險業（法律及會計業除外）","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"10003005","rcName":"金融保險業","linkRtIndex":{},"linkRcIndex":{}}}}},"3":{"rtIndex":"10004","rtName":"4.您的個人/家庭年收入為（若為未成年人，請依其實際狀況填答）","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"10004001","rcName":"500萬元以上","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"10004002","rcName":"300萬元以上未逹500萬元","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"10004003","rcName":"100萬元以上未逹300萬元","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"10004004","rcName":"50萬元以上未逹100萬元","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"10004005","rcName":"未逹50萬元","linkRtIndex":{},"linkRcIndex":{}}}}},"4":{"rtIndex":"10005","rtName":"5.可供投資資金主要來源（單選）（若為未成年人，請依其實際狀況填答）","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"10005001","rcName":"退休金/儲蓄","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"10005002","rcName":"利息/租金收入/遺產繼承","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"10005003","rcName":"經營事業/餽贈","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"10005004","rcName":"投資收益","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"10005005","rcName":"薪資收入","linkRtIndex":{},"linkRcIndex":{}}}}},"5":{"rtIndex":"10006","rtName":"6.收入或資產可用於投資理財比例（不含自用住宅）","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"10006001","rcName":"未達10%","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"10006002","rcName":"10%以上未達25%","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"10006003","rcName":"25%以上未達50%","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"10006004","rcName":"50%以上","linkRtIndex":{},"linkRcIndex":{}}}}},"6":{"rtIndex":"10007","rtName":"7.預期未來一年的收入情形","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"10007001","rcName":"收入可能減少","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"10007002","rcName":"收入可能增加","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"10007003","rcName":"收入持平","linkRtIndex":{},"linkRcIndex":{}}}}},"7":{"rtIndex":"10008","rtName":"8.曾投資過的商品 (可複選)（未滿7歲者，僅可選填無投資經驗）","multi":"Y","ansLists":{"answer":{"0":{"rcIndex":"10008001","rcName":"無投資經驗","linkRtIndex":"10009","linkRcIndex":"10009001"},"1":{"rcIndex":"10008002","rcName":"選擇權/期貨/衍生性金融商品/不保本之結構型商品","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"10008003","rcName":"保本型商品/儲蓄型保險/定存/貨幣型基金","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"10008004","rcName":"投資等級債券基金/債券/黃金/保本之結構型商品","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"10008005","rcName":"股票/股票型基金/test","linkRtIndex":{},"linkRcIndex":{}},"5":{"rcIndex":"10008006","rcName":"平衡型基金/投資型保單/高收益（非投資等級）債券基金/房地產","linkRtIndex":{},"linkRcIndex":{}}}}},"8":{"rtIndex":"10009","rtName":"9.投資理財經驗（未滿7歲者，僅可選填無投資經驗）","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"10009001","rcName":"無投資經驗","linkRtIndex":"10008","linkRcIndex":"10008001"},"1":{"rcIndex":"10009002","rcName":"未達1年","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"10009003","rcName":"1年以上未達3年","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"10009004","rcName":"3年以上未達5年","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"10009005","rcName":"5年以上","linkRtIndex":{},"linkRcIndex":{}}}}},"9":{"rtIndex":"10010","rtName":"10.假設您的投資因市場波動出現虧損時，當虧損「持續」多久時間，您會調整投資金額？","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"10010001","rcName":"1年以上","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"10010002","rcName":"6個月～1年","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"10010003","rcName":"3～6個月","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"10010004","rcName":"1～3個月","linkRtIndex":{},"linkRcIndex":{}}}}},"10":{"rtIndex":"10011","rtName":"11.假設您的投資因市場波動出現虧損時，您會採取何種方式處理？","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"10011001","rcName":"立即賣出","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"10011002","rcName":"依自身停損點賣出不到一半","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"10011003","rcName":"依自身停損點賣出一半以上","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"10011004","rcName":"加碼買進","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"10011005","rcName":"繼續持有","linkRtIndex":{},"linkRcIndex":{}}}}},"11":{"rtIndex":"10012","rtName":"12.資金預計投資期限","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"10012001","rcName":"未達1年","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"10012002","rcName":"1年以上未達2年","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"10012003","rcName":"2年以上未達3年","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"10012004","rcName":"3年以上未達5年","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"10012005","rcName":"5年以上","linkRtIndex":{},"linkRcIndex":{}}}}},"12":{"rtIndex":"10013","rtName":"13.投資「最主要」目的(可複選)","multi":"Y","ansLists":{"answer":{"0":{"rcIndex":"10013001","rcName":"節稅規劃/ 子女教育/退休準備/購置不動產","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"10013002","rcName":"追求較高投資報酬（可承受較高的投資風險）","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"10013003","rcName":"資產配置/累積資產/追求長期穩定報酬","linkRtIndex":{},"linkRcIndex":{}}}}},"13":{"rtIndex":"10014","rtName":"14.假設期間為一年，您期望的投資報酬率與承擔的相對風險？","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"10014001","rcName":"-5%～5%","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"10014002","rcName":"-10%～10%","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"10014003","rcName":"-15%～15%","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"10014004","rcName":"-20%～20%","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"10014005","rcName":"-25%～25%","linkRtIndex":{},"linkRcIndex":{}}}}}}},"result":"0","respCode":"","respCodeMsg":""}
			// $scope.result = {"@xmlns:fi0":"http://mnb.hitrust.com/service/schema/fi000603","@xsi:type":"fi0:fi000603ResultType","custId":"B121194483","vipFlag":"N","isFirstKYC":"N","custName":"丙一般本國人","isFirstKYC":"Y","custSex":"M","birthday":"0550505","age":"55","custTelOffice":"0227046032","custTelHome":"0222345678","custMobile":"0922486121","custFax":{},"custAddr":"100 台","custEmail":"b1211@yahoo.com","custJob":"019591","profession":"10003003","professionName":"非金融保險業（法律及會計業除外）","illnessCrd":"N","count":"14","topicLists":
			// {"topic":{"0":{"rtIndex":"10001","rtName":"1.請問您的年齡？","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"6","rcName":"19歲以下/76歲以上","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"7","rcName":"20~45歲","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"8","rcName":"46~55歲","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"9","rcName":"56~65歲","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"299","rcName":"66~75歲","linkRtIndex":{},"linkRcIndex":{}}}}},
			// "1":{"rtIndex":"10002","rtName":"2.您的學歷為","multi":"Y","ansLists":{"answer":{"0":{"rcIndex":"11","rcName":"國中以下","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"12","rcName":"高中職","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"13","rcName":"大學/專科","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"32","rcName":"研究所以上","linkRtIndex":{},"linkRcIndex":{}}}}},
			// "2":{"rtIndex":"10003","rtName":"3.您的職業為","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"17","rcName":"無（含家管、學生等）","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"18","rcName":"法律及會計業","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"33","rcName":"非金融保險業（法律及會計業除外）","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"325","rcName":"金融保險業","linkRtIndex":{},"linkRcIndex":{}}}}},
			// "3":{"rtIndex":"10004","rtName":"4.您的個人/家庭年收入為（若為未成年人，請依其實際狀況填答）","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"19","rcName":"500萬元以上","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"20","rcName":"300萬元以上未達500萬元","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"21","rcName":"100萬元以上未達300萬元","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"22","rcName":"50萬元以上未達100萬元","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"311","rcName":"未達50萬元","linkRtIndex":{},"linkRcIndex":{}}}}},
			// "4":{"rtIndex":"10005","rtName":"5.可供投資資金主要來源（單選）（若為未成年人，請依其實際狀況填答）","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"23","rcName":"退休金/儲蓄","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"24","rcName":"利息/租金收入/遺產繼承","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"25","rcName":"經營事業/餽贈","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"310","rcName":"投資收益","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"312","rcName":"薪資收入","linkRtIndex":{},"linkRcIndex":{}}}}},
			// "5":{"rtIndex":"10006","rtName":"6.收入或資產可用於投資理財比例（不含自用住宅）","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"27","rcName":"未達10%","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"28","rcName":"10%以上未達25%","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"29","rcName":"25%以上未達50%","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"30","rcName":"50%以上","linkRtIndex":{},"linkRcIndex":{}}}}},
			// "6":{"rtIndex":"10007","rtName":"7.預期未來一年的收入情形","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"34","rcName":"收入可能減少","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"35","rcName":"收入可能增加","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"36","rcName":"收入持平","linkRtIndex":{},"linkRcIndex":{}}}}},
			// "7":{"rtIndex":"10008","rtName":"8.曾投資過的商品 (可複選)(未滿7歲者，僅可選填無投資經驗）","multi":"Y","ansLists":{"answer":{"0":{"rcIndex":"38","rcName":"無投資經驗","linkRtIndex":"22","linkRcIndex":"42"},"1":{"rcIndex":"39","rcName":"選擇權/期貨/衍生性金融商品/不保本之結構型商品","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"40","rcName":"保本型商品/儲蓄型保險/定存/貨幣型基金","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"41","rcName":"投資等級債券基金/債券/黃金/保本之結構型商品","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"313","rcName":"股票/股票型基金","linkRtIndex":{},"linkRcIndex":{}},"5":{"rcIndex":"314","rcName":"平衡型基金/投資型保單/高收益（非投資等級）債券基金/房地產","linkRtIndex":{},"linkRcIndex":{}}}}},
			// "8":{"rtIndex":"10009","rtName":"9.投資理財經驗  (未滿7歲者，僅可選填無投資經驗）","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"42","rcName":"無投資經驗","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"43","rcName":"未達1年","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"44","rcName":"1年以上未達3年","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"286","rcName":"3年以上未達5年","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"306","rcName":"5年以上","linkRtIndex":{},"linkRcIndex":{}}}}},
			// "9":{"rtIndex":"10010","rtName":"10.假設您的投資因市場波動出現虧損時，當虧損「持續」多久時間，您會調整投資金額？","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"121","rcName":"1年以上","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"122","rcName":"6個月～1年","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"123","rcName":"3～6個月","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"124","rcName":"1～3個月","linkRtIndex":{},"linkRcIndex":{}}}}},
			// "10":{"rtIndex":"10011","rtName":"11.假設您的投資因市場波動出現虧損時，您會採取下列何種方式處理？","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"291","rcName":"立即賣出","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"292","rcName":"依自身停損點賣出不到一半","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"293","rcName":"依自身停損點賣出一半以上","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"315","rcName":"加碼買進","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"316","rcName":"繼續持有","linkRtIndex":{},"linkRcIndex":{}}}}},
			// "11":{"rtIndex":"10012","rtName":"12.資金預計投資期限","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"295","rcName":"未達1年","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"296","rcName":"1年以上未達2年","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"297","rcName":"2年以上未達3年","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"307","rcName":"3年以上未達5 年","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"308","rcName":"5年以上","linkRtIndex":{},"linkRcIndex":{}}}}},
			// "12":{"rtIndex":"10013","rtName":"13.投資「最主要」目的(可複選)","multi":"Y","ansLists":{"answer":{"0":{"rcIndex":"317","rcName":"節稅規劃/ 子女教育/退休準備/購置不動產","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"318","rcName":"追求較高投資報酬（可承受較高的投資風險）","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"319","rcName":"資產配置/累積資產/追求長期穩定報酬","linkRtIndex":{},"linkRcIndex":{}}}}},
			// "13":{"rtIndex":"10014","rtName":"14.假設期間為一年，您期望的投資報酬率與承擔的相對風險為何？","multi":"N","ansLists":{"answer":{"0":{"rcIndex":"320","rcName":"-5%～5%","linkRtIndex":{},"linkRcIndex":{}},"1":{"rcIndex":"321","rcName":"-10%～10%","linkRtIndex":{},"linkRcIndex":{}},"2":{"rcIndex":"322","rcName":"-15%～15%","linkRtIndex":{},"linkRcIndex":{}},"3":{"rcIndex":"323","rcName":"-20%～20%","linkRtIndex":{},"linkRcIndex":{}},"4":{"rcIndex":"324","rcName":"-25%～25%","linkRtIndex":{},"linkRcIndex":{}}}}}}},
			// "result":"0","respCode":"","respCodeMsg":"","child":"3","sick":"Y"};
			$scope.result2 = $scope.result.topicLists.topic;
			$scope.rtIndex1 = 0;
			//$scope.aaa1='0'
			$scope.nnn=0;//當前題目
			$scope.status2 ='-1';//答案預設值
			$scope.aaa=[,,,,,,,,,,,,,];
			// var mm = qrCodePayTelegram.toArray($scope.result.topicLists.topic[nnn].ansLists.answer).length;//取得當前答案數目
			// alert("12"+mm);

			$scope.ww2=[];
			$scope.ww3=[];
			$scope.single = 'Y';//第一題為單選
			//$scope.a13 ='';
			//var count111 = Object.keys($scope.result.count).length;
			// var kkk=$scope.result.profession;
			// $scope.kkk=kkk.substr(kkk.length-1,1);
			//$("input[id='alex'][value='17']").attr('checked',true);
			if($scope.result.profession==null ||$scope.result.profession ==''){$scope.pro =false;}
			else{$scope.pro= true;}

			$scope.a15 =$scope.result.profession;
			//document.getElementById("10003").disabled = true;

			var eee=[10001,10002,10003,10004,10005,10006,10007,10008,10009,10010,10011,10012,10013,10014];
			//$scope.rcIndex1 = 13;
			// aa = qrCodePayTelegram.toArray($scope.result.topicLists.topic[$scope.nnn]);
			// 	$scope.ww1=aa[0].rtName;//題目
			$scope.defaultSecurityType =[];
			var securityTypes = [];
			qrcodePayServices.getLoginInfo(function(res){
				$scope.custId = res.custId;
				
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
				// if (!(securityTypes.length > 0)) {
				// 	framework.alert('您的行動裝置無合庫行動網銀轉帳機制，請洽營業單位申請。',function(){
				// 		framework.backToNative();
				// 	});
				// }

				//securityTypes=[{name:'憑證', key:'NONSET'},{name:'OTP', key:'OTP'}];
				$scope.defaultSecurityType = securityTypes[0];
				if (securityTypes.length == 2) {
					$scope.anotherSecurityType = securityTypes[1];
				}

				

			});
			


			$scope.changeSecurity = function (key) {
				if (key == 'NONSET') {
					$scope.defaultSecurityType = securityTypes[0];
					$scope.anotherSecurityType = securityTypes[1];
				} else {
					$scope.defaultSecurityType = securityTypes[1];
					$scope.anotherSecurityType = securityTypes[0];
				}
				
				$scope.onChangeSecurityType = false;
				//alert('defaultSecurityType'+$scope.defaultSecurityType);
			}


			$scope.clickChangeSceurityType = function (show) {
				
				$scope.onChangeSecurityType = show;
				//alert('onChangeSecurityType'+$scope.onChangeSecurityType);
			}

			qrcodePayServices.requireLogin();
			
			//alert($scope.result.age < 7);
			if($scope.result.age < 7){$scope.seven = 1;}//6歲以下
			else if($scope.result.age < 20){$scope.seven = 2;}//19歲以下
			else if($scope.result.age < 46){$scope.seven = 3;}
			else if($scope.result.age < 56){$scope.seven = 4;}
			else if($scope.result.age < 66){$scope.seven = 5;}
			else if($scope.result.age < 76){$scope.seven = 6;}

			else{
				$scope.seven = 0;
			}


			
			




			// for(var i=1;i<mm+1;i++){
			// 	$scope.ww2[i-1]=(qrCodePayTelegram.toArray($scope.result.topicLists.topic[nnn].ansLists.answer[i-1]))[0].rcName;
			// }
			// alert($scope.ww2);
			var aa = [];
			aa = qrCodePayTelegram.toArray($scope.result.topicLists.topic[0]);
			

			$scope.ww1=aa[0].rtName;//題目
			
			
			//android實體鍵盤返回鍵
			document.addEventListener("backbutton", onBackKeyDown, false);
			function onBackKeyDown() {
				
			}

			//第一題資訊
			if($scope.nnn == 0){
				// if($scope.result.age <= 19|| $scope.result.age>= 76){  //一個答案
					
				// 	$scope.ww2[0]=(qrCodePayTelegram.toArray($scope.result.topicLists.topic[$scope.nnn].ansLists.answer[0]))[0].rcName;
				// 	$scope.aaa[0]=1;//寫入選擇答案
				// 	alert($scope.aaa);
				// 	if($scope.aaa[$scope.nnn]!='NaN'){$scope.status2 = $scope.aaa[$scope.nnn]-1}
				// 	else{$scope.status2='-1';}//預設寫入選擇答案為空
				// 	alert($scope.status2);
				// }
				// else{  //5個答案
				// 	$scope.ww2[0]=(qrCodePayTelegram.toArray($scope.result.topicLists.topic[$scope.nnn].ansLists.answer[0]))[0].rcName;
				// 	for(var i=1;i<6;i++){
				// 		$scope.ww2[i-1]=(qrCodePayTelegram.toArray($scope.result.topicLists.topic[$scope.nnn].ansLists.answer[i-1]))[0].rcName;
				// 	}//取得當前答案
				// }
				if($scope.seven == 0 || $scope.seven == 1 || $scope.seven == 2){
					$scope.a13 ="10001001";//寫入選擇答案
					}
				else if($scope.seven == 3){
					$scope.a13 ="10001002";//寫入選擇答案
				}
				else if($scope.seven == 4){
					$scope.a13 ="10001003";//寫入選擇答案
				}
				else if($scope.seven == 5){
					$scope.a13 ="10001004";//寫入選擇答案
				}
				else if($scope.seven == 6){
					$scope.a13 ="10001005";//寫入選擇答案
				}
			}
			
			$scope.clickBack = function () {
				framework.confirm('是否離開風險承受度測驗。',function(ok){
					if(ok){framework.backToNative()};
					//return;
				});
			}
			
			$scope.clickSubmit1 = function () {
				var bbb=[$scope.a13,$scope.a14,$scope.a15,$scope.a16,$scope.a17,$scope.a18,$scope.a20,$scope.a21,$scope.a22,$scope.a106,$scope.a155,$scope.a156,$scope.a157,$scope.a158];
				//alert(bbb[$scope.nnn]);
				//七歲以下設定參數
				if($scope.seven ==1){
					$scope.a13 ="10001001";
					$scope.a21 ="10008001";
					$scope.a22 ="10009001";
				}

				
				//單選防呆
				if(bbb[$scope.nnn] == null && $scope.nnn != 7 && $scope.nnn != 12 && ($scope.seven !=1 || $scope.nnn != 0)&& ($scope.seven !=1 || $scope.nnn != 8) ){framework.alert('請輸入答案');}
				//複選防呆
				else if($scope.nnn==7){
					var aa21=$('input:checkbox:checked[name="a21"]').map(function() { return $(this).val(); }).get().toString();
					$scope.a21 = aa21;
					//alert(aa21);
					if(aa21 == ''&& $scope.seven !=1){
						framework.alert('請輸入答案');
					}else{$scope.nnn = $scope.nnn +1;
						$scope.rtIndex1 = $scope.nnn ;}
					
					if(aa21 == '10008001'){
						$scope.a22 ="10009001";
						$scope.ten = 1;
						//alert('11'+$scope.ten);
						}
					if($scope.seven != 1 && $scope.ten != 1){$scope.ten=2;}	
						//alert('22'+$scope.ten);
				}

				else if($scope.nnn == 12){
					var aa157=$('input:checkbox:checked[name="a157"]').map(function() { return $(this).val(); }).get().toString();
					//alert(a157);
					$scope.a157 = aa157;
					if(aa157 == ''){
						framework.alert('請輸入答案');
					}else{$scope.nnn = $scope.nnn +1;
						$scope.rtIndex1 = $scope.nnn ;
						if($scope.result.isFirstKYC == 'Y'){
						$scope.isFirstKYC = 'Y'
					}
					}
				}
				//最後一題點選後上送答案
				else if($scope.nnn == 13){
					$scope.result.custName = (typeof $scope.result.custName).toString() === "object" ? "" : $scope.result.custName;
					$scope.result.custSex = (typeof $scope.result.custSex).toString() === "object" ? "" : $scope.result.custSex;
					$scope.result.birthday = (typeof $scope.result.birthday).toString() === "object" ? "" : $scope.result.birthday;
					$scope.result.age = (typeof $scope.result.age).toString() === "object" ? "" : $scope.result.age;
					$scope.result.custTelOffice = (typeof $scope.result.custTelOffice).toString() === "object" ? "" : $scope.result.custTelOffice;
					$scope.result.custTelHome = (typeof $scope.result.custTelHome).toString() === "object" ? "" : $scope.result.custTelHome;
					$scope.result.custMobile = (typeof $scope.result.custMobile).toString() === "object" ? "" : $scope.result.custMobile;
					$scope.result.custFax = (typeof $scope.result.custFax).toString() === "object" ? "" : $scope.result.custFax;
					$scope.result.custAddr = (typeof $scope.result.custAddr).toString() === "object" ? "" : $scope.result.custAddr;
					$scope.result.custEmail = (typeof $scope.result.custEmail).toString() === "object" ? "" : $scope.result.custEmail;

					if($scope.result.isFirstKYC == 'Y'){
						var form = {};
						form.resultList ={};
						form.resultList.detail=[{},{},{},{},{},{},{},{},{},{},{},{},{},{}];
						for(var i=0;i<14;i++){
							form.resultList.detail[i].rtIndex = eee[i].toString();
							form.resultList.detail[i].rcIndex = bbb[i].toString();}
						
						
						form.custId = $scope.result.custId;
						form.type= '2';
						//???
						if(bbb[3] ==' '){bbb[3]='4'}
						else if(bbb[3] =='10002002'){bbb[3]='3'}
						else if(bbb[3] =='10002003'){bbb[3]='2'}
						else{bbb[3]='1'}
						form.familyIncome=bbb[3];
						//???
						if(bbb[1] =='10002001'){bbb[1]='1'}
						else if(bbb[1] =='10002002'){bbb[1]='2'}
						else if(bbb[1] =='10002003'){bbb[3]='3'}
						else{bbb[1]='4'}
						form.eduLevel = bbb[1];
						form.custName=$scope.result.custName;
						form.custSex = $scope.result.custSex;
						form.birthday = $scope.result.birthday;
						form.age = $scope.result.age;
						form.custTelOffice = $scope.result.custTelOffice;
						form.custTelHome = $scope.result.custTelHome;
						form.custMobile = $scope.result.custMobile;
						form.custFax = $scope.result.custFax;
						form.custAddr = $scope.result.custAddr;
						form.custEmail = $scope.result.custEmail;

						// form.profession = $scope.result.profession;
						// form.professionName = $scope.result.professionName;

						if($scope.result.profession == null || $scope.result.profession ==''||$scope.result.profession == "undefined"){
                            form.profession = $scope.a15.toString();
                            var jj=form.profession.substring(7,8);
                            console.log("$scope.a15"+$scope.a15);
                            //console.log("toString(7,8)"+form.profession.toString(7,8));
                            console.log("jj"+jj);
                            //alert("jj"+jj);
                            if(jj=='5'){form.professionName = $scope.result2[2].ansLists.answer[jj-2].rcName;}
                            else{form.professionName = $scope.result2[2].ansLists.answer[jj-1].rcName;}
                        }else{
                            form.profession = $scope.result.profession;
                            form.professionName = $scope.result.professionName;
                        }

						form.illnessCrd = $scope.result.sick;

						form.childNum = $scope.result.child;
						form.content = "客戶測驗內容";
						//form.trnsToken = "";
						console.log(JSON.stringify(form));
						
						form.isFirstKYC = "Y";
						form.trnsToken = $scope.result.trnsToken;
						console.log(JSON.stringify(form));
						// qrCodePayTelegram.send('qrcodePay/fi000604', form, function (res, error) {
						// 	$log.debug("fi000604 res:" + JSON.stringify(res));
						securityServices.send('qrcodePay/fi000604', form, $scope.defaultSecurityType, function(res, error){
							$log.debug("fi000604 res:" + JSON.stringify(res));
							if (res) {
								var params = {
									result:res,
									form:form
								};
								$state.go('KYCEndExam',params,{location: 'replace'});
									
							} else {
								framework.alert(error.respCodeMsg, function(){
									qrcodePayServices.closeActivity();});
								}
							}, $scope.sslkey);
						//}, null, false);
					}else{
						var form = {};
						form.resultList ={};
						form.resultList.detail=[{},{},{},{},{},{},{},{},{},{},{},{},{},{}];
						for(var i=0;i<14;i++){
							form.resultList.detail[i].rtIndex = eee[i];
							form.resultList.detail[i].rcIndex = bbb[i];}
						
						
						form.custId = $scope.result.custId;
						form.type= '2';
						//???
						if(bbb[3] ==' '){bbb[3]='4'}
						else if(bbb[3] =='10002002'){bbb[3]='3'}
						else if(bbb[3] =='10002003'){bbb[3]='2'}
						else{bbb[3]='1'}
						form.familyIncome=bbb[3];
						//???
						if(bbb[1] =='10002001'){bbb[1]='1'}
						else if(bbb[1] =='10002002'){bbb[1]='2'}
						else if(bbb[1] =='10002003'){bbb[3]='3'}
						else{bbb[1]='4'}
						form.eduLevel = bbb[1];

						





						form.custName=$scope.result.custName;
						form.custSex = $scope.result.custSex;
						form.birthday = $scope.result.birthday;
						form.age = $scope.result.age;
						form.custTelOffice = $scope.result.custTelOffice;
						form.custTelHome = $scope.result.custTelHome;
						form.custMobile = $scope.result.custMobile;
						form.custFax = $scope.result.custFax;
						form.custAddr = $scope.result.custAddr;
						form.custEmail = $scope.result.custEmail;

						// form.profession = $scope.result.profession;
						// form.professionName = $scope.result.professionName;

						if($scope.result.profession == null || $scope.result.profession ==''||$scope.result.profession == "undefined"){
                            form.profession = $scope.a15.toString();
                            var jj=form.profession.substring(7,8);
                            console.log("$scope.a15"+$scope.a15);
                            //console.log("toString(7,8)"+form.profession.toString(7,8));
                            console.log("jj"+jj);
                            //alert("jj"+jj);
                            if(jj=='5'){form.professionName = $scope.result2[2].ansLists.answer[jj-2].rcName;}
                            else{form.professionName = $scope.result2[2].ansLists.answer[jj-1].rcName;}
                        }else{
                            form.profession = $scope.result.profession;
                            form.professionName = $scope.result.professionName;
							                        }

						

						form.illnessCrd = $scope.result.sick;

						form.childNum = $scope.result.child;
						form.content = "客戶測驗內容";
						
						console.log(JSON.stringify(form));
						
						//form.trnsToken = "";
						form.isFirstKYC = "N";
						qrCodePayTelegram.send('qrcodePay/fi000604', form, function (res, error) {
							$log.debug("fi000604 res:" + JSON.stringify(res));
							if (res) {
								var params = {
									result:res,
									form:form
								};
								$state.go('KYCEndExam',params,{location: 'replace'});
									
							} else {
								framework.alert(error.respCodeMsg, function(){
									qrcodePayServices.closeActivity();});
								}
						}, null, false);
					}


				}
				else{
				//一般換題顯示切換
				$scope.nnn = $scope.nnn +1;
				
				$scope.rtIndex1 = $scope.nnn ;
				}
				// var ii='';
				// var index = 0;
				// var index1 = 0;
				// $('.a21').each(function() {
				// 	if (this.checked) {
				// 		alert("Box is checked at index=" + index);
						
				// 		ii = ii+index;
						
				// 		//index1++;
				// 	}
				// 	index++;
				// });
				// alert('ii'+ii);
				
				
				}
			qrcodePayServices.getLoginInfo(function (res) {});
			
			
			$scope.clickBack1 = function () { //上一題
				$scope.nnn = $scope.nnn -1;
				$scope.rtIndex1 = $scope.nnn;
				if($scope.result.isFirstKYC == 'Y'){
					$scope.isFirstKYC = 'N'
				}
				if($scope.nnn == 7){$scope.ten ='';}
				
			}
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			// $scope.clickSubmit = function () {	//下一題
				
			// 	alert($scope.status3);
			// 	if(($scope.status2 == '-1' || isNaN($scope.status2) )&& $scope.single == 'Y'){
			// 		framework.alert('請輸入答案');}
			// 	else{
			// 	// nnn = nnn +1;
			// 	// aa = qrCodePayTelegram.toArray($scope.result.topicLists.topic[nnn]);
			// 	// $scope.ww1=aa[0].rtName;//題目
			// 	// alert($scope.result.age);
				
			// 	$scope.nnn = $scope.nnn +1;
			// 	alert($scope.nnn);
			// 	aa = qrCodePayTelegram.toArray($scope.result.topicLists.topic[$scope.nnn]);
			// 	$scope.ww1=aa[0].rtName;//題目
			// 	mm = qrCodePayTelegram.toArray($scope.result.topicLists.topic[$scope.nnn].ansLists.answer).length;//取得當前答案數目
			// 	//alert("multi"+aa[0].multi);
			// 	ti = aa[0].multi;
			// 	//alert("ti"+ti);
			// 	if(ti == 'N'){
			// 		for(var i=1;i<mm+1;i++){
			// 			$scope.ww2[i-1]=(qrCodePayTelegram.toArray($scope.result.topicLists.topic[$scope.nnn].ansLists.answer[i-1]))[0].rcName;
			// 		}//取得當前單選答案
			// 		$scope.single ='Y';
			// 		$scope.multi = ti ;
			// 		alert("單選"+ti);
			// 		//存入複選值
			// 		var ii=[];
			// 		var index = 0;
			// 		var index1 = 0;
			// 		$('.it').each(function() {
			// 			if (this.checked) {
			// 				alert("Box is checked at index=" + index);
			// 				ii[index1] = index;
			// 				index1++;
			// 			}
			// 			index++;
			// 		});
			// 		alert('ii'+ii);
					
			// 	}else if(ti == 'Y'){
			// 		for(var i=1;i<mm+1;i++){
			// 			$scope.ww3[i-1]=(qrCodePayTelegram.toArray($scope.result.topicLists.topic[$scope.nnn].ansLists.answer[i-1]))[0].rcName;
			// 		}//取得當前複選答案
			// 		$scope.multi = ti ;
			// 		$scope.single ='N';
			// 		alert("複選"+ti);
			// 		//存入複選值
			// 		var ii;
			// 		var index = 0;
			// 		var index1 = 0;
			// 		$('.it').each(function() {
			// 			if (this.checked) {
			// 				alert("Box is checked at index=" + index);
			// 				ii = ii+index;
			// 				index1++;
			// 			}
			// 			index++;
			// 		});
			// 		alert('ii'+ii);
					
			// 		//寫入複選值

			// 	}

			// 	//ww=(qrCodePayTelegram.toArray($scope.result.topicLists.topic[nnn].ansLists.answer[0]))[0].rcName;//答案
			// 	//framework.backToNative();
			// 	//alert($scope.status2);
				
			// 	$scope.aaa[$scope.nnn-1]=$scope.status2+1;//寫入選擇答案
			// 	alert($scope.aaa);
			// 	if($scope.aaa[$scope.nnn]!='NaN'){$scope.status2 = $scope.aaa[$scope.nnn]-1}
			// 	else{$scope.status2='-1';}//預設寫入選擇答案為空
			// 	alert($scope.status2);

				
			// 	// if(nnn==0){$scope.aaa1='0'}
			// 	// else{$scope.aaa1='1'}
			// 	}
			// }

			// $scope.clickBack = function () { //上一題
				
			// 	//if($scope.nnn=='0'){$scope.nnn=$scope.nnn+1;}
			// 	$scope.nnn = $scope.nnn - 1;
			// 	alert($scope.nnn);
			// 			if($scope.nnn == 0){ //第一題情況
			// 				if($scope.result.age <= 19|| $scope.result.age>= 76){
			// 					alert("$scope.nnn"+$scope.nnn);
			// 					$scope.ww2=[];
			// 					$scope.ww2[0]=(qrCodePayTelegram.toArray($scope.result.topicLists.topic[$scope.nnn].ansLists.answer[0]))[0].rcName;
			// 					$scope.aaa[0]=1;//寫入選擇答案
			// 					alert($scope.aaa);
			// 					//if($scope.aaa[nnn]!='NaN'){$scope.status2 = $scope.aaa[nnn]-1}
			// 					//else{$scope.status2='-1';}//預設寫入選擇答案為空
			// 					$scope.status2 = $scope.aaa[$scope.nnn]-1;//0
			// 					alert($scope.status2);
			// 					aa = qrCodePayTelegram.toArray($scope.result.topicLists.topic[$scope.nnn]);
			// 					$scope.ww1=aa[0].rtName;//題目
			// 					$scope.single ='Y';
			// 					$scope.multi = 'N' ;
								
			// 				}else{
			// 					aa = qrCodePayTelegram.toArray($scope.result.topicLists.topic[0]);
			// 					$scope.ww1=aa[0].rtName;//題目

			// 					$scope.ww2=[];
			// 					//$scope.ww2[0]=(qrCodePayTelegram.toArray($scope.result.topicLists.topic[nnn].ansLists.answer[0]))[0].rcName;
			// 					for(var i=1;i<6;i++){
			// 						$scope.ww2[i-1]=(qrCodePayTelegram.toArray($scope.result.topicLists.topic[$scope.nnn].ansLists.answer[i-1]))[0].rcName;
			// 					}//取得當前答案
			// 					$scope.status2 = $scope.aaa[($scope.nnn)]-1;
			// 					$scope.single ='Y';
			// 					$scope.multi = 'N' ;
			// 				}
			// 			}else{ //非第一題情況
						
			// 					mm = qrCodePayTelegram.toArray($scope.result.topicLists.topic[$scope.nnn].ansLists.answer).length;//取得當前答案數目
			// 					aa = qrCodePayTelegram.toArray($scope.result.topicLists.topic[$scope.nnn]);
			// 					$scope.ww1=aa[0].rtName;//題目
			// 					ti = aa[0].multi;
			// 						//alert("ti"+ti);
			// 						if(ti == 'N'){
			// 							for(var i=1;i<mm+1;i++){
			// 								$scope.ww2[i-1]=(qrCodePayTelegram.toArray($scope.result.topicLists.topic[$scope.nnn].ansLists.answer[i-1]))[0].rcName;
			// 							}//取得當前單選答案
			// 							$scope.single ='Y';
			// 							$scope.multi = 'N';
			// 							alert("單選"+ti);
			// 						}else if(ti == 'Y'){
			// 							for(var i=1;i<mm+1;i++){
			// 								$scope.ww3[i-1]=(qrCodePayTelegram.toArray($scope.result.topicLists.topic[$scope.nnn].ansLists.answer[i-1]))[0].rcName;
			// 							}//取得當前複選答案
			// 							$scope.multi = 'Y' ;
			// 							$scope.single ='N';
			// 							alert("複選"+ti);
			// 						}
			// 					// for(var i=1;i<mm+1;i++){
			// 					// 	$scope.ww2[i-1]=(qrCodePayTelegram.toArray($scope.result.topicLists.topic[$scope.nnn].ansLists.answer[i-1]))[0].rcName;
			// 					// }//取得當前答案
								

			// 					//ww=(qrCodePayTelegram.toArray($scope.result.topicLists.topic[nnn].ansLists.answer[0]))[0].rcName;//答案
			// 					//framework.backToNative();
			// 					alert('上題nnn'+$scope.nnn)
			// 					$scope.status2 = $scope.aaa[$scope.nnn]-1;
			// 					alert("選擇的答案"+$scope.status2);
			// 					//$scope.aaa[nnn-1]=$scope.status2+1;
			// 					alert($scope.aaa);
			// 					//$scope.status2=0;
			// 					alert('77'+$scope.status2);
			// 					// if(nnn==0){$scope.aaa1='0'}
			// 					// else{$scope.aaa1='1'}
			// 					}
			// 		}
		
		});
	//=====[ END]=====//


});