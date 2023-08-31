/**
 * 基金申購(定期定額)
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FundPurchaseRegularService } from '@pages/fund/shared/service/fund-purchase-regular.service';
import { CheckService } from '@shared/check/check.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { FundInformation1 } from '@conf/terms/fund/fund-information1';
import { FundInformation2 } from '@conf/terms/fund/fund-information2';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { DateSelectService } from '@shared/popup/date-select-popup/date-select.service';
import { logger } from '@shared/util/log-util';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';
import { SearchStaffService } from '@pages/fund/shared/service/searchStaff.service';

@Component({
    selector: 'app-purchase-regular',
    templateUrl: './purchase-regular-page.component.html',
    styleUrls: [],
    providers: [FundPurchaseRegularService]
})
export class PurchaseRegularPageComponent implements OnInit {
    /**
      * 參數處理
      */
    @Input() setInfo: any; //fi000401 資訊
    @Input() set_twAcnt: any; //台幣約定轉出帳號
    @Input() set_frgn: any; //外幣約定轉出帳號
    @Input() set_trust: any; //信託帳號
    @Input() set_pkg: any; //定期不定額套餐
    @Input() fundSubject: any; //投資基金標的
    @Input() fundStatus: any; //紀錄基金狀態(國內、國外、精選、自選)
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    nowPage = 'regular_edit_1'; //控制頁面

    //--------------- 投資幣別 -----------------
    showCheck = true; //是否打勾
    showDisable_twd = false;
    showDisable_frgn = false;

    //--------------- 扣款週期 -----------------
    showRangeCheck = true;
    dateType = ''; //傳入module
    dateVal = [];
    nowRange = 'please-select';

    //----------- 檢查金額 --------------
    saveAmount = {};
    amount_error = ''; //金額檢核錯誤訊息
    checkAmount = false; //是否顯示紅框(金額)
    amountPlace = '';

    // 頁面錯誤訊息
    errorMsg = {
        amount: '',
        balance1: '',
        balance2: ''
    };
    errorHostCodeMsg = '';
    //----------- 顯示紅框 --------------
    checkDate = false;
    check_trust = false;
    check_twAcnt = false;
    check_frgn = false;
    check_sales = false;
    check_intro = false;
    check_range = false;

    //ngModel綁定
    inp_data = {
        twAcntNo: '', //台幣轉出帳號
        frgnNo: '', //外幣轉出帳號
        trustNo: '', //信託帳號
        amount: '', //金額
        currType: '', //台幣：1，外幣：2
        date: '', //申購日期
        sales: '', //理財專員
        intro: '', //轉借人員
        code: '', //定期不定額套餐
    }

    dateArr = []; //日期
    //週(畫面顯示用，非送request)
    dateShow = {
        show: '',
        month: '',
        week: ''
    };
    week_data = ['一', '二', '三', '四', '五'];
    nowChkRang; //紀錄扣款選擇週期
    //----------- 編輯頁2 -----------
    loss_error = ''; //停損，檢核錯誤訊息
    pro_error = ''; //停利，檢核錯誤訊息
    check_loss = false; //flag
    check_pro = false; //flag
    agree1 = false;
    agree2 = false;
    agree3 = false;
    agree22 = false;
    //*送往下一頁的值，使用者輸入
    regularReq = {
        custId: '',
        trustAcnt: '', //信託帳號
        fundCode: '',//基金代碼
        enrollDate: '', //申請日期 (新)
        amount: '', //金額
        payAcnt: '', //轉出帳號
        fundType: '', //信託業務別
        salesId: '', //銷售行員id
        salesName: '', //銷售行員姓名
        introId: '', //轉借人員id
        introName: '', //轉借人員姓名
        code: '', //定期不定額 套餐代碼
        payDate31: '', //扣款日期(1~31) (新)
        payDate5W: '', //每周扣款(1~5) (新)
        notiCD: '', //停損停利，通知出場 (新)
        sLossCD: '', //停損點正負號 (新)
        sLoss: '', //停損點，空白時輸入 000 (新)
        sProCD: '', //停利點正負號 (新)
        sPro: '', //停利點 (新)
        continue: '', //自動贖回是否繼續扣款 (新)
        decline1Cd: '', //跌幅級距1 (-5 ~ -10) 加減碼 (-/+) (新)
        decline1: '', //跌幅級距1 (-5~-10) (新)
        decline2Cd: '', //跌幅級距2 (-10~-15)加減碼(-/+) (新)
        decline2: '', //跌幅級距2 (-10~-15) (新)
        decline3Cd: '', //跌幅級距3 (-15~-20)加減碼(-/+) (新)
        decline3: '', //跌幅級距3 (-15~-20) (新)
        decline4Cd: '', //跌幅級距4 (-20~-25)加減碼(-/+) (新)
        decline4: '', //跌幅級距4 (-20~-25) (新)
        decline5Cd: '', //跌幅級距5 (-25~-999)加減碼(-/+) (新)
        decline5: '', //跌幅級距5 (-20~-999) (新)
        gain1Cd: '', //漲幅級距1 (5~10)加減碼(-/+) (新)
        gain1: '', //漲幅級距 (5~10) (新)
        gain2Cd: '', //漲幅級距2 (10~15)加減碼(-/+) (新)
        gain2: '', //漲幅級距2 (10~15) (新)
        gain3Cd: '', //漲幅級距3 (15~20)加減碼(-/+) (新)
        gain3: '', //漲幅級距3 (15~20) (新)
        gain4Cd: '', //漲幅級距4 (20~25)加減碼(-/+) (新)
        gain4: '', //漲幅級距4 (20~25) (新)
        gain5Cd: '', //漲幅級距5 (25~999)加減碼(-/+) (新)
        gain5: '', //漲幅級距5 (25~999) (新)
    };

    range = []; //依照幣別存放下方陣列值
    TWD = ["1000", "2000", "3000", "4000", "5000"]; //新台幣對照規格，以千元為單位
    USD = ["100", "200", "300", "400", "500"];
    AUD = ["100", "200", "300", "400", "500"];
    CAD = ["100", "200", "300", "400", "500"];
    CHF = ["100", "200", "300", "400", "500"];
    EUR = ["100", "200", "300", "400", "500"];
    GBP = ["100", "200", "300", "400", "500"];
    HKD = ["1000", "2000", "3000", "4000", "5000"];
    JPY = ["10000", "20000", "30000", "40000", "50000"];
    SEK = ["1000", "2000", "3000", "4000", "5000"];
    CNY = ["1000", "2000", "3000", "4000", "5000"];
    ZAR = ["1000", "2000", "3000", "4000", "5000"];
    NZD = ["100", "200", "300", "400", "500"];
    SGD = ["100", "200", "300", "400", "500"];

    //2020/01/30 新追加以下規則，對照表單規定，設定最小申請金額
    leastRange = ''; //為外幣時，需套用最低申請金額規則
    least_USD = '100'; //美元
    least_HKD = '1000'; //港幣
    least_GBP = '100'; //英鎊
    least_AUD = '100'; //澳幣
    least_SGD = '100'; //新加坡幣
    least_CHF = '100'; //瑞士法郎
    least_CAD = '100'; //加拿大幣
    least_JPY = '10000'; //日圓
    least_CNY = '1000'; //人民幣
    least_SEK = '1000'; //瑞典幣
    least_NZD = '100'; //紐西蘭幣
    least_EUR = '100'; //歐元
    least_ZAR = '1000'; //南非幣

    autoFlag = false;
    immFlag = false;
    emailFlag = false;
    continue = true; //續不續扣
    //sales = []; // 銷售人員資訊，整理過
    //intro = []; //轉借人員資訊，整理過
    _sales = []; // 銷售人員資訊
    _intro = []; //轉借人員資訊

    showFundBook = false; //控制「基金公開說明書」checkbox
    showFundInfo = false; //控制「基金通路資訊」checkbox
    showFundAgree = false; //控制「本人同意」checkbox

    //----------- 接收fi000403基金申購申請 -----------
    purchaseInfo: any = {};

    //----------- 接收fi000710(結果頁)會用到 -----------
    investAttribute = ''; //客戶投資屬性 1:保守2:穩健3:積極
    //服務分行， branchName: 服務分行名稱, unitCall: 服務分行電話, 
    //prospectus: 公開說明書取得方式，0:已取得並詳閱,1:已自行下載 , 
    //okCode: Y:同意投資屬性低客戶購買高風險產品， N:不同意投資屬性低客戶購買高風險產品
    serviceBranch = {
        branchName: '',
        unitCall: '',
        prospectus: '',
        okCode: '',
        fundType: ''
    };

    screenTop;  //初始螢幕高度
    oldCurrency = ''; //儲存前一頁外幣(舊)
    branchSelect = false; //是否顯示選擇分行頁面
    branch = ''; //分行代號-分行名稱

    salesindex = '';
    checkbranch  = '1'; // 1非空 ,2為空
    custBUId = '';

    constructor(
        private _logger: Logger
        , private _headerCtrl: HeaderCtrlService
        , private _handleError: HandleErrorService
        , private _formateServcie: FormateService
        , private navgator: NavgatorService
        , private _mainService: FundPurchaseRegularService
        , private _checkService: CheckService
        , private alert: AlertService
        , private confirm: ConfirmService
        , private infomationService: InfomationService
        , private _uiContentService: UiContentService
        , private _dateSelectService: DateSelectService
        , private _searchStaffService: SearchStaffService
    ) {

    }

    ngOnInit() {

        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '基金定期定額申購'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            // switch (this.nowPage) {
            //     case 'regular_edit_1':
            //         this.leftBack('edit1');
            //         break;
            //     case 'regular_edit_2':
            //         this.leftBack('edit2');
            //         break;
            //     case 'regular_edit_3':
            //         this.leftBack('edit3');
            //         break;
            // }
            this.navgator.push('fund');
        });
        this.screenTop = document.body.scrollHeight;
        this._logger.log("setInfo:", this.setInfo);
        this._logger.log("set_pkg:", this.set_pkg);
        this._logger.log("fundStatus:", this.fundStatus);
        this._logger.log("fundSubject:", this.fundSubject);
        this._logger.log("set_frgn:", this.set_frgn);

        this.regularReq['code'] = '';

        //客戶投資屬性 1:保守2:穩健3:積極
        this.investAttribute = this.setInfo['rtType'];

        //先抓今天日期(申請日期)
        this.regularReq['enrollDate'] = this._mainService.getToday();
        this._logger.log("line 205 regularNotReq['enrollDate']:", this.regularReq['enrollDate']);

        this.inp_data['trustNo'] = this.set_trust[0].trustAcntNo;
        this._logger.log("fundSubject:", this.fundSubject);

        //2019/08/21 402電文(投資標的)計價幣別如果是「外幣」，台外幣都可以選，為「台幣」只允許選擇台幣(disable外幣)，投資金額元拿掉(顯示幣別) ex: 投資金額(USD)
        if (this.fundSubject['currency'] == 'TWD' || this.fundSubject['currency'] == 'NTD') {
            // this._logger.log("into currency twd");
            this.showDisable_twd = false;
            this.showDisable_frgn = true;
        } else {
            // this._logger.log("into currency frgn");
            this.showDisable_twd = false;
            this.showDisable_frgn = false;
        }
        //用於切換回外幣，還原本來之外幣
        this.oldCurrency = this.fundSubject['currency'];
        if (this.setInfo['custBUId'] == '' || typeof this.setInfo['custBUId'] === 'undefined' || this.setInfo['custBUId'] === null) {
            this.checkbranch = '2';
        } else {
            this.branch = this.setInfo['custBUId'];
            this.inp_data.sales = this.setInfo['custFPId'];
            // this.inp_data['sales']['salesId'] = this.setInfo['custFPId'];
            this._intro = this._mainService.intro_sort(this.set_trust);
            this._sales = this._mainService.sales_sort(this.set_trust);
            this.salesindex = this._sales.findIndex(obj => obj.salesId == this.setInfo['custFPId']).toString();
        }

        //剛進頁面預設台幣
        this.fundSubject['currency'] = 'TWD';
        this.currencyRule();
        this._logger.log("range:", this.range);

        // //整理轉售人員資料
        // this.intro = this._mainService.intro_sort(this.set_trust);
        // //整理銷售人員資料
        // this.sales = this._mainService.sales_sort(this.set_trust);
        //將基金代碼帶入
        this.regularReq['fundCode'] = this.fundSubject['fundCode'];

        if (this.nowRange == 'please-select') {
            this.dateVal = [];
        }

        // this._logger.log("line 100 intro:", this.intro);
        // this._logger.log("line 101 sales:", this.sales);
        this._logger.log("setInfo:", this.setInfo);
        this._logger.log("set_twAcnt:", this.set_twAcnt);
        this._logger.log("set_frgn:", this.set_frgn);
        this._logger.log("set_trust:", this.set_trust);
        this._logger.log("fundSubject:", this.fundSubject);
        this._logger.log("fundStatus:", this.fundStatus);
    }

    //幣別規則
    currencyRule() {
        //帶入幣別規則，由前一頁帶入幣別
        switch (this.fundSubject['currency']) {
            case 'TWD':
                this.range = this.TWD;
                this.leastRange = '3000'; //台幣為3000
                break;
            case 'USD':
                this.range = this.USD;
                this.leastRange = this.least_USD; //最低金額
                break;
            case 'AUD':
                this.range = this.AUD;
                this.leastRange = this.least_AUD;
                break;
            case 'CAD':
                this.range = this.CAD;
                this.leastRange = this.least_CAD;
                break;
            case 'CHF':
                this.range = this.CHF;
                this.leastRange = this.least_CHF;
                break;
            case 'EUR':
                this.range = this.EUR;
                this.leastRange = this.least_EUR;
                break;
            case 'GBP':
                this.range = this.GBP;
                this.leastRange = this.least_GBP;
                break;
            case 'HKD':
                this.range = this.HKD;
                this.leastRange = this.least_HKD;
                break;
            case 'JPY':
                this.range = this.JPY;
                this.leastRange = this.least_JPY;
                break;
            case 'SEK':
                this.range = this.SEK;
                this.leastRange = this.least_SEK;
                break;
            case 'CNY':
                this.range = this.CNY;
                this.leastRange = this.least_CNY;
                break;
            case 'ZAR':
                this.range = this.ZAR;
                this.leastRange = this.least_ZAR;
                break;
            case 'NZD':
                this.range = this.NZD;
                this.leastRange = this.least_NZD;
                break;
            case 'SGD':
                this.range = this.SGD;
                this.leastRange = this.least_SGD;
                break;
            default:
                this.range = [];
                this.leastRange = '0';
                break;
        }
    }

    //點擊國內or國外
    selectCurr(curr) {
        //國內
        if (this.fundStatus.foreginType == '1') {
            this._logger.log("1");
            if (curr == 'twd') {
                this.inp_data['amount'] = '';
                this.showCheck = true;
                this.fundSubject['currency'] = 'TWD';
                this.currencyRule();
                this.errorMsg.amount = '';
                //2019/08/21 新規則不需判斷前一頁，選擇國外or國內，來限制選擇幣別
                // this.showDisable = false;
                //使用者反悔，將相反欄位清空，ex:點台幣，清空外幣
                this.regularReq.payAcnt = '';
                this.amountPlace = '請輸入金額';
            } else if (curr == 'forgen') {
                this.inp_data['amount'] = '';
                this.showCheck = false;
                this.fundSubject['currency'] = this.oldCurrency;
                this.currencyRule();
                this.errorMsg.amount = '';
                //2019/08/21 新規則不需判斷前一頁，選擇國外or國內，來限制選擇幣別
                // this.showDisable = false;
                //使用者反悔，將相反欄位清空，ex:點台幣，清空外幣
                this.regularReq.payAcnt = '';

                //新規則無限制(國內也可選外幣)
                // this._handleError.handleError({
                //     type: 'dialog',
                //     title: 'POPUP.NOTICE.TITLE',
                //     content: 'CHECK.STRING.TWD_SUBJECT'
                // });
                this.amountPlace = '請輸入金額';
                //外幣約定轉出帳號，有可能沒資料，要跳出訊息
                if (this.set_frgn.length <= 0 || typeof this.set_frgn === null) {
                    this._logger.log("into set_frgn<0,foreginType=1");
                    this._handleError.handleError({
                        type: '我知道了',
                        title: '提醒您',
                        content: '請先臨櫃辦理約定「外幣轉出帳號」'
                    });
                    return false;
                }
            }
            //國外
        } else {
            this._logger.log("2", curr);
            if (curr == 'twd') {
                this.inp_data['amount'] = '';
                this.showCheck = true;
                this.fundSubject['currency'] = 'TWD';
                this.currencyRule();
                this.errorMsg.amount = '';
                //2019/08/21 新規則不需判斷前一頁，選擇國外or國內，來限制選擇幣別
                // this.showDisable = false;
                //使用者反悔，將相反欄位清空，ex:點台幣，清空外幣
                this.regularReq.payAcnt = '';
                this.amountPlace = '請輸入金額';
            } else if (curr == 'forgen') {
                this.inp_data['amount'] = '';
                this.showCheck = false;
                this.fundSubject['currency'] = this.oldCurrency;
                this.currencyRule();
                this.errorMsg.amount = '';
                //外幣約定轉出帳號，有可能沒資料，要跳出訊息
                if (this.set_frgn.length <= 0 || this.set_frgn === null) {
                    this._logger.log("into set_frgn<0,foreginType=2");
                    this._handleError.handleError({
                        type: '我知道了',
                        title: '提醒您',
                        content: '請先臨櫃辦理約定「外幣轉出帳號」'
                    });
                    return false;
                }
                //2019/08/21 新規則不需判斷前一頁，選擇國外or國內，來限制選擇幣別
                // this.showDisable = false;
                //使用者反悔，將相反欄位清空，ex:點台幣，清空外幣
                this.regularReq.payAcnt = '';
                this.amountPlace = '請輸入金額';
            }
        }
    }

    //點擊radio選擇扣款週期
    selectRange(range) {
        if (range != this.nowChkRang) {
            if (range == 'month') {
                this.showRangeCheck = true;
                this.dateVal = [];
                this.dateArr = [];
                this.nowRange = 'please-select';
            } else {
                this.showRangeCheck = false;
                this.dateVal = [];
                this.dateArr = [];
                this.nowRange = 'please-select';
            }
            this.regularReq['payDate31'] = '';
            this.regularReq['payDate5W'] = '';

            this.nowChkRang = range;
        } else {
            return false;
        }

    }

    //點擊扣款日
    rangePoupOn() {
        let show_title = '';
        if (this.showRangeCheck == true) {
            this.dateType = '1';
            show_title = '每月扣款設定';
            this.nowRange = 'select-month';
        } else {
            this.dateType = '2';
            show_title = '每週扣款設定';
            this.nowRange = 'select-week';
        }
        // this.nowPage = 'date-select';
        this._dateSelectService.show({
            title: show_title,
            dateType: this.dateType,
            dateArr: this.dateArr
        }).then(
            (res) => {
                this.onPageBackEvent(res);
            },
            (error_res) => {
                this.onErrorBackEvent(error_res);
            }
        );
    }

    //點擊下一步
    onNext() {
        this._logger.log("inp_data.twAcntNo:", this.inp_data.twAcntNo);
        this._logger.log("inp_data.frgnNo:", this.inp_data.frgnNo);
        this._logger.log("inp_data:", this.inp_data);
        this._logger.log("dateVal", this.dateVal);
        this._logger.log("line 383 onNext regularReq:", this.regularReq);
        logger.error('dataSHOW', this.dateShow);
        //檢查風險屬性符合?
        //rtType：1,不可買RR4、RR5, rtType：2,不可買RR5
        if (this.setInfo['rtType'] == '1' && (this.fundSubject['risk'] == 'RR4' || this.fundSubject['risk'] == 'RR5')) {
            this.rangeCheck();
            return false;
        }
        if (this.setInfo['rtType'] == '2' && this.fundSubject['risk'] == 'RR5') {
            this.rangeCheck();
            return false;
        }

        //檢查金額
        this.saveAmount = this._checkService.checkMoney(this.inp_data.amount, {
            currency: 'POSITIVE',
            not_zero: false
        });
        this._logger.log("saveAmount:", this.saveAmount);
        if (this.saveAmount['status'] == false) {
            this.errorMsg.amount = this.saveAmount['msg'];
            this.checkAmount = true;
            this.regularReq['amount'] = '';
            return false;
        } else {
            this.errorMsg.amount = '';
            this.checkAmount = false;
            this.regularReq['amount'] = this.inp_data['amount'];
        }

        //檢查信託帳號
        // if (this.inp_data['trustNo'] == '') {
        //     this.check_trust = true;
        //     this.regularReq['trustAcnt'] = '';
        // } else {
        //     this.check_trust = false;
        //     this.regularReq['trustAcnt'] = this.inp_data['trustNo']['trustAcntNo'];
        // }

        //檢查扣款週期設定
        // if (this.dateVal.length <= 0) {
        //     this._logger.log("line 225, dateVal == []");
        //     this.check_range = true;
        //     this.regularNotReq['payDate'] = '';
        // } else {
        //     this.check_range = false;
        //     this.regularNotReq['payDate'] = this.dateVal.join();
        //     this._logger.log("line 224 toString:", this.dateVal.join());
        // }

        //兩個欄位都空，代表沒選(扣款日)
        if (this.regularReq['payDate31'] == '' && this.regularReq['payDate5W'] == '') {
            this.check_range = true;
        } else {
            this.check_range = false;
        }

        //檢查定期不定額套餐,新規格不需要此欄位
        // if (this.inp_data['code'] == '') {
        //     this.check_pkg = true;
        //     this.regularReq['code'] = '';
        // } else {
        //     this.check_pkg = false;
        //     this.regularReq['code'] = this.inp_data['pkg']['pkgCode'];
        // }

        //台幣
        if (this.showCheck == true) {
            this._logger.log("line 442 into twd!!");
            this.regularReq['currType'] = '1';
            //檢查扣款帳號(台幣)
            if (this.inp_data['twAcntNo'] == '') {
                this.check_twAcnt = true;
                this.regularReq['payAcnt'] = '';
            } else {
                this.check_twAcnt = false;
                this.regularReq['payAcnt'] = this.inp_data['twAcntNo']['twAcntNo'];
            }
            //投資金額 依照幣別來決定它的金額倍數，有錯跳錯誤紅框
            if (parseInt(this.inp_data['amount']) % parseInt(this.range[0]) != 0 || this.inp_data['amount'] == '') {
                this._logger.log("into amount curreny error!");
                this.errorMsg.amount = '輸入需為幣別單位' + this.range[0];
                return false;
            } else {
                this.errorMsg.amount = '';
            }
            //檢核各幣別最低申請金額(台幣)
            if (parseInt(this.inp_data.amount) < parseInt(this.leastRange)) {
                this.errorMsg.amount = '您的申購金額不得低於最低投資金額';
                this.alert.show('您的申購金額不得低於最低投資金額' + this.fundSubject['currency'] + ':' + this.leastRange, {
                    title: '提醒您',
                    btnTitle: '我知道了',
                }).then(
                    () => {
                    }
                );
                return false;
            }
            //*金額未達5000，比照trunk程式小額申購不檔最低金額
            // if (parseInt(this.inp_data['amount']) < 5000 || this.inp_data['amount'] == '') {
            //     this.alert.show('請輸入有效的申購金額', {
            //         title: '提醒您',
            //         btnTitle: '我知道了',
            //     }).then(
            //         () => {
            //         }
            //     );
            //     //金額達到5000
            // } else {
            //最後檢核，都過進下一頁
            if (this.regularReq['amount'] && this.inp_data['twAcntNo'] !== '' && this.inp_data['trustNo'] !== ''
                && (this.regularReq['payDate31'] !== '' || this.regularReq['payDate5W'] !== '')) {

                //國內基金
                if (this.fundStatus['foreginType'] == '1') {
                    this._logger.log("into twd fundType C");
                    this.regularReq['fundType'] = 'C';
                    //國外台幣
                } else if (this.fundStatus['foreginType'] == '2') {
                    this._logger.log("into twd fundType N");
                    this.regularReq['fundType'] = 'N';
                }
                this.serviceBranch['fundType'] = this.regularReq['fundType'];
                this.nowPage = 'regular_edit_2';
                this._logger.log("twd regularNotReq:", this.regularReq);
                this._logger.log("inp_data", this.inp_data);
            } else {
                return false;
            }
            // }

            //外幣
        } else {
            this._logger.log("line 468 into frgn!!");
            this.regularReq['currType'] = '2';
            //檢查扣款帳號(外幣)
            if (this.inp_data['frgnNo'] == '') {
                this.check_frgn = true;
                this.regularReq['payAcnt'] = '';
            } else {
                this.check_frgn = false;
                this.regularReq['payAcnt'] = this.inp_data['frgnNo']['frgnAcntNo'];
            }
            //投資金額 依照幣別來決定它的金額倍數，有錯跳錯誤紅框
            if (parseInt(this.inp_data['amount']) % parseInt(this.range[0]) != 0 || this.inp_data['amount'] == '') {
                this._logger.log("into amount curreny error!");
                this.errorMsg.amount = '輸入需為幣別單位' + this.range[0];
                return false;
            } else {
                this.errorMsg.amount = '';
            }
            //檢核各幣別最低申請金額
            if (parseInt(this.inp_data.amount) < parseInt(this.leastRange)) {
                this.errorMsg.amount = '您的申購金額不得低於最低投資金額';
                this.alert.show('您的申購金額不得低於最低投資金額' + this.fundSubject['currency'] + ':' + this.leastRange, {
                    title: '提醒您',
                    btnTitle: '我知道了',
                }).then(
                    () => {
                    }
                );
                return false;
            }
            //最後檢核，都過進下一頁
            if (this.regularReq['amount'] && this.inp_data['frgnNo'] !== '' && this.inp_data['trustNo'] !== ''
                && (this.regularReq['payDate31'] !== '' || this.regularReq['payDate5W'] !== '')) {

                //到下一頁時，紀錄「國內基金」
                if (this.fundStatus['foreginType'] == '1') {
                    this._logger.log("into frg fundType C");
                    this.regularReq['fundType'] = 'C';
                    //國外外幣
                } else if (this.fundStatus['foreginType'] == '2') {
                    this._logger.log("into frg fundType Y");
                    this.regularReq['fundType'] = 'Y';
                }
                this.serviceBranch['fundType'] = this.regularReq['fundType'];
                this.nowPage = 'regular_edit_2';
                this._logger.log("forgen regularNotReq:", this.regularReq);
                this._logger.log("inp_data", this.inp_data);
            } else {
                return false;
            }
        }
    }

    //點擊上一步(編輯頁1)
    onBack() {
        this.onBackPageData({});
    }

    private rangeCheck() {
        this.confirm.show('您本次欲申購/轉入的基金「' + this.fundSubject['fundCode'] + this.fundSubject['fundName'] + '(' + this.fundSubject['risk'] + ')' + '」，其風險等級為' + this.fundSubject['risk']
            + '，已較您投資屬性之風險承受度高，本行依主管機關規定，當您購買商品風險等級超出您的投資屬性之風險承受度時(如下)，將不可進行交易。\n'
            + '*保守型客戶不可購買風險等級為RR4-RR5之商品。\n' + '*穩健型客戶不可購買風險等級為RR5之商品。請點選下方按鈕進行「風險承受度測驗」後，再重新進行基金下單交易。', {
                title: '提醒您',
                btnYesTitle: '風險承受度測驗',
                btnNoTitle: '取消'
            }).then(
                () => {
                    //繼續(popup)內層
                    //跳轉風險成受度測驗
                    this.navgator.push('fund-group-resk-test');
                },
                () => {
                    //離開(popup)內層
                    this.navgator.push('fund');
                }
            );
        return false;
    }

    //點擊投資金額說明
    onAmountPopoup() {
        if (document.body.scrollHeight != this.screenTop) {
            logger.error('鍵盤開啟')
            return false;
        } else {
            this.nowPage = 'amount-popoup';

        }
    }
    //---------------------------------- 編輯頁2 ------------------------------------------
    //選擇通知/出場方式
    onNotice(notice) {
        switch (notice) {
            case 'auto':
                //點自動贖回，如果其他有開著，全部關閉
                if (this.autoFlag == false) {
                    this.autoFlag = true;
                    if (this.immFlag == true || this.emailFlag == true) {
                        this.immFlag = false;
                        this.emailFlag = false;
                    }
                } else {
                    this.autoFlag = false;
                }
                break;
            case 'imm':
                //如果自動贖回勾著，其他的不能選
                if (this.autoFlag == true) {
                    this.immFlag = false;
                } else {
                    //正常開關
                    if (this.immFlag == false) {
                        this.immFlag = true;
                    } else {
                        this.immFlag = false;
                    }
                }
                break;
            case 'email':
                //如果自動贖回勾著，其他的不能選
                if (this.autoFlag == true) {
                    this.emailFlag = false;
                } else {
                    //正常開關
                    if (this.emailFlag == false) {
                        this.emailFlag = true;
                    } else {
                        this.emailFlag = false;
                    }
                }
                break;
        }
    }

    //點擊繼續扣款
    onContinue(use) {
        if (use == 'Y') {
            this.continue = true;
        } else {
            this.continue = false;
        }
    }

    //點擊下一步
    onNext2() {
        this._logger.log("edit2 nextpage regularReq:", this.regularReq);
        //判斷出場通知
        //自動贖回
        if (this.autoFlag == true) {
            this.regularReq['notiCD'] = '1';
            //即時畫面
        } else if (this.immFlag == true && this.emailFlag == false) {
            this.regularReq['notiCD'] = '2';
            this.regularReq['continue'] = ''; //續扣清空
            //E-mail    
        } else if (this.emailFlag == true && this.immFlag == false) {
            this.regularReq['notiCD'] = '3';
            this.regularReq['continue'] = ''; //續扣清空
            //即時畫面 + E-mail
        } else if (this.immFlag == true && this.emailFlag == true) {
            this.regularReq['notiCD'] = '4';
            this.regularReq['continue'] = ''; //續扣清空
        } else if (this.autoFlag == false && this.immFlag == false && this.emailFlag == false) {
            this.regularReq['notiCD'] = '';
            this.regularReq['continue'] = '';
        }
        //是否繼續扣款
        if (this.continue == true && this.autoFlag == true) {
            this.regularReq['continue'] = 'Y';
        } else if (this.continue == false && this.autoFlag == true) {
            this.regularReq['continue'] = 'N';
        }

        // //檢查停損停利點
        // if (parseInt(this.regularReq['sLoss']) > 100) {
        //     this.loss_error = '停損點最小限制-100%';
        //     this.check_loss = true;
        // } else {
        //     this.check_loss = false;
        // }
        // if (this.regularReq['sPro'].length > 3) {
        //     this.pro_error = '請輸入正確停利點';
        //     this.check_pro = true;
        // } else {
        //     this.check_pro = false;
        // }

        // 檢查停損停利點
        if (this.errorMsg.balance1 != '' || this.errorMsg.balance2 != '') {
            let alertMsg = '';
            if (this.errorMsg.balance1 != '') {
                alertMsg = this.errorMsg.balance1;
            } else if (this.errorMsg.balance2 != '') {
                alertMsg = this.errorMsg.balance2;
            }
            this.alert.show(alertMsg, {
                title: '提醒您',
                btnTitle: '我知道了',
            }).then(
                () => {
                }
            );
            // 當使用者輸入有誤時，將頁面拉回最上方。
            this._uiContentService.scrollTop();
            return false;
        }

        //停損點，固定負
        this.regularReq['sLossCD'] = '-';
        //停利點，固定正
        this.regularReq['sProCD'] = '';

        //檢核理財專員
        if (this.inp_data['sales'] == '') {
            this.check_sales = true;
            this.regularReq['salesId'] = '';
            this.regularReq['salesName'] = '';
        } else {
            this.check_sales = false;
            if (this.checkbranch == '2') {
                this.regularReq['salesId'] = this.inp_data['sales']['pid'];
                this.regularReq['salesName'] = this.inp_data['sales']['name'];
            }else if (this.checkbranch == '1') {
                if (this.salesindex == '-1') {
                    this.regularReq['salesId'] = this.inp_data.sales;
                    this.regularReq['salesName'] = '';
                }else {
                    this.regularReq['salesId'] = this.inp_data.sales;
                    this.regularReq['salesName'] = this._sales[this.salesindex]['salesName'];
                }
                }
        }
        this._logger.log("line 249:", this.regularReq);

        //檢查銷售行員
        if (this.inp_data['intro'] == '') {
            this.check_intro = true;
            this.regularReq['introId'] = '';
            this.regularReq['introName'] = '';
        } else {
            this.check_intro = false;
            if (this.checkbranch == '2') {
            this.regularReq['introId'] = this.inp_data['intro']['pid'];
            this.regularReq['introName'] = this.inp_data['intro']['name'];
        } else if (this.checkbranch == '1') {
            this.regularReq['introId'] = this.inp_data['intro']['introId'];
            this.regularReq['introName'] = this.inp_data['intro']['introName'];
        }

        }

        // 20190626 依合庫需求改為非必填，請參考文件:轉置案UAT問題追蹤表@20190625.xls-問題編號353
        // if (this.inp_data['sales'] !== '' && this.inp_data['intro'] !== ''
        //     && parseInt(this.regularReq['sLoss'], 0) <= 100) {
        //     // 當停損停利為空，輸入000
        //     if (this.regularReq['sLoss'] == '') {
        //         this.regularReq['sLoss'] = '000';
        //     }
        //     if (this.regularReq['sPro'] == '') {
        //         this.regularReq['sPro'] = '000';
        //     }
        //     this.nowPage = 'regular_edit_3';
        // } else {
        //     return false;
        // }
        if (this.regularReq['sLoss'] == '') {
            this.regularReq['sLoss'] = '000';
        }
        if (this.regularReq['sPro'] == '') {
            this.regularReq['sPro'] = '000';
        }
        this.nowPage = 'regular_edit_3';
    }

    //編輯頁2點擊，上一步
    onBackEdit1() {
        this.nowPage = 'regular_edit_1';
    }

    //---------------------------------- 編輯頁3 ------------------------------------------

    // 同意事項頁面 -基金之公開說明書 popup
    linkToBook1() {
        // this.nowPageType = 'fundInformation1';
        const set_data = new FundInformation1();
        this.infomationService.show(set_data);
    }

    // 同意事項頁面 -基金通路報酬揭露資訊 popup
    linkToBook2() {
        // this.nowPageType = 'fundInformation2';
        // const set_data = new FundInformation2();
        // this.infomationService.show(set_data);
        const navParams = {};
        const params = {
            p: this.fundSubject['fundCode']
        };
        this._logger.step('FUND', 'linkToBook2: ', params);
        this.navgator.push('web:fund-info', {}, params);
    }

    // 同意事項頁面 -基金近五年費用率及報酬率 popup
    linkToBook3() {
        
        // const navParams = {};
        // const params = {
        //     FUNDID: this.fundSubject['fundCode'],
        //     FILE: 21
        // };
        // this._logger.step('FUND', 'linkToBook3: ', params);
        // this.navgator.push('web:fund-info5', {}, params);
        let urlstr = "https://tcbbankfund.moneydj.com/w/CustFundIDMap.djhtm?FUNDID=" +this.fundSubject['fundCode'] + '&FILE=21'
        this.navgator.push(urlstr, {});
    }
    /**
     * 第一個checkbox url
     */
    goFundUrl(type) {
        if (type == '1') {
            this.navgator.push('web:overseas-info-fund', {});
        } else {
            this.navgator.push('web:public-info-fund', {});
        }
    }
    /**
     * 點選checkbox
     */
    chgAgree(type) {
        if (type == '1') {
            this.agree1 = !this.agree1
        } else if (type == '2') {
            this.agree2 = !this.agree2
        } else if (type == '3') {
            this.agree3 = !this.agree3
        } else if (type == '22') {
            this.agree22 = !this.agree22
        }
    }
    //點擊返回行動網銀
    onHome() {
        this.navgator.push('home');
    }
    //點擊確認
    onConfirm3(fundBook, fundInfo, agree) {
        //同意申請都打勾
        if (this.agree1 == true && this.agree2 == true && this.agree3 == true && this.agree22 == true) {
            //舊規格
            // this._logger.log("line 294 go confirm page!!!");
            // this._mainService.getFundPurchase(this.regularNotReq).then(
            //     (result) => {
            //         this.purchaseInfo = result.info_data;
            //         this._logger.log("line 303, purchaseInfo:", this.purchaseInfo);
            //     },
            //     (errorObj) => {
            //         this._handleError.handleError(errorObj);
            //     }
            // );

            //送出後停損、停利為空 帶000
            if (this.regularReq['sLoss'] == '') {
                this.regularReq['sLoss'] = '000';
            }
            if (this.regularReq['sPro'] == '') {
                this.regularReq['sPro'] = '000';
            }

            //新規格
            this.serviceBranch['prospectus'] = '0';
            this.serviceBranch['okCode'] = 'Y';

            this._mainService.getPurchase_New(this.regularReq).then(
                (result) => {
                    logger.error('result709', result)
                    if (result.info_data.trnsRsltCode == 'X') {
                        this._headerCtrl.updateOption({
                            'leftBtnIcon': 'menu',
                            'title': '交易異常'
                        })
                        this.errorHostCodeMsg = result.info_data.hostCodeMsg;
                        this.nowPage = 'failed_x';
                    } else if (result.info_data.trnsRsltCode == '1') {
                        this._headerCtrl.updateOption({
                            'leftBtnIcon': 'menu',
                            'title': '交易失敗'
                        })
                        this.errorHostCodeMsg = result.info_data.hostCodeMsg;
                        this.nowPage = 'failed_1';
                    } else {
                        this.purchaseInfo = result.info_data;
                        this._logger.log("line 659 purchaseInfo:", this.purchaseInfo);
                        //成功後，切換至確認頁
                        this.nowPage = 'regularConfirm';
                    }
                },
                (errorObj) => {
                    logger.error('709', errorObj)
                    errorObj['type'] = 'message';
                    this._handleError.handleError(errorObj);
                }
            );
        } else {
            // 未勾選同意事項
            this._handleError.handleError({
                type: 'dialog',
                title: 'POPUP.NOTICE.TITLE',
                content: '未勾選同意事項或閱讀條款。'
            });
            return false;
        }
    }

    //編輯頁3點擊取消
    onBackEdit2() {
        this.nowPage = 'regular_edit_2';
    }

    //左側返回
    // leftBack(page) {
    //     switch (page) {
    //         case 'edit1':
    //             this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
    //                 title: '提醒您'
    //             }).then(
    //                 () => {
    //                     //確定
    //                     this.onBackPageData({});
    //                 },
    //                 () => {

    //                 }
    //             );
    //             break;
    //         case 'edit2':
    //             this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
    //                 title: '提醒您'
    //             }).then(
    //                 () => {
    //                     //確定
    //                     this.nowPage = 'regular_edit_1';
    //                 },
    //                 () => {

    //                 }
    //             );
    //             break;
    //         case 'edit3':
    //             this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
    //                 title: '提醒您'
    //             }).then(
    //                 () => {
    //                     //確定
    //                     this.nowPage = 'regular_edit_2';
    //                 },
    //                 () => {

    //                 }
    //             );
    //             break;
    //     }
    // }

    /**
     * 返回上一層
     * @param item
     */
    onBackPageData(item?: any) {
        this._logger.log("line 685 into back function!");
        // 返回最新消息選單
        let output = {
            'page': 'purchase-regular',
            'type': 'back',
            'data': item
        };
        if (item.hasOwnProperty('page')) {
            output.page = item.page;
        }
        if (item.hasOwnProperty('type')) {
            output.type = item.type;
        }
        if (item.hasOwnProperty('data')) {
            output.data = item.data;
        }
        this.backPageEmit.emit(output);
    }

    /**
     * 子層返回事件(分頁)
     * @param e
     */
    onPageBackEvent(e) {
        this._logger.log('Deposit', 'onPageBackEvent', e);
        let page = 'list';
        let pageType = 'list';
        let tmp_data: any;
        let show_data = '';
        let week_obj = [];
        if (typeof e === 'object') {
            if (e.hasOwnProperty('page')) {
                page = e.page;
            }
            if (e.hasOwnProperty('type')) {
                pageType = e.type;
            }
            if (e.hasOwnProperty('data')) {
                tmp_data = e.data;
            }
            if (e.hasOwnProperty('show') && e.show) {
                show_data = e.show;
            }
        }
        this._logger.log("page:", page);
        this._logger.log("pageType:", pageType);
        this._logger.log("tmp_data:", tmp_data);

        if (page == 'purchase-tag' && pageType == 'back') {
            this.onBackPageData({});
        }

        if (page == 'date-select') {
            this.dateVal = tmp_data;
            this.dateArr = tmp_data;
            this.dateShow['show'] = show_data;
            this.nowPage = 'regular_edit_1';
            this._logger.log("line 176, dateVal:", this.dateVal);
            //點取，回來接收到
            if (tmp_data.length <= 0) {
                this._logger.log("line 325 tmp_data.length <= 0");
                this.nowRange = 'please-select';
                this.regularReq['payDate31'] = '';
                this.regularReq['payDate5W'] = '';
            }
            if (this.nowRange == 'select-month') {
                this.regularReq['payDate31'] = this.dateVal.join();
                this.regularReq['payDate5W'] = '';
                this.dateShow['month'] = show_data;
                //如果是選擇每週口款時
            } else if (this.nowRange == 'select-week') {
                this.regularReq['payDate5W'] = this.dateVal.join();
                this.regularReq['payDate31'] = '';

                //下方為顯示畫面用
                this.dateShow['week'] = show_data;
                // this.dateVal.forEach(week_item => {
                //     switch (week_item) {
                //         case '1':
                //             week_obj.push(this.week_data[0]);
                //             break;
                //         case '2':
                //             week_obj.push(this.week_data[1]);
                //             break;
                //         case '3':
                //             week_obj.push(this.week_data[2]);
                //             break;
                //         case '4':
                //             week_obj.push(this.week_data[3]);
                //             break;
                //         case '5':
                //             week_obj.push(this.week_data[4]);
                //             break;
                //     }
                // });
                // this.dateWeek['week'] = week_obj.join();
                // this._logger.log("line 824 dateWeek['week']:", this.dateWeek['week']);
            }
            this._logger.log("line 701 regularReq['payDate5W']:", this.regularReq['payDate5W']);
            this._logger.log("line 702 regularReq['payDate31']:", this.regularReq['payDate31']);
        }


        //投資金額說明回傳
        if (page == 'fund-amount-content' && pageType == 'success') {
            this.nowPage = 'regular_edit_1';
        }
        if (page == 'confirm') {
            this.nowPage = 'regular_edit_3';
        }

        //從選擇分行的子層分頁回來
        if (page == 'select_branch') {
            this.branchSelect = false;
            //按取消回來
            if (pageType == 'back') {

            }
            //按確認回來
            else if (pageType == 'go') {
                //清空分行選項
                this.branch = '';
                //清空理財、轉介人員選單
                this._sales = [];
                this._intro = [];
                //清空理財、轉介人員已選擇的選項
                this.inp_data.sales = '';
                this.inp_data.intro = '';
                if (typeof tmp_data.branchName != 'undefined' && tmp_data.branchName != ''
                    && typeof tmp_data.branchId != 'undefined' && tmp_data.branchId != '') {

                    this.branch = tmp_data.branchId + '-' + tmp_data.branchName;
                    //發電文查詢理財、轉介人員
                    this._searchStaffService.getStaff(tmp_data.branchId).then(
                        (result) => {
                            if (typeof result.data !== 'undefined' && !!result.data) {
                                result.data.forEach(staff_item => {
                                    if (staff_item.type == 'FP') {
                                        this._sales.push(staff_item);
                                    } else if (staff_item.type == 'BO') {
                                        this._intro.push(staff_item);
                                    }
                                });
                            }
                        },
                        (errorObj) => {
                            this._handleError.handleError(errorObj);
                        }
                    );
                }
            }
        }
    }

    /**
* 失敗回傳(分頁)
* @param error_obj 失敗物件
*/
    onErrorBackEvent(e) {
        this._logger.step('Deposit', 'onErrorBackEvent', e);
        let page = 'list';
        let pageType = 'list';
        let errorObj: any;
        if (typeof e === 'object') {
            if (e.hasOwnProperty('page')) {
                page = e.page;
            }
            if (e.hasOwnProperty('type')) {
                pageType = e.type;
            }
            if (e.hasOwnProperty('data')) {
                errorObj = e.data;
            }
        }
        // 列表頁：首次近來錯誤推頁
        errorObj['type'] = 'dialog';
        this._handleError.handleError(errorObj);
    }

    // // --------------------------------------------------------------------------------------------
    // //  ____       _            _         _____                 _
    // //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    // //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    // //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    // //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // // --------------------------------------------------------------------------------------------
    amntCheck(checkAmount, checkCurrency, msgType?: any) {
        const req_curr = {
            currency: 'POSITIVE'
        };
        this._logger.step('FUND', 'CHnage1: ', checkAmount, req_curr);
        const check_obj = this._checkService.checkMoney(checkAmount, req_curr); // 金額檢核
        if (check_obj.status) {
            if ((msgType == 'balance1' || msgType == 'balance2') && checkAmount.length > 3) {
                this.errorMsg[msgType] = '請輸入3位內整數';
            } else if (msgType == 'balance1' && parseInt(checkAmount, 0) > 100) {
                this.errorMsg[msgType] = '停損點最小限制額-100%';
            } else {
                this.errorMsg[msgType] = '';
            }
        } else {
            if ((msgType == 'balance1' || msgType == 'balance2') && checkAmount == '') {
                this.errorMsg[msgType] = '';
            } else {
                this.errorMsg[msgType] = check_obj.msg;
            }
        }
        this._logger.step('FUND', 'CHnage2: ', check_obj);

    }

    selectBranch() {
        this.branchSelect = true;
    }
}
