define([], function () {
	var menu_config = {
		'main' : [],
		'left' : [],
		'footer' : []
	};

	//-------------main-------------//
	menu_config['main'] = [
		{
			"link" : "#/my_card/",
			"class_name" : "m_i_ov",
			"name" : "MENU.MAIN.MYCARD" //"我的信用卡"
		},
		{
			"link" : "#/select/billSearch/",
			"class_name" : "m_i_bl",
			"name" : "MENU.MAIN.BILLSEARCH" //"帳單查詢"
		},
		{
			"link" : "#/select/payCardFee/",
			"class_name" : "m_i_pay",
			"name" : "MENU.MAIN.PAYCARDFEE" //"繳卡費"
		},
		{
			"link" : "#/qrCode4Fee/",
			"class_name" : "m_i_qrc",
			"name" : "MENU.MAIN.QRCODE4FEE" //"QR Code繳卡費"
		},
		{
			"link" : "#/select/instSelect/",
			"class_name" : "m_i_ins",
			"name" : "MENU.MAIN.INSTSELECT" //"分期付款"
		},
		{
			"link" : "#/apply/",
			"class_name" : "m_i_upload",
			"name" : "MENU.MAIN.APPLY" //"申請/補件"
		},
		{
			// "link" : "#/promotions/",
			"link" : "https://www.tcb-bank.com.tw/creditcard/discount_news/Pages/activity.aspx",
			"class_name" : "m_i_mark",
			"name" : "MENU.MAIN.APP" //"優惠活動"
		},
		// {
		// 	"link" : "#/dividend/",
		// 	"class_name" : "m_i_divid",
		// 	"name" : "MENU.MAIN.DIVIDEND" //"紅利專區"
		// },
		{
			"link" : "#/activityLogin",
			"class_name" : "m_i_divid",
			"name" : "MENU.LEFT.ACTIVITYLOGIN" //"活動登錄"
		},
		{
			"link" : "#/select/activateCard/",
			"class_name" : "m_i_or",
			"name" : "MENU.MAIN.ACTIVATECARD" //"開卡/掛失"
		}
	];
	//-------------menu end-------------//

	//-------------left-------------//
	menu_config['left'] = [
		{
			"link" : "#/close",
			"class_name" : "",
			"name" : "MENU.LEFT.HOME" //"回首頁"
		},
		{
			"link" : "#/my_card/",
			"class_name" : "",
			"name" : "MENU.LEFT.MYCARD" //"我的信用卡"
		},
		{
			"link" : "",
			"class_name" : "",
			"name" : "MENU.LEFT.BILLSEARCH", //"帳單查詢",
			"sub_menu" : [
				{
					"link" : "#/bill_unrecorded/",
					"class_name" : "",
					"name" : "MENU.LEFT.BILLUNRECORDED" //"信用卡未列帳單明細"
				},
				{
					"link" : "#/visa_search/",
					"class_name" : "",
					"name" : "MENU.LEFT.VISASEARCH" //"VISA金融卡帳單查詢"
				},
				{
					"link" : "#/bill_period/?period=0",
					"class_name" : "",
					"name" : "MENU.LEFT.BILLPERIOD0" //"本期帳單"
				}
				// {
				// 	"link" : "#/bill_period/?period=1",
				// 	"class_name" : "",
				// 	"name" : "MENU.LEFT.BILLPERIOD1" //"前期帳單"
				// }
				// ,{
				// 	"link" : "#/bill_period/?period=2",
				// 	"class_name" : "",
				// 	"name" : "MENU.LEFT.BILLPERIOD2" //"前兩期帳單"
				// }
			]
		},
		{
			"link" : "",
			"class_name" : "",
			"name" : "MENU.LEFT.PAYCARD", //"繳卡費",
			"sub_menu" : [
				{
					"link" : "#/select/payCardFee/",
					"class_name" : "",
					"name" : "MENU.LEFT.PAYCARDFEE" //"繳卡費"
				},
				{
					"link" : "#/qrCode4Fee/",
					"class_name" : "",
					"name" : "MENU.LEFT.QRCODE4FEE" //"QR Code繳卡費"
				}
			]
		},
		{
			"link" : "",
			"class_name" : "",
			"name" : "MENU.LEFT.APPLYANDUPLOAD", //"申請/補件",
			"sub_menu" : [
				{
					"link" : "#/apply/",
					"class_name" : "",
					"name" : "MENU.LEFT.APPLY" //"申請信用卡"
				},
				{
					"link" : "#/upload",
					"class_name" : "",
					"name" : "MENU.LEFT.UPLOAD", //"補件上傳"
				}
			]
		},
		{
			"link" : "",
			"class_name" : "",
			"name" : "MENU.LEFT.INSTSELECT", //"分期付款",
			"sub_menu" : [
				{
					"link" : "#/billInst/",
					"class_name" : "",
					"name" : "MENU.LEFT.BILLINST" //"帳單分期"
				},
				{
					"link" : "#/singleInst/",
					"class_name" : "",
					"name" : "MENU.LEFT.SINGLEINST", //"單筆分期"
				}
			]
		},
		{
			"link" : "",
			"class_name" : "",
			"name" : "MENU.LEFT.ACTIVITYAPP", //"行銷活動/登錄",
			"sub_menu" : [
				{
					// "link" : "#/promotions/",
					"link" : "https://www.tcb-bank.com.tw/creditcard/discount_news/Pages/activity.aspx",
					"class_name" : "",
					"name" : "MENU.LEFT.APP" //"優惠活動"
				},
				{
					"link" : "#/activityLogin",
					"class_name" : "",
					"name" : "MENU.LEFT.ACTIVITYLOGIN" //"活動登錄"
				}
			]
		},
		{
			"link" : "#/dividend/",
			"class_name" : "",
			"name" : "MENU.LEFT.DIVIDEND" //"紅利專區"
		},
		{
			"link" : "",
			"class_name" : "",
			"name" : "MENU.LEFT.ACTIVATECARD", //"開卡/掛失",
			"sub_menu" : [
				{
					"link" : "#/activateCard/activateForm",
					"class_name" : "",
					"name" : "MENU.LEFT.OPEN" //"開卡"
				},
				{
					"link" : "#/activateCard/lostForm",
					"class_name" : "",
					"name" : "MENU.LEFT.LOST" //"掛失"
				}
			]
		},
		{
			"link" : "https://cobank.tcb-bank.com.tw/TCB.TWNB.IDV.WEB/general/ccardApply.faces?__menu=TWNCUT05",
			"class_name" : "",
			"name" : "MENU.LEFT.REGISTERED" //"註冊信用卡會員"
		}
		// ,
		// {
		// 	"link" : "../index.html#/card/card-quota",
		// 	"class_name" : "",
		// 	"name" : "額度調整" //"額度調整"
		// }
		// ,
		// {
		// 	"link" : "#/qanda/",
		// 	"class_name" : "",
		// 	"name" : "MENU.LEFT.QANDA" //"Q&A"
		// }
	];
	//-------------left end-------------//
	//-------------left-------------//
	menu_config['left_cardLogin'] = [
		{
			"link": "#/close",
			"class_name": "icon_epay",
			"name": "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;合庫E Pay",
			"class": "icon_epay"
		},
		{
			"link" : "#/my_card/",
			"class_name" : "",
			"name" : "MENU.LEFT.MYCARD" //"我的信用卡"
		},
		{
			"link" : "",
			"class_name" : "",
			"name" : "MENU.LEFT.BILLSEARCH", //"帳單查詢",
			"sub_menu" : [
				{
					"link" : "#/bill_unrecorded/",
					"class_name" : "",
					"name" : "MENU.LEFT.BILLUNRECORDED" //"信用卡未列帳單明細"
				},
				{
					"link" : "#/visa_search/",
					"class_name" : "",
					"name" : "MENU.LEFT.VISASEARCH" //"VISA金融卡帳單查詢"
				},
				{
					"link" : "#/bill_period/?period=0",
					"class_name" : "",
					"name" : "MENU.LEFT.BILLPERIOD0" //"本期帳單"
				},
				{
					"link" : "#/bill_period/?period=1",
					"class_name" : "",
					"name" : "MENU.LEFT.BILLPERIOD1" //"前期帳單"
				}
				// ,{
				// 	"link" : "#/bill_period/?period=2",
				// 	"class_name" : "",
				// 	"name" : "MENU.LEFT.BILLPERIOD2" //"前兩期帳單"
				// }
			]
		},
		{
			"link" : "",
			"class_name" : "",
			"name" : "MENU.LEFT.PAYCARD", //"繳卡費",
			"sub_menu" : [
				{
					"link" : "#/select/payCardFee/",
					"class_name" : "",
					"name" : "MENU.LEFT.PAYCARDFEE" //"繳卡費"
				},
				{
					"link" : "#/qrCode4Fee/",
					"class_name" : "",
					"name" : "MENU.LEFT.QRCODE4FEE" //"QR Code繳卡費"
				}
			]
		},
		{
			"link" : "",
			"class_name" : "",
			"name" : "MENU.LEFT.APPLYANDUPLOAD", //"申請/補件",
			"sub_menu" : [
				{
					"link" : "#/apply/",
					"class_name" : "",
					"name" : "MENU.LEFT.APPLY" //"申請信用卡"
				},
				{
					"link" : "#/upload",
					"class_name" : "",
					"name" : "MENU.LEFT.UPLOAD", //"補件上傳"
				}
			]
		},
		{
			"link" : "",
			"class_name" : "",
			"name" : "MENU.LEFT.INSTSELECT", //"分期付款",
			"sub_menu" : [
				{
					"link" : "#/billInst/",
					"class_name" : "",
					"name" : "MENU.LEFT.BILLINST" //"帳單分期"
				},
				{
					"link" : "#/singleInst/",
					"class_name" : "",
					"name" : "MENU.LEFT.SINGLEINST", //"單筆分期"
				}
			]
		},
		{
			"link" : "",
			"class_name" : "",
			"name" : "MENU.LEFT.ACTIVITYAPP", //"行銷活動/登錄",
			"sub_menu" : [
				{
					// "link" : "#/promotions/",
					"link" : "https://www.tcb-bank.com.tw/creditcard/discount_news/Pages/activity.aspx",
					"class_name" : "",
					"name" : "MENU.LEFT.APP" //"優惠活動"
				},
				{
					"link" : "#/activityLogin",
					"class_name" : "",
					"name" : "MENU.LEFT.ACTIVITYLOGIN" //"活動登錄"
				}
			]
		},
		{
			"link" : "#/dividend/",
			"class_name" : "",
			"name" : "MENU.LEFT.DIVIDEND" //"紅利專區"
		},
		{
			"link" : "",
			"class_name" : "",
			"name" : "MENU.LEFT.ACTIVATECARD", //"開卡/掛失",
			"sub_menu" : [
				{
					"link" : "#/activateCard/activateForm",
					"class_name" : "",
					"name" : "MENU.LEFT.OPEN" //"開卡"
				},
				{
					"link" : "#/activateCard/lostForm",
					"class_name" : "",
					"name" : "MENU.LEFT.LOST" //"掛失"
				}
			]
		},
		{
			"link" : "https://cobank.tcb-bank.com.tw/TCB.TWNB.IDV.WEB/general/ccardApply.faces?__menu=TWNCUT05",
			"class_name" : "",
			"name" : "MENU.LEFT.REGISTERED" //"註冊信用卡會員"
		}
		// ,
		// {
		// 	"link" : "../index.html#/card/card-quota",
		// 	"class_name" : "",
		// 	"name" : "額度調整" //"額度調整"
		// }
		// ,
		// {
		// 	"link" : "#/qanda/",
		// 	"class_name" : "",
		// 	"name" : "MENU.LEFT.QANDA" //"Q&A"
		// }
	];
	//-------------left end-------------//
	//-------------footer-------------//
	menu_config['footer'] = [
		{
			"link" : "#/home",
			"class_name" : "f_i_cr",
			"name" : "MENU.FOOTER.BACK_TO_HOME" //"信用卡服務"
		},
		{
			"link" : "#/select/payCardFee/",
			"class_name" : "f_i_pay",
			"name" : "MENU.FOOTER.PAYCARDFEE" //"繳卡費"
		},
		{
			"link" : "#/singleInst/",
			"class_name" : "f_i_staging",
			"name" : "MENU.FOOTER.SINGLEINST" //"單筆分期"
		},
		{
			"link" : "#/activityLogin",
			"class_name" : "f_i_al",
			"name" : "MENU.FOOTER.ACTIVITYLOGIN" //"活動登錄"
		},
		{
			"link" : "#/close",
			"class_name" : "f_i_home",
			"name" : "MENU.FOOTER.HOME" //"回首頁"
		}
	];
	//-------------footer end-------------//
	//-------------footer 信卡登入-------------//
	menu_config['footer_card'] = [
		{
			"link" : "#/home",
			"class_name" : "f_i_cr",
			"name" : "MENU.FOOTER.BACK_TO_HOME" //"信用卡服務"
		},
		{
			"link" : "#/select/payCardFee/",
			"class_name" : "f_i_pay",
			"name" : "MENU.FOOTER.PAYCARDFEE" //"繳卡費"
		},
		{
			"link" : "#/singleInst/",
			"class_name" : "f_i_staging",
			"name" : "MENU.FOOTER.SINGLEINST" //"單筆分期"
		},
		{
			"link" : "#/activityLogin",
			"class_name" : "f_i_al",
			"name" : "MENU.FOOTER.ACTIVITYLOGIN" //"活動登錄"
		},
		{
			"link": "#/close",
			"class_name": "f_i_home",
			"name": "合庫E Pay", //"回首頁"
			"class": "icon_epay"
		}
	];
	//-------------footer end-------------//

	return menu_config;
});
