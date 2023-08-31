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
	MainApp.register.controller('ForeignInsuranceEditCtrl',
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

			//var message = '注意事項：\n1.本交易營業時間：星期一至星期五（例假日除外）上午九時至下午三時三十分。\n2.注意！！為保障您的權益，請謹慎操作，錯誤轉帳或銷帳後續問題之處理，請洽原人壽保險公司辦理，並告知所輸入之繳費資訊。\n3.本轉帳交易申報交易性質細分類為 Z：其他-繳納外幣保費。\n4.若交易成功後欲列印水單等收據，請由「進出匯服務→ 網銀交易進出匯水單列印」功能列印。';
			// var message = '注意事項：\n1.本交易營業時間：星期一至星期五（例假日除外）上午九時至下午三時三十分。\n2.注意！！為保障您的權益，請謹慎操作，錯誤轉帳或銷帳後續問題之處理，請洽原人壽保險公司辦理，並告知所輸入之繳費資訊。\n3.本轉帳交易申報匯款性質695Z:人身保險費。';
			
			// framework.alert(message);
			$scope.closePopup = function() {
				$('.popup_window').removeClass("popup_open");
			};
			// $scope.trnsAmountNum = 'a123456789';
			// alert(($scope.trnsAmountNum.toString().substring(0,1).toUpperCase()+$scope.trnsAmountNum.toString().substring(1,10)));
			//main
			qrcodePayServices.getLoginInfo(function (res) {
				
				//保留 custId
				//alert(JSON.stringify(res));
				$scope.custId = res.custId;
				// if(res.DefAuthType == "0" || res.DefAuthType == "3"){framework.alert("您的行動裝置無合庫行動網銀轉帳機制，請洽營業單位申請");}
				var cnEndDate = stringUtil.formatDate(res.cnEndDate);
				var todayDate = stringUtil.formatDate(new Date());
				//判斷是否有SSL或憑證(是否過期)
				if (res.AuthType.indexOf('1') == -1 && (res.AuthType.indexOf('2') == -1 || res.AuthType.indexOf('2') > -1 && (res.cn==null || res.cn=='' || stringUtil.compareDate(todayDate, cnEndDate) == -1))) {
					
						framework.alert("您的行動裝置無合庫行動網銀轉帳機制，請洽營業單位申請");
						framework.backToNative();
					}
					
					
					
				getF5000201();
				
			});
			//點選南山首期禁止繳納提醒
			$scope.clicktype = function () {
			if($scope.type11 == '1'){
				framework.alert("首期保費暫不開放網路繳納，請洽臨櫃辦理。");
			}
			}

			//限制輸入金額小數兩位
			$scope.clearNoNum1 = function(){
				$scope.trnsAmountStr = $scope.trnsAmountStr.replace(/[^\d.]/g,""); //清除"數字"和"."以外的字符
				$scope.trnsAmountStr = $scope.trnsAmountStr.replace(/^\./g,""); //驗證第一個字符是數字
				$scope.trnsAmountStr = $scope.trnsAmountStr.replace(/\.{2,}/g,"."); //只保留第一個, 清除多餘的
				$scope.trnsAmountStr = $scope.trnsAmountStr.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
				$scope.trnsAmountStr= $scope.trnsAmountStr.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能輸入兩個小數
				if($scope.trnsAmountStr.indexOf(".")< 0 && $scope.trnsAmountStr !=""){//以上已經過濾，此處控制的是如果沒有小數點，首位不能為類似於 01、02的金額 
						if($scope.trnsAmountStr.substr(0,1) == '0' && $scope.trnsAmountStr.length == 2){ 
							$scope.trnsAmountStr= parseFloat($scope.trnsAmountStr);     
						} 
				 }
			}

			// line分享鍵
			$scope.windowplugins = function () {
			var option = { // type 1 
				message: 'Hi, 我已經預約囉! 到時請看看有沒有收到喔!', // not supported on some apps (Facebook, Instagram)
				subject: '單筆轉帳預約完成', // fi. for email
				//files: [cordova.file.dataDirectory+'ui/images/link_arrow.png'],
				//url:'https://www.google.nl/images/srpr/logo4w.png',
				//files: ['file:///android_asset/www/ui/images/btn_icon05.png'],
				//files:[$scope.base22],
				appPackageName:'line',
				chooserTitle: '選擇分享功能' // Android only, you can override the default share sheet title
			   }
			   
			   var onSuccess = function (res) {
				console.log('e', res)
			   }
			   var onError = function (res) {
				console.log('e', res)
			   }
			   //window.plugins.socialsharing.share(null, null, 'https://www.google.nl/images/srpr/logo4w.png');
			   plugins.socialsharing.shareWithOptions(option, onSuccess, onError);
			   //window.plugins.socialsharing.share(null, null, 'file:///android_asset/www/ui/images/btn_icon05.png', null);

			}




//網威訊息分享object內容 start

		$scope.getDataUri= function(){
			//@param url 圖片位置
			//判斷開啟哪一個通訊軟體
			// if($scope.imgg == "1"){$scope.appPackageName ='line';}
			// else if($scope.imgg == "2"){$scope.appPackageName ='whatsapp';}
			// else if($scope.imgg == "3"){$scope.appPackageName ='wechat';}

			var options = {
				message: "Hi, 我已轉帳新台幣$1,000元給你了(006, 帳號末四碼9999), 請看看有沒有收到喔!", 
				subject: '轉帳通知', 
				files: [], 
				// appPackageName:$scope.appPackageName,
				appPackageName:'line'
				// url: '',
				// chooserTitle: '' 
			};

			//訊息分享成功事件	
			var onSuccess = function(s) {
				console.log("Share completed");
			};

			//訊息分享失敗事件
			var onError = function(e) {
				console.log("Sharing failed with message");
			};


			var image = new Image();
			image.onload = function () {
				var canvas = document.createElement('canvas');
				canvas.width = image.width;
				canvas.height = image.height;

				canvas.getContext('2d').drawImage(image, 0, 0);

				//增加文字在圖片上
				var ctx = canvas.getContext("2d");
				ctx.font = "50px Arial";
				ctx.fillText('alex test',250,250);


				//base64完資料 ＝ base64text
				var base64text = canvas.toDataURL('image/jpeg');
				//把base64text資料放進要傳送object的files files需為array

				
				options.files = [base64text];
				
				alert(JSON.stringify(options));
				//啟動訊息分享功能
				window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
			};

			image.src = "ui/newMainPage/image/newyear.jpg";
		}	

			var trnsToken;
			//F5000101-台幣活存約定轉出及轉入帳號查詢
			function getF5000201() {
				var form = {};
				form.custId = $scope.custId; //$scope.resfi000702Param.custId;
				qrCodePayTelegram.send('qrcodePay/f5000201', form, function (res, error) {
					 //$log.debug("f5000101:"+JSON.stringify(res));
					 //alert(JSON.stringify(res));
				if(res.trnsRsltCode == '0'){
					if (res) {
						//$scope.trnsToken = res.trnsToken; //先用702明細的token
						trnsToken = res.trnsToken;
						var actsOut = qrCodePayTelegram.toArray(res.trnsOutAccts.trnsOutAcct);
						//alert(JSON.stringify(actsOut));
						$scope.InAC = [];
						for (key in actsOut) {
									var tempIn = {};
									tempIn.acctNo = actsOut[key].acctNo;
									//tempIn.acctCurr = actsOut[key].acctCurr;
									$scope.InAC.push(tempIn);
								
							
						}
						$scope.kkk=res.trnsOutAccts.trnsOutAcct.acctCurr.toString().split(",");
						$scope.paymentObject =  res.paymentObject;
						//$log.debug(JSON.stringify($scope.InAC));
						//$log.debug("in:" + $scope.InAC.length);

						
					} 
				}
				else {
					framework.alert(res.hostCodeMsg, function () {
						// alert("333"+JSON.stringify(res));
						// alert("444"+JSON.stringify(error));
						framework.backToNative();
					});
				}
				}, null, false);
			}
			
			
		

			

			$scope.form9 = {};
			//確定變更
			
			$scope.clickSubmit = function () {
				// if ($scope.trnsAmountNum.search(/^[A-Z](1|2)\d{8}$/i) == -1) {
					
				// 	framework.alert('基本格式錯誤');
					//alert($scope.life5);
				// 	} 
				//檢查付款帳號是否輸入
				// if($scope.life == undefined) {framework.alert("請選擇付款帳號");}
				// if(($scope.trnsAmountNum.toString().search(/^[a-zA-Z]\d{9}$/i) == -1) && ($scope.life5 == '1' || $scope.paymentObject == 'N'))  {
					
				// 	framework.alert('繳費單號格式錯誤');
					
				// 	} 
				// else if(($scope.trnsAmountNum.toString().search(/^\d{14}$/i) == -1) && ($scope.life5 == '2'|| $scope.paymentObject == 'S')){
					
				// 	framework.alert('繳費單號格式錯誤');
				// }
				
				if(($scope.trnsAmountNum.length != 10 || $scope.trnsAmountNum == 'undefined') && ($scope.life5 == '1' || $scope.paymentObject == 'N'))  {
					
					framework.alert('繳費單號格式錯誤');
					
					} 
				else if(($scope.trnsAmountNum.length != 14 || $scope.trnsAmountNum == 'undefined')&& ($scope.life5 == '2'|| $scope.paymentObject == 'S')){
					
					framework.alert('繳費單號格式錯誤');
				}
				

				//檢查付款幣別是否輸入
				else if($scope.life1 == undefined) {framework.alert("請選擇付款幣別");}

				//檢查繳費單號是否為10碼
				//else if($scope.trnsAmountNum.length != 10 ) {framework.alert("請輸入10碼繳費單號");}//繳費單號格式錯誤會檢查是否為10,14碼
				// if($scope.trnsAmountNum.length != 10 ) {}
				//檢查交易金額是否輸入
				else if(($scope.trnsAmountStr == "")||($scope.trnsAmountStr == undefined)||($scope.trnsAmountStr == '0')) {framework.alert("請輸入交易金額");}
				//檢查在paymentObject為Ａ時，是否有選繳費對象
				else if($scope.paymentObject == 'A'&& $scope.life5 == undefined){framework.alert("請輸入繳費對象");}
				//檢查南山人壽禁止繳納首期保費
				else if($scope.type11 == '1'){
					framework.alert("首期保費暫不開放網路繳納，請洽臨櫃辦理。");
				}
				
				else {
						$scope.form9 = {};
						$scope.form9.custId = $scope.custId;
						
						//$scope.form9.paymentObject = "N";
						// $scope.form9.paymentObject1 = "南山人壽外幣保險";
					if($scope.paymentObject=="N"|| $scope.life5=="1"){
						$scope.form9.paymentObject1 = "南山人壽外幣保險";
						$scope.form9.paymentObject = "N";
					}
					else if ($scope.paymentObject=="S" || $scope.life5=="2"){
						$scope.form9.paymentObject1 = "新光人壽外幣保險";
						$scope.form9.paymentObject = "S";}
					
						$scope.form9.trnsfrOutAcct = $scope.InAC[$scope.life].acctNo;
						$scope.form9.trnsfrOutCurr = $scope.kkk[$scope.life1];
						//保單編號第一碼轉大寫
						if(($scope.life5 == '1'|| $scope.paymentObject == 'N')){
							$scope.form9.paymentNumber = $scope.trnsAmountNum.toString().substring(0,1).toUpperCase()+$scope.trnsAmountNum.toString().substring(1,10);
						}else{
							$scope.form9.paymentNumber = $scope.trnsAmountNum;
						}
						
						$scope.form9.trnsfrAmount = $scope.trnsAmountStr;
						$scope.form9.trnsToken = trnsToken;
						//alert(JSON.stringify($scope.form9))
						
				// else{	
				// 	$scope.form9 = {};
				// 	$scope.form9.custId = "N123wewfw";
				// 	$scope.form9.paymentObject = "N123wewfw";
				// 	$scope.form9.trnsfrOutAcct = "N123wewfw";
				// 	$scope.form9.trnsfrOutCurr = "N123wewfw";
				// 	$scope.form9.paymentNumber = "N123wewfw";
				// 	$scope.form9.trnsfrAmount = "N123wewfw";
				// 	$scope.form9.trnsToken = "N123wewfw";
						var params = {
					
							//OutacctNo : $scope.InAC[$scope.life].acctNo,
							//InacctNo :	$scope.InAC11[$scope.life1].acctNo,
							securityType :{},
							form9: $scope.form9

						};
						
						$state.go('ForeignInsuranceCheck',params,{location: 'replace'});
					
				}
			
			}
			
			

			$scope.clickBack = function () {
				//alert(JSON.stringify($scope.example.value.getDay()));
				
				// framework.backToNative();
				framework.mainPage();
			}
			//回上頁
			//$scope.clickCancel = $scope.clickDisAgree;
			//點選返回
			//$scope.clickBack = $scope.clickDisAgree;
			function getBase64(url){
				//通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片，相比 createElement() 创建 <img> 省去了 append()，也就避免了文档冗余和污染
				//alert("11");
				var Img = new Image(),
					dataURL='';
				Img.src=url;
				Img.onload=function(){ //要先确保图片完整获取到，这是个异步事件
					var canvas = document.createElement("canvas"), //创建canvas元素
						width=Img.width, //确保canvas的尺寸和图片一样
						height=Img.height;
						//alert(height);
					canvas.width=width;
					canvas.height=height;
					canvas.getContext("2d").drawImage(Img,0,0,width,height); //将图片绘制到canvas中
					dataURL=canvas.toDataURL('image/jpeg'); //转换图片为dataURL
					//alert(dataURL);
					$scope.base22=dataURL;
				};
			}
			
			getBase64('ui/images/id_02.jpg');
			
			// getBase64('ui/images/id_02.jpg',(dataURL)=>{
			// 	alert(dataURL);
			// 	console.log(dataURL);
			// 	$scope.dataURL=dataURL;
				
			// });
		
	//=====[ END]=====//
})

});