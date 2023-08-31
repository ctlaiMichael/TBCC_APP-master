/**
 * 外聯網址設定
 * target設定說明
 *  _system: 另開OS預設劉覽器開啟鏈結
 *  _blank: 開啟內嵌網頁劉覽器開啟鏈結
 */
import { environment } from '@environments/environment';

let extemalWebOption = {
    'cordova': { url: 'https://cordova.apache.org', target: '_blank' },
    'google': {
        url: 'https://www.google.com.tw',
        target: '_system',
        confirmOptions: {
            title: '', // 空值 就用預設值取代
            context: '即將離開app前往google網頁'
        }
    },
    // ========================= [最新消息] ========================= //
    // -- [優惠活動資訊] -- //
    'abouthot': {
        url: 'https://www.tcb-bank.com.tw/abouthot/Pages/activity02.aspx'
        , target: '_blank'
    },
    // -- [信用卡活動資訊] -- //
    'creditcard': {
        url: 'https://www.tcb-bank.com.tw/creditcard/discount_news/Pages/activity.aspx'
        , target: '_blank'
    },
    // -- [e-Bill全國繳費網] -- //
    'ebill': {
        url: 'https://ebill.ba.org.tw/'
        , target: '_blank'
    },
    // ========================= [最新消息 End] ========================= //
    // ========================= [其他鏈結] ========================= //
    // 理財金庫
    'moneydj': {
        url: 'https://tcbbankfund.moneydj.com/mobile/'
        , target: '_system'
    },
    // 線上取號
    'otn': {
        url: 'https://otn.tcb-bank.com.tw/Acweb/'
        , target: '_blank'
    },
    // 下單開戶
    'luckydraw': {
        url: 'http://luckydraw.tcfhc-sec.com.tw/websites/web20181015/index.html'
        , target: '_system'
    },
    // HCE
    'hce': {
        url: 'https://www.tcb-bank.com.tw/creditcard/discount_news/Pages/activity.aspx'
        , target: '_blank'
    },
    // 智能客服
    'robot': {
        url: 'https://robot.tcb-bank.com.tw:8443/wise/?ch=app'
        , target: '_blank'
    },
    // 雲端發票
    'einvoice': {
        url: 'https://www.einvoice.nat.gov.tw/APCONSUMER/BTC500W/'
        , target: '_blank'
    },
    // 生活資訊
    'mWebEasyInfo': {
        url: 'https://newservices.mitake.com.tw:8443/MWebEasyInfo/init.do?APPCODE=mitakeonly&CHANNEL=iPad6'
        , target: '_blank'
    },
    // 證券線上開戶
    'luckydrawRegister': {
        url: 'https://www.tcfhc-sec.com.tw/Page.aspx?PageID=P151127234138&MenuID=211',
        target: '_system'
    },
    // 預約填單-台幣存款
    'reser-deposit': {
        url: 'https://cobank.tcb-bank.com.tw/TCB.TWNB.IDV.WEB/general/onlinePrefill/onlinePrefillTwdDeposit.faces?__menu=TWNCUX01',
        target: '_system'
    },
    // 預約填單-台幣提款
    'reser-withdrawal': {
        url: 'https://cobank.tcb-bank.com.tw/TCB.TWNB.IDV.WEB/general/onlinePrefill/onlinePrefillTwdWithdrawal.faces?__menu=TWNCUX02',
        target: '_system'
    },
    // 預約填單-台幣自行轉帳
    'reser-transfer': {
        url: 'https://cobank.tcb-bank.com.tw/TCB.TWNB.IDV.WEB/general/onlinePrefill/onlinePrefillTwdTransfer.faces?__menu=TWNCUX03',
        target: '_system'
    },
    // 預約開立一般存款帳戶
    'reser-norm': {
        url: 'https://cobank.tcb-bank.com.tw/TCB.TWNB.IDV.WEB/general/onlinePrefill/onlinePrefillDepositAccount.faces?__menu=TWNCUX04',
        target: '_system'
    }
    // // 線上融資申請
    // 'epinput': {
    //     url: 'https://cobank.tcb-bank.com.tw/ELNA/epinput.jsp',
    //     target: '_system'
    // }
    // 網路預約投保
    , 'onlineInsurance': {
        url: 'https://cobank.tcb-bank.com.tw/TCB.TWNB.IDV.WEB/general/onlineInsurance.faces?__menu=TWNCUT12',
        target: '_system'
    },
    // 隱私權
    'privacy': {
        url: 'https://www.tcb-bank.com.tw/others/Pages/privacy3.aspx'
        , target: '_system'
    }
    // ========================= [其他鏈結 End] ========================= //
    // ========================= [Epay] ========================= //
    // -- 台灣Pay消費據點查詢 -- //
    , 'epay-location': {
        url: 'https://www.taiwanpay.com.tw/content/info/use.aspx'
        , target: '_system'
    }
    // ========================= [Epay End] ========================= //
    // ========================= [基金] ========================= //
    // --  基金通路報酬資訊 https://www.tcb-bank.com.tw/product/trust/Pages/fundchanneldetail.aspx?p=XXX -- //
    , 'fund-info': {
        url: 'https://www.tcb-bank.com.tw/product/trust/Pages/fundchanneldetail.aspx?'
        , target: '_self'
    }
    // ==境外基金資訊觀測站==//
    , 'overseas-info-fund': {
        url: 'https://announce.fundclear.com.tw/MOPSFundWeb/ '
        , target: '_self'
    }
    // ==公開資訊觀測站==//
    , 'public-info-fund': {
        url: 'https://mops.twse.com.tw/mops/web/index'
        , target: '_self'
    }
    // ==理財金庫==//
    , 'fundCashBox': {
        // url: 'https://tcbbankfund.moneydj.com/w/CustFundIDMap.djhtm?',
        url: 'https://tcbbankfund.moneydj.com/w/CustFundIDMapMobile.djhtm?',
        target: '_blank'
    }

    // ========================= [基金 End] ========================= //
    // ========================= [外匯] ========================= //
    // ==外幣繳保費==//
    , 'fund-forex': {
        url: './old/index_main.html#/ReservationForeign/ForeignInsuranceEdit',
        target: '_self'
    }
    // ==綜活存轉綜定存優惠==//
    , 'demandOffer': {
        url: 'https://www.tcb-bank.com.tw/aboutnews/Documents/100y.jpg',
        target: '_system'
    }
    // ==外匯優惠== //
    , 'forex-active': {
        url: 'https://www.tcb-bank.com.tw/abouthot/Pages/ForeignActivity.aspx',
        target: '_system'
    }
    // ========================= [外匯 End] ========================= //
    // ========================= [AngularJS] ========================= //
    // 信用卡 angularJS
    , 'card': {
        url: './old/index.html',
        target: '_self'
    }
    , 'pay': {
        url: './old/index.html#/select/payCardFee/',
        target: '_self'
    }
    , 'bill': {
        url: './old/index.html#/bill_period/?period=0',
        target: '_self'
    }
    , 'apply': {
        url: './old/index.html#/apply/',
        target: '_self'
    }
    , 'bill_prev': { //前期帳單
        url: './old/index.html#/bill_period/?period=1',
        target: '_self'
    }
    , 'mycard':{    //我的信用卡
        url: './old/index.html#/my_card/',
        target: '_self'
    }
    , 'activityLogin':{    //活動登錄
        url: './old/index.html#/activityLogin',
        target: '_self'
    }
    , 'dividend':{  //紅利積點
        url: './old/index.html#/dividend/',
        target: '_self'
    }
    , 'bill_unrecorded':{    //未列帳單明細
        url: './old/index.html#/bill_unrecorded/',
        target: '_self'
    }
    , 'visa_search':{    //VISA金融卡帳單查詢
        url: './old/index.html#/visa_search/',
        target: '_self'
    }
    , 'payForm':{    //自行輸入繳款
        url: './old/index.html#/payCardFee/payForm',
        target: '_self'
    }
    , 'payCardFee':{    //繳卡費清單
        url: './old/index.html#/select/payCardFee/',
        target: '_self'
    }
    , 'payFormLogin':{    //登入網銀/信用卡會員繳款
        url: './old/index.html#/payCardFee/payFormLogin',
        target: '_self'
    }
    , 'qrCode4Fee':{    //QR Code繳卡費
        url: './old/index.html#/qrCode4Fee/',
        target: '_self'
    }
    , 'upload':{    //補件上傳
        url: './old/index.html#/upload/',
        target: '_self'
    }
    , 'billInst':{    //帳單分期
        url: './old/index.html#/billInst/',
        target: '_self'
    }
    , 'singleInst':{    //單筆分期
        url: './old/index.html#/singleInst/',
        target: '_self'
    }
    , 'activateForm':{    //開卡
        url: './old/index.html#/activateCard/activateForm',
        target: '_self'
    }
    , 'lostForm':{    //掛失
        url: './old/index.html#/activateCard/lostForm',
        target: '_self'
    }
    // 數位存款
    , 'digital': {
        url: 'https://actlink.tcb-bank.com.tw/linepay/v1.0.0/digitalDep'
        , target: '_system'
    }
    , 'digitalDep': {
        url: 'https://actlink.tcb-bank.com.tw/linepay/v1.0.0/digitalDep/toOTP?'
        , target: '_system'
    },
    // 綜所稅
    'taxbillInst': {
        url: './old/index.html#/taxbillInst/'
        , target: '_self'
    }
    // 本期帳單
    , 'bill_period': {
        url: './old/index.html#/bill_period/?period=0',
        target: '_self'
    }
    // 107年房屋稅分期
    , 'houbillInst': {
        url: './old/index.html#/houbillInst/',
        target: '_self'
    // 109房屋稅分期
    }, 'licenseInst': {
        url: './old/index.html#/licenseInst/',
        target: '_self'
    // 振興三倍
    }, 'tricoupon': {
        url: 'https://actlink.tcb-bank.com.tw/tricoupon/v1.0.0/tricoupon',
        target: '_system'
    }


    // epay angularJS
    // , 'epay': {
    //     url: './old/qrcode.html#/qrcodePay/qrcodePayScanNew/',
    //     target: '_self',
    //     loginRequired: true
    // }
    // , 'epayScan': {
    //     url: './old/qrcode.html#/qrcodePay/qrcodePayScanNew/',
    //     target: '_self',
    //     loginRequired: true
    // }
    // // 出示付款碼
    // , 'epayPaymentQrcode': {
    //     url: './old/qrcode.html#/qrCodePay/menu?redirect=qrcodePayBeScanEdit',
    //     target: '_self',
    //     loginRequired: true
    // }
    // , 'epayReceiptQrcode': {
    //     url: './old/qrcode.html#/qrCodePay/qrcodeGetBeScanEdit',
    //     target: '_self',
    //     loginRequired: true
    // }
    // 基金 angularJS
    // ==基金 定期(不)定額查詢/異動==//
    // , 'fund-terms': {
    //     url: './old/index_main.html#/fund/fundTermsSipOti',
    //     target: '_self'
    // }
    // // ==現金收益存入帳號異動==//
    // , 'fund-account': {
    //     url: './old/index_main.html#/fund/fundTermsProfitAcnt',
    //     target: '_self'
    // }
    // // ==停損/獲利點通知設定==//
    // , 'fund-note': {
    //     url: './old/index_main.html#/fund/fundTermsStopPoint',
    //     target: '_self'
    // }
    // // ==信託對帳單寄送方式==//
    // , 'fund-notetype': {
    //     url: './old/index_main.html#/fund/fundTermsNoticeType',
    //     target: '_self'
    // }
    // ========================= [AngularJS End] ========================= //
};

/**
 * 測試外連網址
 */
if (!environment.PRODUCTION) {
    // 智能客服
    extemalWebOption['robot']['url'] = 'http://robot.tcb-test.com.tw:8080/wise?ch=app';
    extemalWebOption['digital']['url'] = 'https://actlink.tcb-test.com.tw/openAPI/v1.0.0/digitalDep';
    extemalWebOption['digitalDep']['url'] = 'https://actlink.tcb-test.com.tw/openAPI/v1.0.0/digitalDep/toOTP?';
    extemalWebOption['tricoupon']['url'] = 'https://actlink.tcb-test.com.tw/tricoupon/v1.0.0/tricoupon';
}


export const Sites = extemalWebOption;
