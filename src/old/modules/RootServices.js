var RootServicesApp =angular.module('RootServicesApp', []);


//=====[RootServices START]=====//
RootServicesApp.service('RootServices', function(
	deviceInfo,framework
){
	var mainClass = this;
	//==參數設定==//
	var DebugMode = framework.getConfig("OFFLINE", 'B');
	var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');
	//==首次使用APP規範畫面==//
	var isFirstFlag = false; //首次啟動


	/**
	 * [openInfo 啟動檢查]
	 * @return {[type]} [description]
	 */
	this.openInfo = function(){
		if(!isFirstFlag){
			angular.element('.loader-box').css('display','none'); //首次啟動強制關閉loading
			isFirstFlag = true;
			// firstOpenInfo();
			// JBRootInfo();
		}
	}

	/**
	 * [firstOpenInfo 首次啟動Information]
	 * @return {[type]} [description]
	 */
	function firstOpenInfo(){
		// //==首次使用APP規範畫面==//
		// var key = "card_cookie";
		// var value_str = "Regulate_watched";
		// //==取得cookie==//
		// if(!getCookie(key) && deviceInfo.platform === "Android"){
		// 	angular.element('.loader-box').css('display','none');
		// 	MainUiTool.openDialog({
		// 			title: "首次使用 APP規範",
		// 			content: "為提升交易安全，請先安裝防毒軟體",
		// 			footer:'確認'
		// 	});
		// 	//==設定cookie==//
		// 	var expire_time = 50*60*60*24*31*12;
		// 	setCookie(key, value_str, expire_time, "", "/");
		// }
	}

	/**
	 * [JBRootInfo description]
	 */
	function JBRootInfo(){
		// if(OpenNactive && !window.localStorage.checkRootJB){
		// 	framework.checkRootJB(function(isJailbroken){
		// 		if(isJailbroken){
		// 			showMsg('NOTE_JBROOT_TITLE','NOTE_JBROOT_CONTENT');
		// 			MainUiTool.openDialog({
		// 				title: "安全提示",
		// 				content: "為提升交易安全，請先安裝防毒軟體",
		// 				footer:'確認'
		// 			});
		// 		}
		// 	}, function(){
		// 		$log.error('checkRootJB Fail!');
		// 	});
		// 	window.localStorage.checkRootJB = true;
		// }
	}


	//==設定cookie 值、時效和domain和路徑==//
	function setCookie(key, value_str, expire, domain, path){
		if(OpenNactive){
			window.localStorage.setItem(key,1);
		}else{
			// console.log(value_str + "/" + expire + "/" + domain + "/" + path);
			var cookie_str = key + "=" + value_str;
			if(expire){
				var date = new Date();
				date.setTime(date.getTime() + 24*60*60*1000*31*12*expire);
				cookie_str += "; expires="+date.toGMTString();
			}
			if(domain){
				cookie_str += "; domain=" + domain;
			}
			if(path){
				cookie_str += "; path=" + path;
			}
			document.cookie = cookie_str;
		}
	}

	//==取得cookie 值 以name搜尋儲存的值==//
	function getCookie(key){
		if(OpenNactive){
			var count = window.localStorage.getItem(key);
			// console.log(count);
			if(count){
				return true;
			}else{
				return false;
			}
		}else{
			if(document.cookie.length == 0){
				return false;
			}
			var i=document.cookie.search(key+'=');
			if(i == -1){
				return false;
			}
			i += key.length + 1;
			var j = document.cookie.indexOf(';', i);
			if(j == -1){
				j = document.cookie.length;
			}
			return document.cookie.slice(i,j);
		}
	}

});
//=====[RootServices END]=====//