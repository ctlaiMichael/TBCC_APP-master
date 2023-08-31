/**
 * 開啟app or url
 */
define([
	"app"
	, 'components/hitrust/HtStartApp'
]
, function (MainApp, HtStartApp) {
	MainApp.register.service("openAppUrlServices", function (
		framework
		, $window
		, $http
		, $log
	) {
		var MainClass = this;

		//==參數設定==//
		var DebugMode = framework.getConfig("OFFLINE", 'B');
		var OpenNactive = framework.getConfig("NACTIVE_OPEN", 'B');

		/**
		 * 啟動外部APP 
		 * @param url   // app json scheme
		 * 
		 * 1.message 新增 appName 的資料夾
		 * 2.appName 的資料夾 新增 json scheme
		 * 3.組url , call openAppUrlServices.openApp()
		 */
		this.openApp = function (appName) {
			var url = "message/scheme/" + appName + ".json"; //json 路徑

			if (OpenNactive) {
				var scheme_set;
				var platform = device.platform;
				//console.log("device.platform:::"+device.platform);

				var success_method = function (res) {
					if (platform == "Android") { //ios不做start和check
						HtStartApp.start();
					}
				}
				var error_method = function (res) {
					if (platform == 'iOS') {
						startApp.set(scheme_set.iOS.store).go();
					} else if (platform == 'Android') {
						location.href = scheme_set.Android.store;
					}
				}
				//讀取json
				$http.get(url).then(function (res) {
					scheme_set = res.data;
					platform = HtStartApp.set(res.data);
					if (platform == "Android") {
						HtStartApp.check(success_method, error_method);
					}
					else { //ios
						HtStartApp.go(success_method, error_method);
					}
				}, function (e) {
					console.log('get json stock err:' + e);
				});
			} else {
				//platform = "Android";
			}
		};

		/**
		 * 啟動瀏覽器
		 * @param url   
		 */
		this.openWeb = function (url) {
			if (OpenNactive) {
				if (device.platform == 'iOS'){
					startApp.set(url).go();
				} else { //Android
					location.href = url;
				}
			} else {
				//platform = "Android";
			}
		};

	});
});
