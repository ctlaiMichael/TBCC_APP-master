/**
 * [signature Directive] 簽名檔
 */
define([
	'app'
],function(MainApp){

/**
 * [signatureDirective] 簽名檔
 * @param  {object}	$scope.signatureSet	[signatureDirective設定]
 *         list : {
 *         		'key1' : {	name : '檔案類型一',max_num : 3},
 *         		'key2' : {	name : '檔案類型二',max_num : 2}
 *         },
 *         show_btn : {close : '稍後上傳'}
 *
 */
MainApp.register.directive('signatureDirective', function($q){
	var linkFun = function($scope, iElm, iAttrs, controller)
	{
		if(typeof $scope.signatureSet !== 'object'){
			return false;
		}
		$scope.signatureData = ''; //儲存的資料
		//==產生upload button==//
		$scope.signature_check_name = '確定';
		if(typeof $scope.signatureSet.check_name === 'string'){
			$scope.signature_check_name = $scope.signatureSet.check_name;
		}
		//==產生upload body END==//

		//==簽名檔==//
		var draw_flag=0;
		var context;
		var context_top;
		var context_left;
		var start_x=0;
		var start_y=0;
		var end_x=0;
		var end_y=0;
		var demo_box_width = document.getElementById('signatureDemo').offsetWidth;
		var demo_box_height = document.getElementById('signatureDemo').offsetHeight;

		function startDraw(e)
		{
			if(e.clientX){
				start_x = e.clientX - context_left;
				start_y = e.clientY - context_top;
			}else if(typeof e.touches !== 'undefined' && e.touches[0].pageX){
				start_x = e.touches[0].pageX - context_left;
				start_y = e.touches[0].pageY - context_top;
			}else if(typeof e.originalEvent.targetTouches !== 'undefined' &&  e.originalEvent.targetTouches[0].pageX){
				start_x = e.originalEvent.targetTouches[0].pageX - context_left;
				start_y = e.originalEvent.targetTouches[0].pageY - context_top;
			}else{
				start_x = e.pageX - context_left;
				start_y = e.pageY - context_top;
			}
			setDrawFlag(1);
		}

		function setDrawFlag(flag){
			draw_flag=flag;
		}

		function drawLine(e)
		{
			if(draw_flag!==1){
				return false;
			}
			context.moveTo(start_x,start_y);
			if(e.clientX){
				end_x = e.clientX - context_left;
				end_y = e.clientY - context_top;
			}else if(typeof e.touches !== 'undefined' && e.touches[0].pageX){
				end_x = e.touches[0].pageX - context_left;
				end_y = e.touches[0].pageY - context_top;
			}else if(typeof e.originalEvent.targetTouches !== 'undefined' &&  e.originalEvent.targetTouches[0].pageX){
				end_x = e.originalEvent.targetTouches[0].pageX - context_left;
				end_y = e.originalEvent.targetTouches[0].pageY - context_top;
			}else{
				end_x = e.pageX - context_left;
				end_y = e.pageY - context_top;
			}
			context.lineTo(end_x,end_y);
			start_x = end_x;
			start_y = end_y;
			context.stroke();
		}

		function checkCanvasEmpty(imageUrl,dpi){
			var blankCanvas = document.createElement('canvas');
			var blanktxt;

			blankCanvas.className = "signature_area";
			blanktxt = blankCanvas.getContext("2d");
			blanktxt.canvas.width = demo_box_width;
			blanktxt.canvas.height = demo_box_height;
			blanktxt.clearRect(0,0,blanktxt.canvas.width,blanktxt.canvas.height); // Clears the canvas

			blanktxt.fillStyle = '#FFF';
			blanktxt.fillRect(0,0,blanktxt.canvas.width,blanktxt.canvas.height);

			blanktxt.strokeStyle = "#000000";
			blanktxt.lineJoin = "round";
			blanktxt.lineWidth = 2;

			//console.log(imageUrl.length);
			if(imageUrl !== blankCanvas.toDataURL("image/jpeg", dpi) && imageUrl.length > 5099){
				return true;
			}
			return false;
		}

		$scope.clearPainter = function()
		{
			var demoBox = document.getElementById('signatureDemo');
			var myCanvas = document.getElementById('signatureCanvas');
			context = myCanvas.getContext("2d");
			// context.canvas.width = iElm.find(demoBox).width();
			// context.canvas.height = iElm.find(demoBox).height();
			context.canvas.width = demo_box_width;
			context.canvas.height = demo_box_height;
			context.clearRect(0,0,context.canvas.width,context.canvas.height); // Clears the canvas

			//==signatureDemo是否啟動==//
			angular.element(demoBox).fadeIn();
			angular.element(myCanvas).fadeOut();
		}

		$scope.initPainter = function()
		{
			var demoBox = document.getElementById('signatureDemo');
			var myCanvas = document.getElementById('signatureCanvas');
			var canvasSection = document.getElementById('MainBox');
			angular.element(demoBox).fadeOut();
			angular.element(myCanvas).fadeIn();

			context_top = canvasSection.offsetTop + myCanvas.offsetTop;
			context_left = canvasSection.offsetLeft + myCanvas.offsetLeft;

			context = myCanvas.getContext("2d");
			// context.canvas.width = demoBox.offsetWidth;
			// context.canvas.height = demoBox.offsetHeight;
			context.canvas.width = demo_box_width;
			context.canvas.height = demo_box_height;
			context.clearRect(0,0,context.canvas.width,context.canvas.height); // Clears the canvas

			context.fillStyle = '#FFF';
			context.fillRect(0,0,context.canvas.width,context.canvas.height);

			var startInit = function(){
				context.strokeStyle = "#000000";
				context.lineJoin = "round";
				context.lineWidth = 2;

				iElm.find(myCanvas).unbind('mousedown touchstart mousemove touchmove mouseup mouseout touchend touchcancel');
				iElm.find(myCanvas).bind('mousedown touchstart',function(event){
					startDraw(event);
				});
				iElm.find(myCanvas).bind('mousemove touchmove',function(event){
					drawLine(event);
				});
				iElm.find(myCanvas).bind('mouseup mouseout touchend touchcancel',function(event){
					setDrawFlag(0);
				});
			}

			//==浮水印==//
			var mask = document.createElement('img');
			mask.setAttribute('crossOrigin', 'Anonymous');
			mask.src = 'ui/images/tcb_watermarks.png';

			mask.width = demo_box_width;
			mask.height = demo_box_height;
			//遮罩圖片加載失敗
			mask.onerror = function() {
				startInit();
			};
			mask.onload = function() {
				// context.globalAlpha = 0.5;
				// context.drawImage(mask, 0, 0, demo_box_width, demo_box_height);
				startInit();
			};


		}

		/**
		 * [msakImage 圖片遮罩]
		 * @param  {[type]} img_url      [description]
		 * @return {[type]}              [description]
		 */
		var msakImage = function(img_url)
		{
			var deferred = $q.defer();
			var promise = deferred.promise;
			var imgObj = document.createElement('img');
			imgObj.setAttribute('crossOrigin', 'Anonymous'); //解決跨域問題
			imgObj.src = img_url;

			//原圖片加载失败
			imgObj.onerror = function(){
				deferred.reject(img_url);
			}

			//原圖片加载成功
			imgObj.onload = function()
			{
				var imageWidth = imgObj.width;
				var imageHeight = imgObj.height;
				var mask = document.createElement('img');
				mask.setAttribute('crossOrigin', 'Anonymous');
				mask.src = 'ui/images/tcb_watermarks.png';
				mask.width = imageWidth;
				mask.height = imageHeight;
				//遮罩圖片加載失敗
				mask.onerror = function() {
					deferred.reject(img_url);
				};

				//遮罩圖片加載成功
				mask.onload = function() {
					// deferred.reject(img_url); //關閉浮水印
					//==浮水印==//
					var maskCanvas = document.createElement('canvas');
					var maskContext = maskCanvas.getContext('2d');

					var maskWidth = mask.width;
					var maskHeight = mask.height;

					maskCanvas.width  = imageWidth;
					maskCanvas.height = imageHeight;

					/**
					 * 合并mask与处理后的原始图
					 */
					maskContext.globalAlpha = 0.5;
					maskContext.drawImage(mask, 0, 0, imageWidth, imageHeight);
					//将一个源（新的）图像绘制到目标（已有）的图像上
					// maskContext.globalCompositeOperation = 'destination-over';
					maskContext.globalCompositeOperation = 'lighter';

					maskContext.drawImage(imgObj, 0, 0, imageWidth, imageHeight);

					var newImg = maskCanvas.toDataURL();
					deferred.resolve(newImg);
				};
			}
			return promise;
		}

		$scope.signatureSuccess = function(){
			setDrawFlag(0); //確認stop canvas
			var myCanvas = document.getElementById('signatureCanvas');

			var fullQuality = myCanvas.toDataURL("image/jpeg", 1.0);

			// var mediumQuality = myCanvas.toDataURL("image/jpeg", 0.5);
			// var lowQuality = myCanvas.toDataURL("image/jpeg", 0.1);
			// window.open(fullQuality);
			// window.open(mediumQuality);
			// window.open(lowQuality);

			if(!context || document.getElementById('signatureDemo').style.display !== 'none'){
				MainUiTool.openDialog('請在簽名區塊簽名');
				return false;
			}
			if(!checkCanvasEmpty(fullQuality,1.0)){
				MainUiTool.openDialog('請在簽名區塊簽名!');
				return false;
			}


			msakImage(fullQuality).then(function(imgUri){
				$scope.signatureData = imgUri;
				if(typeof $scope.signatureSet.success === 'function'){
					$scope.signatureSet.success(imgUri);
				}
			}).catch(function(imgUri){
				$scope.signatureData = imgUri;
				if(typeof $scope.signatureSet.success === 'function'){
					$scope.signatureSet.success(imgUri);
				}
			});


		}


		iElm.find('#signatureDemo').bind('mousedown touchstart',function(event){
			$scope.initPainter();
		});
		$scope.initPainter(); //先關閉signatureDemo
	};
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		replace: false,
		templateUrl: 'modules/template/templates/signature.html',
		link: linkFun
	};
});
//=====[signatureDirective END]=====//


});