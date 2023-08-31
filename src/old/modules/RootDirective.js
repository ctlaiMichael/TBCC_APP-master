/**
 * [RootDirectiveApp 全APP的directive]
 */
var RootDirectiveApp =angular.module('RootDirectiveApp', [
	'angularTranslate' //i18n (預防app.js未載入)
]);


/**
 * [identityMaskDirective 身分證遮罩]
 */
RootDirectiveApp.directive('identityMaskDirective', function(i18n)
{
	var linkFun = function($scope, iElm, iAttrs, ctrl)
	{
		iElm.prop('autocomplete','off');
		//--取得input位置 end--//
		var getCursorPosition = function(obj)
		{
			var input = $(obj).get(0);
			if (!input) return; // No (input) element found
			if ('selectionStart' in input) {
				// Standard-compliant browsers
				return input.selectionStart;
			} else if (document.selection) {
				// IE
				input.focus();
				var sel = document.selection.createRange();
				var selLen = document.selection.createRange().text.length;
				sel.moveStart('character', -input.value.length);
				return sel.text.length - selLen;
			}
		}
		//--遮罩--//
		var makeHideWord = function(idval)
		{
			if(typeof idval === 'undefined'){
				idval = '';
			}
			var tmp = idval;
			var strlen = idval.length;
			if (strlen > 4){
				tmp = idval.substring(0,3);
				if(strlen < 8){
					tmp += Array(strlen-4+1).join("●");
					tmp += idval.substring(strlen-1,strlen);
				}else{
					tmp += "●●●●" + idval.substring(7,strlen);
				}
			}
			return tmp;
		}
		var show_inp = iElm;
		if(show_inp.length !== 1){
			return false;
		}
		iElm.attr('maxlength','');
		iElm.data('realvalue','');

		//==針對手機無偵測刪除事件的特別處理==//
		$scope.$watch(function(){
			return getCursorPosition(iElm);
		}
		,function(){
			var obj = iElm;
			var idval = obj.val();
			var val_length = idval.length;
			var hideval = obj.data('realvalue');
			var position = getCursorPosition(obj);
			var delete_length = hideval.length - val_length;
			if(delete_length === 1){
				hideval = hideval.substring(0,position);
				hideval = hideval.toUpperCase();
				iElm.data('realvalue',hideval);
				iElm.val(makeHideWord(hideval));
			}
		});
		//==輸入==//
		iElm.keyup(function(e)
		{
			var obj = iElm;
			var idval = obj.val();
			var val_length = idval.length;
			var hideval = obj.data('realvalue');
			var keyval = '';
			var position = getCursorPosition(obj);
			var delete_length = hideval.length - val_length;
			keyval = idval.substring(position-1,position);
			if(val_length <= 1){
				hideval = idval;
				keyval = '';
			}
			if(val_length > 10){
				keyval = '';
			}
			if(delete_length === 0){
				keyval = '';
			}

			//==刪除處理==//
			if(delete_length === 1){
				hideval = hideval.substring(0,position);
				keyval = '';
			}
			//==位移輸入處理==//
			if(position != val_length && keyval !== ''){
				var tmp = hideval.substring(0,position-1);
				tmp += keyval;
				tmp += hideval.substring(position-1,hideval.length);
				hideval = tmp;
			}else{
				hideval += keyval;
			}

			hideval = hideval.toUpperCase();
			iElm.data('realvalue',hideval);
			iElm.val(makeHideWord(hideval));
		});
		//==防貼上處理==//
		iElm.focusout(function(){
			var obj = iElm;
			var idval = obj.val();
			var val_length = idval.length;
			var hideval = obj.data('realvalue');
			var delete_length = hideval.length - val_length;
			var res = /[A-Za-z]{1}[0-9]{9}/;
			if(res.test(idval) || hideval===''){
				idval = idval.toUpperCase();
				iElm.data('realvalue',idval);
				iElm.val(makeHideWord(idval));
			}
		});
	}

	//-------------------[輔助method]-------------------//
	return {
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		link: linkFun
	};
});
//==identityMaskDirective END==//


/**
 * [dateMaskDirective 日期遮罩]
 */
RootDirectiveApp.directive('dateMaskDirective', function(i18n)
{
	
	var linkFun = function($scope, iElm, iAttrs, ctrl)
	{
		var show_inp = angular.element(iElm);
		if(show_inp.length !== 1){
			return false;
		}
		var show_error = function(msg){
			MainUiTool.openDialog(msg);
			if(iElm.parent('.row_single').length == 1){
				iElm.parent('.row_single').addClass('input_error');
				if(iElm.parent('.row_single').find('.input_comment').length==1){
					iElm.parent('.row_single').find('.input_comment').text(msg);
				}
			}
		}
		var remove_error = function(){
			if(iElm.parent('.row_single').length == 1){
				iElm.parent('.row_single').removeClass('input_error');
				if(iElm.parent('.row_single').find('.input_comment').length==1){
					iElm.parent('.row_single').find('.input_comment').text('');
				}
			}
		}
		show_inp.focusout(function(e)
		{
			var obj = iElm;
			var obj_val = obj.val();
			obj.data('error','0');

			obj_val = obj_val.replace(/[\-|\.]/g,'/');

			$scope.birthdayData = {
				status : false,
				msg : i18n.getStringByTag('INPUT_CHECK.DATE'),
				formate:'',
				time:0
			};

			var error_flag = false;
			var res = /^[0-9]+$/;
			var res_date = /^[0-9|\/]+$/;
			if(res.test(obj_val))
			{
				var obj_length = obj_val.length;
				var date_list = ['','',''];
				switch(obj_length){
					case 6: //780101 民國78.01.01
					case 7: //1010101 民國101.01.01
						date_list[1] = obj_val.substr(-4,2);
						date_list[2] = obj_val.substr(-2,2);
						date_list[0] = obj_val.replace(obj_val.substr(-4,4),'');
					break;
					case 8://19890101 西元1989.01.01
						date_list[0] = obj_val.substr(0,4);
						date_list[1] = obj_val.substr(4,2);
						date_list[2] = obj_val.substr(6,2);
					break;
					default:
						error_flag = true;
					break;
				}
				obj_val = date_list.join('/');
			}else if(!res_date.test(obj_val)){
				error_flag = true;
			}

			//==民國轉換==//
			var tmp_date = obj_val.split('/');
			if(tmp_date[0] <= 1911 && tmp_date[0].length < 4){
				tmp_date[0] = parseInt(tmp_date[0]) + 1911;
				obj_val = tmp_date.join('/');
			}

			var dt = new Date(obj_val);
			var timestamp = dt.getTime();
			if(!timestamp){
				error_flag = true;
			}
			if(error_flag){
				show_error($scope.birthdayData.msg);
				obj.data('error','1');
				return false;
			}else{
				remove_error();
			}

			var month = dt.getMonth()+1;
			var day = dt.getDate();
			var year = dt.getFullYear();
			if(year < 1){
				show_error($scope.birthdayData.msg);
				return false;
			}else{
				remove_error();
			}
			var data = {};
			data.status = true;
			data.msg = '';
			data.formate = year+'/'+month+'/'+day;
			data.time = timestamp;
			$scope.birthdayData = data;
			obj.val($scope.birthdayData.formate).trigger('change');
			obj.data('error','0');
		});
	};
	//-------------------[輔助method]-------------------//
	return {
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		link: linkFun
	};
});
//==dateMaskDirective END==//


/**
 * [cardYmMaskDirective 有效月年遮罩]
 */
RootDirectiveApp.directive('cardYmMaskDirective', function(i18n)
{
	var linkFun  = function($scope, iElm, iAttrs, ctrl)
	{
		//==input屬性設定==//
		iElm.prop('autocomplete','off');
		iElm.prop('placeholder','MM/YY');
		iElm.prop('maxlength','5');


		iElm.change(function(){
			var data = iElm.val();
			data = data.replace(/(\d{1,2})(\/|)(\d{2})/,'$1/$3');
			iElm.val(data);
		});
	};
	//-------------------[輔助method]-------------------//
	return {
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		link: linkFun
	};
});
//==cardYmMaskDirective END==//