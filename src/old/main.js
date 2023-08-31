/**
 * ver 1.0 , 2016.11.23
 */
require.config({
	baseUrl: "",
	paths: {
		//==Path Set==//
		'controller' : 'modules/controller/card',
		'service' : 'modules/service/card',
		'app_telegram' : 'modules/telegram/card',
		'directive' : 'modules/directive/card',
		'ht_components' : 'ht_components',
		'resource' : 'resource',
		'lib' : 'lib',
		'config' : 'resource/config', //一些設定檔
		'data' : 'resource/data', //一些local的設定資料
		'hitrust' : 'components/hitrust',

		//==Angular==//
		'angular': 'lib/angular/angular',
		'angular-resource': 'lib/angular/angular-resource.min',
		'angular-touch': 'lib/angular-touch/angular-touch.min',
		'angular-animate': 'lib/angular-animate/angular-animate.min',

		//==Angular CSS==//
		'angular-css': 'lib/angular-css/angular-css.min',

		//==Angular QR==//
		'qrcode': 'lib/angular-qr/qrcode',
		'angular-qr':'lib/angular-qr/angular-qr',
		'angular-barcode':'lib/angular-barcode/dist/angular-barcode',


		//==Library==//
		//==[router]==//
		'ui-router': 'lib/angular-ui-router',
		//===[i18n]===//
		'angular-translate': 'lib/angular-translate/angular-translate.min', //for i18n
		'loader-static-files': 'lib/angular-translate/loader-static-files', //for i18n
		'localization':  'lib/localize/localize',
		//===[電文]===//
		'telegram' : 'ht_components/telegram',
		//JQuery
		'jquery': 'lib/jquery.min',
		//HiTrustFramework
		'framework': 'components/hitrust/HtFramework',
		//HiTrustComponents
		'telegram' : 'ht_components/telegram',
		'timer' : 'ht_components/timer', //時間timeout
		'sysCtrl': 'ht_components/sysCtrl', //跟登入登出有關 =>想辦法廢掉
		'serviceStatus': 'ht_components/serviceStatus', //中台確認
		'boundle': 'ht_components/boundle', //頁面切換
		// 'view' : 'ht_components/view/view', //記憶上一頁的路徑
		'crypto' : 'ht_components/crypto', //安控
		'deviceInfo':'ht_components/deviceInfo', //與手機連動取得資訊
		// 'antivirusRemind':'ht_components/antivirusRemind', //防毒提示
		'stringUtil': 'ht_components/stringUtil', //文字處理
		'spinningWheel':'ht_components/spinningWheel/spinningWheelDirective' //spinningwheel
	},
	shim: {
		'angular': {
			exports: 'angular'
		},
		//==anuglar library==//
		'ui-router': ['angular'],
		'angular-resource': ['angular'],
		'angular-translate': ['angular'],	//for i18n
		'loader-static-files': ['angular-translate'],	//for i18n
		'angular-touch': ['angular'],
		'angular-animate': ['angular'],

		'angular-css': ['angular'],
		'angular-qr':['angular','qrcode'],
		'angular-barcode':['angular'],
		//i18n
		'localization': ['angular','angular-translate','loader-static-files'],
		//HiTrustFramework
		'framework': ['jquery', 'angular'],
		//HiTrustComponents
		'telegram': ['angular','localization'],
		'timer': ['jquery','angular'],
		'sysCtrl': ['angular'],
		'serviceStatus':['angular', 'telegram', 'localization'],
		'boundle': ['angular'],
		'crypto':['angular'],
		'deviceInfo':['angular'],
		// 'view' : ['angular', 'boundle', 'serviceStatus'],
		'stringUtil' : ['angular'],
		'antivirusRemind':['angular','localization'],
		'spinningWheel':['angular'], //SpinningWheel

		//==app要載入的method==// => 也可以直接在葉面定義
		'app': {
			deps: [
				//==angular==//
				'angular',
				'angular-resource',
				'angular-touch',
				'angular-animate',
				'ui-router',

				'angular-css',
				'angular-qr',
				'angular-barcode',
				//==library==//
				'localization', //i18n

				//==HtFramework==//
				'crypto', //安控
				'timer', //時間timeout
				'spinningWheel',
				'sysCtrl', //跟登入登出有關
				'serviceStatus', //中台確認
				'boundle', //頁面切換
				'deviceInfo', //與手機連動取得資訊
				// 'antivirusRemind', //防毒提示
				// 'view', //記憶上一頁的路徑
				'stringUtil', //文字處理
				'telegram'
			]
		}
	}
});

// 初始化MainApp模块
require([
	'app'
],function(MainApp){
	angular.bootstrap(document, ['MainApp']);
});
