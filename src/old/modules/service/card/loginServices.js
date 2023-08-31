/**
 * [登入相關]
 */
define([
	"app"
	,'service/formServices' //用於其他登入項目檢查
	,'app_telegram/fc000303Telegram' //信用卡登入
	,'app_telegram/fc000304Telegram' //信用卡登出
]
, function (MainApp) {

//=====[loginServices START]=====//
MainApp.register.service("loginServices",function(
	$state,$rootScope,$log,i18n
	,sysCtrl,framework
	,loginModelServices
){
	var mainClass = this;
	//==參數設定==//
	var DebugMode = framework.getConfig("OFFLINE", 'B');
	var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');

	var mainSet = {};
	var loginType = ''; //web:個網,card:信用卡

	/**
	 * [setFun 參數設定]
	 * @param {[type]} object [description]
	 */
	var setFun = function(object){
		var default_set = {
			url : "",
			redirect : true,
			success : function(){},
			error : function(jsonObj){
				$log.debug('[STEP] LOGIN ERROR');
				if(typeof jsonObj === 'object'){
					$log.debug(jsonObj);
					MainUiTool.openDialog({
						title : i18n.getStringByTag('LOGIN_MENU.LOGIN_ERROR'),
						content : jsonObj.respCodeMsg
					});
				}else{
					$state.go('message',{code:'401'});
				}
			},
			showLoginMenu : false
		}
		mainSet = default_set;
		mainSet.url = window.location.hash;
		if(typeof object !== 'object'){
			return false;
		}
		if(typeof object.url !== 'undefined'){
			mainSet.url = object.url;
		}
		if(typeof object.redirect !== 'undefined' && !mainSet.redirect){
			mainSet.redirect = false;
		}
		if(typeof object.success === 'function'){
			mainSet.success = object.success;
		}
		if(typeof object.error === 'function'){
			mainSet.error = object.error;
		}

		//==是否多登入模式==//
		if(typeof object.showLoginMenu !== 'undefined' && object.showLoginMenu){
			mainSet.showLoginMenu = true;
			mainSet.login_menu = loginModelServices.getLoginMenu(true);
		}
		// mainSet.showLoginMenu = false; //強制只允許個網登入
	}


	/**
	 * [checkLogin 檢查是否登入]
	 * @param  {[type]} set_obj [description]
	 * @return {[type]}         [description]
	 */
	this.checkLogin = function(set_obj)
	{
		$log.debug('[CHECK LOGIN] START====');
		setFun(set_obj);
		sysCtrl.setOringPath(mainSet.url);

		var LoginCheck = sysCtrl.isLogin(true);
		//尚未登入
		if(!LoginCheck.isLogin){
			$log.debug('[CHECK LOGIN] not login');
			doLogin();
			return false;
		}
		if(LoginCheck.isLogin && LoginCheck.loginCardUser)
		{
			//-------------------------信用卡已登入處理-------------------------//
			// =>要執行這部分，需要native提供判斷個網登入的plugin
			$log.debug('[CHECK LOGIN] login by card');
			/**
			 * [webIsNotLogin 個網未登入情境處理]
			 * @return {[type]} [description]
			 */
			var webIsNotLogin = function()
			{
				$log.debug('[LOGIN] web is not login');
				if((typeof mainSet.showLoginMenu === 'undefined' || !mainSet.showLoginMenu))
				{
					$log.debug('[LOGIN] login only web');

					MainUiTool.openConfirm({
						//系統已強制登出，請重新登入
						content : i18n.getStringByTag('LOGIN_MENU.LOGIN_CHECK_WEB'),
						success : function(){
							mainClass.checkLogout({
								redirect : false,
								success : function(){
									$log.debug('[LOGIN] logout and login to web');
									$rootScope.head_right = false;
									$rootScope.head_right_title = '';
									setTimeout(function(){
										mainClass.checkLogin(set_obj); //重作此method
									},1000);
								}
							});
						},
						cancel : function(){
							mainClass.backPrePage();
						},
						footer : [
							i18n.getStringByTag('BTN.CANCEL'), //取消
							i18n.getStringByTag('LOGIN_MENU.RELOGIN') //重新登入
						]
					});
					return false;
				} //login only web END
				return LoginCheck.isLogin;
			};

			//==信用卡登入，判斷個網是否登入==//
			//==信用卡登入，判斷個網是否登入 END==//

			var check_card = webIsNotLogin();
			if(!check_card){
				return false; //非信用卡登入可使用的功能強制登出
			}
			//-------------------------信用卡已登入處理 END-------------------------//
		}else if(LoginCheck.isLogin){
			//-------------------------個網已登入處理-------------------------//
			// $log.debug('[CHECK LOGIN] login by web');
			// sysCtrl.loging(mainSet.success,function(){
			// 	$log.debug('[CHECK LOGIN] native is logout');
			// 	mainClass.checkLogout({
			// 		redirect : false,
			// 		success : function(){
			// 			$log.debug('[LOGIN] logout and login');
			// 			$rootScope.head_right = false;
			// 			$rootScope.head_right_title = '';
			// 			setTimeout(function(){
			// 				mainClass.checkLogin(set_obj); //重作此method
			// 			},1000);
			// 		}
			// 	});
			// 	return false;
			// });
			sysCtrl.getSessionId(mainSet.success,function(){
				//騙人 沒登入沒清空
				$log.debug('[CHECK LOGIN] native is logout');
				mainClass.checkLogout({
					redirect : false,
					success : function(){
						$log.debug('[LOGIN] logout and login');
						$rootScope.head_right = false;
						$rootScope.head_right_title = '';
						setTimeout(function(){
							mainClass.checkLogin(set_obj); //重作此method
						},1000);
					}
				});
				return false;
			});
			//-------------------------個網已登入處理 END-------------------------//
		}
		if(LoginCheck.isLogin){
			//更新session id
			sysCtrl.getSessionId(mainSet.success,mainSet.success);
			return LoginCheck.isLogin;
		}
		return false;
	}

	this.checkLogout = function(set_obj,logout_type){
		setFun(set_obj);
		sysCtrl.setOringPath(mainSet.url);
		var isLogin = sysCtrl.isLogin();
		if(isLogin){
			doLogout(logout_type);
		}else{
			mainSet.success();
		}
		return isLogin;
	}

	/**
	 * [loginEvent 執行不同登入事件]
	 * @param  {[type]} login_type [登入類型]
	 * @param  {[type]} set_data [傳遞的參數]
	 * @return {[type]}            [description]
	 */
	this.loginEvent = function(login_type,set_data)
	{
		$log.debug('[LOGIN] loginEvent');
		var data = {
			status : false,
			msg : '',
			data : {},
			error_list : {}
		};
		$log.debug('[LOGIN] 登入模式:'+login_type);
		var loginSet = loginModelServices.getLoginMenu(login_type);
		loginType = '';
		//==登入成功後事件==//
		var doSuccess = function(){
			$log.debug('[LOGIN] login succes');
			loginType = login_type;
			sysCtrl.doLoginAS(mainSet.redirect);
			//==其他登入要處理userId==//
			mainSet.success();
		};
		//==登入失敗事件==//
		var doError = function(jsonObj){
			$log.debug('[LOGIN] login error');
			mainSet.error(jsonObj);
		};
		if(typeof set_data === 'undefined'){
			set_data = {};
		}
		if(typeof login_type !== 'string' || !loginSet){
			doError();
			return false;
		}

		if(login_type==='web'){
			//個網登入
			sysCtrl.loging(doSuccess,doError);
		}else{
			//其他登入
			var result = loginModelServices.doLoginMethod(login_type,{
				data : set_data,
				success : doSuccess,
				error : doError
			});
			if(!result.status){
				$log.debug(result);
				doError();
			}
		}
	}


	/**
	 * [doLogin 登入事件]
	 * @return {[type]} [description]
	 */
	var doLogin = function()
	{
		//==預設登入模式==//
		if(typeof mainSet.login_menu === 'undefined'
			|| (mainSet.login_menu.length == 1 && mainSet.login_menu[0] !== 'web')
		){
			mainClass.loginEvent('web'); //預設
			return true;
		}
		//==先檢查是否個網登入==//
		var show_menu_method = function(){
			//==顯示登入選單==//
			// $rootScope.showLoginMenu = true; //請看menuCtrl
			sessionStorage.setItem("login_method","3");
			sessionStorage.setItem("redirectToOld",location.href);
			window.location.href="../index.html";
		}

		sysCtrl.getSessionIdPromise().then(function(token){
			$log.debug('[LOGIN] token:'+token);
			if(token !== ""){
				//強制進行個網登入，取代信用卡登入
				$log.debug('[LOGIN] web is login');
				mainClass.loginEvent('web');
			}else{
				show_menu_method();
			}
		},function(){
			show_menu_method();
		});
	}

	/**
	 * [doLogout 登出事件]
	 * @return {[type]} [description]
	 */
	var doLogout = function(logout_type){
		//==登出成功後事件==//
		var doSuccess = function(){
			mainSet.success();
			loginType = '';
		};
		//==登入失敗事件==//
		var doError = function(jsonObj){
			var error_msg = i18n.getStringByTag('LOGIN_MENU.LOGOUT_ERROR');
			$state.go('message',{title:error_msg,content:error_msg});
		};

		$log.debug('[LOGOUT] doLogout:'+loginType);
		if(typeof logout_type !== 'undefined'){
			$log.debug('[LOGOUT] logout all');
			sysCtrl.logout(doSuccess,true); //強制清空資料
			if(logout_type !== loginType){
				$log.debug('[LOGOUT] doLogout only:'+logout_type);
				mainSet.success();
				return false;
			}else{
				//==忽略登出error==//
				doError = function(jsonObj){
					$log.debug('[LOGOUT] 登出失敗，但仍強制執行成功事件');
					mainSet.success();
				};
			}
		}
		var data = {
			status : false,
			msg : '',
			data : {},
			error_list : {}
		};
		if(typeof loginType !== 'string' || loginType === ''){
			doError();
			return false;
		}

		if(loginType==='web'){
			//個網登入
			sysCtrl.logout(doSuccess);
		}else{
			//其他登入
			var result = loginModelServices.doLogoutMethod(loginType,{
				success : doSuccess,
				error : doError
			});
			if(!result.status){
				$log.debug(result);
				doError();
			}
		}

	}


	/**
	 * [backPrePage 返回前一頁面]
	 * @return {[type]} [description]
	 */
	this.backPrePage = function(){
		if(typeof $state.previous_set !== 'undefined'){ //headCtrl設定
			if($state.previous_set.state.name !== 'select'){
				$state.go('home',$state.previous_set.params); //返回首頁
			}else{
				$state.go($state.previous_set.state.name,$state.previous_set.params); //返回選單頁
			}
		}
	}

});
//=====[loginServices END]=====//


//=====[loginModelServices START 登入模式]=====//
MainApp.register.service("loginModelServices",function(
	$state,$log,i18n
	,sysCtrl
	,formServices
	,fc000303Telegram,fc000304Telegram //信用卡登入登出
){
	var mainClass = this;
	//==參數設定==//
	var loginModelSet = {
		'web' : {
			key : 'web',
			name : i18n.getStringByTag('LOGIN_MENU.MENU_WEB'),
			directive : '',
			check_event : false,
			login_event : false,
			logout_event : false
		},
		'card' : {
			key : 'card',
			name : i18n.getStringByTag('LOGIN_MENU.MENU_CARD'),
			directive : 'login-card-directive',
			check_event : 'checkCardLogin',
			login_event : 'doCardLogin',
			logout_event : 'doCardLogout'
		}
	};

	/**
	 * [getLoginMenu 登入模式]
	 * @return {[type]} [description]
	 */
	this.getLoginMenu = function(return_key){
		if(typeof return_key === 'string'){
			return (typeof loginModelSet[return_key] !== 'undefined')
					? loginModelSet[return_key] : false;
		}
		if(typeof return_key === 'blooean' && return_key){
			return Object.keys(loginModelSet);
		}
		return loginModelSet;
	}

	/**
	 * [checkLoginData 檢查處理]
	 * @param  {[type]} loginKey [登入類型]
	 * @param  {[type]} set_data [description]
	 * @return {[type]}          [description]
	 */
	this.checkLoginData = function(loginKey,set_data)
	{
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.ERROR'),
			data : {},
			error_list : {}
		};
		data.data = set_data;
		var loginSet = mainClass.getLoginMenu(loginKey);
		if(typeof loginKey !== 'string' || !loginSet){
			data.msg = i18n.getStringByTag('LOGIN_MENU.MENU_ERROR');
			return data;
		}
		switch(typeof loginSet.check_event){
			case 'string':
				if(typeof checkMethod[loginSet.check_event] === 'function'){
					data = checkMethod[loginSet.check_event](set_data);
				}else{
					data.msg = i18n.getStringByTag('NOTE_JBROOT_CONTENT');
				}
			break;
			case 'function':
				data = loginSet.check_event(set_data);
			break;
			default :
				data.status = true;
			break;
		}
		return data;
	}

	/**
	 * [doLoginMethod 執行登入]
	 * @param  {[type]} loginKey [登入類型]
	 * @param  {[type]} set_data [description]
	 * @return {[type]}          [description]
	 */
	this.doLoginMethod = function(loginKey,jsonObj)
	{
		$log.debug('[LOGIN] loginModel doLoginMethod');
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.ERROR')
		};
		var loginSet = mainClass.getLoginMenu(loginKey);
		if(typeof loginKey !== 'string' || !loginSet){
			data.msg = i18n.getStringByTag('LOGIN_MENU.MENU_ERROR');
			return data;
		}
		var set_data = (typeof jsonObj.data !== 'undefined') ? jsonObj.data : {};
		jsonObj.data = set_data;
		if(typeof jsonObj.success !== 'function' || typeof jsonObj.error !== 'function'){
			data.msg = i18n.getStringByTag('NOTE_JBROOT_CONTENT');
			return data;
		}
		var result = mainClass.checkLoginData(loginKey,set_data);
		if(!result.status){
			data.msg = result.msg;
			return data;
		}
		switch(typeof loginSet.login_event){
			case 'string':
				if(typeof loginMethod[loginSet.login_event] === 'function'){
					$log.debug('[LOGIN] loginModel loginMethod.'+loginSet.login_event);
					data.status = true;
					//原本送電文完才會做改為已下
					loginMethod[loginSet.login_event](jsonObj);	
					// userModel.loginCardUser = true;
					// userModel.userId = jsonObj.custId;
					// CelebrusInsertTool.manualAddTextChange("CreditCard_ID", "CreditCard_login", userModel.userId);
					// sysCtrl.getSessionId(successCallback, errorCallback);
				}else{
					data.msg = i18n.getStringByTag('NOTE_JBROOT_CONTENT');
				}
			break;
			case 'function':
				$log.debug('[LOGIN] loginModel login_event');
				data.status = true;
				loginSet.login_event(jsonObj);
			break;
			default :
				jsonObj.error();
			break;
		}
		return data;
	}


	/**
	 * [doLogoutMethod 執行登出]
	 * @param  {[type]} loginKey [登出類型]
	 * @param  {[type]} set_data [description]
	 * @return {[type]}          [description]
	 */
	this.doLogoutMethod = function(loginKey,jsonObj)
	{
		$log.debug('[LOGOUT] logoutModel doLogoutMethod');
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.ERROR')
		};
		var loginSet = mainClass.getLoginMenu(loginKey);
		if(typeof loginKey !== 'string' || !loginSet){
			data.msg = i18n.getStringByTag('LOGIN_MENU.MENU_ERROR');
			return data;
		}
		var set_data = (typeof jsonObj.data !== 'undefined') ? jsonObj.data : {};
		jsonObj.data = set_data;
		if(typeof jsonObj.success !== 'function' || typeof jsonObj.error !== 'function'){
			data.msg = i18n.getStringByTag('NOTE_JBROOT_CONTENT');
			return data;
		}
		switch(typeof loginSet.logout_event){
			case 'string':
				if(typeof loginMethod[loginSet.logout_event] === 'function'){
					$log.debug('[LOGIN] loginModel loginMethod.'+loginSet.logout_event);
					data.status = true;
					loginMethod[loginSet.logout_event](jsonObj);
				}else{
					data.msg = i18n.getStringByTag('NOTE_JBROOT_CONTENT');
				}
			break;
			case 'function':
				$log.debug('[LOGIN] loginModel logout_event');
				data.status = true;
				loginSet.logout_event(jsonObj);
			break;
			default :
				jsonObj.error();
			break;
		}
		return data;
	}

	//==========================[CHECK]==========================//
	var checkMethod = {};
	/**
	 * [checkCardLogin description]
	 * @param  {[type]} set_data [description]
	 * @return {[type]}          [description]
	 */
	checkMethod.checkCardLogin = function(set_data)
	{
		var data = {
			status : false,
			msg : i18n.getStringByTag('INPUT_CHECK.ERROR'),
			data : {},
			error_list : {}
		};
		if(typeof set_data !== 'object'){
			data.msg = i18n.getStringByTag('MSG_FORMATE_ERROR');
			return data;
		}
		var check_list = ['idNo','userida','password'];
		var result;
		for(key in check_list){
			result = formServices.checkEmpty(set_data[check_list[key]]);
			if(!result.status){
				data.error_list[check_list[key]] = result.msg;
			}
		}

		var inp_key = '';
		//==identity==//
		inp_key = 'idNo';
		if(typeof data.error_list[inp_key] === 'undefined'){
			result = formServices.checkIdentity(set_data[inp_key]);
			if(!result.status){
				data.error_list[inp_key] = result.msg;
			}
		}

		var inp_key = '';
		//==identity==//
		inp_key = 'userida';
		if(typeof data.error_list[inp_key] === 'undefined'){
			result = formServices.checkuseridalen(set_data[inp_key]);
			if(!result.status){
				data.error_list[inp_key] = result.msg;
			}
		}

		var inp_key = '';
		//==identity==//
		inp_key = 'password';
		if(typeof data.error_list[inp_key] === 'undefined'){
			result = formServices.checkpasswoedlen(set_data[inp_key]);
			if(!result.status){
				data.error_list[inp_key] = result.msg;
			}
		}

		//==check end==//
		if(Object.keys(data.error_list).length === 0){
			data.status = true;
			data.data = set_data;
			data.msg = '';
		}
		return data;
	}

	//==========================[LOGIN]==========================//
	var loginMethod = {};
	/**
	 * [doCardLogin 信用卡登入]
	 */
	loginMethod.doCardLogin = function(jsonObj)
	{
		if(typeof jsonObj.success !== 'function'
			|| typeof jsonObj.error !== 'function'
			|| typeof jsonObj.data !== 'object'
		){
			return false;
		}
		$log.debug('[LOGIN] doCardLogin');
		var callBackMethod = function(success,resultObj,headerObj){
			$log.debug(resultObj);
			$log.debug(headerObj);
			if(success){
				sysCtrl.logingCard(headerObj,jsonObj.success,jsonObj.error);
			}else{
				jsonObj.error(resultObj);
			}
		}
		// fc000303Telegram.loginData(jsonObj.data,callBackMethod);
		var info=sessionStorage.getItem("userInfo");
		var data = {
			custId : info.custId,
			userId : info.userId			
		};
		sysCtrl.logingCard(data,jsonObj.success,jsonObj.error);
	}
	/**
	 * [doCardLogin 信用卡登出]
	 */
	loginMethod.doCardLogout = function(jsonObj)
	{
		if(typeof jsonObj.success !== 'function'
			|| typeof jsonObj.error !== 'function'
		){
			return false;
		}
		$log.debug('[LOGOUT] doCardLogout');
		var callBackMethod = function(success,resultObj,headerObj){
			$log.debug(resultObj);
			$log.debug(headerObj);
			if(success){
				sysCtrl.logout(jsonObj.success);
			}else{
				jsonObj.error(resultObj);
			}
		}
		fc000304Telegram.logout(callBackMethod);
	}


});
//=====[loginModelServices END]=====//

});

