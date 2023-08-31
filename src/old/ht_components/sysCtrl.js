var sysCtrl = angular.module('sysCtrl', []);


sysCtrl.service('sysCtrl', function (
	$rootScope
	, $state
	, $window, $timeout, $location, $log, $q
	, framework, i18n, timer
) {

	var self = this;
	//==參數設定==//
	var userModel = {};
	//==參數設定==//
	var DebugMode = framework.getConfig("OFFLINE", 'B');
	var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');

	/**
	 * [show_message 顯示dialog訊息] 請依照各專案自行調整
	 * @param  {[type]} message [description]
	 * @return {[type]}         [description]
	 */
	function show_message(message) {
		if (typeof MainUiTool === 'object') {
			MainUiTool.openDialog(message);
		}
	}

	/**
	 * [clean 參數重設定]
	 * @return {[type]} [description]
	 */
	function clean() {
		userModel.id = '';
		userModel.locale = '';
		// let userInfoStr = sessionStorage.getItem('userInfo');
		// userModel.isLogin = !!userInfoStr;
		userModel.isLogin = false;
		userModel.path = "";
		userModel.ui_state = $state.current;
		userModel.authToken = '';//sessionId
		userModel.isGraphed = false;//是否有圖型密嗎
		userModel.userId = ""; //身分證
		userModel.userCode = ""; //編號
		userModel.loginCardUser = false; //登入信用卡會員
		self.statusText = i18n.getStringByTag('LOGIN_INDEX_OUT'); //"未登入";

		//==header==//
		$rootScope.head_right = false; //右事件
		$rootScope.head_right_title = '';
	}
	clean();

	// function init() {
	// 	let userInfoStr = sessionStorage.getItem('userInfo');
	// 	if (!userInfoStr) {
	// 		return;
	// 	}
	// 	let userInfo = JSON.parse(userInfoStr);
	// 	userModel.isLogin = true;
	// 	userModel.authToken = userInfo.sessionId; // sessionId
	// 	userModel.userId = userInfo.custId; //身分證
	// 	userModel.userCode = userInfo.userCode; //編號
	// 	userModel.loginCardUser = false; //登入信用卡會員
	// }
	// init();
	this.statusText = i18n.getStringByTag('LOGIN_INDEX_OUT'); //"未登入";
	this.clean = clean;

	this.getUserModel = function () {
		return userModel;
	};

	this.isLogin = function (check_logintype) {
		if (typeof check_logintype === 'undefined' || !check_logintype) {
			return userModel.isLogin;
		}
		var userInfo=sessionStorage.getItem("userInfo");
		var jsObj = {};
		if(userInfo){
			jsObj=eval( '(' + userInfo + ')' );
			userModel.isLogin=true;
			userModel.custId=jsObj.custId;
			userModel.userId=jsObj.custId;
			var cardlogin=false;//預設網銀
			if(jsObj.hasOwnProperty('loginCardUser') && jsObj['loginCardUser'] == true){
				cardlogin=true;
			}
			userModel.loginCardUser=cardlogin;
			console.log('this.isLogin',userModel);
			return {
				isLogin:true,
				loginCardUser: cardlogin
			};
		}
		return {
			isLogin: userModel.isLogin,
			loginCardUser: userModel.loginCardUser
		};
	};

	this.handShakeTimer = (function handShakeTimerInit() {
		$log.debug('handShakeTimer init!');

		var timeOutCallBackHandeler;

		var timeOutHandler = function () {
			$log.debug('handShakeTimer timeout!');
			$rootScope.rehandShakeTime.stop();
			timeOutCallBackHandeler();
		};

		function doHandShakeAs(timeOutCallBack) {
			$log.debug('doHandShakeAs');
			timeOutCallBackHandeler = timeOutCallBack;

			//倒數計時行為
			var countDownCallBack = function (sencend) {
				if (sencend <= 10) {
					$log.debug('handShakeTimer time:' + sencend);
				}
			};

			var counter = framework.getConfig('REHANDSHAKE_TIME', 'I');
			//?動計時行為
			$rootScope.rehandShakeTime = $rootScope.rehandShakeTime || new timer.Instance(framework.getConfig('REHANDSHAKE_TIME', 'I'), timeOutHandler, countDownCallBack);
			$rootScope.rehandShakeTime.start();
		};

		document.addEventListener("pause", onPause, false);
		document.addEventListener("resume", onResume, false);

		function onPause() {
			$log.debug('onPause');
			var today = new Date();
			if (!!$rootScope.rehandShakeTime && $rootScope.rehandShakeTime.timerRunning) {
				$rootScope.handshakePauseTime = today.getTime();
				$rootScope.handshakePauseCounter = $rootScope.rehandShakeTime.counter;
				$log.debug($rootScope.handshakePauseTime);
				$log.debug($rootScope.handshakePauseCounter);
			}
			//==[待處理]離開APP，全部機制關掉==//
			//1. 強制登出
			//2. handShakeTime歸0
		}

		function onResume() {
			$log.debug('onResume');
			//檢查是否已登出
			if (!!$rootScope.rehandShakeTime && $rootScope.rehandShakeTime.timerRunning) {
				var today = new Date();
				var resumeTime = today.getTime();
				var diffTime = Math.round((resumeTime - $rootScope.handshakePauseTime) / 1000);
				$rootScope.rehandShakeTime.counter = $rootScope.handshakePauseCounter - diffTime;
				if ($rootScope.rehandShakeTime.counter <= 0) {
					timeOutHandler();
				}
			}
			$log.debug($rootScope.rehandShakeTime);
		}

		function resolveHandShake() {
			if ($rootScope.rehandShakeTime != undefined) {
				$rootScope.rehandShakeTime.counter = framework.getConfig('REHANDSHAKE_TIME', 'I');
			}

		}

		return {
			doHandShakeAs: doHandShakeAs,
			resolveHandShake: resolveHandShake
		}
	})();

	/**
	 * 檢查登入狀態
	 * @param {*} doSuccess 
	 * @param {*} doError 
	 */
	this.checkLogin = function (doSuccess, doError) {
		var successCallback = function () {
			$log.debug('[STEP] Web Login successCallback');
			if (typeof doSuccess === 'function') {
				doSuccess();
			}
		}
		var errorCallback = function () {
			$log.debug('[STEP] Web Login errorCallback');
			if (typeof doError === 'function') {
				self.logout(doError);
			} else {
				self.logout();
			}
		}

		self.getLoginInfo(function (jsonObj) {
			//==登入==//
			$log.debug('[STEP] do Web Login');
			userModel.loginCardUser = false;
			userModel.isLogin = true;
			//身分證
			userModel.userId = jsonObj.custId || "";
			//編號
			userModel.userCode = (typeof jsonObj.userCode !== 'undefined')
				? jsonObj.userCode : "";

			self.getSessionId(successCallback, errorCallback);
		}
			, errorCallback);
	}

	//檢查是否已登入//20171211
	var isLoginedStatus = false;
	this.isLogined = function () {
		if (OpenNactive) {
			plugin.tcbb.getF1000101Data(function (json) {
				isLoginedStatus = true;
				// $log.debug('isLogined o="" :'+isLoginedStatus );
			}, function (err) {
				isLoginedStatus = false;
				// $log.debug('isLogined x="" :'+isLoginedStatus );
			});
		}
		return isLoginedStatus;
	}

	/**
	 * [loging 登入執行]
	 * @param  {[type]} jsonObj [登入資訊]
	 * @return {[type]}         [description]
	 */
	this.loging = function (doSuccess, doError) {
		$log.debug('[STEP] Web Login');
		var successCallback = function () {
			$log.debug('[STEP] Web Login successCallback');
			if (typeof doSuccess === 'function') {
				doSuccess();
			} else {
				self.doLoginAS(true);
			}
		}
		var errorCallback = function () {
			$log.debug('[STEP] Web Login errorCallback');
			if (typeof doError === 'function') {
				self.logout(doError);
			} else {
				self.logout();
			}
		}

	

	if (OpenNactive) {
			// 目前login固定導頁登入頁,所以都出錯
			// 判斷是否登入
			let userInfoStr = sessionStorage.getItem('userInfo');
			const check_login = !!userInfoStr;
			if (check_login) {
				// 已登入設定登入資訊
				this.checkLogin(function() {
					CelebrusInsertTool.celetbrslnsertClickEvent("login");
					CelebrusInsertTool.manualAddTextChange("PersonalEB_ID", "Personal_Bank_login", userModel.userId);
					CelebrusInsertTool.celetbrslnsertClickEvent("login_ok");
					doSuccess();
				}, doError);
			} else {
				plugin.tcbb.doLogin(function (jsonObj) {
					//==登入==//
					if (jsonObj.error != 0) {
						errorCallback();
						return false;
					}
					$log.debug('[STEP] do Web Login');
					userModel.loginCardUser = false;
					userModel.isLogin = true;
					//身分證
					userModel.userId = (typeof jsonObj.value.custId !== 'undefined')
						? jsonObj.value.userId : "";
	
					CelebrusInsertTool.celetbrslnsertClickEvent("login");
					CelebrusInsertTool.manualAddTextChange("PersonalEB_ID", "Personal_Bank_login", userModel.userId);
					CelebrusInsertTool.celetbrslnsertClickEvent("login_ok");
	
					//編號
					userModel.userCode = (typeof jsonObj.value.userCode !== 'undefined')
						? jsonObj.value.userCode : "";
	
					self.getSessionId(successCallback, errorCallback);
				}
					, errorCallback);
			}
		} else if (DebugMode) {
			//==success debug==//
			userModel.userId = "A123123123";
			userModel.userCode = "demo_user_code";
			successCallback();
			// errorCallback();
		} else {
			errorCallback();
		}
	}

	/**
		 * 取得登入資訊
		 * 
		 * callback(res)
		 * res.custId => 用戶id
		 */
	this.getLoginInfo = function (callback) {
		if (OpenNactive) {
			//TODO
			plugin.tcbb.getF1000101Data(function (json) {
				callback(json.value);
				//alert('loginInfo:'+JSON.stringify(json));
			}, function (err) {
				// alert('未登入');
				//alert(JSON.stringify(err));
				plugin.tcbb.doLogin(function (success) {
					//alert('LoginSuccess:'+JSON.stringify(success));
					//重新整理
				}, function (err) {
					//alert('LoginFail:'+JSON.stringify(err));
				});
			});
			//callback({ custId: "A123456789" });
		} else {
			var json = {
				/* usercode:"M001",
				cnEndDate:"20170904",
				BoundID:"1",
				SSLID:"3",
				OTPID:"1",
				DefAuthType:"2",
				AuthType:"1,2,3",
				CategoryId:[9],
				DtxisSecurityOpen:["1,2","1,2","1,2"],
				NdtxisSecurityOpen:[],
				AuthStatus:"0",
				PwdStatus:"0",
				PhoneNo:"",
				Email:"", */
				AuthStatus: "0",
				AuthType: "1,2,3",
				BoundID: "4",
				CategoryId: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
				DefAuthType: "3",
				DtxisSecurityOpen: ["1,2", "1,2", "1,2", "1,2", "1,2", "1,2", "1,2", "", ""],
				Email: "1109TEST1@TCB-BANK.COM.TW",
				NdtxisSecurityOpen: ["2,3", "2,3", "", "", "", "", "", "2", "2"],
				OTPID: "2",
				PhoneNo: "0972060288",
				PwdStatus: "0",
				SSLID: "3",
				cn: "F121374529-00-20170912008",
				cnEndDate: "20171020",
				custId: "F121374529",
				serialNumber: "4ED0D031",
				usercode: "M002",
			}
			callback(json);
		}
	}

	/**
	 * [getSessionId 取得session]
	 * @param  {[type]} successCallback [description]
	 * @param  {[type]} errorCallback   [description]
	 * @return {[type]}           [description]
	 */
	this.getSessionId = function (successCallback, errorCallback) {
		$log.debug('[STEP] getSessionId');
		if (OpenNactive) {
			plugin.tcbb.getSessionID(function (rtnSession) {
				//==取session==//
				if (rtnSession.error == 0) {
					userModel.authToken = rtnSession.value;
					successCallback();
				} else {
					errorCallback();
				}
			}
				, errorCallback);
		} else if (DebugMode) {
			successCallback();
		} else {
			errorCallback();
		}
	}


	/**
	 * [getSessionId 取得session => 取代getSessionId]
	 * @return {[type]}           [description]
	 */
	this.getSessionIdPromise = function () {
		$log.debug('[STEP] getSessionId');
		var deferred = $q.defer();
		var promise = deferred.promise;

		if (OpenNactive) {
			$log.debug('[STEP] tcbb getSessionId start');
			plugin.tcbb.getSessionID(function (rtnSession) {
				// $log.debug('[STEP] tcbb getSessionId back');
				// $log.debug(rtnSession);
				//==取session==//
				if (rtnSession.error == 0) {
					userModel.authToken = rtnSession.value;
					deferred.resolve(rtnSession.value);
				} else {
					// $log.debug('error');
					deferred.reject();
				}
			}
				, function () {
					deferred.reject();
				});
		} else if (DebugMode) {
			deferred.resolve('');
		} else {
			deferred.reject();
		}
		return promise;
	}

	/**
	 * [loging 信用卡登入執行]
	 * @param  {[type]} jsonObj [登入資訊]
	 * @return {[type]}         [description]
	 */
	this.logingCard = function (jsonObj, successCallback, errorCallback) {
		$log.debug('[STEP] logingCard');
		if (typeof jsonObj.custId !== 'undefined' && jsonObj.custId !== '') {
			userModel.loginCardUser = true;
			userModel.userId = jsonObj.custId;
			CelebrusInsertTool.manualAddTextChange("CreditCard_ID", "CreditCard_login", userModel.userId);
			self.getSessionId(successCallback, errorCallback);
		}
	}

	/**
	 * [logout 執行登出]
	 * @param  {[type]} boolean [description]
	 * @return {[type]}         [description]
	 */
	this.logout = function (doSuccess, clear_flag) {
    	$rootScope.isLoading = true;
		var successCallback = function () {
			clean();
			userModel.isLogin = false;
			if (typeof $rootScope.loginOuTime === 'object') {
				$rootScope.loginOuTime.stop();
			}
			if (typeof doSuccess === 'function') {
        		$rootScope.isLoading = false;
				doSuccess();
			}
		};
		var errorCallback = function () {
      		$rootScope.isLoading = false;
			var error_msg = i18n.getStringByTag('LOGIN_MENU.LOGOUT_ERROR');
			$state.go('message', { title: error_msg, content: error_msg });
		};

		if (typeof clear_flag !== 'undefined' && clear_flag) {
			$log.debug('LogOut all sysCtrl verbal');
			successCallback();
			return false;
		}
	var userInfo=sessionStorage.getItem("userInfo");
		if(userInfo){
			var jsObj=eval( '(' + userInfo + ')' );
			if(jsObj.hasOwnProperty('loginCardUser') && jsObj['loginCardUser'] == true){
				userModel.loginCardUser=true;
				console.log('userModel0',userModel);
			}
		}
		sessionStorage.setItem("userInfo","");
		sessionStorage.setItem("login_method","");
		if (userModel.loginCardUser) {
			$log.debug('LogOut by card user');
			successCallback();
		} else {
			$log.debug('LogOut by web user');
			if (OpenNactive) {
				plugin.tcbb.doLogout(successCallback, errorCallback);
			} else if (DebugMode) {
				successCallback();
			} else {
				errorCallback();
			}
		}
	}

	/**
	 * [resetTimer 重設登入時間]
	 * @return {[type]} [description]
	 */
	this.resetTimer = function () {
		if (typeof $rootScope.loginOuTime === 'object') {
			$rootScope.loginOuTime.counter = framework.getConfig('LOGOUT_TIME', 'I');
		}
	}

	this.appResume = function (time) {
		if (time < 0) time = 0;
		$rootScope.loginOuTime.counter = time;
		if (userModel.isLogin) {
			if ($rootScope.loginOuTime.counter <= 0) {
				//超過時間自動登出
				show_message(i18n.getStringByTag('LOGIN_MENU.TIMEOUT')); //閒置時間過長系統已自動將您登出
				self.logout();
			}
		}

	}

	this.setOringPath = function (url) {
		userModel.path = url;
		userModel.ui_state = $state.current;
	}

	this.resolveLogin = function () {
		userModel.path = window.location.hash;
		userModel.ui_state = $state.current;
		if (!userModel.isLogin) {
			self.logout();
			// framework.redirect('#/login', false);
		} else {
			// $rootScope.loginOuTime .restart();
			this.resetTimer();
		}
	}

	//成功該做的事
	this.doLoginAS = function (do_redirect, no_alert) {
		if (typeof do_redirect === 'undefined') {
			do_redirect = true;
		}

		if (typeof MainUiTool === 'object' && !no_alert) {
			// 不跳訊息
			// show_message(i18n.getStringByTag('LOGIN_MENU.LOGIN_SUCCESS')); //"登入成功"
		}
		userModel.isLogin = true;

		self.statusText = i18n.getStringByTag('LOGIN_INDEX_IN');//"已登入";
		// $log.debug(userModel);
		//更新功能表
		//navFactory.refresh();

		//==header==//
		$rootScope.head_right = true; //右事件
		$rootScope.head_right_title = i18n.getStringByTag('LOGOUT'); //'登出';

		//以下為計時動作
		//逾時做事
		var timeOutCallBack = function () {
			$log.debug('[CHECK] check login timeout');
			//==目前先不提供timeout事件==//
			var timeout_success = function () {
				self.resetTimer();
			}
			var timeout_error = function () {
				if (typeof MainUiTool === 'object') {
					show_message(i18n.getStringByTag('LOGIN_MENU.HAVE_TIMEOUT')); // "已逾時登出!"
				}
				self.logout();
				self.clean();
			}
			//==timeout==//
			if (userModel.loginCardUser) {
				timeout_success(); //信用卡登入直接延長
			} else {
				//個網登入要檢查native
				self.loging(timeout_success, timeout_error);
			}
		}

		//倒數計時行為
		var countDownCallBack = function (sencend) {
			var m = parseInt(sencend / 60);
			var s = sencend % 60;

			$rootScope.loginOuTimeFormate = (m >= 10 ? m : '0' + m) + ':' + (s >= 10 ? s : '0' + s);
		}

		//計時行為(目前沒有先關閉)
		$rootScope.loginOuTime = $rootScope.loginOuTime || new timer.Instance(framework.getConfig('LOGOUT_TIME', 'I'), timeOutCallBack, countDownCallBack);
		$rootScope.loginOuTime.start();

		//導向功能路徑
		if (do_redirect) {
			var path = userModel.path;
			if (path != "") {
				if (path === window.location.hash) {
					$state.go($state.current, {}, { reload: true });
				} else {
					$state.go(userModel.ui_state, {}, { reload: true });
					// framework.redirect(path, true);
				}
			} else {
				$state.go("home");
			}
		}
	}

	//以下物件目前沒用到
	// this.saveUserModel = function(model,msg) {
	// 	userModel.isGraphed = msg.data.para1;
	// 	userModel.id = model.id;
	// };
	// this.saveUserModel2 = function(model,msg) {
	// 	userModel.isGraphed = msg.data.para1;
	// 	userModel.id = model.id1;
	// };

	// this.errorHandle = function( errorObj ){
	// 	var serviceId = errorObj.serviceId;
	// 	var msg = '';

	// 	if( serviceId == 'md5' || serviceId == 'des' ){
	// 		msg = i18n.getStringByTag('ENCRYPT_ERROR');
	// 	}else{
	// 		msg = i18n.getStringByTag('CONNECT_ERROR');
	// 	}
	// 	return msg;
	// }

});
