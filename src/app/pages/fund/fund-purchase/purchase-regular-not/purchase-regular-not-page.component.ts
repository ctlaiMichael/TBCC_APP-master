/**
 * 基金申購(定期不定額)
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
import { FundInformation1 } from '@conf/terms/fund/fund-information1';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { FundInformation2 } from '@conf/terms/fund/fund-information2';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { DateSelectService } from '@shared/popup/date-select-popup/date-select.service';
import { SearchStaffService } from '@pages/fund/shared/service/searchStaff.service';

@Component({
    selector: 'app-purchase-regular-not',
    templateUrl: './purchase-regular-not-page.component.html',
    styleUrls: [],
    providers: [FundPurchaseRegularService]
})
export class PurchaseRegularNotPageComponent implements OnInit {
    /**
      * 參數處理
      */
    @Input() setInfo: any; //fi000401 資訊
    @Input() set_twAcnt: any; //台幣約定轉出帳號
    @Input() set_frgn: any; //外幣約定轉出帳號
    @Input() set_trust: any; //信託帳號
    @Input() set_pkg: any; //定期不定額套餐
    @Input() fundSubject: any; //投資基金標的
    @Input() fundStatus: any; //紀錄基金狀態(國內、國外、精選、)
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    nowPage = 'regular_not_edit_1'; //控制頁面
    pkgList: any = []; //定期不定額套餐

    // 頁面錯誤訊息
    errorMsg = {
        amount: '',
        balance1: '',
        balance2: ''
    };

    errorHostCodeMsg = '';
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

    //----------- 顯示紅框 --------------
    checkDate = false;
    check_trust = false;
    check_twAcnt = false;
    check_frgn = false;
    check_sales = false;
    check_intro = false;
    check_range = false;
    check_pkg = false;

    //ngModel綁定(舊版)
    // inp_data = {
    //     twAcntNo: '', //台幣轉出帳號
    //     frgnNo: '', //外幣轉出帳號
    //     trustNo: '', //信託帳號
    //     amount: '', //金額
    //     currType: '', //台幣：1，外幣：2
    //     date: '', //申購日期
    //     sales: '', //理財專員
    //     intro: '', //轉借人員
    //     pkg: '' //定期不定額套餐
    // }

    //ngModel綁定(新版)
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

    //*送往下一頁的值，使用者輸入(舊規格)
    // regularNotReq = {
    //     custId: '',
    //     trustAcnt: '', //信託帳號
    //     fundCode: '',//基金代碼
    //     currType: '', //台幣：1，外幣：2
    //     amount: '', //金額
    //     payAcnt: '', //轉出帳號(外幣)
    //     salesId: '', //銷售行員ID
    //     salesName: '', //銷售行員姓名
    //     introId: '', //轉借人員ID
    //     introName: '', //轉借人員姓名
    //     payDate: '', //每月扣款日
    //     code: '' //定期不定額 套餐代碼， 定額：空白，不定額：帶套餐代碼
    // };

    //漲跌級距規則
    range = []; //依照幣別存放下方陣列值
    TWD = ["1000", "2000", "3000", "4000", "5000"];
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
    least_USD = '300'; //美元
    least_HKD = '3000'; //港幣
    least_GBP = '300'; //英鎊
    least_AUD = '300'; //澳幣
    least_SGD = '300'; //新加坡幣
    least_CHF = '300'; //瑞士法郎
    least_CAD = '300'; //加拿大幣
    least_JPY = '30000'; //日圓
    least_CNY = '3000'; //人民幣
    least_SEK = '3000'; //瑞典幣
    least_NZD = '300'; //紐西蘭幣
    least_EUR = '300'; //歐元
    least_ZAR = '3000'; //南非幣

    pattern = '';
    agree1 = false;
    agree2 = false;
    agree3 = false;
    agree22 = false;
    //*送往下一頁的值，使用者輸入(新規格)
    regularNotReq = {
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

    //新規格(評價方式設定，漲幅級距按鈕flag)
    eval = true;
    lossFlag = true; //控制打勾
    lossGain = true; //true跌幅，false漲幅

    autoFlag = false;
    immFlag = false;
    emailFlag = false;
    continue = true; //續不續扣
    // sales = []; // 銷售人員資訊，整理過
    // intro = []; //轉借人員資訊，整理過
    _sales = []; // 銷售人員資訊
    _intro = []; //轉借人員資訊

    //檢核變數
    check_decline1 = false;
    check_decline2 = false;
    check_decline3 = false;
    check_decline4 = false;
    check_decline5 = false;
    check_gain1 = false;
    check_gain2 = false;
    check_gain3 = false;
    check_gain4 = false;
    check_gain5 = false;

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

    //----------- 接收fi000709基金申購申請 -----------
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


    //顯示錯誤訊息
    decline1_msg = '';
    decline2_msg = '';
    decline3_msg = '';
    decline4_msg = '';
    decline5_msg = '';
    gain1_msg = '';
    gain2_msg = '';
    gain3_msg = '';
    gain4_msg = '';
    gain5_msg = '';

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
            'title': '基金定期不定額申購'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            // switch (this.nowPage) {
            //     case 'regular_not_edit_1':
            //         this.leftBack('edit1');
            //         break;
            //     case 'regular_edit_2':
            //         this.leftBack('edit2');
            //         break;
            //     case 'regular_edit_3':
            //         this.leftBack('edit3');
            //         break;
            // }
            this.confirm.show('您是否放棄此次編輯?', {
                title: '提醒您'
            }).then(
                () => {
                    // 返回投資理財選單
                    this.navgator.push('fund');
                },
                () => {
                }
            );
        });

        this.screenTop = document.body.scrollHeight;
        this.regularNotReq['code'] = '02';

        this._logger.log("setInfo:", this.setInfo);
        this._logger.log("set_pkg:", this.set_pkg);
        this._logger.log("fundStatus:", this.fundStatus);
        this._logger.log("fundSubject:", this.fundSubject);
        this._logger.log("set_frgn:", this.set_frgn);

        //客戶投資屬性 1:保守2:穩健3:積極
        this.investAttribute = this.setInfo['rtType'];

        //先抓今天日期(申請日期)
        this.regularNotReq['enrollDate'] = this._mainService.getToday();
        this._logger.log("line 205 regularNotReq['enrollDate']:", this.regularNotReq['enrollDate']);

        this.inp_data['trustNo'] = this.set_trust[0].trustAcntNo;
        this._logger.log("fundSubject:", this.fundSubject);
        //2019/08/21 402電文(投資標的)計價幣別如果是「外幣」，台外幣都可以選，為「台幣」只允許選擇台幣(disable外幣)，投資金額元拿掉(顯示幣別) ex: 投資金額(USD)
        if (this.fundSubject['currency'] == 'TWD' || this.fundSubject['currency'] == 'NTD') {
            this._logger.log("into currency twd");
            this.showDisable_twd = false;
            this.showDisable_frgn = true;
        } else {
            this._logger.log("into currency frgn");
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
        this.currencyRule(); //設定幣別規則
        this.rangeRule(); //設定級距規則
        this._logger.log("range:", this.range);
        // //整理轉售人員資料
        // this.intro = this._mainService.intro_sort(this.set_trust);
        // //整理銷售人員資料
        // this.sales = this._mainService.sales_sort(this.set_trust);
        //將基金代碼帶入
        this.regularNotReq['fundCode'] = this.fundSubject['fundCode'];
        this._logger.log("line 296 currency:", this.fundSubject['currency']);
        this._logger.log("line 297 currency range:", this.range);

        if (this.nowRange == 'please-select') {
            this.dateVal = [];
        }
        this._logger.log("inp_data:", this.inp_data);
    }
    //幣別規則
    currencyRule() {
        //判斷幣別，判斷要用哪個級距規則
        switch (this.fundSubject['currency']) {
            case 'TWD':
                this.range = this.TWD;
                this.leastRange = '5000'; //台幣為5000 (定期不定額為5000)
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
    //級距規則
    rangeRule() {
        this.pattern = this.range[0]; //每種幣別的級距
        this.regularNotReq.decline1 = this.range[0];
        this.regularNotReq.decline2 = this.range[1];
        this.regularNotReq.decline3 = this.range[2];
        this.regularNotReq.decline4 = this.range[3];
        this.regularNotReq.decline5 = this.range[4];
        this.regularNotReq.gain1 = this.range[0];
        this.regularNotReq.gain2 = this.range[1];
        this.regularNotReq.gain3 = this.range[2];
        this.regularNotReq.gain4 = this.range[3];
        this.regularNotReq.gain5 = this.range[4];
    }

    //點擊國內or國外
    selectCurr(curr) {
        //國內
        if (this.fundStatus.foreginType == '1') {
            this._logger.log("1");
            if (curr == 'twd') {
                this.showCheck = true;
                this.inp_data['amount'] = '';
                //切換台幣改計價幣別為TWD
                this.fundSubject['currency'] = 'TWD';
                this.currencyRule();
                this.rangeRule();
                this.errorMsg.amount = '';
                //2019/08/21 新規則不需判斷前一頁，選擇國外or國內，來限制選擇幣別
                // this.showDisable = false;
                //使用者反悔，將相反欄位清空，ex:點台幣，清空外幣
                this.regularNotReq.payAcnt = '';
                this.amountPlace = '請輸入金額';
            } else if (curr == 'forgen') {
                this.showCheck = false;
                this.inp_data['amount'] = '';
                this.fundSubject['currency'] = this.oldCurrency;
                this.currencyRule();
                this.rangeRule();
                this.errorMsg.amount = '';
                //2019/08/21 新規則不需判斷前一頁，選擇國外or國內，來限制選擇幣別
                // this.showDisable = false;
                //使用者反悔，將相反欄位清空，ex:點台幣，清空外幣
                this.regularNotReq.payAcnt = '';

                //新規則無限制(國內也可選外幣)
                // this._handleError.handleError({
                //     type: 'dialog',
                //     title: 'POPUP.NOTICE.TITLE',
                //     content: 'CHECK.STRING.TWD_SUBJECT'
                // });
                this.amountPlace = '請輸入金額';

                //外幣約定轉出帳號，有可能沒資料，要跳出訊息
                if (this.set_frgn.length <= 0 || typeof this.set_frgn === null) {
                    this._handleError.handleError({
                        type: '提醒您',
                        title: '我知道了',
                        content: '請先臨櫃辦理約定「外幣轉出帳號」'
                    });
                    return false;
                }
            }
            //國外
        } else if (this.fundStatus.foreginType == '2') {
            this._logger.log("2");
            if (curr == 'twd') {
                this.showCheck = true;
                this.inp_data['amount'] = '';
                //切換台幣改計價幣別為TWD
                this.fundSubject['currency'] = 'TWD';
                this.currencyRule();
                this.rangeRule();
                this.errorMsg.amount = '';
                //2019/08/21 新規則不需判斷前一頁，選擇國外or國內，來限制選擇幣別
                // this.showDisable = false;
                //使用者反悔，將相反欄位清空，ex:點台幣，清空外幣
                this.regularNotReq.payAcnt = '';
                this.amountPlace = '請輸入金額';
            } else if (curr == 'forgen') {
                this.showCheck = false;
                this.inp_data['amount'] = '';
                this.fundSubject['currency'] = this.oldCurrency;
                this.currencyRule();
                this.rangeRule();
                this.errorMsg.amount = '';
                //2019/08/21 新規則不需判斷前一頁，選擇國外or國內，來限制選擇幣別
                // this.showDisable = false;
                //使用者反悔，將相反欄位清空，ex:點台幣，清空外幣
                this.regularNotReq.payAcnt = '';
                this.amountPlace = '請輸入金額';

                //外幣約定轉出帳號，有可能沒資料，要跳出訊息
                if (this.set_frgn.length <= 0 || typeof this.set_frgn === null) {
                    this._handleError.handleError({
                        type: '提醒您',
                        title: '我知道了',
                        content: '請先臨櫃辦理約定「外幣轉出帳號」'
                    });
                    return false;
                }
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
            this.regularNotReq['payDate31'] = '';
            this.regularNotReq['payDate5W'] = '';

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

    //選擇評價方式設定
    onSelectEval(select) {
        switch (select) {
            case 'eval1':
                this._logger.log('line 309 into eval1!');
                if (this.eval == false) {
                    this.eval = true;
                } else {
                    this.eval = false;
                }
                break;
            case 'eval2':
                this._logger.log('line 317 into eval2!');
                if (this.eval == false) {
                    this.eval = true;
                } else {
                    this.eval = false;
                }
                break;
        }
    }

    //選擇漲跌幅
    onLoss(select) {
        switch (select) {
            case 'loss':
                this.lossGain = true; //判斷當下選擇，跌幅
                this._logger.log("line 334 lossGain:", this.lossGain);
                break;
            case 'gain':
                this.lossGain = false; //判斷當下選擇，漲幅
                this._logger.log("line 339 lossGain:", this.lossGain);
                break;
        }
    }
    //點擊返回行動網銀
    onHome() {
        this.navgator.push('home');
    }
    //點擊下一步
    onNext() {
        this._logger.log("inp_data.twAcntNo:", this.inp_data.twAcntNo);
        this._logger.log("inp_data.frgnNo:", this.inp_data.frgnNo);
        this._logger.log("inp_data:", this.inp_data);
        this._logger.log("dateVal", this.dateVal);
        this._logger.log("line 383 onNext regularNotReq:", this.regularNotReq);

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
            this.regularNotReq['amount'] = '';
            return false;
        } else {
            this.errorMsg.amount = '';
            this.checkAmount = false;
            this.regularNotReq['amount'] = this.inp_data['amount'];
        }

        //檢查信託帳號
        // if (this.inp_data['trustNo'] == '') {
        //     this.check_trust = true;
        //     this.regularNotReq['trustAcnt'] = '';
        // } else {
        //     this.check_trust = false;
        //     this.regularNotReq['trustAcnt'] = this.inp_data['trustNo']['trustAcntNo'];
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
        if (this.regularNotReq['payDate31'] == '' && this.regularNotReq['payDate5W'] == '') {
            this.check_range = true;
        } else {
            this.check_range = false;
        }

        let decline = true; //跌幅級距，有一個為false須提醒使用者
        let gain = true; //漲幅級距，有一個為false須提醒使用者
        //錯誤訊息
        let decline1_msg = '';
        let decline2_msg = '';
        let decline3_msg = '';
        let decline4_msg = '';
        let decline5_msg = '';
        let gain1_msg = '';
        let gain2_msg = '';
        let gain3_msg = '';
        let gain4_msg = '';
        let gain5_msg = '';

        //檢核跌幅級距
        //為整數 && 不可為小數
        let checkNb_d1 = this._checkService.checkNumber(this.regularNotReq.decline1);
        console.log("checkNb_d1:", checkNb_d1);
        if (this.regularNotReq.decline1.indexOf(".") > 0 || checkNb_d1['status'] == false) {
            decline = false; //判斷alert提示 漲幅 or 跌幅有錯
            decline1_msg += '請輸入整數';
        } else {
        if (parseInt(this.regularNotReq.decline1) % parseInt(this.pattern) != 0) {
            decline = false; //判斷alert提示 漲幅 or 跌幅有錯
            decline1_msg += ' 輸入單位需為' + this.pattern;
            }
        }
        let checkNb_d2 = this._checkService.checkNumber(this.regularNotReq.decline2);
        if (this.regularNotReq.decline2.indexOf(".") > 0 || checkNb_d2['status'] == false) {
            decline = false; //判斷alert提示 漲幅 or 跌幅有錯
            decline2_msg += '請輸入整數';
        } else {
        if (parseInt(this.regularNotReq.decline2) % parseInt(this.pattern) != 0) {
            decline = false;
            decline2_msg += ' 輸入單位需為' + this.pattern;
            }
        }
        let checkNb_d3 = this._checkService.checkNumber(this.regularNotReq.decline3);
        if (this.regularNotReq.decline3.indexOf(".") > 0 || checkNb_d3['status'] == false) {
            decline = false; //判斷alert提示 漲幅 or 跌幅有錯
            decline3_msg += '請輸入整數';
        } else {
        if (parseInt(this.regularNotReq.decline3) % parseInt(this.pattern) != 0) {
            decline = false;
            decline3_msg += ' 輸入單位需為' + this.pattern;
            }
        }
        let checkNb_d4 = this._checkService.checkNumber(this.regularNotReq.decline4);
        if (this.regularNotReq.decline4.indexOf(".") > 0 || checkNb_d4['status'] == false) {
            decline = false; //判斷alert提示 漲幅 or 跌幅有錯
            decline4_msg += '請輸入整數';
        } else {
        if (parseInt(this.regularNotReq.decline4) % parseInt(this.pattern) != 0) {
            decline = false;
            decline4_msg += ' 輸入單位需為' + this.pattern;
            }
        }
        let checkNb_d5 = this._checkService.checkNumber(this.regularNotReq.decline5);
        if (this.regularNotReq.decline5.indexOf(".") > 0 || checkNb_d5['status'] == false) {
            decline = false; //判斷alert提示 漲幅 or 跌幅有錯
            decline5_msg += '請輸入整數';
        } else {
        if (parseInt(this.regularNotReq.decline5) % parseInt(this.pattern) != 0) {
            decline = false;
            decline5_msg += ' 輸入單位需為' + this.pattern;
            }
        }
        //檢查漲幅級距
        let checkNb_g1 = this._checkService.checkNumber(this.regularNotReq.gain1);
        if (this.regularNotReq.gain1.indexOf(".") > 0 || checkNb_g1['status'] == false) {
            gain = false; //判斷alert提示 漲幅 or 跌幅有錯
            gain1_msg += '請輸入整數';
        } else {
        if (parseInt(this.regularNotReq.gain1) % parseInt(this.pattern) != 0) {
            gain = false;
            gain1_msg += ' 輸入單位需為' + this.pattern;
            }
        }
        let checkNb_g2 = this._checkService.checkNumber(this.regularNotReq.gain2);
        if (this.regularNotReq.gain2.indexOf(".") > 0 || checkNb_g2['status'] == false) {
            gain = false; //判斷alert提示 漲幅 or 跌幅有錯
            gain2_msg += '請輸入整數';
        } else {
        if (parseInt(this.regularNotReq.gain2) % parseInt(this.pattern) != 0) {
            gain = false;
            gain2_msg += ' 輸入單位需為' + this.pattern;
            }
        }
        let checkNb_g3 = this._checkService.checkNumber(this.regularNotReq.gain3);
        if (this.regularNotReq.gain3.indexOf(".") > 0 || checkNb_g3['status'] == false) {
            gain = false; //判斷alert提示 漲幅 or 跌幅有錯
            gain3_msg += '請輸入整數';
        } else {
        if (parseInt(this.regularNotReq.gain3) % parseInt(this.pattern) != 0) {
            gain = false;
            gain3_msg += ' 輸入單位需為' + this.pattern;
            }
        }
        let checkNb_g4 = this._checkService.checkNumber(this.regularNotReq.gain4);
        if (this.regularNotReq.gain4.indexOf(".") > 0 || checkNb_g4['status'] == false) {
            gain = false; //判斷alert提示 漲幅 or 跌幅有錯
            gain4_msg += '請輸入整數';
        } else {
        if (parseInt(this.regularNotReq.gain4) % parseInt(this.pattern) != 0) {
            gain = false;
            gain4_msg += ' 輸入單位需為' + this.pattern;
            }
        }
        let checkNb_g5 = this._checkService.checkNumber(this.regularNotReq.gain5);
        if (this.regularNotReq.gain5.indexOf(".") > 0 || checkNb_g5['status'] == false) {
            gain = false; //判斷alert提示 漲幅 or 跌幅有錯
            gain5_msg += '請輸入整數';
        } else {
        if (parseInt(this.regularNotReq.gain5) % parseInt(this.pattern) != 0) {
            gain = false;
            gain5_msg += ' 輸入單位需為' + this.pattern;
            }
        }

        //檢查跌幅級距值是否有都為零情況
        if ((this.regularNotReq.decline1 == '0' || this.regularNotReq.decline1 == '') && (this.regularNotReq.decline2 == '0' || this.regularNotReq.decline2 == '')
            && (this.regularNotReq.decline3 == '0' || this.regularNotReq.decline3 == '') && (this.regularNotReq.decline4 == '0' || this.regularNotReq.decline4 == '')
            && (this.regularNotReq.decline5 == '0' || this.regularNotReq.decline5 == '') && (this.regularNotReq.gain1 == '0' || this.regularNotReq.gain1 == '')
            && (this.regularNotReq.gain2 == '0' || this.regularNotReq.gain2 == '') && (this.regularNotReq.gain3 == '0' || this.regularNotReq.gain3 == '')
            && (this.regularNotReq.gain4 == '0' || this.regularNotReq.gain4 == '') && (this.regularNotReq.gain5 == '' || this.regularNotReq.gain5 == '')) {
            this.alert.show('請輸入至少一組漲跌幅級距值', {
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

        //2020/02/06 檢查漲跌幅+-號有無輸入
        //跌幅+-
        if (this.regularNotReq.decline1Cd == '' || typeof this.regularNotReq.decline2Cd == 'undefined') {
            decline1_msg += ' 未選擇加減碼';
            decline = false; //判斷alert提示 漲幅 or 跌幅有錯
        }
        if (this.regularNotReq.decline2Cd == '' || typeof this.regularNotReq.decline2Cd == 'undefined') {
            decline2_msg += ' 未選擇加減碼';
            decline = false;
        }
        if (this.regularNotReq.decline3Cd == '' || typeof this.regularNotReq.decline3Cd == 'undefined') {
            decline3_msg += ' 未選擇加減碼';
            decline = false;
        }
        if (this.regularNotReq.decline4Cd == '' || typeof this.regularNotReq.decline4Cd == 'undefined') {
            decline4_msg += ' 未選擇加減碼';
            decline = false;
        }
        if (this.regularNotReq.decline5Cd == '' || typeof this.regularNotReq.decline5Cd == 'undefined') {
            decline5_msg += ' 未選擇加減碼';
            decline = false;
        }
        //漲幅+-
        if (this.regularNotReq.gain1Cd == '' || typeof this.regularNotReq.gain1Cd == 'undefined') {
            gain1_msg += ' 未選擇加減碼';
            gain = false;
        }
        if (this.regularNotReq.gain2Cd == '' || typeof this.regularNotReq.gain2Cd == 'undefined') {
            gain2_msg += ' 未選擇加減碼';
            gain = false;
        }
        if (this.regularNotReq.gain3Cd == '' || typeof this.regularNotReq.gain3Cd == 'undefined') {
            gain3_msg += ' 未選擇加減碼';
            gain = false;
        }
        if (this.regularNotReq.gain4Cd == '' || typeof this.regularNotReq.gain4Cd == 'undefined') {
            gain4_msg += ' 未選擇加減碼';
            gain = false;
        }
        if (this.regularNotReq.gain5Cd == '' || typeof this.regularNotReq.gain5Cd == 'undefined') {
            gain5_msg += ' 未選擇加減碼';
            gain = false;
        }
        //2020/02/06 漲跌幅級距輸入錯誤，需提示使用者查看 alert
        this.showDeclineError(gain, decline);

        this.decline1_msg = ''; //給html顯示訊息，每點擊一次都須先清空全域變數
        this.decline1_msg = decline1_msg;
        this.decline2_msg = '';
        this.decline2_msg = decline2_msg;
        this.decline3_msg = '';
        this.decline3_msg = decline3_msg;
        this.decline4_msg = '';
        this.decline4_msg = decline4_msg;
        this.decline5_msg = '';
        this.decline5_msg = decline5_msg;
        this.gain1_msg = '';
        this.gain1_msg = gain1_msg;
        this.gain2_msg = '';
        this.gain2_msg = gain2_msg;
        this.gain3_msg = '';
        this.gain3_msg = gain3_msg;
        this.gain4_msg = '';
        this.gain4_msg = gain4_msg;
        this.gain5_msg = '';
        this.gain5_msg = gain5_msg;

        //判斷該欄位有錯誤才顯示紅框
        if (this.decline1_msg != '') {
            this.check_decline1 = true;
        } else {
            this.check_decline1 = false;
        }
        if (this.decline2_msg != '') {
            this.check_decline2 = true;
        } else {
            this.check_decline2 = false;
        }
        if (this.decline3_msg != '') {
            this.check_decline3 = true;
        } else {
            this.check_decline3 = false;
        }
        if (this.decline4_msg != '') {
            this.check_decline4 = true;
        } else {
            this.check_decline4 = false;
        }
        if (this.decline5_msg != '') {
            this.check_decline5 = true;
        } else {
            this.check_decline5 = false;
        }
        if (this.gain1_msg != '') {
            this.check_gain1 = true;
        } else {
            this.check_gain1 = false;
        }
        if (this.gain2_msg != '') {
            this.check_gain2 = true;
        } else {
            this.check_gain2 = false;
        }
        if (this.gain3_msg != '') {
            this.check_gain3 = true;
        } else {
            this.check_gain3 = false;
        }
        if (this.gain4_msg != '') {
            this.check_gain4 = true;
        } else {
            this.check_gain4 = false;
        }
        if (this.gain5_msg != '') {
            this.check_gain5 = true;
        } else {
            this.check_gain5 = false;
        }

        //2020/02/06 阻檔不符合級距金額 or +-未輸入，不可進入下一頁
        let checkBlock = this.checkDeclineBlock();
        if (checkBlock == false) {
            return false;
        }


        //檢查定期不定額套餐,新規格不需要此欄位
        // if (this.inp_data['code'] == '') {
        //     this.check_pkg = true;
        //     this.regularNotReq['code'] = '';
        // } else {
        //     this.check_pkg = false;
        //     this.regularNotReq['code'] = this.inp_data['pkg']['pkgCode'];
        // }

        //台幣
        if (this.showCheck == true) {
            this._logger.log("line 442 into twd!!");
            this.regularNotReq['currType'] = '1';
            //檢查扣款帳號(台幣)
            if (this.inp_data['twAcntNo'] == '') {
                this.check_twAcnt = true;
                this.regularNotReq['payAcnt'] = '';
            } else {
                this.check_twAcnt = false;
                this.regularNotReq['payAcnt'] = this.inp_data['twAcntNo']['twAcntNo'];
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
            //*金額未達3000，比照新trunk程式，小額申購不擋最低金額
            // if (parseInt(this.inp_data['amount']) < 3000 || this.inp_data['amount'] == '') {
            //     this.alert.show('請輸入有效的申購金額', {
            //         title: '提醒您',
            //         btnTitle: '我知道了',
            //     }).then(
            //         () => {
            //         }
            //     );
            //     //金額達到3000
            // } else {
            //最後檢核，都過進下一頁
            if (this.regularNotReq['amount'] && this.inp_data['twAcntNo'] !== '' && this.inp_data['trustNo'] !== ''
                && (this.regularNotReq['payDate31'] !== '' || this.regularNotReq['payDate5W'] !== '')) {
                if (this.eval == true) {
                    this.regularNotReq['code'] = '02';
                } else {
                    this.regularNotReq['code'] = '01';
                }
                //國內基金
                if (this.fundStatus['foreginType'] == '1') {
                    this._logger.log("into twd fundType C");
                    this.regularNotReq['fundType'] = 'C';
                    //國外台幣
                } else if (this.fundStatus['foreginType'] == '2') {
                    this._logger.log("into twd fundType N");
                    this.regularNotReq['fundType'] = 'N';
                }
                this.serviceBranch['fundType'] = this.regularNotReq['fundType'];
                this.nowPage = 'regular_edit_2';
                this._logger.log("twd regularNotReq:", this.regularNotReq);
                this._logger.log("inp_data", this.inp_data);
            } else {
                return false;
            }
            // }

            //外幣
        } else {
            this._logger.log("line 468 into frgn!!");
            this.regularNotReq['currType'] = '2';
            //檢查扣款帳號(外幣)
            if (this.inp_data['frgnNo'] == '') {
                this.check_frgn = true;
                this.regularNotReq['payAcnt'] = '';
            } else {
                this.check_frgn = false;
                this.regularNotReq['payAcnt'] = this.inp_data['frgnNo']['frgnAcntNo'];
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
            if (this.regularNotReq['amount'] && this.inp_data['frgnNo'] !== '' && this.inp_data['trustNo'] !== ''
                && (this.regularNotReq['payDate31'] !== '' || this.regularNotReq['payDate5W'] !== '')) {
                if (this.eval == true) {
                    this.regularNotReq['code'] = '02'; //api帶01、02，但native code帶1、2
                } else {
                    this.regularNotReq['code'] = '01';
                }
                //到下一頁時，紀錄「國內基金」
                if (this.fundStatus['foreginType'] == '1') {
                    this._logger.log("into frg fundType C");
                    this.regularNotReq['fundType'] = 'C';
                    //國外外幣
                } else if (this.fundStatus['foreginType'] == '2') {
                    this._logger.log("into frg fundType Y");
                    this.regularNotReq['fundType'] = 'Y';
                }
                this.serviceBranch['fundType'] = this.regularNotReq['fundType'];
                this.nowPage = 'regular_edit_2';
                this._logger.log("forgen regularNotReq:", this.regularNotReq);
                this._logger.log("inp_data", this.inp_data);
            } else {
                return false;
            }
        }
    }

    //若漲跌幅級距輸入錯誤，依照為哪個欄位提示
    //gain: 漲幅級距
    //decline: 跌幅級距
    //type: 判別 加碼數值 or +-號， value: 加碼數值，sign: +-號
    private showDeclineError(gain: boolean, decline: boolean) {
        //漲幅級距錯誤
        if (gain == false && decline == true) {
            this.alert.show('漲幅級距輸入錯誤，請切換至漲幅級距，查看資料輸入是否正確', {
                title: '提醒您',
                btnTitle: '我知道了',
            }).then(
                () => {
                }
            );
            //跌幅級距輸入錯誤
        } else if (gain == true && decline == false) {
            this.alert.show('跌幅級距輸入錯誤，請切換至跌幅級距，確認資料輸入是否正確', {
                title: '提醒您',
                btnTitle: '我知道了',
            }).then(
                () => {
                }
            );
        } else if (gain == false && decline == false) {
            this.alert.show('漲幅級距、跌幅級距皆輸入錯誤，請切換確認資料輸入是否正確', {
                title: '提醒您',
                btnTitle: '我知道了',
            }).then(
                () => {
                }
            );
        } else {
            this._logger.log("check all true");
        }
    }

    //2020/02/06 阻檔不符合級距金額 or +-未輸入，不可進入下一頁
    private checkDeclineBlock() {
        let block: boolean = false;
        if (this.check_decline1 || this.check_decline2 || this.check_decline3 || this.check_decline4 || this.check_decline5
            || this.check_gain1 || this.check_gain2 || this.check_gain3 || this.check_gain4 || this.check_gain5) {
            block = false;
        } else {
            block = true;
        }
        return block;
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
        // this.nowPage = 'amount-popoup';
        if (document.body.scrollHeight != this.screenTop) {
            return false;
        } else {
            this.nowPage = 'amount-popoup';

        }
    }

    //編輯頁1點擊上一步
    onBack() {
        this.onBackPageData({});
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
        this._logger.log("edit2 nextpage regularNotReq:", this.regularNotReq);
        //判斷出場通知
        //自動贖回
        if (this.autoFlag == true) {
            this.regularNotReq['notiCD'] = '1';
            //即時畫面
        } else if (this.immFlag == true && this.emailFlag == false) {
            this.regularNotReq['notiCD'] = '2';
            this.regularNotReq['continue'] = ''; //續扣清空
            //E-mail    
        } else if (this.emailFlag == true && this.immFlag == false) {
            this.regularNotReq['notiCD'] = '3';
            this.regularNotReq['continue'] = ''; //續扣清空
            //即時畫面 + E-mail
        } else if (this.immFlag == true && this.emailFlag == true) {
            this.regularNotReq['notiCD'] = '4';
            this.regularNotReq['continue'] = ''; //續扣清空
        } else if (this.autoFlag == false && this.immFlag == false && this.emailFlag == false) {
            this.regularNotReq['notiCD'] = '';
            this.regularNotReq['continue'] = '';
        }
        //是否繼續扣款
        if (this.continue == true && this.autoFlag == true) {
            this.regularNotReq['continue'] = 'Y';
        } else if (this.continue == false && this.autoFlag == true) {
            this.regularNotReq['continue'] = 'N';
        }

        // //檢查停損停利點
        // if (parseInt(this.regularNotReq['sLoss']) > 100) {
        //     this.loss_error = '停損點最小限制-100%';
        //     this.check_loss = true;
        // } else {
        //     this.check_loss = false;
        // }
        // if (this.regularNotReq['sPro'].length > 3) {
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
        this.regularNotReq['sLossCD'] = '-';
        //停利點，固定正
        this.regularNotReq['sProCD'] = '';

        //檢核理財專員
        if (this.inp_data['sales'] == '') {
            this.check_sales = true;
            this.regularNotReq['salesId'] = '';
            this.regularNotReq['salesName'] = '';
        } else {
            this.check_sales = false;
            if (this.checkbranch == '2') {
                this.regularNotReq['salesId'] = this.inp_data['sales']['pid'];
                this.regularNotReq['salesName'] = this.inp_data['sales']['name'];
            }else if (this.checkbranch == '1') {
                if (this.salesindex == '-1') {
                    this.regularNotReq['salesId'] = this.inp_data.sales;
                    this.regularNotReq['salesName'] = '';
                }else {
                    this.regularNotReq['salesId'] = this.inp_data.sales;
                    this.regularNotReq['salesName'] = this._sales[this.salesindex]['salesName'];
                }
            }
        }
        this._logger.log("line 249:", this.regularNotReq);

        //檢查銷售行員
        if (this.inp_data['intro'] == '') {
            this.check_intro = true;
            this.regularNotReq['introId'] = '';
            this.regularNotReq['introName'] = '';
        } else {
            this.check_intro = false;
            if (this.checkbranch == '2') {
                this.regularNotReq['introId'] = this.inp_data['intro']['pid'];
                this.regularNotReq['introName'] = this.inp_data['intro']['name'];
            } else if (this.checkbranch == '1') {
                this.regularNotReq['introId'] = this.inp_data['intro']['introId'];
                this.regularNotReq['introName'] = this.inp_data['intro']['introName'];
            }
        }

        // 20190626 依合庫需求改為非必填，請參考文件:轉置案UAT問題追蹤表@20190625.xls-問題編號353
        // if (this.inp_data['sales'] !== '' && this.inp_data['intro'] !== ''
        //     && parseInt(this.regularNotReq['sLoss']) <= 100) {
        //     //當停損停利為空，輸入000
        //     if (this.regularNotReq['sLoss'] == '') {
        //         this.regularNotReq['sLoss'] = '000';
        //     }
        //     if (this.regularNotReq['sPro'] == '') {
        //         this.regularNotReq['sPro'] = '000';
        //     }
        //     this.nowPage = 'regular_edit_3';
        // } else {
        //     return false;
        // }
        if (this.regularNotReq['sLoss'] == '') {
            this.regularNotReq['sLoss'] = '000';
        }
        if (this.regularNotReq['sPro'] == '') {
            this.regularNotReq['sPro'] = '000';
        }
        this.nowPage = 'regular_edit_3';
    }

    //編輯頁2點擊上一步
    onBackEdit1() {
        this.nowPage = 'regular_not_edit_1';
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
        // this.nowPageType = 'fundInformation2';
        // const set_data = new FundInformation2();
        // this.infomationService.show(set_data);

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

            //新規格
            this.serviceBranch['prospectus'] = '1';
            this.serviceBranch['okCode'] = 'Y';
            this._logger.log("line 654 go confirm page!!!");
            this._logger.log("line 655 regularNotReq to service");
            this._mainService.getPurchase_New(this.regularNotReq).then(
                (result) => {
                    if (result.info_data.trnsRsltCode == 'X') {
                        this.errorHostCodeMsg = result.info_data.hostCodeMsg;
                        this.nowPage = 'failed_x';
                        this._headerCtrl.updateOption({
                            'leftBtnIcon': 'menu',
                            'title': '交易異常'
                        })
                    } else if (result.info_data.trnsRsltCode == '1') {
                        this.errorHostCodeMsg = result.info_data.hostCodeMsg;
                        this.nowPage = 'failed_1';
                        this._headerCtrl.updateOption({
                            'leftBtnIcon': 'menu',
                            'title': '交易失敗'
                        })
                    } else {
                        this.purchaseInfo = result.info_data;
                        //成功後，切換至確認頁
                        this.nowPage = 'regularConfirm';
                    }
                },
                (errorObj) => {
                    this._handleError.handleError(errorObj);
                    this.navgator.push('fund');
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
    //                     this.nowPage = 'regular_not_edit_1';
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
        // 返回最新消息選單
        let output = {
            'page': 'purchase-regular-not',
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
            if (e.hasOwnProperty('data') && e.data) {
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
            this.nowPage = 'regular_not_edit_1';
            this._logger.log("line 176, dateVal:", this.dateVal);
            //點取，回來接收到
            if (tmp_data.length <= 0) {
                this._logger.log("line 325 tmp_data.length <= 0");
                this.nowRange = 'please-select';
                this.regularNotReq['payDate31'] = '';
                this.regularNotReq['payDate5W'] = ''
            }
            if (this.nowRange == 'select-month') {
                this.regularNotReq['payDate31'] = this.dateVal.join();
                this.regularNotReq['payDate5W'] = '';
                this.dateShow['month'] = show_data;
                //如果是選擇每週口款時
            } else if (this.nowRange == 'select-week') {
                this.regularNotReq['payDate5W'] = this.dateVal.join();
                this.regularNotReq['payDate31'] = '';

                // 下方為顯示畫面用
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
            // this._logger.log("line 701 regularNotReq['payDate5W']:", this.regularNotReq['payDate5W']);
            // this._logger.log("line 702 regularNotReq['payDate31']:", this.regularNotReq['payDate31']);
        }
        //投資金額說明(回傳)
        if (page == 'fund-amount-content' && pageType == 'success') {
            this.nowPage = 'regular_not_edit_1';
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
