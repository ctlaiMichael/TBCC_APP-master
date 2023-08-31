/**
 * []
 */
define([
	'app'
	,'modules/service/qrcodePay/qrcodePayServices'
	,'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/service/common/openAppUrlServices'
],function(MainApp){

//=====[ START]=====//
MainApp.register.controller('qrcodeRedEnveCtrl',
function(
	$scope,$stateParams,$state,$element,$compile,i18n
	,$rootScope,$timeout, stringUtil, framework, sysCtrl
	,qrcodePayServices
	,qrCodePayTelegram,$css
	, openAppUrlServices
){
	//登出
	// $css.add('ui/newMainPage/css/main.css');
	// $css.add('ui/newMainPage/css/fund.css');
	$scope.logout = function(){
		// sysCtrl.logout();
		// framework.mainPage();
		qrcodePayServices.logout();
	}
	$scope.kkk = $stateParams.kkk;
	//alert($scope.kkk);
	$scope.write = $scope.kkk;
	//alert($scope.write);
	// line分享鍵
	$scope.windowplugins = function () {
		var option = { // type 1 
			message: 'Hi, 我已經預約囉! 到時請看看有沒有收到喔!', // not supported on some apps (Facebook, Instagram)
			subject: '單筆轉帳預約完成', // fi. for email
			//files: [cordova.file.dataDirectory+'ui/images/link_arrow.png'],
			//url:'https://www.google.nl/images/srpr/logo4w.png',
			//files: ['file:///android_asset/www/ui/images/btn_icon05.png'],
			files:[],
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

		//var ddd='http://line.naver.jp/R/msg/text/?'.concat($scope.write);
		
		$scope.getDataUri1 = function(){
			var url_path = "https://line.naver.jp/R/msg/text/?"+ encodeURIComponent($scope.write);
			//alert(url_path);

			openAppUrlServices.openWeb(url_path);
			//window.open("http://line.naver.jp/R/msg/text/?"+$scope.write);
	}
		
		
	//網威訊息分享object內容 start
	//var options = {};
	//圖片base64 
	
	$scope.getDataUri = function(){
		var options ;
		options = {
			message: "", 
			subject: '', 
			files: [], 
			chooserTitle: '' }
		// if($scope.data == '1'){
		//  options = {
		// 	message: "", 
		// 	subject: '', 
		// 	files: [], 
		// 	appPackageName:'line',
			
		// 	chooserTitle: '' 
		// };
		// }else if($scope.data == '2'){
		// 	 	options = {
		// 		message: "", 
		// 		subject: '', 
		// 		files: [], 
		// 		appPackageName:'whatsapp',
				
		// 		chooserTitle: '' 
		// 	};
		// }else if($scope.data == '3'){
		// 	    options = {
		// 		message: "", 
		// 		subject: '', 
		// 		files: [], 
		// 		//appPackageName:'wechat',
				
		// 		chooserTitle: '' 
		// 	};
		// }
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
		         var canvas1 = document.createElement('canvas');
		         canvas1.width = image.width;
		         canvas1.height = image.height;
		     
		         canvas1.getContext('2d').drawImage(image, 0, 0);
		     
		         //增加文字在圖片上
		         
		         
		
		//canvasTextAutoLine("恭喜發財紅包600元恭喜發財紅包600元",canvas1,50,50,50);
		//function canvasTextAutoLine(str,canvas,initX,initY,lineHeight){
		var str = $scope.write;
		var initX = 30;
		var initY = 100;
		var lineHeight = 50;
		var ctx = canvas1.getContext("2d"); 
		ctx.font = "30px Arial";
		           var lineWidth = 0;
		     var canvasWidth = canvas1.width; 
		    var lastSubStrIndex= 0; 
		   for(let i=0;i<str.length;i++){ 
		     lineWidth+=ctx.measureText(str[i]).width; 
		        if(lineWidth>canvasWidth-initX-20){//减去initX,防止边界出现的问题
		           ctx.fillText(str.substring(lastSubStrIndex,i),initX,initY);
		          initY+=lineHeight;
		         lineWidth=0;
		            lastSubStrIndex=i;
		      } 
		     if(i==str.length-1){
		          ctx.fillText(str.substring(lastSubStrIndex,i+1),initX,initY);
		      }
		  }
				var base64text = canvas1.toDataURL('image/png');
				 //把base64text資料放進要傳送object的files files需為array
			 
				 options.files = [base64text];
				//alert(JSON.stringify(options));
		         plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
		        };
		        
		if($scope.pic=='7771'){image.src = "ui/newMainPage/image/7771.png";}
		else if($scope.pic=='6661'){image.src = "ui/newMainPage/image/6661.png";}
		
	}

	

//https://blog.csdn.net/lishihong108/article/details/52483867
	// <canvas id="myCanvas" width="610" height="350" style="border:1px solid #d3d3d3;">
	// Your browser does not support the HTML5 canvas tag.</canvas>
	
	// <script>
	// var c = document.getElementById("myCanvas");
	// var ctx = c.getContext("2d");
	// ctx.font = "40px Arial";
	// canvasTextAutoLine("yuiyiuyiudasdwqewrewrwer11133werwerwerrewwerwerwerrewyiuy",c,50,50,50);
	// function canvasTextAutoLine(str,canvas,initX,initY,lineHeight){
	// 	var ctx = canvas.getContext("2d"); 
	// 	var lineWidth = 0;
	// 	var canvasWidth = c.width; 
	// 	var lastSubStrIndex= 0; 
	// 	for(let i=0;i<str.length;i++){ 
	// 		lineWidth+=ctx.measureText(str[i]).width; 
	// 		if(lineWidth>canvasWidth-initX){//减去initX,防止边界出现的问题
	// 			ctx.fillText(str.substring(lastSubStrIndex,i),initX,initY);
	// 			initY+=lineHeight;
	// 			lineWidth=0;
	// 			lastSubStrIndex=i;
	// 		} 
	// 		if(i==str.length-1){
	// 			ctx.fillText(str.substring(lastSubStrIndex,i+1),initX,initY);
	// 		}
	// 	}
	//   }
	

	$scope.getData11 = function(){
		alert("111"+$scope.write);
		alert("222"+$scope.imgg);
		alert("333"+$scope.pic);
		
		alert("444"+JSON.stringify(options));

	}
	//getDataUri('新年紅包', './newyear.jpg');

	//getDataUri('新年紅包', 'ui/images/id_02.jpg');
	//網威訊息分享object內容 end	

	/**
	 * 點選取消
	 */
	$scope.clickCancel = function(){
		qrcodePayServices.closeActivity();
	}
	//點選返回
	$scope.clickBack = $scope.clickCancel;
	document.addEventListener("backbutton", $scope.clickBack, false);

});
//=====[ END]=====//


});
