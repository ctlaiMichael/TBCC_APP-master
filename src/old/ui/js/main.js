(function () {
	document.addEventListener('deviceready', onDeviceReady, false);
	
	function onDeviceReady(){
		//最新消息
		document.getElementById('btn1').onclick = function () {
			plugin.main.news(function(){},function(){})
		}
		//金融資訊
		document.getElementById('btn2').onclick = function () {
			plugin.main.financeinfo(function(){},function(){})
		}
		//理財金庫
		document.getElementById('btn3').onclick = function () {
			plugin.main.funds(function(){},function(){})
		}
		//醫療服務
		document.getElementById('btn4').onclick = function () {
			plugin.main.hospital(function(){},function(){})
		}
		//行動網銀
		document.getElementById('btn5').onclick = function () {
			plugin.main.mobliebank(function(){},function(){})
		}
		//服務據點
		document.getElementById('btn6').onclick = function () {
			plugin.main.servicesite(function(){},function(){})
		}
		//產壽險服務
		document.getElementById('btn7').onclick = function () {
			plugin.main.insurance(function(){},function(){})
		}
		//信用卡
		document.getElementById('btn8').onclick = function () {
			plugin.main.creadit(function(){},function(){})
		}
		//信用卡
		document.getElementById('btn9').onclick = function () {
			plugin.main.easy(function(){},function(){})
		}
	}
})();