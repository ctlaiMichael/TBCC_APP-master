/**
 * [imageUpload Directive] 圖片上傳
 */
define([
	'app'
	,'components/hitrust/HtCamera'
	,'directive/checkDirective'
],function(MainApp,HtCamera){

/**
 * [imageUploadDirective] 圖片上傳
 * @param  {object}	$scope.imageUploadSet	[imageUploadDirective設定]
 *         list : {
 *         		'編號key' : {	name : '顯示名稱',max_num : 最大數量},
 *         		'key2' : {	name : '檔案類型二',max_num : 2}
 *         },
 *         show_btn : {close : '稍後上傳'},
 *         button_row : {
 *				'btn_key' : {
 *					name : '顯示名稱',
 *					success: function(){ click duccess event}
 *				},
 *				'btn2' : {
 *					name : '下一步',
 *					success: $scope.testEvent
 *				}
 *         }
 *
 */
MainApp.register.directive('imageUploadDirective', function(
	$compile,$q
	,framework,i18n
){
	var DebugMode = framework.getConfig("OFFLINE", 'B');
	var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
	var linkFun = function($scope, iElm, iAttrs, controller)
	{
		// console.log($scope.imageUploadSet);
		if(typeof $scope.imageUploadSet !== 'object' || typeof $scope.imageUploadSet.list !== 'object' ){
			return false;
		}
		//==參數調整==//
		$scope.imageUploadData = {}; //最後的圖片清單
		$scope.image_num_list = {
			max : {},
			have : {}
		};
		$scope.upload_key = '';
		$scope.view_obj;
		$scope.append_image_num = 0;
		$scope.show_btn = {
			close : '',
			upload : '確定',
			camera : '開啟相機',
			photo : '開啟相簿'
		};
		if(typeof $scope.imageUploadSet.show_btn !== 'undefined'){
			angular.merge($scope.show_btn,$scope.imageUploadSet.show_btn);
		}

		//==物件==//
		var popup_upload = angular.element('#popup_upload');
		var upload_box = angular.element(popup_upload).find('.ca_upload_frame'); //上傳box
		var view_box = angular.element(popup_upload).find('.ca_show_frame'); //檢視box

		//==產生upload body==//
		var tmp_html = '';
		var tmp_show = {};
		var tmp_obj = {};
		for(key in $scope.imageUploadSet.list)
		{
			tmp_obj = $scope.imageUploadSet.list[key];
			tmp_show = {
				max : ''
			};
			$scope.image_num_list.have[key] = 0;
			$scope.image_num_list.max[key] = 1;
			if(tmp_obj.max_num && tmp_obj.max_num > 1){
				tmp_show.max = '(最多'+tmp_obj.max_num+'件)';
				$scope.image_num_list.max[key] = tmp_obj.max_num;
			}
			tmp_html += '<div class="pic_upload_frame" data-key="'+key+'">';
			tmp_html += 	'<h4>'+tmp_obj.name+tmp_show.max+'</h4>';
			tmp_html += 	'<div class="pic_upload_list">';
			tmp_html += 	'<a href="javascript:void(0)" class="upload_add"><img src="ui/images/blank.gif" alt=""  class="blank_size"></a>';
			tmp_html += 	'</div>';
			tmp_html += '</div>';
		}
		iElm.find('.bc_frame').before(tmp_html);
		iElm.find('.pic_upload_frame').last().addClass('bottom_space_30');
		//==產生upload body END==//

		if(typeof $scope.imageUploadSet.show_captcha !== 'undefined' && $scope.imageUploadSet.show_captcha){
			tmp_html = '<check-captcha-directive></check-captcha-directive>';
			iElm.find('.bc_frame .row_single2').before($compile(tmp_html)($scope));
		}

		//==產生upload button==//
		if(typeof $scope.imageUploadSet.button_row === 'object')
		{
			tmp_html = '';
			for(key in $scope.imageUploadSet.button_row){
				if(tmp_html !== ''){
					tmp_html += '&nbsp;';
				}
				tmp_html += '<button class="button_confirm" ng-click="imageSuccessEvent(\''+key+'\')">'+$scope.imageUploadSet.button_row[key]['name']+'</button>';
			}
			iElm.find('.bc_frame .row_single2').append($compile(tmp_html)($scope));
		}
		//==產生upload body END==//

		//==圖片增加事件==//
		iElm.find('.upload_add').click(function()
		{
			var pap = angular.element(this).closest('.pic_upload_frame');
			var upload_key = pap.data('key');
			$scope.upload_key = upload_key;

			//==圖片上傳popup重建==//
			$scope.append_image_num = 0;
			//==open==//
			MainUiTool.openPopupUpload('upload');
		});
		//==圖片增加事件 END==//

		//==圖片關閉事件==//
		$scope.imageCloseEvent = function()
		{
			angular.element(popup_upload)
					.find('.ca_upload_frame,.ca_show_frame')
					.removeClass('active');
			angular.element('body').removeClass('opened');
			//==檢查是否允許繼續上傳==//
			var image_box = iElm.find('.pic_upload_frame[data-key='+$scope.upload_key+'] .pic_upload_list .upload_add');
			if($scope.image_num_list.have[$scope.upload_key] >= $scope.image_num_list.max[$scope.upload_key] ){
				image_box.css('display','none');
			}else{
				image_box.css('display','block');
			}
		}
		//==圖片關閉事件 End==//

		var checkMaxImage = function(){
			var upload_key = $scope.upload_key;
			var max_num = (typeof $scope.image_num_list.max[upload_key] !== 'undefined')
							? $scope.image_num_list.max[upload_key]
							: 1;
			var have_num = (typeof $scope.image_num_list.have[upload_key] !== 'undefined')
							? $scope.image_num_list.have[upload_key]
							: 0;
			var do_num = $scope.append_image_num;
			//==上限==//
			if(do_num+have_num >= max_num){
				MainUiTool.openDialog({
					title:'最多上傳'+max_num+'件',
					content:'請稍後上傳<br>或是按下['
							+$scope.show_btn.upload
							+']後並刪除圖片，<br>再重新選取圖片。'
				});
				return false;
			}
			return true;
		}

		//---------------------------[view popup]---------------------------//
		//==圖片顯示事件==//
		var viewImageEvent = function()
		{
			var obj = this;
			$scope.view_obj = obj;
			var pap = angular.element(obj).closest('.pic_upload_frame');
			var upload_key = pap.data('key');
			$scope.upload_key = upload_key;
			var image_data = angular.element(obj).find('.upload_pic').attr('src');
			var option_set = {};
			option_set.content = '<img src="'+image_data+'" />';
			option_set.remove_event = function(){
				//==確認刪除再刪==//
				MainUiTool.openConfirm({
					content : '確認是否刪除?',
					success : function(){
						iElm.find('.pic_upload_frame[data-key='+$scope.upload_key+'] .pic_upload_list').find($scope.view_obj).remove();
						$scope.image_num_list.have[$scope.upload_key]--;
						if($scope.image_num_list.have[$scope.upload_key] < 0){
							$scope.image_num_list.have[$scope.upload_key] = 0;
						}
						$scope.imageCloseEvent();
					}
				});
			} //remove_event END
			//==open==//
			MainUiTool.openPopupUpload('view',option_set);
		}
		//==圖片顯示事件 END==//


		//---------------------------[upload popup]---------------------------//
		//==圖片加入(上傳popup)==//
		var appendImageEvent = function(image_data)
		{
			if(typeof image_data !== 'string'){
				return false;
			}
			var check = checkMaxImage();
			if(!check){
				return false;
			}
			var appendImgHtml = function(imageUri){
				//==加入==//
				var tmp_html = '<a href="javascript:void(0);">';
				tmp_html += '<img src="'+imageUri+'" />';
				tmp_html += '</a>';
				angular.element(upload_box).find('.camera_album_frame').append(tmp_html);
				$scope.append_image_num++;
			}

			msakImage(image_data).then(function(imgUri){
				appendImgHtml(imgUri);
			}).catch(function(imgUri){
				appendImgHtml(imgUri);
			});
		}
		//==圖片加入 END==//

		//==圖片確認事件 imageConfirmEvent==//
		var imageConfirmEvent = function()
		{
			var image_box = iElm.find('.pic_upload_frame[data-key='+$scope.upload_key+'] .pic_upload_list .upload_add');
			if(image_box.length < 1){
				MainUiTool.openDialog({content:'不存在的圖片類型'});
				return false;
			}
			angular.element(upload_box).find('.camera_album_frame img').each(
			function(){
				var image_data = angular.element(this).attr('src');
				if(typeof image_data === 'undefined' || image_data === ''){
					return false;
				}
				var tmp_html = '<a href="javascript:void(0)" class="upload_show">'
							+'<img src="ui/images/blank.gif" alt=""  class="blank_size" />'
							+'<img src="'+image_data+'" alt="" class="upload_pic" />'
							+'</a>';
				image_box.before(function(){
					return angular.element(tmp_html).click(viewImageEvent);
				});
				$scope.image_num_list.have[$scope.upload_key]++;
			});

			// 判斷物件框架內之物件寬高不同，給予不同 class
			iElm.find('.upload_show img.upload_pic').each(function(i,elem){
				var image_obj = $(this);
				var ratio = image_obj.width() / image_obj.height();

				image_obj.addClass((ratio < 1) ? 'portrait' : 'landscape');
			});

			$scope.imageCloseEvent();
		}
		//==imageConfirmEvent END==//

		//==getCameraEvent==//
		var getCameraEvent = function(){
			var check = checkMaxImage();
			if(!check){
				return false;
			}
			var success_method = function(imageUri){
				if(imageUri !== '' ){
					var res = /\.(jpg|png|gif)\b/;
					if(!res.test(imageUri)){
						imageUri = "data:image/jpeg;base64,"+imageUri;
					}
					appendImageEvent(imageUri);
				}else{
					MainUiTool.openDialog({content:i18n.getStringByTag('NACTIVE_MSG.PHOTO')+'(1)'});
				}
			};
			var fail_method = function(error){
				// console.log(error);
				MainUiTool.openDialog({content:i18n.getStringByTag('NACTIVE_MSG.PHOTO')+'(0)'});
			}
			if(OpenNactive){
				HtCamera.openCamera(success_method,fail_method);
			}else if(DebugMode){
				var image_data = 'ui/images/pic_upload_01.jpg';
				success_method(image_data);
			}else{
				MainUiTool.openDialog({content:i18n.getStringByTag('NACTIVE_MSG.CAMERA')});
			}
		}
		//==getCameraEvent END==//

		//==getPhotoEvent==//
		var getPhotoEvent = function(){
			var check = checkMaxImage();
			if(!check){
				return false;
			}
			var success_method = function(imageUri){
				if(imageUri !== '' ){
					var res = /\.(jpg|png|gif)\b/;
					if(!res.test(imageUri)){
						imageUri = "data:image/jpeg;base64,"+imageUri;
					}
					appendImageEvent(imageUri);
				}else{
					MainUiTool.openDialog({content:i18n.getStringByTag('NACTIVE_MSG.PHOTO')+'(1)'});
				}
			};
			var fail_method = function(error){
				// console.log(error);
				// MainUiTool.openDialog({content:i18n.getStringByTag('NACTIVE_MSG.CAMERA_PHOTO')});
				// 相簿可以返回
				MainUiTool.openDialog({content:i18n.getStringByTag('NACTIVE_MSG.PHOTO')+'(0)'});
			}
			if(OpenNactive){
				HtCamera.selectPicFile(success_method,fail_method);
			}else if(DebugMode){
				var image_data = 'ui/images/pic_upload_02.jpg';
				success_method(image_data);
			}else{
				MainUiTool.openDialog({content:i18n.getStringByTag('NACTIVE_MSG.CAMERA_PHOTO')});
			}
		}
		//==getPhotoEvent END==//

		$scope.imageSuccessEvent = function(btn_key){
			$scope.imageUploadData = {};
			iElm.find('.upload_show img.upload_pic').each(function(){
				var imgElm = angular.element(this);
				var pap_key = iElm.find(imgElm).closest('.pic_upload_frame').data('key');
				if(typeof $scope.imageUploadData[pap_key] === 'undefined'){
					$scope.imageUploadData[pap_key] = [];
				}
				var image_data = angular.element(imgElm).attr('src');
				// var image_data = angular.element(imgElm).css('background-image').replace(/^url\(['"]?/,'').replace(/['"]?\)$/,'');
				$scope.imageUploadData[pap_key].push(image_data);
			});
			if(typeof $scope.imageUploadSet.button_row[btn_key]['success'] === 'function'){
				$scope.imageUploadSet.button_row[btn_key]['success'](btn_key);
			}
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
			deferred.resolve(img_url);

			//圖片遮罩檔案過大...
			// //原圖片加载失败
			// imgObj.onerror = function(){
			// 	deferred.reject(img_url);
			// }

			// //原圖片加载成功
			// imgObj.onload = function()
			// {
			// 	var imageWidth = imgObj.width;
			// 	var imageHeight = imgObj.height;
			// 	var mask = document.createElement('img');
			// 	mask.setAttribute('crossOrigin', 'Anonymous');
			// 	mask.src = 'ui/images/tcb_watermarks.png';
			// 	mask.width = imageWidth;
			// 	mask.height = imageHeight;
			// 	//遮罩圖片加載失敗
			// 	mask.onerror = function() {
			// 		deferred.reject(img_url);
			// 	};

			// 	//遮罩圖片加載成功
			// 	mask.onload = function() {
			// 		// deferred.reject(img_url); //關閉浮水印
			// 		//==浮水印==//
			// 		var maskCanvas = document.createElement('canvas');
			// 		var maskContext = maskCanvas.getContext('2d');

			// 		var maskWidth = mask.width;
			// 		var maskHeight = mask.height;

			// 		maskCanvas.width  = imageWidth;
			// 		maskCanvas.height = imageHeight;

			// 		/**
			// 		 * 合并mask与处理后的原始图
			// 		 */
			// 		maskContext.globalAlpha = 0.5;
			// 		maskContext.drawImage(mask, 0, 0, imageWidth, imageHeight);
			// 		//将一个源（新的）图像绘制到目标（已有）的图像上
			// 		// maskContext.globalCompositeOperation = 'destination-over';
			// 		maskContext.globalCompositeOperation = 'lighter';

			// 		maskContext.drawImage(imgObj, 0, 0, imageWidth, imageHeight);

			// 		var newImg = maskCanvas.toDataURL('image/png');
			// 		deferred.resolve(newImg);
			// 	};
			// }
			return promise;
		}

		MainUiTool.initPopupUpload({
			//==btn_left==//
			left_btn : $scope.show_btn.camera,
			left_event : getCameraEvent,
			//==btn_right==//
			right_btn : $scope.show_btn.photo,
			right_event : getPhotoEvent,
			//==btn_check==//
			check_btn : $scope.show_btn.upload,
			check_event : imageConfirmEvent,
			//==關閉==//
			upload_close : $scope.show_btn.close,
			close_event : $scope.imageCloseEvent
		});


	};
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		replace: false,
		templateUrl: 'modules/template/templates/image_upload.html',
		link: linkFun
	};
});
//=====[imageUploadDirective END]=====//


});