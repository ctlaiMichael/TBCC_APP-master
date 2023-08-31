define([], function () {
	var router_config = {};
	router_config['init'] = 'home';
	//==Layout==//
	router_config['masterLayout'] = {
		abstract: true,
		controller_path : 'controller/menuCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.BACK_TO_HOME' //'信用卡服務'
		},
		resolve : {
		},
		views: {
			'header': {
				templateUrl: 'modules/template/templates/header.html',
				controller: 'headCtrl'
			},
			'menu-left': {
				templateUrl: 'modules/template/templates/aside_menu.html',
				controller: 'menuLeftCtrl'
			},
			'content': {
				templateUrl: 'modules/template/home.html',
				controller: 'menuCtrl'
			},
			'footer':{
				templateUrl: 'modules/template/templates/footer.html',
				controller: 'footerCtrl'
			},
			'popup':{
				templateUrl: 'modules/template/templates/popup_window.html',
				controller: 'popupCtrl'
			},
			'fix_box':{
				template: '',
				controller: 'fixBoxCtrl'
			}
		}
	};


	//==close==//
	router_config['close'] = {
		url:"/close",
		parent: 'masterLayout',
		controller_path : 'controller/closeCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.BACK_TO_HOME' //'信用卡服務'
		},
		views: {
			'content@':{
				template: '<div class="bc_frame"><h3 class="row_single in_sub_title sixthagree">離開信用卡服務</h3></div>',
				controller: 'closeCtrl'
			}
		}
	};

	//==home==//
	router_config['home'] = {
		url:"/home",
		parent: 'masterLayout',
		data : {
			pageTitle : 'PAGE_TITLE.BACK_TO_HOME' //'信用卡服務'
		},
		views: {
			'footer@':{
				template: '<div main-footer-ad></div>'
				// controller: 'menuCtrl'
			}
		}
	};

	//==message==//
	router_config['message'] = {
		url:"/message?title&content",
		parent: 'masterLayout',
		controller_path : 'controller/messageCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.ERRORMESSAGE' //'錯誤訊息'
		},
		params: {
			code: '',
			title: '',
			content: '',
			btn_list: []
		},
		views: {
			'content@':{
				templateUrl: 'modules/template/message/message.html',
				controller: 'messageCtrl'
			}
		}
	};

	//==選單==//
	router_config['select'] = {
		url:"/select/:menu_type/",
		parent: 'masterLayout',
		controller_path : 'controller/selectMenuCtrl',
		data : {
			pageTitle : ''
		},
		views: {
			'content@' : {
					templateUrl: 'modules/template/templates/select_menu.html',
					controller: 'selectMenuCtrl'
			}
		}
	};

	//==dividend==//
	router_config['dividend'] = {
		url:"/dividend/",
		parent: 'masterLayout',
		controller_path : 'controller/dividendCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.DIVIDEND' //'紅利積點'
		},
		views: {
			'content@':{
				templateUrl: 'modules/template/dividend/index.html',
				controller: 'dividendCtrl'
			}
		}
	};
	router_config['dividend.success'] = {
		url:"/success/:dividend/:money/:transfer",
		parent: 'dividend',
		data : {
			pageTitle : 'PAGE_TITLE.DIVIDEND' //'紅利積點'
		},
		views: {
			'content@':{
				templateUrl: 'modules/template/dividend/success.html',
				controller: 'dividendSuccessCtrl'
			}
		}
	};

	//==apply==//
	router_config['apply'] = {
		url:"/apply/:page?card_type&card_id",
		parent: 'masterLayout',
		controller_path : 'controller/applySelectCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.APPLY', //'申請信用卡',
			pageBack : {
				state:'home'
				,set:{}
			}
		},
		params: {
			page: 'index',
			card_type: 'hot',
			card_id: ''
		},
		views: {
			'content@':{
				templateUrl: 'modules/template/apply/index.html',
				controller: 'applySelectCtrl'
			}
		}
	};
	//信用卡申請方法 2018/08/27 105CR ADD
	router_config['applyTypeCheck'] = {
		url:"/applyTypeCheck/:page?card_type&card_id",
		parent: 'masterLayout',
		controller_path : 'controller/applyTypeCheckCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.APPLY', //'申請信用卡',
			pageBack : {
				state:'apply'
				,set:{}
			}
		},
		params: { //帶的參數設定
			page: 'index',
			card_type: 'hot',
			card_id: ''
		},
		views: {
			'content@':{
				templateUrl: 'modules/template/applyTypeCheck/index.html',
				controller: 'applyTypeCheckCtrl'
			}
		}
	};
	//==以他行卡==//
	router_config['otherCreditCard'] = {
		url:"/applyTypeCheck/other/:page?card_type&card_id&credit_type",
		parent: 'masterLayout',
		controller_path : 'controller/applyTypeCheckCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.APPLY', //'申請信用卡'
			pageBack : {
				state:'apply'
				,set:{}
				,confirm:{
					content : '如返回上一頁，您的資料將遺失'
				}
			}
		},
		params: { //帶的參數設定
			page: 'other',
			card_type: 'hot',
			card_id: '',
			credit_type:'other'
		},
		views: {
			'content@':{
				templateUrl: 'modules/template/applyTypeCheck/other.html',
				controller: 'applyTypeCheckCtrl'
			}
		}
	};
		//==以合庫卡==//
		router_config['tcbCreditCard'] = {
			url:"/applyTypeCheck/tcb/:page?card_type&card_id&credit_type",
			parent: 'masterLayout',
			controller_path : 'controller/applyTCBCheckCtrl',
			data : {
				pageTitle : 'PAGE_TITLE.APPLY', //'申請信用卡'
				pageBack : {
					state:'apply'
					,set:{}
					,confirm:{
						content : '如返回上一頁，您的資料將遺失'
					}
				}
			},
			params: { //帶的參數設定
				card_type: 'hot',
				card_id: '',
				credit_type:'tcb'
			},
			views: {
				'content@':{
					templateUrl: 'modules/template/applyTypeCheck/tcbCard.html',
					controller: 'applyTCBCheckCtrl'
				}
			}
		};


	router_config['apply.card'] = {
		url:"/apply/card/:card_id?:credit_type&idno",
		parent: 'masterLayout',
		data : {
			pageTitle : 'PAGE_TITLE.APPLY', //'申請信用卡',
			pageBack : {
				state:'apply'
				,set:{}
				,confirm:{
					content : '如返回上一頁，您的資料將遺失'
				}
			}
		},
		controller_path : 'controller/applyCtrl',
		views: {
			'content@':{
				templateUrl: 'modules/template/apply/apply_card.html',
				controller: 'applyCtrl'
			}
		}
	};

	//==upload==//
	router_config['upload'] = {
		url:"/upload",
		parent: 'masterLayout',
		controller_path : 'controller/applyUploadCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.UPLOAD' //'補件上傳'
		},
		views: {
			'content@':{
				templateUrl: 'modules/template/apply/upload_index.html',
				controller: 'applyUploadCtrl'
			}
		}
	};

	//==自行輸入繳卡費==//
	router_config['payForm'] = {
		url:"/payCardFee/payForm",
		parent: 'masterLayout',
		controller_path : 'controller/payCardFeeCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.PAY_FORM' //自行輸入繳卡費
		},
		params: {
			byPassage : 1, //通路別
			paymentData : {}, //選擇繳費清單
			check_key : '' //檢查項目
		},
		views: {
			'content@':{
				templateUrl: 'modules/template/payCardFee/payForm.html',
				controller: 'payCardFeeCtrl'
			}
		}
	};
	//==登入網銀繳卡費==//
	router_config['payFormLogin'] = {
		url:"/payCardFee/payFormLogin",
		parent: 'masterLayout',
		controller_path : 'controller/payCardFeeCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.PAY_LOGIN' //登入網銀繳卡費
		},
		views: {
			'content@':{
				// templateUrl: 'modules/template/payCardFee/payFormLogin.html',
				controller: 'loginPayCardFeeCtrl'
			}
		}
	};
	//==QR Code掃描==//
	router_config['qrCode4Fee'] = {
		url:"/qrCode4Fee/",
		parent: 'masterLayout',
		controller_path : 'controller/qrCode4FeeCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.QRCODE4FEE' //'QR Code繳卡費'
		},
		views: {
			'content@' : {
					templateUrl: 'modules/template/payCardFee/qrCodeIndex.html',
					controller: 'qrCode4FeeCtrl'
			}
		}
	};
	//==繳卡費確認頁==//
	// router_config['payCheck'] = {
	// 	url:"payCheck",
	// 	parent: 'payCardFee',
	// 	params: {
	// 		sendData: null
	// 	},
	// 	views: {
	// 		'content@':{
	// 			templateUrl: 'modules/template/payCardFee/payCheck.html',
	// 			controller: 'payCheckCtrl'
	// 		}
	// 	}
	// };

	//==開卡==//
	router_config['activateForm'] = {
		url:"/activateCard/activateForm",
		parent: 'masterLayout',
		controller_path : 'controller/activateCardCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.ACTIVATEFORM'//'信用卡開卡'
		},
		views: {
			'content@':{
				templateUrl: 'modules/template/activateCard/activateForm.html',
				controller: 'activateFormCtrl'
			}
		}
	};
	//==掛失==//
	router_config['lostForm'] = {
		url:"/activateCard/lostForm",
		parent: 'masterLayout',
		controller_path : 'controller/lostCardCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.LOSTFORM' //'信用卡掛失'
		},
		views: {
			'content@':{
				templateUrl: 'modules/template/activateCard/lostForm.html',
				controller: 'lostFormCtrl'
			}
		}
	};

	//==帳單分期==//
	router_config['billInst'] = {
		url:"/billInst/",
		parent: 'masterLayout',
		controller_path : 'controller/billInstCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.BILLINST' //'帳單分期'
		},
		views: {
			'content@' : {
					templateUrl: 'modules/template/installment/billInst.html',
					controller: 'billInstCtrl'
			}
		}
	};

	//==106年綜合所得稅分期==//
	router_config['taxbillInst'] = {
		url:"/taxbillInst/",
		parent: 'masterLayout',
		controller_path : 'controller/taxbillInstCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.TAXBILLINST11 ' //'帳單分期'
		},
		views: {
			'content@' : {
					templateUrl: 'modules/template/installment/taxbillInst.html',
					controller: 'taxbillInstCtrl'
			}
		}
	};

	
	//==單筆分期==//
	router_config['singleInst'] = {
		url:"/singleInst/",
		parent: 'masterLayout',
		controller_path : 'controller/singleInstCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.SINGLEINST' //'單筆分期'
		},
		views: {
			'content@' : {
					templateUrl: 'modules/template/installment/singleInst.html',
					controller: 'singleInstCtrl'
			}
		}
	};

	//==活動登錄==//
	router_config['activityLogin'] = {
		url:"/activityLogin",
		parent: 'masterLayout',
		controller_path : 'controller/activityLoginCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.ACTIVITYLOGIN' //'活動登錄'
		},
		views: {
			'content@':{
				templateUrl: 'modules/template/activity/activityLogin.html',
				controller: 'activityLoginCtrl'
			}
		}
	};

	//==我的信用卡==//
	router_config['my_card'] = {
		url:"/my_card/",
		parent: 'masterLayout',
		controller_path : 'controller/myCardCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.MYCARD' //'我的信用卡'
		},
		views: {
			'content@':{
				templateUrl: 'modules/template/billSearch/myCard.html',
				controller: 'myCardListCtrl'
			}
		}
	};

	//==帳單查詢==//
	router_config['bill_period'] = {
		url:"/bill_period/?period",
		parent: 'masterLayout',
		controller_path : 'controller/billPeriodCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.BILLPERIOD0' //'帳單查詢'
			,pageBack : {
				state:'select',
				set : {menu_type:'billSearch'}
			}
		},
		params: {
			period: '',
		},
		views: {
			'content@':{
				templateUrl: 'modules/template/billSearch/billPeriodSelect.html',
				controller: 'billPeriodSelectCtrl'
			}
		}
	};

	//==信用卡未列帳單明細==//
	router_config['bill_unrecorded'] = {
		url:"/bill_unrecorded/",
		parent: 'masterLayout',
		controller_path : 'controller/billUnrecordedCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.BILLUNRECORDED' //'信用卡未列帳單明細'
			,pageBack : {
				state:'select',
				set : {menu_type:'billSearch'}
			}
		},
		views: {
			'content@':{
				templateUrl: 'modules/template/billSearch/unrecordedSelect.html',
				controller: 'unrecordedSelectCtrl'
			}
		}
	};

	//==VISASearch==//
	router_config['visa_search'] = {
		url:"/visa_search/",
		parent: 'masterLayout',
		controller_path : 'controller/visaSearchCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.VISASEARCH' //'VISA金融卡帳單查詢',
			,pageBack : {
				state:'select',
				set : {menu_type:'billSearch'}
			}
		},
		views: {
			'content@':{
				templateUrl: 'modules/template/visaSearch/visaSearch.html',
				controller: 'visaListCtrl'
			}
		}
	};

	//==qanda==//
	router_config['qanda'] = {
		url:"/qanda/",
		parent: 'masterLayout',
		controller_path : 'controller/qandaCtrl',
		data : {
			pageTitle : 'PAGE_TITLE.QANDA' //'Q&A'
		},
		views: {
			'content@':{
				templateUrl: 'modules/template/qanda/qanda_information.html',
				controller: 'qandaCtrl'
			}
		}
	};


	//==qanda==//
	router_config['promotions'] = {
		url:"/promotions/",
		parent: 'masterLayout',
		controller_path : 'controller/promotionsCtrl',
		data : {
			pageTitle : '優惠活動' //'Q&A'
		},
		views: {
			'content@':{
				controller: 'promotionsCtrl'
			}
		}
	};

	//==Main Page 首頁==//
	router_config['mainPageMenu'] = {
		url:"/mainPage/menu",
		parent: 'masterLayout',
		controller_path : 'modules/mainPage/00menu/mainPageMenu',
		data : {
			pageTitle : '首頁' //首頁
		},
		views: {
			'content@':{
				templateUrl: 'modules/mainPage/00menu/mainPageMenu.html',
				controller: 'mainPageMenuCtrl'
			}
		}
	};

	//==============================QR Code 付款 Start=========================//
	//==QR Code 付款-選單==//
	router_config['qrcodePayMenu'] = {
		url:"/qrCodePay/menu",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/00menu/qrcodePayMenu',
		data : {
			pageTitle : '輸入繳費金額' //自行輸入繳費金額
		},
		params: {
			byPassage : 1, //通路別
			paymentData : {}, //選擇繳費清單
			check_key : '' //檢查項目
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/00menu/qrcodePayMenu.html',
				controller: 'qrcodePayMenuCtrl'
			}
		}
	};

	//==QR Code 付款-使用條款==//
	router_config['qrcodePayTerms'] = {
		url:"/qrCodePay/terms",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/01setting/terms/qrcodePayTerms',
		data : {
			pageTitle : '輸入繳費金額' //自行輸入繳費金額
		},
		params: {
			byPassage : 1, //通路別
			paymentData : {}, //選擇繳費清單
			check_key : '' //檢查項目
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/01setting/terms/qrcodePayTerms.html',
				controller: 'qrcodePayTermsCtrl'
			}
		}
	};
	//==QR Code 付款-帳號設定==//
	router_config['qrcodePaySetting'] = {
		url:"/qrCodePay/setting",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/01setting/setting/qrcodePaySetting',
		data : {
			pageTitle : 'PAGE_TITLE.PAY_FORM' //自行輸入繳卡費
		},
		params: {
			accts : [] 	//帳號清單
			,defaultTrnsOutAcct: '' //轉帳帳戶
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/01setting/setting/qrcodePaySetting.html' ,
				controller: 'qrcodePaySettingCtrl'
			}
		}
	};

	//==QRCode設定輸入密碼==//
	router_config['qrCodePaySettingConfirm'] = {
		url:"/qrCodePay/settingConfirm",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/01setting/confirm/qrcodePayConfirm',
		data : {
			pageTitle : 'PAGE_TITLE.QRCODE_PAY_EDIT' //自行輸入繳卡費
		},
		params: {
			form : {} 
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/01setting/confirm/qrcodePayConfirm.html',
				controller: 'qrCodePaySettingConfirmCtrl'
			}
		}
	};


	//==QR Code 付款-結果==//
	router_config['qrcodePaySettingResult'] = {
		url:"/qrCodePay/settingResult",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/01setting/result/qrcodePayResult',
		data : {
			pageTitle : 'PAGE_TITLE.PAY_FORM' //自行輸入繳卡費
		},
		params: {
			isAgreeQRCode: '',
			result : {} //選擇繳費清單
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/01setting/result/qrcodePayResult.html',
				controller: 'qrcodePayResultCtrl'
			}
		}
	};
	//==QR Code 付款-掃描==//
	router_config['qrcodePay'] = {
		url:"/qrcodePay/",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/scan/qrcodePayScan',
		data : {
			pageTitle : 'PAGE_TITLE.QRCODE4FEE' //'QR Code繳卡費'
		},
		views: {
			'content@' : {
					controller: 'qrcodePayScan'
			}
		}
	};
	//==QR Code 付款-掃描==//
	router_config['qrcodePayScanNew'] = {
		url:"/qrcodePay/qrcodePayScanNew/",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/scanNew/qrcodePayScanNew',
		data : {
			pageTitle : '' //'QR Code掃描'
		},
		views: {
			'content@' : {
				templateUrl: 'modules/qrcodePay/02payment/scanNew/qrcodePayScanNew.html',
				controller: 'qrcodePayScanNewCtrl'
			}
		}
	};

	//==QR Code 付款-輸入金額==//
	router_config['qrCodePayForm'] = {
		url:"/qrCodePay/payForm",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/edit/qrcodePayEdit',
		data : {
			pageTitle : 'PAGE_TITLE.QRCODE_PAY_EDIT' //自行輸入繳卡費
		},
		params: {
			trnsfrOutAcct: ''	//預設轉出帳號
			,trnsLimitAmt: ''	//單筆限額
			, qrcode : {} //QRCode內容
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/02payment/edit/qrcodePayEdit.html',
				controller: 'qrcodePayEditCtrl'
			}
		}
	};

	//==QR Code 繳稅付款-輸入金額==//
	router_config['qrCodePayFormTax'] = {
		url:"/qrCodePay/payFormTax",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/edit/qrcodePayEditTax',
		data : {
			pageTitle : 'QRCode繳稅' //自行輸入繳卡費
		},
		params: {
			trnsfrOutAcct: ''	//預設轉出帳號
			,trnsLimitAmt: ''	//單筆限額
			, qrcode : {} //QRCode內容
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/02payment/edit/qrcodePayEditTax.html',
				controller: 'qrcodePayEditTaxCtrl'
			}
		}
	};

	//==QR Code PayTax-輸入金額==//
	router_config['qrCodePayFormTax2'] = {
		url:"/qrCodePay/payFormTax2",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/edit/qrcodePayEditTax2',
		data : {
			pageTitle : 'QRCode繳稅2' //自行輸入繳卡費
		},
		params: {
			trnsfrOutAcct: ''	//預設轉出帳號
			,trnsLimitAmt: ''	//單筆限額
			, qrcode : {} //QRCode內容
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/02payment/edit/qrcodePayEditTax2.html',
				controller: 'qrcodePayEditTax2Ctrl'
			}
		}
	};

	//==QR Code PayTax4-輸入金額(綜所稅)==//
	router_config['qrCodePayFormTax4'] = {
		url:"/qrCodePay/payFormTax4",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/edit/qrcodePayEditTax4',
		data : {
			pageTitle : 'QRCode繳稅4' //自行輸入繳卡費
		},
		params: {
			trnsfrOutAcct: ''	//預設轉出帳號
			,trnsLimitAmt: ''	//單筆限額
			, qrcode : {} //QRCode內容
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/02payment/edit/qrcodePayEditTax4.html',
				controller: 'qrcodePayEditTax4Ctrl'
			}
		}
	};

	//==QR Code GetEdit (P2P轉帳)==//
	router_config['qrCodeGetForm'] = {
		url:"/qrCodePay/getForm",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/edit/qrcodeGetEdit',
		data : {
			pageTitle : '單筆轉帳' //自行輸入繳卡費
		},
		params: {
			trnsfrOutAcct: ''	//預設轉出帳號
			,trnsLimitAmt: ''	//單筆限額
			, qrcode : {} //QRCode內容
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/02payment/edit/qrcodeGetEdit.html',
				controller: 'qrCodeGetEditCtrl'
			}
		}
	};



	//==QR Code 繳卡費-輸入金額==//
	router_config['qrCodePayFormCard'] = {
		url:"/qrCodePay/payFormCard",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/edit/qrcodePayEditCard',
		data : {
			pageTitle : 'QRCode繳費' //自行輸入繳卡費
		},
		params: {
			trnsfrOutAcct: ''	//預設轉出帳號
			,trnsLimitAmt: ''	//單筆限額
			, qrcode : {} //QRCode內容
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/02payment/edit/qrcodePayEditCard.html',
				controller: 'qrcodePayEditCardCtrl'
			}
		}
	};



	//==QR Code 付款-確認==//
	router_config['qrcodePayCheck'] = {
		url:"/qrCodePay/payCheck",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/check/qrcodePayCheck',
		data : {
			pageTitle : '輸入繳費金額' //自行輸入繳費金額
		},
		params: {
			qrcode : {},	//QRCode掃描資訊
			paymentData : {}, //交易內容
			securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/02payment/check/qrcodePayCheck.html',
				controller: 'qrcodePayCheckCtrl'
			}
		}
	};

	//==QR Code 繳稅付款-確認==//
	router_config['qrcodePayTaxCheck'] = {
		url:"/qrCodePay/payTaxCheck",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/check/qrcodePayTaxCheck',
		data : {
			pageTitle : 'QRCode繳稅確認' //自行輸入繳費金額
		},
		params: {
			qrcode : {},	//QRCode掃描資訊
			paymentData : {}, //交易內容
			securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/02payment/check/qrcodePayTaxCheck.html',
				controller: 'qrcodePayTaxCheckCtrl'
			}
		}
	};

	//==QR Code 繳卡費-確認==//
	router_config['qrcodePayCardCheck'] = {
		url:"/qrCodePay/payCardCheck",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/check/qrcodePayCardCheck',
		data : {
			pageTitle : 'QRCode繳卡費確認' //自行輸入繳費金額
		},
		params: {
			qrcode : {},	//QRCode掃描資訊
			paymentData : {}, //交易內容
			securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/02payment/check/qrcodePayCardCheck.html',
				controller: 'qrcodePayCardCheckCtrl'
			}
		}
	};

	//==QR Code 付款-結果==//
	router_config['qrcodePayResult'] = {
		url:"/qrCodePay/payResult",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/result/qrcodePayResult',
		data : {
			pageTitle : 'PAGE_TITLE.PAY_FORM' //自行輸入繳卡費
		},
		params: {
			qrcode: {},	//上行資料
			result : {} //選擇繳費清單
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/02payment/result/qrcodePayResult.html',
				controller: 'qrcodePayResultCtrl'
			}
		}
	};

	//==QR Code 繳稅-結果==//
	router_config['qrcodePayTaxResult'] = {
		url:"/qrCodePay/payTaxResult",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/result/qrcodePayTaxResult',
		data : {
			pageTitle : 'QRCode繳稅結果' //自行輸入繳卡費
		},
		params: {
			qrcode: {},	//上行資料
			result : {} //選擇繳費清單
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/02payment/result/qrcodePayTaxResult.html',
				controller: 'qrcodePayTaxResultCtrl'
			}
		}
	};

	//==QR Code P2P轉帳-結果==//
	router_config['qrcodeGetResult'] = {
		url:"/qrCodePay/getResult",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/result/qrcodeGetResult',
		data : {
			pageTitle : 'QRCode轉帳結果' //自行輸入繳卡費
		},
		params: {
			qrcode: {},	//上行資料
			result : {} //選擇繳費清單
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/02payment/result/qrcodeGetResult.html',
				controller: 'qrcodeGetResultCtrl'
			}
		}
	};

	//==QR Code 繳卡費-結果==//
	router_config['qrcodePayCardResult'] = {
		url:"/qrCodePay/payCardResult",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/result/qrcodePayCardResult',
		data : {
			pageTitle : 'QRCode繳費結果' //自行輸入繳卡費
		},
		params: {
			qrcode: {},	//上行資料
			result : {} //選擇繳費清單
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/02payment/result/qrcodePayCardResult.html',
				controller: 'qrcodePayCardResultCtrl'
			}
		}
	};

	//==QR Code 小額支付免輸密碼設定-使用條款==//
	router_config['microPaymentTerms'] = {
		url:"/qrCodePay/microPaymentTerms",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/03microPaymentSetting/terms/qrcodePayTerms',
		data : {
			pageTitle : '小額支付免輸密碼設定' //小額支付免輸密碼設定
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/03microPaymentSetting/terms/qrcodePayTerms.html',
				controller: 'qrcodePayTermsCtrl'
			}
		}
	};

	//==出示條碼-編輯==//
	router_config['qrcodePayBeScanEdit'] = {
		url:"/qrCodePay/qrcodePayBeScanEdit",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/04beSacn/edit/qrcodePayBeScanEdit',
		data : {
			pageTitle : '出示條碼編輯' //出示條碼編輯
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/04beSacn/edit/qrcodePayBeScanEdit.html',
				controller: 'qrcodePayBeScanEditCtrl'
			}
		}
	};

	//==出示條碼頁面==//
	router_config['qrcodePayBeScanShow'] = {
		url:"/qrCodePay/qrcodePayBeScanShow",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/04beSacn/show/qrcodePayBeScanShow',
		data : {
			pageTitle : '出示條碼頁面' //出示條碼頁面
		},
		params: {
			result : {} 
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/04beSacn/show/qrcodePayBeScanShow.html',
				controller: 'qrcodePayBeScanShowCtrl'
			}
		}
	};

	//==出示條碼交易結果==//
	router_config['qrcodePayBeScanResult'] = {
		url:"/qrCodePay/qrcodePayBeScanResult",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/04beSacn/result/qrcodePayBeScanResult',
		data : {
			pageTitle : '出示條碼結果' //出示條碼結果
		},
		params: {
			result : {} 
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/04beSacn/result/qrcodePayBeScanResult.html',
				controller: 'qrcodePayBeScanResultCtrl'
			}
		}
	};

	//==電子發票專區==//
	// router_config['barcodeMenu'] = {
	// 	url:"/qrCodePay/barcodeMenu",
	// 	parent: 'masterLayout',
	// 	controller_path : 'modules/qrcodePay/05barcode/00menu/barcodeMenu',
	// 	data : {
	// 		pageTitle : '電子發票專區' //電子發票專區
	// 	},
	// 	views: {
	// 		'content@':{
	// 			templateUrl: 'modules/qrcodePay/05barcode/00menu/barcodeMenu.html',
	// 			controller: 'barcodeMenuCtrl'
	// 		}
	// 	}
	// };

	//==發票載具條碼 顯示==//
	router_config['getBarcodeTerm'] = {
		url:"/qrCodePay/getBarcodeTerm",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/05barcode/01getBarcode/term/getBarcodeTerm',
		data : {
			pageTitle : '發票載具條碼' //發票載具條碼
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/05barcode/01getBarcode/term/getBarcodeTerm.html',
				controller: 'getBarcodeTermCtrl'
			}
		}
	};

	//==發票載具條碼 編輯==//
	router_config['getBarcodeEdit'] = {
		url:"/qrCodePay/getBarcodeEdit",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/05barcode/01getBarcode/edit/getBarcodeEdit',
		data : {
			pageTitle : '發票載具條碼' //發票載具條碼
		},
		params: {
			result : {} 
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/05barcode/01getBarcode/edit/getBarcodeEdit.html',
				controller: 'getBarcodeEditCtrl'
			}
		}
	};

	//==發票載具條碼 結果==//
	router_config['getBarcodeResult'] = {
		url:"/qrCodePay/getBarcodeResult",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/05barcode/01getBarcode/result/getBarcodeResult',
		data : {
			pageTitle : '發票載具條碼' //發票載具條碼
		},
		params: {
			result : {} //選擇繳費清單
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/05barcode/01getBarcode/result/getBarcodeResult.html',
				controller: 'getBarcodeResultCtrl'
			}
		}
	};

	//==帳戶綁定 編輯==//
	router_config['bankInfoEdit'] = {
		url:"/qrCodePay/bankInfoEdit",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/05barcode/02bankInfo/edit/bankInfoEdit',
		data : {
			pageTitle : '帳戶綁定' //帳戶綁定
		},
		params: {
			result : {} //選擇繳費清單
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/05barcode/02bankInfo/edit/bankInfoEdit.html',
				controller: 'bankInfoEditCtrl'
			}
		}
	};

	//==帳戶綁定 結果==//
	router_config['bankInfoResult'] = {
		url:"/qrCodePay/bankInfoResult",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/05barcode/02bankInfo/result/bankInfoResult',
		data : {
			pageTitle : '帳戶綁定' //帳戶綁定
		},
		params: {
			result : {} //選擇繳費清單
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/05barcode/02bankInfo/result/bankInfoResult.html',
				controller: 'bankInfoResultCtrl'
			}
		}
	};

	//==手機條碼註冊 編輯==//
	router_config['carRegEdit'] = {
		url:"/qrCodePay/carRegEdit",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/05barcode/03carReg/edit/carRegEdit',
		data : {
			pageTitle : '手機條碼註冊' //手機條碼註冊
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/05barcode/03carReg/edit/carRegEdit.html',
				controller: 'carRegEditCtrl'
			}
		}
	};

	//==手機條碼註冊 結果==//
	router_config['carRegResult'] = {
		url:"/qrCodePay/carRegResult",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/05barcode/03carReg/result/carRegResult',
		data : {
			pageTitle : '手機條碼註冊' //手機條碼註冊
		},
		params: {
			result : {} //選擇繳費清單
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/05barcode/03carReg/result/carRegResult.html',
				controller: 'carRegResultCtrl'
			}
		}
	};

	//==變更手機條碼驗證碼 編輯==//
	router_config['changeVerEdit'] = {
		url:"/qrCodePay/changeVerEdit",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/05barcode/04changeVer/edit/changeVerEdit',
		data : {
			pageTitle : '變更手機條碼驗證碼' //變更手機條碼驗證碼
		},
		params: {
			result : {} //選擇繳費清單
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/05barcode/04changeVer/edit/changeVerEdit.html',
				controller: 'changeVerEditCtrl'
			}
		}
	};

	//==變更手機條碼驗證碼 結果==//
	router_config['changeVerResult'] = {
		url:"/qrCodePay/changeVerResult",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/05barcode/04changeVer/result/changeVerResult',
		data : {
			pageTitle : '變更手機條碼驗證碼' //變更手機條碼驗證碼
		},
		params: {
			result : {} //選擇繳費清單
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/05barcode/04changeVer/result/changeVerResult.html',
				controller: 'changeVerResultCtrl'
			}
		}
	};

	//==重置手機條碼驗證碼 編輯==//
	router_config['forgetVerEdit'] = {
		url:"/qrCodePay/forgetVerEdit",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/05barcode/05forgetVer/edit/forgetVerEdit',
		data : {
			pageTitle : '重置手機條碼驗證碼' //重置手機條碼驗證碼
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/05barcode/05forgetVer/edit/forgetVerEdit.html',
				controller: 'forgetVerEditCtrl'
			}
		}
	};

	//==重置手機條碼驗證碼 結果==//
	router_config['forgetVerResult'] = {
		url:"/qrCodePay/forgetVerResult",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/05barcode/05forgetVer/result/forgetVerResult',
		data : {
			pageTitle : '重置手機條碼驗證碼' //重置手機條碼驗證碼
		},
		params: {
			result : {} //選擇繳費清單
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/05barcode/05forgetVer/result/forgetVerResult.html',
				controller: 'forgetVerResultCtrl'
			}
		}
	};

	//==捐贈碼 編輯==//
	router_config['loveCodeEdit'] = {
		url:"/qrCodePay/loveCodeEdit",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/05barcode/06loveCode/edit/loveCodeEdit',
		data : {
			pageTitle : '捐贈碼' //捐贈碼
		},
		params: {
			result : {} 
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/05barcode/06loveCode/edit/loveCodeEdit.html',
				controller: 'loveCodeEditCtrl'
			}
		}
	};

	//==推薦人設定==//
	router_config['referenceEdit'] = {
		url:"/qrcodePay/referenceEdit",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/06reference/edit/referenceEdit',
		data : {
			pageTitle : '推薦人設定' 
		},
		params: {
			result : {} 
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/06reference/edit/referenceEdit.html',
				controller: 'referenceEditCtrl'
			}
		}
	};

	//==推薦人設定結果==//
	router_config['referenceResult'] = {
		url:"/qrcodePay/referenceResult",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/06reference/result/referenceResult',
		data : {
			pageTitle : '推薦人設定結果' 
		},
		params: {
			result : {} //交易結果
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/06reference/result/referenceResult.html',
				controller: 'referenceResultCtrl'
			}
		}
	};

	//==消費扣款-交易結果查詢-清單==//
	router_config['transQueryTerms'] = {
		url:"/qrcodePay/transQueryTerms",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/07transQuery/terms/transQueryTerms',
		data : {
			pageTitle : '消費扣款-交易結果查詢-清單' 
		},
		params: {
			result : {} //交易結果
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/07transQuery/terms/transQueryTerms.html',
				controller: 'transQueryTermsCtrl'
			}
		}
	};

	//==消費扣款-交易結果查詢-明細==//
	router_config['transQueryDetail'] = {
		url:"/qrcodePay/transQueryDetail",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/07transQuery/detail/transQueryDetail',
		data : {
			pageTitle : '消費扣款-交易結果查詢-明細' 
		},
		params: {
			result : {} //交易結果
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/07transQuery/detail/transQueryDetail.html',
				controller: 'transQueryDetailCtrl'
			}
		}
	};

	//==消費扣款-交易結果查詢-購物退款==//
	router_config['transQueryRefund'] = {
		url:"/qrcodePay/transQueryRefund",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/07transQuery/refund/transQueryRefund',
		data : {
			pageTitle : '消費扣款-交易結果查詢-購物退款' 
		},
		params: {
			result : {} //交易結果
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/07transQuery/refund/transQueryRefund.html',
				controller: 'transQueryRefundCtrl'
			}
		}
	};

	//==消費扣款-交易結果查詢-退款結果==//
	router_config['transQueryRefundResult'] = {
		url:"/qrcodePay/transQueryRefundResult",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/07transQuery/result/transQueryRefundResult',
		data : {
			pageTitle : '消費扣款-交易結果查詢-退款結果' 
		},
		params: {
			result : {} //交易結果
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/07transQuery/result/transQueryRefundResult.html',
				controller: 'transQueryRefundResultCtrl'
			}
		}
	};
	//==============================QR Code 付款 End==============================//
		//==============================基金 Start=========================//
	//==基金 定期(不)定額查詢/異動==//
	router_config['fundTermsSipOti'] = {
		url:"/fund/fundTermsSipOti",
		parent: 'masterLayout',
		controller_path : 'modules/fund/01setSipOti/fundChangeSipOti/terms/fundChangeSipOtiTerms',
		data : {
			pageTitle : '定期(不)定額查詢/異動' 
		},
		params: {
			paymentData : {}, //交易內容
			keepData : {},   
			securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/fund/01setSipOti/fundChangeSipOti/terms/fundChangeSipOtiTerms.html',
				controller: 'fundChangeSipOtiTermsCtrl'
			}
		}
	};

	//==基金 定期(不)定額查詢/異動-編輯==//
	router_config['fundEditSipOti'] = {
		url:"/fund/fundEditSipOti",
		parent: 'masterLayout',
		controller_path : 'modules/fund/01setSipOti/fundChangeSipOti/edit/fundChangeSipOtiEdit',
		data : {
			pageTitle : '定期(不)定額查詢/異動' 
		},
		params: {
			paymentData : {}, //交易內容
			OutAC : [],       //扣款帳號
			InAC : [],        //現金收益帳號
			reqfi000702Param: {}, //702電文參數
			resfi000702Param: {}, //702電文參數
			keepData:{},   //show電文參數
			securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/fund/01setSipOti/fundChangeSipOti/edit/fundChangeSipOtiEdit.html',
				controller: 'fundChangeSipOtiEditCtrl'
			}
		}
	};

	//==基金 定期(不)定額查詢/異動-扣款日期異動==//
	router_config['fundSettingSipOtiSetPayDate'] = {
		url:"/fund/fundSettingSipOtiSetPayDate",
		parent: 'masterLayout',
		controller_path : 'modules/fund/01setSipOti/fundChangeSipOti/setting/fundChangeSipOtiSetSettingPayDate',
		data : {
			pageTitle : '扣款日期異動' 
		},
		params: {
			paymentData : {}, //交易內容
			OutAC : [],       //扣款帳號
			InAC : [],        //現金收益帳號
			resfi000702Param: {}, //702 res 電文參數
			reqfi000702Param: {}, //702 req 電文參數
			keepData:{},   //show電文參數
			securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/fund/01setSipOti/fundChangeSipOti/setting/fundChangeSipOtiSetSettingPayDate.html',
				controller: 'fundChangeSipOtiSetSettingPayDateCtrl'
			}
		}
	};

	//==基金 定期(不)定額查詢/異動-交易結果==//
	router_config['fundResultSipOti'] = {
		url:"/fund/fundResultSipOti",
		parent: 'masterLayout',
		controller_path : 'modules/fund/01setSipOti/fundChangeSipOti/result/fundChangeSipOtiResult',
		data : {
			pageTitle : '交易結果' 
		},
		params: {
			keepData:{},   //show電文參數
			response:{},       //response
			securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/fund/01setSipOti/fundChangeSipOti/result/fundChangeSipOtiResult.html',
				controller: 'fundChangeSipOtiResultCtrl'
			}
		}
	};

	//==現金收益存入帳號異動==//
	router_config['fundTermsProfitAcnt'] = {
		url:"/fund/fundTermsProfitAcnt",
		parent: 'masterLayout',
		controller_path : 'modules/fund/01setSipOti/fundChangeProfitAcnt/terms/fundChangeProfitAcntTerms',
		data : {
			pageTitle : '現金收益存入帳號異動' 
		},
		params: {
			paymentData : {}, //交易內容
			keepData : {},
			securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/fund/01setSipOti/fundChangeProfitAcnt/terms/fundChangeProfitAcntTerms.html',
				controller: 'fundChangeProfitAcntTermsCtrl'
			}
		}
	};

	//==現金收益存入帳號異動-編輯==//
	router_config['fundEditProfitAcnt'] = {
		url:"/fund/fundEditProfitAcnt",
		parent: 'masterLayout',
		controller_path : 'modules/fund/01setSipOti/fundChangeProfitAcnt/edit/fundChangeProfitAcntEdit',
		data : {
			pageTitle : '現金收益存入帳號異動' 
		},
		params: {
			paymentData : {}, //交易內容
			OutAC : [],       //扣款帳號
			InAC : [],        //現金收益帳號
			reqfi000702Param: {}, //702電文參數
			securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/fund/01setSipOti/fundChangeProfitAcnt/edit/fundChangeProfitAcntEdit.html',
				controller: 'fundChangeProfitAcntEditCtrl'
			}
		}
	};

	//==現金收益存入帳號異動-交易結果==//
	router_config['fundResultProfitAcnt'] = {
		url:"/fund/fundResultProfitAcnt",
		parent: 'masterLayout',
		controller_path : 'modules/fund/01setSipOti/fundChangeProfitAcnt/result/fundChangeProfitAcntResult',
		data : {
			pageTitle : '交易結果' 
		},
		params: {
			displayParam:{},   //show電文參數
			response:{},       //response
			securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/fund/01setSipOti/fundChangeProfitAcnt/result/fundChangeProfitAcntResult.html',
				controller: 'fundChangeProfitAcntResultCtrl'
			}
		}
	};

	//==停損/獲利點通知設定==//
	router_config['fundTermsStopPoint'] = {
		url:"/fund/fundTermsStopPoint",
		parent: 'masterLayout',
		controller_path : 'modules/fund/02other/setStopLossAndTakeProfit/setting/stopLossAndTakeProfitSetting',
		data : {
			pageTitle : '現金收益存入帳號異動' 
		},
		params: {
			paymentData : {}, //交易內容
			securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/fund/02other/setStopLossAndTakeProfit/setting/stopLossAndTakeProfitSetting.html',
				controller: 'fundTermsStopPointCtrl'
			}
		}
	};


	//==停損/獲利點通知設定-結果==//
	router_config['fundResultStopPoint'] = {
		url:"/fund/fundResultStopPoint",
		parent: 'masterLayout',
		controller_path : 'modules/fund/02other/setStopLossAndTakeProfit/result/stopLossAndTakeProfitSettingResult',
		data : {
			pageTitle : '交易結果' 
		},
		params: {
			result : {}//交易結果
		},
		views: {
			'content@':{
				templateUrl: 'modules/fund/02other/setStopLossAndTakeProfit/result/stopLossAndTakeProfitSettingResult.html',
				controller: 'fundResultStopPointCtrl'
			}
		}
	};

	//==信託對帳單寄送方式==//
	router_config['fundTermsNoticeType'] = {
		url:"/fund/fundTermsNoticeType",
		parent: 'masterLayout',
		controller_path : 'modules/fund/02other/setFundStatement/setting/fundStatementSetting',
		data : {
			pageTitle : '信託對帳單寄送方式' 
		},
		params: {
			paymentData : {}, //交易內容
			securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/fund/02other/setFundStatement/setting/fundStatementSetting.html',
				controller: 'fundTermsNoticeTypeCtrl'
			}
		}
	};

	//==信託對帳單寄送方式-結果==//
	router_config['fundResultNoticeType'] = {
		url:"/fund/fundResultNoticeType",
		parent: 'masterLayout',
		controller_path : 'modules/fund/02other/setFundStatement/result/fundStatementSettingResult',
		data : {
			pageTitle : '交易結果' 
		},
		params: {
			result : {}//交易結果
		},
		views: {
			'content@':{
				templateUrl: 'modules/fund/02other/setFundStatement/result/fundStatementSettingResult.html',
				controller: 'fundResultNoticeTypeCtrl'
			}
		}
	};


	//==============================基金 End=========================//


	//==============================憑證 Start=========================//
	//==憑證到期繳費-同意條款畫面==//
	router_config['payForCATerms'] = {
		url:"/ca/payForCATerms",
		parent: 'masterLayout',
		controller_path : 'modules/ca/01payForCA/terms/payForCATerms',
		data : {
			pageTitle : '注意事項' 
		},
		views: {
			'content@':{
				templateUrl: 'modules/ca/01payForCA/terms/payForCATerms.html',
				controller: 'payForCATermsCtrl'
			}
		}
	};

	//==憑證到期繳費-編輯畫面==//
	router_config['payForCAEdit'] = {
		url:"/ca/payForCAEdit",
		parent: 'masterLayout',
		controller_path : 'modules/ca/01payForCA/edit/payForCAEdit',
		data : {
			pageTitle : '憑證到期繳費' 
		},
		params: {
			paymentData : {}, //交易內容
		},
		views: {
			'content@':{
				templateUrl: 'modules/ca/01payForCA/edit/payForCAEdit.html',
				controller: 'payForCAEditCtrl'
			}
		}
	};

	//==憑證到期繳費-確認畫面==//
	router_config['payForCAConfirm'] = {
		url:"/ca/payForCAConfirm",
		parent: 'masterLayout',
		controller_path : 'modules/ca/01payForCA/confirm/payForCAConfirm',
		data : {
			pageTitle : '憑證繳費確認' 
		},
		params: {
			paymentData : {}, //交易內容
			securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/ca/01payForCA/confirm/payForCAConfirm.html',
				controller: 'payForCAConfirmCtrl'
			}
		}
	};

	//==憑證到期繳費-繳費結果==//
	router_config['payForCAResult'] = {
		url:"/ca/payForCAResult",
		parent: 'masterLayout',
		controller_path : 'modules/ca/01payForCA/result/payForCAResult',
		data : {
			pageTitle : '繳費結果' 
		},
		params: {
			paymentData : {} //交易內容
		},
		views: {
			'content@':{
				templateUrl: 'modules/ca/01payForCA/result/payForCAResult.html',
				controller: 'payForCAResultCtrl'
			}
		}
	};

		//==出示收款條碼-編輯==//
		router_config['qrcodeGetBeScanEdit'] = {
			url:"/qrCodePay/qrcodeGetBeScanEdit",
			parent: 'masterLayout',
			controller_path : 'modules/qrcodePay/08beGet/qrcodeGetBeScanEdit',
			params: {
				result : {} 
			},
			data : {
				pageTitle : '出示條碼編輯' //出示條碼編輯
			},
			views: {
				'content@':{
					templateUrl: 'modules/qrcodePay/08beGet/qrcodeGetBeScanEdit.html',
					controller: 'qrcodeGetBeScanEditCtrl'
				}
			}
		};
	//==============================憑證 End=========================//

	//Added by Ivan 2018.5.10 生物辨識設定頁面
	router_config['setting'] = {
		url:"/setting/menu",
		parent: 'masterLayout',
		controller_path : 'modules/setting/setting',
		data : {
			pageTitle : '設定' //自行輸入繳費金額
		},
		views: {
			'content@':{
				templateUrl: 'modules/setting/setting.html',
				controller: 'settingCtrl'
			}
		}
	};

	router_config['Setting'] = {
		url:"/setting",
		parent: 'masterLayout',
		data : {
			pageTitle : '設定' //自行輸入繳費金額
		},
		views: {
			'content@':{
				templateUrl: 'setting.html'
			}
		}
	};
	
	//Added by Ivan 2018.5.10 登入頁面
	router_config['login'] = {
		url:"/login/menu",
		parent: 'masterLayout',
		controller_path : 'modules/login/login',
		data : {
			pageTitle : '登入' //自行輸入繳費金額
		},
		views: {
			'content@':{
				templateUrl: 'modules/login/login.html',
				controller: 'loginCtrl'
			}
		}
	};

	router_config['first'] = {
		url:"/first",
		parent: 'masterLayout',
		controller_path : 'modules/biometric/first/first',
		data : {
			pageTitle : '第一次使用' 
		},
		views: {
			'content@':{
				templateUrl: 'modules/biometric/first/first.html',
				controller: 'firstCtrl'
			}
		}
	};

	router_config['agreement'] = {
		url:"/agreement",
		parent: 'masterLayout',
		controller_path : 'modules/biometric/agreement/agreement',
		data : {
			pageTitle : '同意條款' 
		},
		views: {
			'content@':{
				templateUrl: 'modules/biometric/agreement/agreement.html',
				controller: 'agreementCtrl'
			}
		}
	};
	router_config['otp'] = {
		url:"/otp",
		parent: 'masterLayout',
		controller_path : 'modules/biometric/otp/otp',
		data : {
			pageTitle : 'OTP' 
		},
		views: {
			'content@':{
				templateUrl: 'modules/biometric/otp/otp.html',
				controller: 'otpCtrl'
			}
		}
	};

	router_config['disagreement'] = {
		url:"/disagreement",
		parent: 'masterLayout',
		controller_path : 'modules/biometric/disagreement/disagreement',
		data : {
			pageTitle : '同意條款' 
		},
		views: {
			'content@':{
				templateUrl: 'modules/biometric/disagreement/disagreement.html',
				controller: 'disagreementCtrl'
			}
		}
	};
	//==============================憑證 End=========================//
	//==============================預約外匯 start=========================//
	//==預約台幣轉外幣-Edit==//
	router_config['TwToForeignEdit'] = {
		url:"/ReservationForeign/TwToForeignEdit",
		parent: 'masterLayout',
		controller_path : 'modules/ReservationForeign/01TwToForeign/edit/TwToForeignEdit',
		data : {
			pageTitle : '預約台幣轉外幣-Edit' 
		},
		params: {
			// trnsfrOutAcct: ''	//預設轉出帳號
			// ,trnsLimitAmt: ''	//單筆限額
			// , qrcode : {} //QRCode內容
			
		},
		views: {
			'content@':{
				templateUrl: 'modules/ReservationForeign/01TwToForeign/edit/TwToForeignEdit.html',
				controller: 'TwToForeignEditCtrl'
			}
		}
	};


	//==外匯牌告匯率==//
	router_config['ForeignRate'] = {
		url:"/ReservationForeign/ForeignRate",
		parent: 'masterLayout',
		controller_path : 'modules/ReservationForeign/01TwToForeign/rate/ForeignRate',
		data : {
			pageTitle : '外匯牌告匯率' 
		},
		params: {
			form6 :{} //交易內容
			// keepData : {},
			// securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/ReservationForeign/01TwToForeign/rate/ForeignRate.html',
				controller: 'ForeignRateCtrl'
			}
		}
	};
	
	


	//==預約台幣轉外幣-Check==//
	router_config['TwToForeignCheck'] = {
		url:"/ReservationForeign/TwToForeignCheck",
		parent: 'masterLayout',
		controller_path : 'modules/ReservationForeign/01TwToForeign/check/TwToForeignCheck',
		data : {
			pageTitle : '預約台幣轉外幣-Check' 
		},
		params: {
			// paymentData : {}, //交易內容
			// keepData : {},
			// securityType : {} //安控類別
			form9 :{}
		},
		views: {
			'content@':{
				templateUrl: 'modules/ReservationForeign/01TwToForeign/check/TwToForeignCheck.html',
				
				controller: 'TwToForeignCheckCtrl'
			}
		}
	};

	//==預約台幣轉外幣-Result==//
	router_config['TwToForeignResult'] = {
		url:"/ReservationForeign/TwToForeignResult",
		parent: 'masterLayout',
		controller_path : 'modules/ReservationForeign/01TwToForeign/result/TwToForeignResult',
		data : {
			pageTitle : '預約台幣轉外幣-Result' 
		},
		params: {
			// paymentData : {}, //交易內容
			// keepData : {},
			// securityType : {} //安控類別
			form9 :{},
			result : {}
		},
		views: {
			'content@':{
				templateUrl: 'modules/ReservationForeign/01TwToForeign/result/TwToForeignResult.html',
				
				controller: 'TwToForeignResultCtrl'
			}
		}
	};

	//==預約外幣轉台幣-Edit==//
	router_config['ForeignToTwEdit'] = {
		url:"/ReservationForeign/ForeignToTwEdit",
		parent: 'masterLayout',
		controller_path : 'modules/ReservationForeign/02ForeignToTw/edit/ForeignToTwEdit',
		data : {
			pageTitle : '預約外幣轉台幣-Edit' 
		},
		params: {
			paymentData : {}, //交易內容
			keepData : {},
			securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/ReservationForeign/02ForeignToTw/edit/ForeignToTwEdit.html',
				
				controller: 'ForeignToTwEditCtrl'
			}
		}
	};

	//==預約外幣轉台幣-Check==//
	router_config['ForeignToTwCheck'] = {
		url:"/ReservationForeign/ForeignToTwCheck",
		parent: 'masterLayout',
		controller_path : 'modules/ReservationForeign/02ForeignToTw/check/ForeignToTwCheck',
		data : {
			pageTitle : '預約外幣轉台幣-Check' 
		},
		params: {
			form9 :{}
		},
		views: {
			'content@':{
				templateUrl: 'modules/ReservationForeign/02ForeignToTw/check/ForeignToTwCheck.html',
				
				controller: 'ForeignToTwCheckCtrl'
			}
		}
	};

	//==預約外幣轉台幣-Result==//
	router_config['ForeignToTwResult'] = {
		url:"/ReservationForeign/ForeignToTwResult",
		parent: 'masterLayout',
		controller_path : 'modules/ReservationForeign/02ForeignToTw/result/ForeignToTwResult',
		data : {
			pageTitle : '預約外幣轉台幣-Result' 
		},
		params: {
			// paymentData : {}, //交易內容
			// keepData : {},
			// securityType : {} //安控類別
			form9 :{},
			result : {}
		},
		views: {
			'content@':{
				templateUrl: 'modules/ReservationForeign/02ForeignToTw/result/ForeignToTwResult.html',
				
				controller: 'ForeignToTwResultCtrl'
			}
		}
	};

	//==預約外匯轉帳查詢及註銷-Search==//
	router_config['Search'] = {
		url:"/ReservationForeign/Search",
		parent: 'masterLayout',
		controller_path : 'modules/ReservationForeign/03SearchAndWriteOff/search/Search',
		data : {
			pageTitle : '預約外匯轉帳查詢及註銷-Search' 
		},
		params: {
			paymentData : {}, //交易內容
			keepData : {},
			securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/ReservationForeign/03SearchAndWriteOff/search/Search.html',
				
				controller: 'SearchCtrl'
			}
		}
	};

	//==預約外匯轉帳查詢及註銷-SearchResult==//
	router_config['SearchResult'] = {
		url:"/ReservationForeign/SearchResult",
		parent: 'masterLayout',
		controller_path : 'modules/ReservationForeign/03SearchAndWriteOff/searchresult/SearchResult',
		data : {
			pageTitle : '預約外匯轉帳查詢及註銷-SearchResult' 
		},
		params: {
			// paymentData : {}, //交易內容
			// keepData : {},
			// securityType : {} //安控類別
			form9 :{}
		},
		views: {
			'content@':{
				templateUrl: 'modules/ReservationForeign/03SearchAndWriteOff/searchresult/SearchResult.html',
				
				controller: 'SearchResultCtrl'
			}
		}
	};

	//==預約外匯轉帳查詢及註銷-Check==//
	router_config['SearchAndWriteOffCheck'] = {
		url:"/ReservationForeign/SearchAndWriteOffCheck",
		parent: 'masterLayout',
		controller_path : 'modules/ReservationForeign/03SearchAndWriteOff/check/SearchAndWriteOffCheck',
		data : {
			pageTitle : '預約外匯轉帳查詢及註銷-Result' 
		},
		params: {
			// paymentData : {}, //交易內容
			// keepData : {},
			// securityType : {} //安控類別
			form9 :{}
		},
		views: {
			'content@':{
				templateUrl: 'modules/ReservationForeign/03SearchAndWriteOff/check/SearchAndWriteOffCheck.html',
				
				controller: 'SearchAndWriteOffCheckCtrl'
			}
		}
	};

	//==預約外匯轉帳查詢及註銷-Result==//
	router_config['SearchAndWriteOffResult'] = {
		url:"/ReservationForeign/SearchAndWriteOffResult",
		parent: 'masterLayout',
		controller_path : 'modules/ReservationForeign/03SearchAndWriteOff/result/SearchAndWriteOffResult',
		data : {
			pageTitle : '預約外匯轉帳查詢及註銷-Result' 
		},
		params: {
			// paymentData : {}, //交易內容
			// keepData : {},
			// securityType : {} //安控類別
			form9 :{},
			result : {} 
		},
		views: {
			'content@':{
				templateUrl: 'modules/ReservationForeign/03SearchAndWriteOff/result/SearchAndWriteOffResult.html',
				
				controller: 'SearchAndWriteOffResultCtrl'
			}
		}
	};
	//==============================預約外匯 end=========================//
	//------------------------------------------------------//
	//==法遵客戶基本資料==//
	router_config['9700'] = {
		url:"/ReservationForeign/9700",
		parent: 'masterLayout',
		controller_path : 'modules/ReservationForeign/01TwToForeign/rate/9700',
		data : {
			pageTitle : '客戶基本資料' 
		},
		params: {
			//form6 :{} //交易內容
			// keepData : {},
			// securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/ReservationForeign/01TwToForeign/rate/9700.html',
				controller: '9700Ctrl'
			}
		}
	};

	//==============================定期不定額申購 start=========================//
	router_config['fixBuy'] = {
		url:"/fund/fixBuy",
		parent: 'masterLayout',
		controller_path : 'modules/fund/03buyFund/fixBuy',
		data : {
			pageTitle : '定期不定額申購' 
		},
		params: {
			//form6 :{} //交易內容
			// keepData : {},
			// securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/fund/03buyFund/fixBuy.html',
				controller: 'fixBuyCtrl'
			}
		}
	};

	router_config['fixBuy2'] = {
		url:"/fund/fixBuy2",
		parent: 'masterLayout',
		controller_path : 'modules/fund/03buyFund/fixBuy2',
		data : {
			pageTitle : '定期不定額申購' 
		},
		params: {
			//form6 :{} //交易內容
			// keepData : {},
			// securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/fund/03buyFund/fixBuy2.html',
				controller: 'fixBuy2Ctrl'
			}
		}
	};

	router_config['fixBuy3'] = {
		url:"/fund/fixBuy3",
		parent: 'masterLayout',
		controller_path : 'modules/fund/03buyFund/fixBuy3',
		data : {
			pageTitle : '定期不定額申購' 
		},
		params: {
			//form6 :{} //交易內容
			// keepData : {},
			// securityType : {} //安控類別
		},
		views: {
			'content@':{
				templateUrl: 'modules/fund/03buyFund/fixBuy3.html',
				controller: 'fixBuy3Ctrl'
			}
		}
	};

	//==============================定期不定額申購 end=========================//

	//==============================轉帳購物 start=========================//
	//==QR Code BuyEdit (轉帳購物)==//
	router_config['qrCodeBuyForm'] = {
		url:"/qrCodePay/buyForm",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/edit/qrcodeBuyEdit',
		data : {
			pageTitle : '單筆轉帳' //自行輸入繳卡費
		},
		params: {
			trnsfrOutAcct: ''	//預設轉出帳號
			,trnsLimitAmt: ''	//單筆限額
			, qrcode : {} //QRCode內容
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/02payment/edit/qrcodeBuyEdit.html',
				controller: 'qrCodeBuyEditCtrl'
			}
		}
	};

	//==QR Code BuyResult 結果(轉帳購物)==//
	router_config['qrcodeBuyResult'] = {
		url:"/qrCodePay/buyResult",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/result/qrcodeBuyResult',
		data : {
			pageTitle : 'QRCode轉帳結果' //自行輸入繳卡費
		},
		params: {
			qrcode: {},	//上行資料
			result : {} //選擇繳費清單
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/02payment/result/qrcodeBuyResult.html',
				controller: 'qrcodeBuyResultCtrl'
			}
		}
	};

	//==QR Code 發紅包==//
	router_config['qrcodePayScanRed'] = {
		url:"/qrcodePay/qrcodePayScanRed/",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/scanRed/qrcodePayScanRed',
		data : {
			pageTitle : '' //'QR Code掃描'
		},
		views: {
			'content@' : {
				templateUrl: 'modules/qrcodePay/02payment/scanRed/qrcodePayScanRed.html',
				controller: 'qrcodePayScanRedCtrl'
			}
		}
	};

	

	router_config['qrCodeRedEdit'] = {
		url:"/qrCodePay/redEdit",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/edit/qrcodeRedEdit',
		data : {
			pageTitle : 'QRCode轉帳' //自行輸入繳卡費
		},
		params: {
			qrcode: {},	//上行資料
			result : {} //選擇繳費清單
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/02payment/edit/qrcodeRedEdit.html',
				controller: 'qrCodeRedEditCtrl'
			}
		}
	};
	router_config['qrcodeRedResult'] = {
		url:"/qrCodePay/redResult",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/result/qrcodeRedResult',
		data : {
			pageTitle : 'QRCode轉帳結果' //自行輸入繳卡費
		},
		params: {
			qrcode: {},	//上行資料
			result : {} //選擇繳費清單
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/02payment/result/qrcodeRedResult.html',
				controller: 'qrcodeRedResultCtrl'
			}
		}
	};

	router_config['qrcodeRedEnve'] = {
		url:"/qrCodePay/redEnve",
		parent: 'masterLayout',
		controller_path : 'modules/qrcodePay/02payment/result/qrcodeRedEnve',
		data : {
			pageTitle : 'QRCode轉帳結果' //自行輸入繳卡費
		},
		params: {
			qrcode: {},	//上行資料
			result : {} //選擇繳費清單
		},
		views: {
			'content@':{
				templateUrl: 'modules/qrcodePay/02payment/result/qrcodeRedEnve.html',
				controller: 'qrcodeRedEnveCtrl'
			}
		}
	};

	//==============================轉帳購物 end=========================//



	//==demo==//
	// router_config['demo'] = {
	// 	url:"/demo",
	// 	parent: 'masterLayout',
	// 	data : {
	// 		pageTitle : '請輸入標題'
	// 	},
	// 	views: {
	// 		'content@' : {
	// 				templateUrl: 'modules/template/home.html',
	// 				controller: 'menuCtrl'
	// 		}
	// 	}
	// };

	//==============================外幣繳保費 start=========================//
	//==外幣繳保費 編輯==//
	router_config['ForeignInsuranceEdit'] = {
		url:"/ReservationForeign/ForeignInsuranceEdit",
		parent: 'masterLayout',
		controller_path : 'modules/ReservationForeign/04ForeignInsurance/edit/ForeignInsuranceEdit',
		data : {
			pageTitle : '外幣繳保費申請' //自行輸入繳卡費
		},
		params: {
			//qrcode: {},	//上行資料
			//result : {} //選擇繳費清單
		},
		views: {
			'content@':{
				templateUrl: 'modules/ReservationForeign/04ForeignInsurance/edit/ForeignInsuranceEdit.html',
				controller: 'ForeignInsuranceEditCtrl'
			}
		}
	};

	
	//==外幣繳保費 確認==//
	router_config['ForeignInsuranceCheck'] = {
		url:"/ReservationForeign/ForeignInsuranceCheck",
		parent: 'masterLayout',
		controller_path : 'modules/ReservationForeign/04ForeignInsurance/check/ForeignInsuranceCheck',
		data : {
			pageTitle : '外幣繳保費申請確認' //自行輸入繳卡費
		},
		params: {
			form9 : {},
			securityType : {} 
			//result : {} //選擇繳費清單
		},
		views: {
			'content@':{
				templateUrl: 'modules/ReservationForeign/04ForeignInsurance/check/ForeignInsuranceCheck.html',
				controller: 'ForeignInsuranceCheckCtrl'
			}
		}
	};

	//==外幣繳保費 結果==//
	router_config['ForeignInsuranceResult'] = {
		url:"/ReservationForeign/ForeignInsuranceResult",
		parent: 'masterLayout',
		controller_path : 'modules/ReservationForeign/04ForeignInsurance/result/ForeignInsuranceResult',
		data : {
			pageTitle : '外幣繳保費申請結果' //自行輸入繳卡費
		},
		params: {
			
			result : {} 
		},
		views: {
			'content@':{
				templateUrl: 'modules/ReservationForeign/04ForeignInsurance/result/ForeignInsuranceResult.html',
				controller: 'ForeignInsuranceResultCtrl'
			}
		}
	};
	//==============================外幣繳保費 end=========================//
	return router_config;
});
