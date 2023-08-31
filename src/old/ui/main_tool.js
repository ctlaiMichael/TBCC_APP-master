/**
 * [全站主要的效果method]
 * 放入MainUiTool物件內
 * TCBB UI規則：左確認，右取消
 */
(function($,window, document, undefined){
	'use strict';
	var mainClass = function(){}

	mainClass.prototype.soonOpen = function(){
		//alert('本服務即將上線，敬請期待！');
		//==如果有需要顯示popup 請直接改這==//
		// this.openDialog({
		// 	content : '本服務即將上線，敬請期待！',
		// 	footer : '確認'
		// });
	}

	//==右欄控制==//
	mainClass.prototype.rightMenuOpen = function(){
	}

	//==左側側邊欄開闔控制==//
	mainClass.prototype.leftMenuOpen = function(open){
		$(".sub_menu").hide();
		$('.aside_menu li a').removeClass('active');
		if(open){
			setTimeout(function() {$('body').addClass('open');}, 25 );
		}else{
			setTimeout(function() {
				$('body').removeClass('open');
				$(".aside_cover").css("width",$('body').css("width"));
			}, 25 );
		}
	}
	//==左側側邊欄展開控制==//
	mainClass.prototype.leftMenu = function(){
		$(".sub_menu").hide();
		$('.aside_menu li a').click(function() {
			var checkElement = $(this).next();
			if ((checkElement.is('.sub_menu')) && (checkElement.is(':visible'))) {
				checkElement.slideUp(200);
				checkElement.prev().removeClass('active');
				return false;
			}
			if ((checkElement.is('.sub_menu')) && (!checkElement.is(':visible'))) {
				$('.aside_menu ul:visible').not(checkElement.parentsUntil('.aside_menu')).slideUp(200).prev().removeClass('active');
				checkElement.slideDown(200);
				checkElement.prev().addClass('active');
				return false;
			}
		});
		$('.current-menu-item').parentsUntil('.aside_menu').slideDown('normal');
		$('.aside_menu li').has('.sub_menu').children('a').addClass('has_acc');
	}

	//==主要區塊section控制==//
	mainClass.prototype.setSectionClass = function(set_class,remove){
		if(typeof set_class !== 'string'){
			return false;
		}
		if(remove){
			$('#MainBox').removeClass(set_class);
		}else{
			$('#MainBox').addClass(set_class);
		}
	}

	//==取得按鈕html==//
	mainClass.prototype.createBtnHtml = function(button_set)
	{
		var html_data = '';
		if(typeof button_set !== 'object'){
			return html_data;
		}
		var tmp_obj,tmp_set;
		for(key in button_set)
		{
			tmp_obj = button_set[key];
			tmp_set = {
				name : '',
				class: 'button_submit' //button_cancel,button_submit,button_disable
			};
			if(typeof tmp_obj.name === 'string' ){
				tmp_set.name = tmp_obj.name;
			}
			if(typeof tmp_obj.class === 'string' ){
				tmp_set.class = tmp_obj.class;
			}
			if(html_data != ''){
				html_data += '&nbsp;'; //加了比較漂亮
			}
			html_data += '<button class="button '+tmp_set.class+'">'+tmp_set.name+'</button>';
		}
		return html_data;
	}

	/**
	 * [openPopupInformation 彈跳資訊頁視窗]
	 * @param  {[type]} other_set [description]
	 * @return {[type]}           [description]
	 * demo:
			MainUiTool.openPopupInformation({
				title: agree_obj.title,
				content:agree_obj.content,
				//button:[{name:'取消',class:'button_cancel'},{name:'上一步'}]
				//footer:'關閉'
			});
	 *
	 */
	mainClass.prototype.openPopupInformation = function(other_set)
	{
		var open_obj = $('#popup_information');
		if($(open_obj).length <= 0){
			//console.log('no find');
			return false;
		}
		$('body').addClass('opened');
		if(typeof other_set !== 'object'){
			other_set = {};
		}
		var title,content,button,footer = '';

		//==改標題==//
		if(typeof other_set.title === 'string'){
			title = other_set.title;
		}
		//==改內文==//
		if(typeof other_set.content === 'string'){
			content = other_set.content;
		}
		//==改按鈕==//
		$(open_obj).find('.text_content').addClass('no_poppup_bbtn');
		if(typeof other_set.button === 'object'){
			button = this.createBtnHtml(other_set.button);
			$(open_obj).find('.text_content').removeClass('no_poppup_bbtn');
		}
		//==footer顯示==//
		footer = '';
		$(open_obj).find('.poppup_bclose a').removeClass('text_link');
		if(typeof other_set.footer === 'string'){
			footer = other_set.footer;
			$(open_obj).find('.poppup_bclose a').text(footer);
			$(open_obj).find('.poppup_bclose a').addClass('text_link');
		}

		//==完成html==//
		$(open_obj).find('.text_content h3').text(title);
		$(open_obj).find('.poppup_bbtn').html(button);
		$(open_obj).find('.text_content p').html(content);
		$(open_obj).removeClass('close').addClass('active');
	}

	/**
	 * [openPopupMessage 彈跳錯誤訊息視窗]
	 * @param  {[type]} other_set [description]
	 * @return {[type]}           [description]
	 * demo:
			MainUiTool.openPopupMessage({
				title: 'error infomation',
				content: 'error infomation',
				footer:'關閉'
			});
	 *
	 */
	mainClass.prototype.openDialog = function(other_set)
	{
		var open_obj = $('#popup_dialog');
		if($(open_obj).length <= 0){
			return false;
		}
		if(typeof other_set !== 'object'){
			other_set = (typeof other_set === 'string') ? {content:other_set} :{};
		}
		var title,content,footer;

		//==改標題==//
		title = '';
		if(typeof other_set.title === 'string'){
			title = other_set.title;
		}
		//==改內文==//
		content = '&nbsp;';
		if(typeof other_set.content === 'string'){
			content = other_set.content;
		}
		//==footer顯示==//
		// footer = '<div class="row_single"><button class="button_confirm popup_popup_dismiss">確定</button></div>';
		footer = '<button class="button button_cancel popup_popup_dismiss btn_close">取消</button>';
		if(typeof other_set.footer === 'string'){
			footer = '<button class="button button_cancel popup_popup_dismiss">'+other_set.footer+'</button>';
		}

		if(typeof $.magnificPopup.instance.isOpen !== 'undefined' && $.magnificPopup.instance.isOpen){
			// console.log($.magnificPopup.instance.isOpen);
			//沒關閉前不動作
			return false;
		}
		//==完成html==//
		$(open_obj).find('.in_sub_title').css('display','none');
		if(typeof title !== 'undefined' && title !== ''){
			$(open_obj).find('.in_sub_title').text(title).css('display','block');
		}
		$(open_obj).find('p').html(content);
		$(open_obj).find('.button_row').empty().append(footer);

		$.magnificPopup.open({
			items: {
				src: open_obj,
			},
			type: 'inline',
			modal: true, //設定僅能點選按鈕後關閉視窗，不能點選半透明黑色關閉
			fixedContentPos: true,
			fixedBgPos: true,
			overflowY: 'auto',
			closeBtnInside: true,
			preloader: false,
			midClick: true,
			removalDelay: 300,
			mainClass: 'my-mfp-zoom-in',
			callbacks: {
				open : function(){
					var $content = $(this.content);
					//==close event==//
					$content.find('.popup_popup_dismiss').unbind('click').click(function(e) {
						e.preventDefault();
						$.magnificPopup.close();
					});
				}
			}
		});
	}

	/**
	 * [openPopupMessage 彈跳錯誤訊息視窗]
	 * @param  {[type]} other_set [description]
	 * @return {[type]}           [description]
	 * demo:
			MainUiTool.openPopupMessage({
				title: 'error infomation',
				content: 'error infomation',
				footer:[0:'取消','1':'確認']
			});
	 *
	 */
	mainClass.prototype.openConfirm = function(other_set)
	{
		var open_obj = $('#popup_dialog');
		if($(open_obj).length <= 0){
			return false;
		}
		if(typeof other_set !== 'object'){
			other_set = (typeof other_set === 'string') ? {content:other_set} :{};
		}
		var title,content,footer;

		//==改標題==//
		title = '';
		if(typeof other_set.title === 'string'){
			title = other_set.title;
		}
		//==改內文==//
		content = '&nbsp;';
		if(typeof other_set.content === 'string'){
			content = other_set.content;
		}

		//==footer顯示==//
		var footer_str = ['取消','確定'];
		if(typeof other_set.footer === 'object'){
			footer_str[1] = (typeof other_set.footer[1] === 'string') ? other_set.footer[1] : '確定';
			footer_str[0] = (typeof other_set.footer[0] === 'string') ? other_set.footer[0] : '取消';
		}
		footer = '';
		// 轉置案左右切換
		footer += '<button class="button button_cancel popup_popup_dismiss confirmbox_cancel">'+footer_str[0]+'</button>';
		footer += '<button class="button button_cancel popup_popup_dismiss confirmbox_success">'+footer_str[1]+'</button>';

		//==success==//
		if(typeof other_set.success !== 'function' ){
			other_set.success = function(){};
		}
		//==error==//
		if(typeof other_set.cancel !== 'function' ){
			other_set.cancel = function(){};
		}

		if(typeof $.magnificPopup.instance.isOpen !== 'undefined' && $.magnificPopup.instance.isOpen){
			// console.log($.magnificPopup.instance.isOpen);
			//沒關閉前不動作
			return false;
		}
		//==完成html==//
		$(open_obj).find('.in_sub_title').css('display','none');
		if(typeof title !== 'undefined' && title !== ''){
			$(open_obj).find('.in_sub_title').text(title).css('display','block');
		}
		$(open_obj).find('p').html(content);
		$(open_obj).find('.button_row').empty().append(footer);

		$.magnificPopup.open({
			items: {
				src: open_obj,
			},
			type: 'inline',
			modal: true, //設定僅能點選按鈕後關閉視窗，不能點選半透明黑色關閉
			fixedContentPos: true,
			fixedBgPos: true,
			overflowY: 'auto',
			closeBtnInside: true,
			preloader: false,
			midClick: true,
			removalDelay: 300,
			mainClass: 'my-mfp-zoom-in',
			callbacks: {
				open : function(){
					var $content = $(this.content);
					//==cancel event==//
					$content.find('.popup_popup_dismiss.confirmbox_cancel')
						.unbind('click')
						.click(function(e){
							e.preventDefault();
							$.magnificPopup.close();
							other_set.cancel();
						});
					//==success event==//
					$content.find('.popup_popup_dismiss.confirmbox_success')
						.unbind('click')
						.click(function(e){
							e.preventDefault();
							$.magnificPopup.close();
							other_set.success();
						});
				}
			}
		});
	}

	/**
	 * [initPopupUpload 定義圖片上傳popup]
	 * @param  {[type]} other_set [參數設定]
	 * @return {[type]}          [description]
	 */
	mainClass.prototype.initPopupUpload = function(other_set)
	{
		var open_obj = $('#popup_upload');
		if($(open_obj).length <= 0){
			return false;
		}
		//==popup 初始化==//
		var upload_box = $(open_obj).find('.ca_upload_frame'); //上傳box
		var view_box = $(open_obj).find('.ca_show_frame'); //檢視box
		//---[上傳]---//
		var main_box = $(upload_box).find('.camera_album_frame');
		var btn_box = $(upload_box).find('.ca_button');
		var upload_close = $(upload_box).find('.poppup_bclose a');
		var left_btn = $(btn_box).find('.ca_btn_l');
		var right_btn = $(btn_box).find('.ca_btn_r');
		var check_btn = $(btn_box).find('.ca_sumbit');
		//---[檢視]---//
		var view_close = $(view_box).find('.poppup_bclose a');
		//==init==//
		$(main_box).empty();
		$(upload_close,view_close).removeClass('text_link');
		$(left_btn,right_btn,check_btn,upload_close).unbind('click'); //防止事件重複宣告

		//==顯示處理==//
		//---[左按鈕]---//
		if(typeof other_set.left_btn === 'string' && other_set.left_btn !== ''){
			$(left_btn).find('span').text(other_set.left_btn);
		}
		//---[右按鈕]---//
		if(typeof other_set.right_btn === 'string' && other_set.right_btn !== ''){
			$(right_btn).find('span').text(other_set.right_btn);
		}
		//---[確認按鈕]---//
		if(typeof other_set.check_btn === 'string' && other_set.check_btn !== ''){
			$(check_btn).find('span').text(other_set.check_btn);
		}
		//---[關閉]---//
		if(typeof other_set.upload_close === 'string' && other_set.upload_close !== ''){
			$(upload_close).text(other_set.upload_close);
			$(upload_close).addClass('text_link');
		}

		//==event==//
		//---[左事件]---//
		if(typeof other_set.left_event === 'function'){
			$(left_btn).unbind('click').click(other_set.left_event);
		}
		//---[右事件]---//
		if(typeof other_set.right_event === 'function'){
			$(right_btn).unbind('click').click(other_set.right_event);
		}
		//---[確認事件]---//
		if(typeof other_set.check_event === 'function'){
			$(check_btn).unbind('click').click(other_set.check_event);
		}
		//---[關閉事件]---//
		var close_event = function(){
			$(open_obj).find('.ca_upload_frame,.ca_show_frame').removeClass('active');
			$('body').removeClass('opened');
		}
		if(typeof other_set.close_event === 'function'){
			close_event = other_set.close_event;
		}
		$(upload_close).unbind('click').click(close_event);
		$(view_close).unbind('click').click(close_event);


	}

	/**
	 * [openPopupUpload 開啟圖片上傳]
	 * @return {[type]}          [description]
	 */
	mainClass.prototype.openPopupUpload = function(open_box,other_set){
		var open_obj = $('#popup_upload');
		var show_box;

		//==特殊處理==//
		if(typeof other_set !== 'object'){
			other_set = {};
		}

		switch(open_box){
			case 'upload': //上傳box
				show_box = $(open_obj).find('.ca_upload_frame');
			break;
			case 'view'://檢視box
				show_box = $(open_obj).find('.ca_show_frame');
				$(show_box).find('.upload_delete').unbind('click');
				if(typeof other_set.remove_event === 'function'){
					$(show_box).find('.upload_delete').click(other_set.remove_event);
				}
			break;
			default:
				return false;
			break;
		}
		//==內容重建==//
		$(show_box).find('.camera_album_frame').empty();
		if(typeof other_set.content !== 'undefined'){
			$(show_box).find('.camera_album_frame').append(other_set.content);
		}

		//==open==//
		$('body').addClass('opened');
		$(show_box).addClass('active');
	}


	/**
	 * [closePopupWindow 關閉彈跳視窗]
	 * @param  {[type]} close_obj [關閉的obj名稱]
	 * @return {[type]}           [description]
	 */
	mainClass.prototype.closePopupWindow = function(close_obj){
		$('body').removeClass('opened');
		if(!$(close_obj).hasClass('poppup_window_frame')){
			close_obj = $(close_obj).closest('.poppup_window_frame');
		}
		$(close_obj).removeClass('active').addClass('close');
		document.getElementById("MainBox").style.overflowY = 'auto';
	}

	/**
	 * [showProgressBar 進度條]
	 * @param  {number}	showBoxStep		[當前step]
	 * @param  {object}	set_object	[templateProgressBar設定]
	 * 					bar : {step:name} //進度條設定
	 *      			event : 進度條click事件，沒有就不會執行
	 */
	mainClass.prototype.showProgressBar = function(showBoxStep,set_object){
		var pap_obj = '#FixBox';
		var list_obj = '.sub_info_frame ul li';
		if(typeof showBoxStep === 'undefined'){
			showBoxStep = 1;
		}
		if(typeof set_object === 'undefined'){
			if($(pap_obj).find(list_obj+'[data-step='+showBoxStep+']').length > 0){
				$(pap_obj).find(list_obj).removeClass('step_active');
				$(pap_obj).find(list_obj+' span').css("display","none");
				$(pap_obj).find(list_obj+'[data-step='+showBoxStep+']').addClass('step_active');
				$(pap_obj).find(list_obj+'[data-step='+showBoxStep+'] span').css("display","inline-block");
			}
			return true;
		}
		if(typeof set_object !== 'object'){
			set_object = {bar:{},event:false};
		}
		var tmp_html = '<div class="sub_info_frame"><ul class="step_bar_frame">';
		for(key in set_object.bar){
			tmp_html += '<li data-step="'+key+'" class="step_bar">';
			//if(key == showBoxStep){
				tmp_html += '<span>'+key+'.'+set_object.bar[key]+'</span>';
			//}
			tmp_html += '</li>';
		}
		tmp_html += '</ul></div>';
		$(pap_obj).empty().append(tmp_html);
		//==click==//
		$(pap_obj).find(list_obj).click(function(){
			var step = $(this).data('step');
			set_object.event(step); //其他event
		});
		$(".sub_info_frame").css("margin-top","-10px");
		this.showProgressBar(showBoxStep);
	}



	/**
	 * [showMenu 子選單]
	 * @param  {number}	showBoxStep		[當前step]
	 * @param  {object}	set_object	[templateProgressBar設定]
	 * 					bar : {step:name} //進度條設定
	 *      			event : 進度條click事件，沒有就不會執行
	 */
	mainClass.prototype.showMenu = function(showBoxStep,set_object){
		var pap_obj = '#FixBox';
		var list_obj = '.tab_title a';
		if(typeof showBoxStep === 'undefined'){
			showBoxStep = 1;
		}
		if(typeof set_object === 'undefined'){
			if($(pap_obj).find(list_obj+'[data-step='+showBoxStep+']').length > 0){
				$(pap_obj).find(list_obj).removeClass('active');
				$(pap_obj).find(list_obj+'[data-step='+showBoxStep+']').addClass('active');
			}
			return true;
		}
		if(typeof set_object !== 'object'){
			set_object = {menu:{},event:false};
		}
		var tmp_html = '<div class="tab_title">';
		var tmp_show = {};
		for(key in set_object.menu)
		{
			tmp_show = set_object.menu[key];
			if(typeof tmp_show !== 'object'){
				tmp_show = {
					name : set_object.menu[key]
				};
			}
			tmp_html += '<a href="javascript:void(0);" data-step="'+key+'">'+tmp_show.name+'</a>';
		}
		tmp_html += '</div>';
		$(pap_obj).empty().append(tmp_html);
		//==click==//
		$(pap_obj).find(list_obj).click(function(){
			var step = $(this).data('step');
			MainUiTool.showMenu(step);
			set_object.event(step); //其他event
		});
		this.showMenu(showBoxStep);
	}

	//Add by Ivan 2018.5.24
		/**
	 * [openPopupMessage 彈跳錯誤訊息視窗]
	 * @param  {[type]} other_set [description]
	 * @return {[type]}           [description]
	 * demo:
			MainUiTool.openPopupMessage({
				title: 'error infomation',
				content: 'error infomation',
				footer:'關閉'
			});
	 *
	 */
	mainClass.prototype.openBiometry = function(other_set)
	{
		var open_obj = $('#biometric_dialog');
		if($(open_obj).length <= 0){
			return false;
		}
		if(typeof other_set !== 'object'){
			other_set = (typeof other_set === 'string') ? {content:other_set} :{};
		}
		var title,content,footer;

		//==改標題==//
		title = '';
		if(typeof other_set.title === 'string'){
			title = other_set.title;
		}
		//==改內文==//
		content = '&nbsp;';
		if(typeof other_set.content === 'string'){
			content = other_set.content;
		}
		//==footer顯示==//
		footer = '<button id="openBiometry" class="button button_cancel popup_popup_dismiss biometric_btn_close">確定</button>';
		if(typeof other_set.footer === 'string'){
			footer = '<button id="openBiometry" class="button button_cancel popup_popup_dismiss">'+other_set.footer+'</button>';
		}

		//==success==//
		if(typeof other_set.success !== 'function' ){
			other_set.success = function(){};
		}
		//==error==//
		if(typeof other_set.cancel !== 'function' ){
			other_set.cancel = function(){};
		}

		if(typeof $.magnificPopup.instance.isOpen !== 'undefined' && $.magnificPopup.instance.isOpen){
			// console.log($.magnificPopup.instance.isOpen);
			//沒關閉前不動作
			return false;
		}
		//==完成html==//
		$(open_obj).find('.in_sub_title').css('display','none');
		if(typeof title !== 'undefined' && title !== ''){
			$(open_obj).find('.in_sub_title').text(title).css('display','block');
		}
		$(open_obj).find('p').html(content);
		$(open_obj).find('.button_row').empty().append(footer);

		$.magnificPopup.open({
			items: {
				src: open_obj,
			},
			type: 'inline',
			modal: true, //設定僅能點選按鈕後關閉視窗，不能點選半透明黑色關閉
			fixedContentPos: true,
			fixedBgPos: true,
			overflowY: 'auto',
			closeBtnInside: true,
			preloader: false,
			midClick: true,
			removalDelay: 300,
			mainClass: 'my-mfp-zoom-in',
			callbacks: {
				open : function(){
					var $content = $(this.content);
					//==close event==//
					$content.find('.popup_popup_dismiss').unbind('click').click(function(e) {
						e.preventDefault();
						$.magnificPopup.close();
						other_set.success();
						localStorage.setItem('fromFirst','0');
						localStorage.setItem('fromPay','0');
						localStorage.setItem('fromBoth','0');
						localStorage.setItem('fromSetting','0');
						plugin.tcbb.fastAESDecode([localStorage.getItem('loginname'), localStorage.getItem('loginuser')], function(loginResult){
						    plugin.tcbb.fastAESEncode([loginResult.custId,loginResult.userId], function(result){
								localStorage.setItem('comparename',result.custId);
								localStorage.setItem('compareuser',result.userId);
							})
						})	
						
						//plugin.bank.LoginClose(function(){} ,function(){});
						
					});
				}
			}
		});
	}


	/**
	 * [openPopupMessage 彈跳錯誤訊息視窗]
	 * @param  {[type]} other_set [description]
	 * @return {[type]}           [description]
	 * demo:
			MainUiTool.openPopupMessage({
				title: 'error infomation',
				content: 'error infomation',
				footer:[0:'取消','1':'確認']
			});
	 *
	 */
	mainClass.prototype.openBiometricConfirm = function(other_set)
	{
		var open_obj = $('#biometric_dialog');
		if($(open_obj).length <= 0){
			return false;
		}
		if(typeof other_set !== 'object'){
			other_set = (typeof other_set === 'string') ? {content:other_set} :{};
		}
		var title,content,footer;

		//==改標題==//
		title = '';
		if(typeof other_set.title === 'string'){
			title = other_set.title;
		}
		//==改內文==//
		content = '&nbsp;';
		if(typeof other_set.content === 'string'){
			content = other_set.content;
		}

		//==footer顯示==//
		var footer_str = ['同意','不同意'];
		if(typeof other_set.footer === 'object'){
			footer_str[1] = (typeof other_set.footer[1] === 'string') ? other_set.footer[1] : '不同意';
			footer_str[0] = (typeof other_set.footer[0] === 'string') ? other_set.footer[0] : '同意';
		}
		footer = '';
		
		footer += '<span class="button_border"><button id="openBiometricConfirm" class="button button_cancel popup_popup_dismiss bio-confirmbox_cancel">'+footer_str[0]+'</button></span>';
		
		footer += '<button id="openBiometricConfirm" class="button button_cancel popup_popup_dismiss confirmbox_success">'+footer_str[1]+'</button>';

		//==success==//
		if(typeof other_set.success !== 'function' ){
			other_set.success = function(){};
		}
		//==error==//
		if(typeof other_set.cancel !== 'function' ){
			other_set.cancel = function(){};
		}

		if(typeof $.magnificPopup.instance.isOpen !== 'undefined' && $.magnificPopup.instance.isOpen){
			// console.log($.magnificPopup.instance.isOpen);
			//沒關閉前不動作
			return false;
		}
		//==完成html==//
		$(open_obj).find('.in_sub_title').css('display','none');
		if(typeof title !== 'undefined' && title !== ''){
			$(open_obj).find('.in_sub_title').text(title).css('display','block');
		}
		$(open_obj).find('p').html(content);
		$(open_obj).find('.button_row').empty().append(footer);

		$.magnificPopup.open({
			items: {
				src: open_obj,
			},
			type: 'inline',
			modal: true, //設定僅能點選按鈕後關閉視窗，不能點選半透明黑色關閉
			fixedContentPos: true,
			fixedBgPos: true,
			overflowY: 'auto',
			closeBtnInside: true,
			preloader: false,
			midClick: true,
			removalDelay: 300,
			mainClass: 'my-mfp-zoom-in',
			callbacks: {
				open : function(){
					var $content = $(this.content);
					//==cancel event==//
					$content.find('.popup_popup_dismiss.bio-confirmbox_cancel')
						.unbind('click')
						.click(function(e){
							e.preventDefault();
							$.magnificPopup.close();
							other_set.success();						});
					//==success event==//
					$content.find('.popup_popup_dismiss.confirmbox_success')
						.unbind('click')
						.click(function(e){
							e.preventDefault();
							$.magnificPopup.close();
							other_set.cancel();
							
						});
				}
			}
		});
	}


	/**
	 * [openPopupMessage 彈跳錯誤訊息視窗]
	 * @param  {[type]} other_set [description]
	 * @return {[type]}           [description]
	 * demo:
			MainUiTool.openPopupMessage({
				title: 'error infomation',
				content: 'error infomation',
				footer:'關閉'
			});
	 *
	 */
	mainClass.prototype.openBioWrong = function(other_set)
	{
		var open_obj = $('#popup_dialog');
		if($(open_obj).length <= 0){
			return false;
		}
		if(typeof other_set !== 'object'){
			other_set = (typeof other_set === 'string') ? {content:other_set} :{};
		}
		var title,content,footer;

		//==改標題==//
		title = '';
		if(typeof other_set.title === 'string'){
			title = other_set.title;
		}
		//==改內文==//
		content = '&nbsp;';
		if(typeof other_set.content === 'string'){
			content = other_set.content;
		}
		//==footer顯示==//
		footer = '<button id="openBioWrong" class="button button_cancel popup_popup_dismiss biometric_btn_close">確定</button>';
		if(typeof other_set.footer === 'string'){
			footer = '<button id="openBioWrong" class="button button_cancel popup_popup_dismiss">'+other_set.footer+'</button>';
		}

		if(typeof $.magnificPopup.instance.isOpen !== 'undefined' && $.magnificPopup.instance.isOpen){
			// console.log($.magnificPopup.instance.isOpen);
			//沒關閉前不動作
			return false;
		}
		//==完成html==//
		$(open_obj).find('.in_sub_title').css('display','none');
		if(typeof title !== 'undefined' && title !== ''){
			$(open_obj).find('.in_sub_title').text(title).css('display','block');
		}
		$(open_obj).find('p').html(content);
		$(open_obj).find('.button_row').empty().append(footer);

		$.magnificPopup.open({
			items: {
				src: open_obj,
			},
			type: 'inline',
			modal: true, //設定僅能點選按鈕後關閉視窗，不能點選半透明黑色關閉
			fixedContentPos: true,
			fixedBgPos: true,
			overflowY: 'auto',
			closeBtnInside: true,
			preloader: false,
			midClick: true,
			removalDelay: 300,
			mainClass: 'my-mfp-zoom-in',
			callbacks: {
				open : function(){
					var $content = $(this.content);
					//==close event==//
					$content.find('.popup_popup_dismiss').unbind('click').click(function(e) {
						e.preventDefault();
						$.magnificPopup.close();
					});
				}
			}
		});
	}


	window.MainUiTool = new mainClass();
})(jQuery,window, document);
