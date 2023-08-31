/**
 * 基金申購(單筆申購)
 */
import { Component, OnInit, Input, Output, EventEmitter, ComponentFactoryResolver } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CheckService } from '@shared/check/check.service';
import { FundPurchaseSingleService } from '@pages/fund/shared/service/fund-purchase-single.service';
import { FundInvestDes } from '@conf/terms/fund/fund-invest-des';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { FundInformation1 } from '@conf/terms/fund/fund-information1';
import { FundInformation2 } from '@conf/terms/fund/fund-information2';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
// import { logger } from '@shared/util/log-util';
import { DateService } from '@core/date/date.service';
import { DeviceService } from '@lib/plugins/device.service';
import { SearchStaffService } from '@pages/fund/shared/service/searchStaff.service';
import { FundPurchaseTagService } from '@pages/fund/shared/service/fund-purchase-tag.service';
import { promise } from 'protractor';
import { resolve } from 'path';

@Component({
    selector: 'app-purchase-single',
    templateUrl: './purchase-single-page.component.html',
    styleUrls: [],
    providers: [FundPurchaseSingleService]
})
export class PurchaseSinglePageComponent implements OnInit {
    /**
      * 參數處理
      */
    @Input() setInfo: any; // fi000401 資訊
    @Input() resver_info: any; // fi000401 資訊(預約)
    @Input() set_twAcnt: any; // 台幣約定轉出帳號
    @Input() set_frgn: any; // 外幣約定轉出帳號
    @Input() single_frgn_data_resver: any; // 外幣約定轉出帳號(預約)
    @Input() single_twAcnt_data_resver: any; // 台幣約定轉出帳號(預約)
    @Input() resver_twAcnt_data: any; // 預約台幣帳號(過營業時間)
    @Input() resver_frgn_data: any; // 預約外幣帳號(過營業時間)
    @Input() resver_trust_data: any; // 預約信託帳號(過營業時間)
    @Input() set_trust: any; // 信託帳號
    @Input() fundSubject: any; // 投資基金標的
    @Input() fundStatus: any; // 紀錄基金狀態(國內、國外、精選、)
    @Input() resverFlag: boolean; // 是否轉預約
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

    showAcnt: Array<any>; // 顯示帳號選單
    minDay = '';      // 日期可選之最小值
    maxDay = '';      // 日期可選之最大值
    nowToResver = false;
    nowPage = 'single_edit_1'; // 顯示哪一頁
    showCheck = true; // 是否打勾
    showDisable_twd = false;
    showDisable_frgn = false;
    item = {}; // 選擇的扣款帳號(台幣)，綁ngModel

    //sales = []; //  銷售人員資訊，整理過
    //intro = []; //  轉借人員資訊，整理過
    _sales = []; //  銷售人員資訊
    _intro = []; //  轉借人員資訊
    today = ''; // 預設今天
    today_clone = '';
    // 頁面錯誤訊息
    errorMsg = {
        amount: '',
        balance1: '',
        balance2: ''
    };

    // ngModel綁定
    inp_data = {
        twAcntNo: '', // 台幣轉出帳號
        frgnNo: '', // 外幣轉出帳號
        trustNo: '', // 信託帳號
        amount: '', // 金額
        currType: '', // 台幣：1，外幣：2
        date: '', // 申購日期
        sales: '', // 理財專員
        intro: '' // 轉借人員
    };
    agree1 = false;
    agree2 = false;
    agree3 = false;
    // *送往下一頁的值，使用者輸入
    singleReq = {
        custId: '',
        trustAcnt: '', // 信託帳號
        fundCode: '', // 基金代碼
        currType: '', // 台幣：1，外幣：2
        amount: '', // 金額
        payAcnt: '', // 轉出帳號(外幣)
        salesId: '', // 銷售行員ID
        salesName: '', // 銷售行員姓名
        introId: '', // 轉借人員ID
        introName: '', // 轉借人員姓名
        date: '', // 申購日期
        sLossCD: '-', //停損點正負號 (固定為-)
        sLoss: '', //停損點
        sProCD: '+', //停利點正負號 (固定為+)
        sPro: '', //停利點
        notiCD: '' //通知設定
    };
    autoFlag = false;
    immFlag = false;
    emailFlag = false;

    // ----------- 單筆預約申購(預約)req --------------
    resverReq = {
        custId: '',
        trustAcnt: '',
        fundCode: '',
        currType: '',
        amount: '',
        payAcnt: '',
        salesId: '',
        salesName: '',
        introId: '',
        introName: '',
        effectDate: '',
        sLossCD: '-', //停損點正負號 (固定為-)
        sLoss: '', //停損點
        sProCD: '+', //停利點正負號 (固定為+)
        sPro: '', //停利點
        notiCD: '' //通知設定
    };

    //因2020/01/31家福於中台增加 branchName: 服務分行名稱，unitCall: 服務分行電話欄位，fi000404、fi000406電文需帶入確認頁送交易結果電文
    // new_Data = {
    //     branchName:'', //服務分行名稱 fi000401 res可取得
    //     unitCall: '' //服務分行電話 fi000401 res可取得
    // };

    // ----------- 檢查金額 --------------
    saveAmount = {};
    amount_error = ''; // 金額檢核錯誤訊息
    checkAmount = false; // 是否顯示紅框(金額)
    amountPlace = '';

    // ----------- 檢查日期 --------------
    saveDate = {};
    date_error = '';

    // ----------- 是否顯示紅框 -----------
    checkDate = false;
    check_trust = false;
    check_twAcnt = false;
    check_frgn = false;
    check_sales = false;
    check_intro = false;

    continue = true; // 續不續扣
    showFundBook = false; // 控制「基金公開說明書」checkbox
    showFundInfo = false; // 控制「基金通路資訊」checkbox

    // ----------- 停損停利設定(資訊，使用者輸入，綁ngModel) ----------
    // balanceData = {
    //     custId: '',
    //     details: {
    //         detail: [
    //             {
    //                 trustAcnt: '',
    //                 transCode: '',
    //                 fundCode: '',
    //                 capital: '',
    //                 incomePoint: '', // 停損點
    //                 profitPoint: '', // 獲利點
    //                 webNotice: 'N', // 即時(通知)
    //                 emailNotice: 'N', // email(通知)
    //                 code: '',
    //                 investType: '',
    //                 incomeState: ''
    //             }
    //         ]
    //     }
    // };

    // ----------- 接收fi000403基金申購申請 -----------
    purchaseInfo: any = {};
    screenTop;  // 初始螢幕高度

    range = []; //依照幣別存放下方陣列值
    TWD = ["10000", "20000", "30000", "40000", "50000"]; //新台幣對照規格，以萬元為單位
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

    oldCurrency = ''; //儲存前一頁外幣(舊)
    branchSelect = false; //是否顯示選擇分行頁面
    branch = ''; //分行代號-分行名稱
    salesindex = '';

    checkbranch  = '1'; // 1非空 ,2為空
    custBUId = '';

    //2020/01/30 新追加以下規則，對照表單規定，設定最小申請金額
    leastRange = ''; //為外幣時，需套用最低申請金額規則
    least_USD = '500'; //美元
    least_HKD = '5000'; //港幣
    least_GBP = '500'; //英鎊
    least_AUD = '500'; //澳幣
    least_SGD = '500'; //新加坡幣
    least_CHF = '500'; //瑞士法郎
    least_CAD = '500'; //加拿大幣
    least_JPY = '50000'; //日圓
    least_CNY = '10000'; //人民幣
    least_SEK = '5000'; //瑞典幣
    least_NZD = '500'; //紐西蘭幣
    least_EUR = '500'; //歐元
    least_ZAR = '5000'; //南非幣

    constructor(
        private _logger: Logger
        , private _headerCtrl: HeaderCtrlService
        , private _handleError: HandleErrorService
        , private _formateServcie: FormateService
        , private navgator: NavgatorService
        , private _checkService: CheckService
        , private _mainService: FundPurchaseSingleService
        , private infomationService: InfomationService
        , private alert: AlertService
        , private confirm: ConfirmService
        , private _uiContentService: UiContentService
        , private dateService: DateService
        , private device: DeviceService
        , private _searchStaffService: SearchStaffService
        , private _TagService: FundPurchaseTagService
    ) {

    }


    ngOnInit() {
        this.screenTop = document.body.scrollHeight;
        // this._logger.log('single_frgn_data_resver', this.single_frgn_data_resver, this.single_twAcnt_data_resver);
        // this._logger.log('過營業時間', this.resver_twAcnt_data, this.resver_frgn_data);
        // this._logger.log('this.set_trust', this.set_trust);
        // this._logger.log('resverFlag:', this.resverFlag);

        this.nowPage = 'single_edit_1';
        if (this.resverFlag == false) {
            this._headerCtrl.updateOption({
                'leftBtnIcon': 'back',
                'title': '基金單筆申購'
            });
            this.inp_data['trustNo'] = this.set_trust[0].trustAcntNo;

        } else {
            this._headerCtrl.updateOption({
                'leftBtnIcon': 'back',
                'title': '基金單筆申購(預約)'
            });
            this.inp_data['trustNo'] = this.resver_trust_data[0].trustAcntNo;

        }
        this._resetHeader();
        this._logger.log("into test set_trust:", this.set_trust);
        this._logger.log("* setInfo:", this.setInfo);
        this._logger.log("* resver_info:", this.resver_info);
        // this.new_Data['branchName'] = this.setInfo['branchName'];
        // this.new_Data['unitCall'] = this.setInfo['unitCall'];
        // this._logger.log("new_Data:",this.new_Data);
        if (this.setInfo['custBUId'] == '' || this.resver_info['custBUId'] == ''  || this.setInfo['custBUId'] === null ||
        this.resver_info['custBUId'] === null ) {
            this.checkbranch = '2';
        } else {
            if (this.resverFlag == false) {
            this.branch = this.setInfo['custBUId'];
            this.inp_data.sales = this.setInfo['custFPId'];
            // this.inp_data['sales']['salesId'] = this.setInfo['custFPId'];
            this._intro = this._mainService.intro_sort(this.set_trust);
            this._sales = this._mainService.sales_sort(this.set_trust);
            this.salesindex = this._sales.findIndex(obj => obj.salesId == this.setInfo['custFPId']).toString();
            } else {
                this.branch = this.resver_info['custBUId'];
                this.inp_data.sales = this.resver_info['custFPId'];
                // this.inp_data['sales']['salesId'] = this.setInfo['custFPId'];
                this._intro = this._mainService.intro_sort(this.resver_trust_data);
                this._sales = this._mainService.sales_sort(this.resver_trust_data);
                this.salesindex = this._sales.findIndex(obj => obj.salesId == this.resver_info['custFPId']).toString();
            }

            // if (index == -1) {
            //     this.inp_data['sales']['salesName'] = '';
            // } else {
            //     this.inp_data['sales']['salesName'] = this._sales[index]['introName'];
            // }

        }

        // this._logger.log("fundSubject:", this.fundSubject);
        // 2019/08/21 402電文(投資標的)計價幣別如果是「外幣」，台外幣都可以選，為「台幣」只允許選擇台幣(disable外幣)，投資金額元拿掉(顯示幣別) ex: 投資金額(USD)
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
        //剛進頁面預設台幣
        this.fundSubject['currency'] = 'TWD';
        this.currencyRule();
        this._logger.log("range:", this.range);

        // 將信託帳號，傳給request
        this.singleReq['trustAcnt'] = this.inp_data['trustNo'];
        //非預約
        // if (this.resverFlag == false) {
        //     // 整理轉售人員資料
        //     this.intro = this._mainService.intro_sort(this.set_trust);
        //     // 整理銷售人員資料
        //     this.sales = this._mainService.sales_sort(this.set_trust);
        //預約
        // } else {
        //     this.intro = this._mainService.intro_sort(this.resver_trust_data);
        //     this.sales = this._mainService.sales_sort(this.resver_trust_data);
        // }
        // this._logger.log("into test intro:", this.intro);
        // this._logger.log("into test sales:", this.sales);
        // 將基金代碼帶入
        this.singleReq['fundCode'] = this.fundSubject['fundCode'];
        // 抓取今天時間，帶入預設日期
        let dateType = '';
        if (this.resverFlag == true) {
            dateType = 'resver';
        } else {
            dateType = 'single';
        }
        this.today = this._mainService.setToday(dateType);
        this.inp_data['date'] = this.today;

        const date_data = this._checkService.getDateSet({
            baseDate: 'today', // 基礎日
            rangeType: 'M', // "查詢範圍類型" M OR D
            rangeNum: '6', // 查詢範圍限制
            rangeDate: '' // 比較日
        }, 'future');
        this.today_clone = this._formateServcie.transClone(this.today).replace(/-/g, '/');
        this._logger.log('this.today_clone', this.today_clone);
        this.maxDay = date_data.maxDate;
        this.minDay = date_data.minDate;

        // 如果是預約 最小日需重新設定
        if (this.resverFlag) {
            this.minDay = this.today;
        }

        this.checkShowAcnt(); // 檢查顯示帳號選單
    }

    /**
     * 日期選擇返回事件
     * @param e
     */
    onInputBack(e) {
        // this._logger.log('1', this.inp_data.date, this.today, this.today_clone)
        if (!this._checkService.checkSelectedDate(e, this.today_clone, '=', true)) {
            // this.nowToResver = true;
            this.resverFlag = true;
            this._logger.log("into not today");
            //02/14 手動切換預約申購，需發重發fi000401 type == '3'
            //判斷有無預約相關資訊，無帳號資料重發一次401 (手動切換)，有發過不再發
            if (this.resver_twAcnt_data.length <= 0) {
                this._logger.log("into resver_twAcnt_data.length ==0");
                let selectActData = {
                    custId: '',
                    trnsType: '3'
                };
                this.send401Type(selectActData).then(
                    (success) => {
                        this.checkDateFormate(); //處理日期、並檢查顯示帳號選單
                    },
                    (error) => {
                        this._handleError.handleError(error);
                        this.navgator.push('fund');
                    }
                );
            } else {
                this.checkDateFormate(); //處理日期、並檢查顯示帳號選單
            }
        } else {
            // this.nowToResver = false;
            this.resverFlag = false;
            this._logger.log("into today");
            this.checkDateFormate(); //處理日期、並檢查顯示帳號選單
        }
    }

    //手動切換超過今日，重發401 type:3
    send401Type(selectActData): Promise<any> {
        return this._TagService.getAccount(selectActData).then(
            (selectSuccess) => {
                this.resver_info = selectSuccess.info_data;
                this.resver_twAcnt_data = selectSuccess.twAcnt_data;
                this.resver_frgn_data = selectSuccess.frgn_data;
                this.resver_trust_data = selectSuccess.trust_data;
                return Promise.resolve(selectSuccess);
            },
            (selectError) => {
                this._logger.log("selectError 401 error");
                return Promise.reject(selectError);
            }
        );
    }

    checkDateFormate() {
        if (this.inp_data.date.indexOf('-') > 0) {
            this.inp_data.date = this.inp_data.date.replace(/-/g, '/');
        }
        // 確認this.inp_data.date被改變
        setTimeout(() => {
            this.checkShowAcnt(); // 檢查顯示帳號選單
        }, 5);
    }

    //幣別規則
    currencyRule() {
        //帶入幣別規則，由前一頁帶入幣別
        switch (this.fundSubject['currency']) {
            case 'TWD':
                this.range = this.TWD;
                this.leastRange = '10000'; //台幣為10000
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
            default: //預設
                this.range = [];
                this.leastRange = '0'; 
                break;
        }
    }

    /**
     * 點擊國內or國外
     * @param curr
     */
    selectCurr(curr) {
        // 國內
        if (this.fundStatus.foreginType == '1') {
            // this._logger.log("1");
            if (curr == 'twd') {
                this.inp_data['amount'] = '';
                this.showCheck = true;
                //切換台幣改計價幣別為TWD
                this.fundSubject['currency'] = 'TWD';
                this.currencyRule();
                this.errorMsg.amount = '';
                this._logger.log('line 145 into type1 twd');
                // 2019/08/21 新規則不需判斷前一頁，選擇國外or國內，來限制選擇幣別
                // this.showDisable = false;
                this._logger.log('line 148 into type1 twd, showCheck:', this.showCheck);
                // 使用者反悔，將相反欄位清空，ex:點台幣，清空外幣
                this.singleReq.payAcnt = '';
                this.amountPlace = '請輸入金額';
            } else if (curr == 'forgen') {
                this.inp_data['amount'] = '';
                this._logger.log('line 150 into type1 forgen!');
                this.showCheck = false;
                this.fundSubject['currency'] = this.oldCurrency;
                this.currencyRule();
                this.errorMsg.amount = '';
                // 2019/08/21 新規則不需判斷前一頁，選擇國外or國內，來限制選擇幣別
                // this.showDisable = false;
                this._logger.log('line 155 into type1 forgen, showCheck:', this.showCheck);
                // 使用者反悔，將相反欄位清空，ex:點台幣，清空外幣
                this.singleReq.payAcnt = '';
                // 新規則無限制(國內也可選外幣)
                // this._handleError.handleError({
                //     type: 'dialog',
                //     title: 'POPUP.NOTICE.TITLE',
                //     content: 'CHECK.STRING.TWD_SUBJECT'
                // });
                this.amountPlace = '請輸入金額';
                // 點擊外幣判斷是否有外幣帳號
                if (this.resverFlag == false) {
                    if (!this.set_frgn || this.set_frgn.length < 1) {
                        this._handleError.handleError({
                            type: 'dialog',
                            title: '提醒您',
                            content: '請先臨櫃辦理約定「外幣轉出帳號」'
                        });
                        return false;
                    }
                } else {
                    if (this.single_frgn_data_resver.length < 1 && this.resver_frgn_data.length < 1 ||
                        (JSON.stringify(this.single_frgn_data_resver[0]) == "{}" || JSON.stringify(this.resver_frgn_data[0]) == "{}")) {
                        this._handleError.handleError({
                            type: 'dialog',
                            title: '提醒您',
                            content: '請先臨櫃辦理約定「外幣轉出帳號」'
                        });
                        return false;
                    }
                }
            }
            // 國外
        } else if (this.fundStatus.foreginType == '2') {
            // this._logger.log("2");
            if (curr == 'twd') {
                this.inp_data['amount'] = '';
                this._logger.log('line 174 into type2 twd');
                this.showCheck = true;
                //切換台幣改計價幣別為TWD
                this.fundSubject['currency'] = 'TWD';
                this.currencyRule();
                this.errorMsg.amount = '';
                // 2019/08/21 新規則不需判斷前一頁，選擇國外or國內，來限制選擇幣別
                // this.showDisable = false;
                this._logger.log('line 179 into type2 twd, showCheck:', this.showCheck);
                // 使用者反悔，將相反欄位清空，ex:點台幣，清空外幣
                this.singleReq.payAcnt = '';
                this.amountPlace = '請輸入金額';
            } else if (curr == 'forgen') {
                this.inp_data['amount'] = '';
                // this._logger.log("line 180 into type2 forgen!");
                this.showCheck = false;
                this.fundSubject['currency'] = this.oldCurrency;
                this.currencyRule();
                this.errorMsg.amount = '';
                // 2019/08/21 新規則不需判斷前一頁，選擇國外or國內，來限制選擇幣別
                // this.showDisable = false;
                this._logger.log('line 186 into type2 forgen, showCheck:', this.showCheck);
                // 點擊外幣判斷是否有外幣帳號
                if (this.resverFlag == false) {
                    if (!this.set_frgn || this.set_frgn.length < 1) {
                        this._handleError.handleError({
                            type: 'dialog',
                            title: '提醒您',
                            content: '請先臨櫃辦理約定「外幣轉出帳號」'
                        });
                        return false;
                    }
                } else {
                    this._logger.log(this.single_frgn_data_resver.length, this.resver_frgn_data.length);
                    if (this.single_frgn_data_resver.length < 1 && this.resver_frgn_data.length < 1 ||
                        (JSON.stringify(this.single_frgn_data_resver[0]) == "{}" || JSON.stringify(this.resver_frgn_data[0]) == "{}")) {
                        this._handleError.handleError({
                            type: 'dialog',
                            title: '提醒您',
                            content: '請先臨櫃辦理約定「外幣轉出帳號」'
                        });
                        return false;
                    }
                }
                // 使用者反悔，將相反欄位清空，ex:點台幣，清空外幣
                this.singleReq.payAcnt = '';
                this.amountPlace = '請輸入金額';
            }
        }
        // 確認this.inp_data.date被改變
        setTimeout(() => {
            this.checkShowAcnt(); // 檢查顯示帳號選單
        }, 5);
    }


    // 點擊確認
    // [TODO: 檢核待調整]
    onConfirm() {
        // this._logger.log("inp_data.twAcntNo:", this.inp_data.twAcntNo);
        // this._logger.log("inp_data.frgnNo:", this.inp_data.frgnNo);
        // this._logger.log("inp_data:", this.inp_data);
        // this._logger.log("inp_data:", this.inp_data.date);

        // 檢查風險屬性符合?
        // rtType：1,不可買RR4、RR5, rtType：2,不可買RR5
        if (this.setInfo['rtType'] == '1' && (this.fundSubject['risk'] == 'RR4' || this.fundSubject['risk'] == 'RR5')) {
            this.rangeCheck();
            return false;
        }
        if (this.setInfo['rtType'] == '2' && this.fundSubject['risk'] == 'RR5') {
            this.rangeCheck();
            return false;
        }

        // 檢查金額
        this.errorMsg.amount = '';
        this.saveAmount = this._checkService.checkMoney(this.inp_data.amount, {
            currency: 'POSITIVE',
            not_zero: false
        });
        // this._logger.log("saveAmount:", this.saveAmount);
        if (this.saveAmount['status'] == false || this.inp_data.amount == '') {
            // this._logger.log("saveAmount:", this.saveAmount);
            this.amount_error = this.saveAmount['msg'];
            this.errorMsg.amount = this.saveAmount['msg'];
            this.checkAmount = true;
            this.singleReq['amount'] = '';
            return false;
        } else {
            this.errorMsg.amount = '';
            this.checkAmount = false;
            this.singleReq['amount'] = this.inp_data['amount'];
        }

        // 檢查申購日期
        this.saveDate = this._checkService.checkDate(this.inp_data.date);
        // this._logger.log("saveDate:", this.saveDate);
        if (this.saveDate['status'] == false) {
            // this._logger.log("saveDate:", this.saveDate);
            this.date_error = this.saveDate['msg'];
            this.checkDate = true;
            this.singleReq['date'] = '';
        } else {
            this.checkDate = false;
            this.singleReq['date'] = this.saveDate['formate'];
        }


        let resver_date = this._mainService.check_date_resver(this.inp_data.date);
        // this._logger.log("resver_date:", resver_date);
        // 判斷是否要轉預約
        // 轉預約
        if (resver_date.status == true) {
            this.resverFlag = true;

            // 換api，塞req給 resverReq
            // this.resverReq['fundCode'] = this.singleReq['fundCode'];

            // 選擇日期小於今天
        } else if (resver_date.status == false && resver_date.msg !== 'today') {
            this.resverFlag = false;
            this.date_error = resver_date.msg;
            this.checkDate = true;
            // 選擇日期為今天
        } else if (resver_date.status == false && resver_date.msg == 'today') {
            this.resverFlag = false;
            this.date_error = '';
            this.checkDate = false;
        }

        // 檢查信託帳號
        // if (this.inp_data['trustNo'] == '') {
        //     this.check_trust = true;
        //     this.singleReq['trustAcnt'] = '';
        // } else {
        //     this.check_trust = false;
        //     this.singleReq['trustAcnt'] = this.inp_data['trustNo']['trustAcntNo'];
        // }


        if (this.showCheck == true) {
            this.singleReq['currType'] = '1';
            // 檢查扣款帳號(台幣)
            if (this.inp_data['twAcntNo'] == '') {
                this.check_twAcnt = true;
                this.singleReq['payAcnt'] = '';
            } else {
                this.check_twAcnt = false;
                this.singleReq['payAcnt'] = this.inp_data['twAcntNo']['twAcntNo'];
            }
            //投資金額 依照幣別來決定它的金額倍數，有錯跳錯誤紅框
            if (parseInt(this.inp_data['amount']) % parseInt(this.range[0]) != 0 || this.inp_data['amount'] == '') {
                this._logger.log("into amount curreny error!");
                this.errorMsg.amount = '輸入需為幣別單位' + this.range[0];
                return false;
            } else {
                this.errorMsg.amount = '';
            }
            // 不得低於最低投資金額
            // 台幣(國內標的)不可低於10000
            if (this.fundStatus['foreginType'] == '1') {
                // tslint:disable-next-line:radix
                if (parseInt(this.inp_data['amount']) < 10000 || this.inp_data['amount'] == '') {
                    this.errorMsg.amount = '您的申購金額不得低於最低投資金額';
                    this.alert.show('您的申購金額不得低於最低投資金額 TWD:10000', {
                        title: '提醒您',
                        btnTitle: '我知道了',
                    }).then(
                        () => {
                        }
                    );
                    // 達到最低金額
                } else {
                    if (this.singleReq['amount'] && this.singleReq['date'] && this.checkDate == false
                        && this.inp_data['twAcntNo'] !== '' && this.inp_data['trustNo'] !== ''
                    ) {
                        // 做date formate為request日期格式
                        let dateObj = this._mainService.mappingDate_req(this.singleReq['date']);
                        if (dateObj.status == true) {
                            this.singleReq['date'] = dateObj.data;
                        }
                        this.nowPage = 'single_edit_2';
                        // this._logger.log("singleReq:", this.singleReq);
                        // this._logger.log("inp_data", this.inp_data);
                        // this._logger.log("check success");
                    } else {
                        this._logger.log('check failed');
                        // this._logger.log("this.singleReq['amount']:", this.singleReq['amount']);
                        // this._logger.log("this.singleReq['date']:", this.singleReq['date']);
                        // this._logger.log("this.checkDate:", this.checkDate);
                        // this._logger.log("this.inp_data['twAcntNo']:", this.inp_data['twAcntNo']);
                        // this._logger.log("this.inp_data['trustNo']:", this.inp_data['trustNo']);
                        return false;
                    }
                }
            }
            // 台幣(國外標的)不可低於10000
            if (this.fundStatus['foreginType'] == '2') {
                // tslint:disable-next-line:radix
                if (parseInt(this.inp_data['amount']) < 10000 || this.inp_data['amount'] == '') {
                    this.errorMsg.amount = '您的申購金額不得低於最低投資金額';
                    this.alert.show('您的申購金額不得低於最低投資金額 TWD:10000', {
                        title: '提醒您',
                        btnTitle: '我知道了',
                    }).then(
                        () => {
                        }
                    );
                    // 達到最低金額
                } else {
                    if (this.singleReq['amount'] !== '' && this.singleReq['date'] !== '' && this.checkDate == false
                        && this.inp_data['twAcntNo'] !== '' && this.inp_data['trustNo'] !== '') {
                        // 做date formate為request日期格式
                        let dateObj = this._mainService.mappingDate_req(this.singleReq['date']);
                        if (dateObj.status == true) {
                            this.singleReq['date'] = dateObj.data;
                        }
                        this.nowPage = 'single_edit_2';
                        // this._logger.log("singleReq:", this.singleReq);
                        // this._logger.log("inp_data", this.inp_data);
                    } else {
                        return false;
                    }
                }
            }

        } else {
            this.singleReq['currType'] = '2';
            // 檢查扣款帳號(外幣)
            if (this.inp_data['frgnNo'] == '') {
                this.check_frgn = true;
                this.singleReq['payAcnt'] = '';
            } else {
                this.check_frgn = false;
                this.singleReq['payAcnt'] = this.inp_data['frgnNo']['frgnAcntNo'];
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
            if (this.singleReq['amount'] !== '' && this.singleReq['date'] !== '' && this.checkDate == false
                && this.inp_data['frgnNo'] !== '' && this.inp_data['trustNo'] !== '') {
                // 做date formate為request日期格式
                let dateObj = this._mainService.mappingDate_req(this.singleReq['date']);
                if (dateObj.status == true) {
                    this.singleReq['date'] = dateObj.data;
                }
                // 最後檢核如果不轉預約，切換下一頁
                this.nowPage = 'single_edit_2';
                // this._logger.log("singleReq:", this.singleReq);
                // this._logger.log("inp_data", this.inp_data);
            } else {
                return false;
            }
            // }
        }
    }

    /**
     * 點擊取消
     */
    onCancel() {
        this.navgator.push('fund-purchase');
        // this.onBackPageData({});
    }

    /**
     * 點擊上一步
     */
    onBack() {
        this.onBackPageData({});
    }

    private rangeCheck() {
        // tslint:disable-next-line:max-line-length
        this.confirm.show('您本次欲申購/轉入的基金「' + this.fundSubject['fundCode'] + this.fundSubject['fundName'] + '(' + this.fundSubject['risk'] + ')' + '」，其風險等級為' + this.fundSubject['risk']
            + '，已較您投資屬性之風險承受度高，本行依主管機關規定，當您購買商品風險等級超出您的投資屬性之風險承受度時(如下)，將不可進行交易。\n'
            + '*保守型客戶不可購買風險等級為RR4-RR5之商品。\n' + '*穩健型客戶不可購買風險等級為RR5之商品。請點選下方按鈕進行「風險承受度測驗」後，再重新進行基金下單交易。', {
                title: '提醒您',
                btnYesTitle: '風險承受度測驗',
                btnNoTitle: '取消'
            }).then(
                () => {
                    // 繼續(popup)內層
                    // 跳轉風險成受度測驗
                    this.navgator.push('fund-group-resk-test');
                },
                () => {
                    // 離開(popup)內層
                    this.navgator.push('fund');
                }
            );
        return false;
    }


    // ---------------------------------- 編輯頁2 ------------------------------------------

    //新：
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

    //點擊繼續扣款，此項目前不會被呼叫，單筆申購自動贖回，比照客戶需求，無續不續扣問題
    onContinue(use) {
        if (use == 'Y') {
            this.continue = true;
        } else {
            this.continue = false;
        }
    }


    //舊：
    // 選擇通知/出場方式
    // onNotice(notice) {
    //     switch (notice) {
    //         case 'auto':
    //             // this._logger.log("line 329 into auto!");
    //             // 點自動贖回，如果其他有開著，全部關閉
    //             if (this.autoFlag == false) {
    //                 this.autoFlag = true;
    //                 if (this.immFlag == true || this.emailFlag == true) {
    //                     this.immFlag = false;
    //                     this.emailFlag = false;
    //                 }
    //             } else {
    //                 this.autoFlag = false;
    //             }
    //             break;
    //         case 'imm':
    //             // this._logger.log("line 337 into imm!");
    //             // 如果自動贖回勾著，其他的不能選
    //             if (this.autoFlag == true) {
    //                 this.immFlag = false;
    //             } else {
    //                 // 正常開關
    //                 if (this.immFlag == false) {
    //                     this.immFlag = true;
    //                     this.balanceData['details']['detail'][0]['webNotice'] = 'Y';
    //                 } else {
    //                     this.immFlag = false;
    //                     this.balanceData['details']['detail'][0]['webNotice'] = 'N';
    //                 }
    //             }
    //             break;
    //         case 'email':
    //             // this._logger.log("line 345 into email!");
    //             if (this.autoFlag == true) {
    //                 this.emailFlag = false;
    //             } else {
    //                 if (this.emailFlag == false) {
    //                     this.emailFlag = true;
    //                     this.balanceData['details']['detail'][0]['emailNotice'] = 'Y';
    //                 } else {
    //                     this.emailFlag = false;
    //                     this.balanceData['details']['detail'][0]['emailNotice'] = 'N';
    //                 }
    //             }
    //             break;
    //     }
    // }

    // 點擊繼續扣款
    // onContinue(use) {
    //     if (use == 'Y') {
    //         this.continue = true;
    //     } else {
    //         this.continue = false;
    //     }
    // }

    // 點擊下一步
    onNext() {
        //損益設定，通知設定相關
        this._logger.log("edit2 nextpage regularReq:", this.singleReq);
        //判斷出場通知
        //自動贖回
        if (this.autoFlag == true) {
            this.singleReq['notiCD'] = '1';
            //即時畫面
        } else if (this.immFlag == true && this.emailFlag == false) {
            this.singleReq['notiCD'] = '2';
            this.singleReq['continue'] = ''; //續扣清空
            //E-mail    
        } else if (this.emailFlag == true && this.immFlag == false) {
            this.singleReq['notiCD'] = '3';
            this.singleReq['continue'] = ''; //續扣清空
            //即時畫面 + E-mail
        } else if (this.immFlag == true && this.emailFlag == true) {
            this.singleReq['notiCD'] = '4';
            this.singleReq['continue'] = ''; //續扣清空
        } else if (this.autoFlag == false && this.immFlag == false && this.emailFlag == false) {
            this.singleReq['notiCD'] = '';
            this.singleReq['continue'] = '';
        }
        //是否繼續扣款
        if (this.continue == true && this.autoFlag == true) {
            this.singleReq['continue'] = 'Y';
        } else if (this.continue == false && this.autoFlag == true) {
            this.singleReq['continue'] = 'N';
        }


        // 檢核理財專員
        if (this.inp_data['sales'] == '') {
            this.check_sales = true;
            this.singleReq['salesId'] = '';
            this.singleReq['salesName'] = '';
        } else {
            this.check_sales = false;
            // this.singleReq['salesId'] = this.inp_data['sales']['salesId'];
            // this.singleReq['salesName'] = this.inp_data['sales']['salesName'];
            if (this.checkbranch == '2') {
                this.singleReq['salesId'] = this.inp_data['sales']['pid'];
                this.singleReq['salesName'] = this.inp_data['sales']['name'];
            } else if (this.checkbranch == '1') {
                if (this.salesindex == '-1') {
                    this.singleReq['salesId'] = this.inp_data.sales;
                    this.singleReq['salesName'] = '';
                }else {
                    this.singleReq['salesId'] = this.inp_data.sales;
                    this.singleReq['salesName'] = this._sales[this.salesindex]['salesName'];
                }
                }
        }
        // this._logger.log("line 249:", this.singleReq);

        // 檢查銷售行員
        if (this.inp_data['intro'] == '') {
            this.check_intro = true;
            this.singleReq['introId'] = '';
            this.singleReq['introName'] = '';
        } else {
            this.check_intro = false;
            // this.singleReq['introId'] = this.inp_data['intro']['introId'];
            // this.singleReq['introName'] = this.inp_data['intro']['introName'];
            if (this.checkbranch == '2') {
                this.singleReq['introId'] = this.inp_data['intro']['pid'];
                this.singleReq['introName'] = this.inp_data['intro']['name'];
            } else if (this.checkbranch == '1') {
                this.singleReq['introId'] = this.inp_data['intro']['introId'];
                this.singleReq['introName'] = this.inp_data['intro']['introName'];
            }
        }

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

        // 都成功才進下一頁
        // 20190626 依合庫需求改為非必填，請參考文件:轉置案UAT問題追蹤表@20190625.xls-問題編號353
        // if (this.inp_data['sales'] !== '' && this.inp_data['intro'] !== '') {
        // if (this.inp_data['intro'] !== '') {
        this.nowPage = 'single_edit_3';
        //     this._logger.log("line 423 balanceData:", this.balanceData);
        // } else {
        //     return false;
        // }
    }

    // 編輯頁2點擊，上一步
    onBackEdit1() {
        // this._logger.log("into edit2 back!");
        this.nowPage = 'single_edit_1';
    }

    // ---------------------------------- 編輯頁3 ------------------------------------------
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

        let urlstr = "https://tcbbankfund.moneydj.com/w/CustFundIDMap.djhtm?FUNDID=" + this.fundSubject['fundCode'] + '&FILE=21'
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
            this.agree1 = !this.agree1;
        } else if (type == '2') {
            this.agree2 = !this.agree2;
        } else if (type == '3') {
                this.agree3 = !this.agree3;
        }

    }

    // 點擊確認
    onConfirm3(fundBook, fundInfo) {
        // logger.error(this.agree1, this.agree2, 'ths.agrees')
        // 非預約，走即時單筆申購電文 fi000403
         if (this.agree1 == true && this.agree2 == true && this.agree3 == true && this.resverFlag == false) {
            //送出後停損or停利為空 帶000
            if (this.singleReq['sLoss'] == '') {
                this.singleReq['sLoss'] = '000';
            }
            if (this.singleReq['sPro'] == '') {
                this.singleReq['sPro'] = '000';
            }
            // this._logger.log("line 294 go confirm page!!!");
            this._logger.log("before send 403, singleReq:", this._formateServcie.transClone(this.singleReq));
            this._mainService.getFundPurchase(this.singleReq).then(
                (result) => {
                    this.purchaseInfo = result.info_data;
                    // this.purchaseInfo['branchName'] = this.setInfo['branchName']; //2020/01/31 家福提出新增欄位 服務分行名稱
                    // this.purchaseInfo['unitCall'] = this.setInfo['unitCall']; //2020/01/31 家福提出新增欄位 服務分行電話
                    // 切換至確認頁
                    this.nowPage = 'singleConfirm';
                    this._logger.log("line 303, purchaseInfo:", this.purchaseInfo);
                },
                (errorObj) => {
                    this._handleError.handleError(errorObj);
                    this.navgator.push('fund');
                }
            );
            // 預約，走預約申購電文 fi000405
        } else if (this.agree1 == true && this.agree2 == true && this.agree3 == true && this.resverFlag == true) {
            //送出後停損or停利為空 帶000
            if (this.singleReq['sLoss'] == '') {
                this.singleReq['sLoss'] = '000';
            }
            if (this.singleReq['sPro'] == '') {
                this.singleReq['sPro'] = '000';
            }
            this.resverReq['trustAcnt'] = this.singleReq['trustAcnt'];
            this.resverReq['fundCode'] = this.singleReq['fundCode'];
            this.resverReq['currType'] = this.singleReq['currType'];
            this.resverReq['amount'] = this.singleReq['amount'];
            this.resverReq['payAcnt'] = this.singleReq['payAcnt'];
            this.resverReq['salesId'] = this.singleReq['salesId'];
            this.resverReq['salesName'] = this.singleReq['salesName'];
            this.resverReq['introId'] = this.singleReq['introId'];
            this.resverReq['introName'] = this.singleReq['introName'];
            this.resverReq['effectDate'] = this.singleReq['date'];
            this.resverReq['notiCD'] = this.singleReq['notiCD'];
            this.resverReq['sLossCD'] = this.singleReq['sLossCD'];
            this.resverReq['sLoss'] = this.singleReq['sLoss'];
            this.resverReq['sProCD'] = this.singleReq['sProCD'];
            this.resverReq['sPro'] = this.singleReq['sPro'];;
            // this._logger.log("resverReq:", this.resverReq);
            this._logger.log("before send 405, resverReq:", this._formateServcie.transClone(this.resverReq));
            this._mainService.getResverPurchase(this.resverReq).then(
                (result) => {
                    this.purchaseInfo = result.info_data;
                    // this.purchaseInfo['branchName'] = this.resver_info['branchName']; //2020/01/31 家福提出新增欄位 服務分行名稱
                    // this.purchaseInfo['unitCall'] = this.resver_info['unitCall']; //2020/01/31 家福提出新增欄位 服務分行電話
                    //切換至確認頁
                    this.nowPage = 'singleConfirm';
                    this._logger.log("line 303, purchaseInfo:", this.purchaseInfo);
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

    // 編輯頁3點擊取消
    onBackEdit2() {
        this.nowPage = 'single_edit_2';
        this.branchSelect = false;
    }


    /**
     * 子層返回事件(分頁)
     * @param e
     */
    onPageBackEvent(e) {
        this._logger.step('Deposit', 'onPageBackEvent', e);
        let page = 'list';
        let pageType = 'list';
        let tmp_data: any;
        let fundStatus: any;
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
            if (e.hasOwnProperty('fundStatus')) {
                fundStatus = e.fundStatus;
            }
        }

        if (page == 'purchase-tag' && pageType == 'back') {
            this.onBackPageData({});
        }
        if (page == 'confirm') {
            this.nowPage = 'single_edit_3';
        }
        // this._logger.log("page:", page);
        // this._logger.log("pageType:", pageType);
        // this._logger.log("tmp_data:", tmp_data);
        // this._logger.log("fundStatus:", fundStatus);
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
                //清空已選擇的選項
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
     * 失敗回傳
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(error_obj, page) {
        let output = {
            'page': 'list-item',
            'type': 'error',
            'data': error_obj
        };
        if (page == 'single-page') {
            output.page = page;
        }
        this._logger.error('ContentDetailResult get error', error_obj);
        this.errorPageEmit.emit(output);
    }



    /**
     * 返回上一層
     * @param item
     */
    onBackPageData(item?: any) {
        // 返回最新消息選單
        let output = {
            'page': 'purchase-single',
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

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    /**
     * 基金投資說明
     */
    investDesc() {
        this.device.devicesInfo().then(
            (deviceInfo) => {
                if (deviceInfo.platform.toLowerCase() == 'android') {
                    if (document.body.scrollHeight != this.screenTop) {
                        // logger.error('鍵盤開啟')
                        return false;
                    } else {
                        const set_data = new FundInvestDes();
                        this.infomationService.show(set_data);
                    }
                } else if (deviceInfo.platform.toLowerCase() == 'ios') {
                    if (document.body.scrollHeight != this.screenTop) {
                        // logger.error('鍵盤開啟')
                        return false;
                    } else {
                        const set_data = new FundInvestDes();
                        this.infomationService.show(set_data);
                    }
                }
            },
            (fail) => {

            }
        );
    }

    /**
     * 金額檢查
     */
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

    /**
     * 檢查顯示的帳號選單，且檢查資料是否在清單內
     * (基本上即期和預約選單沒差異，但目前先不調整傳入參數...)
     * 注意：即期選單過營業時間後無法取資料!
     */
    private checkShowAcnt() {
        // this._logger.step('FUND', 'checkShowAcnt do change', this._formateServcie.transClone(this.showAcnt)
        //     , this._formateServcie.transClone(this.inp_data.twAcntNo)
        //     , this._formateServcie.transClone(this.inp_data.frgnNo)
        // );
        let acnt_type = 'twAcntNo';
        let have_data: any;
        this.showAcnt = [];
        let isNow = (this._checkService.checkSelectedDate(this.inp_data.date, this.today, '=', true)
            || this._checkService.checkSelectedDate(this.inp_data.date, this.today_clone, '=', true)
        ) ? true : false;
        if (!!this.showCheck) {
            acnt_type = 'twAcntNo';
            this.showAcnt = this._formateServcie.transClone(this.set_twAcnt); // 統一使用即期帳號
            // 幣別選擇台幣
            // -- 超過營業時間判斷 -- //
            if (!!this.resver_twAcnt_data && this.resver_twAcnt_data.length > 0 && this.resverFlag == true) {
                // 強制轉預約
                this._logger.step('FUND', 'checkShowAcnt twAcntNo強制轉預約');
                this.showAcnt = this._formateServcie.transClone(this.resver_twAcnt_data);
            } else if (!!this.set_twAcnt && this.set_twAcnt.length > 0 && isNow && this.resverFlag == false) {
                // 即期
                this._logger.step('FUND', 'checkShowAcnt twAcntNo即期');
                this.showAcnt = this._formateServcie.transClone(this.set_twAcnt);
            } else {
                // 預約
                this._logger.step('FUND', 'checkShowAcnt twAcntNo預約');
                this.showAcnt = this._formateServcie.transClone(this.resver_twAcnt_data);
            }
            if (!!this.inp_data.twAcntNo && !!this.inp_data.twAcntNo['twAcntNo']) {
                have_data = this.inp_data.twAcntNo['twAcntNo'];
            }
        } else {
            acnt_type = 'frgnAcntNo';
            this.showAcnt = this._formateServcie.transClone(this.set_frgn); // 統一使用即期帳號
            // 幣別選擇外幣
            // -- 超過營業時間判斷 -- //
            if (!!this.resver_frgn_data && this.resver_frgn_data.length > 0 && this.resverFlag == true) {
                // 強制轉預約
                this._logger.step('FUND', 'checkShowAcnt frgnAcntNo強制轉預約');
                this.showAcnt = this._formateServcie.transClone(this.resver_frgn_data);
            } else if (!!this.set_frgn && this.set_frgn.length > 0 && isNow && this.resverFlag == false) {
                // 即期
                this._logger.step('FUND', 'checkShowAcnt frgnAcntNo即期');
                this.showAcnt = this._formateServcie.transClone(this.set_frgn);
            } else {
                // 預約
                this._logger.step('FUND', 'checkShowAcnt frgnAcntNo預約');
                this.showAcnt = this._formateServcie.transClone(this.resver_frgn_data);
            }
            if (!!this.inp_data.frgnNo && !!this.inp_data.frgnNo['frgnAcntNo']) {
                have_data = this.inp_data.frgnNo['frgnAcntNo'];
            }
        }
        // console.log(acnt_type, this.showAcnt, this.inp_data.twAcntNo );

        if (!!have_data) {
            // 檢查現有資料是否有已選項目
            this.showAcnt.forEach(item_acnt => {
                // console.log(item_acnt);
                if (!!item_acnt[acnt_type] && have_data == item_acnt[acnt_type]) {
                    // console.log('check', acnt_type, have_data, item_acnt);
                    // 指定變數
                    if (acnt_type == 'twAcntNo') {
                        this.inp_data.twAcntNo = item_acnt;
                    } else {
                        this.inp_data.frgnNo = item_acnt;
                    }
                    return;
                }
            });
        } else if (this.showAcnt.length == 1 && !!this.showAcnt[0]) {
            // 未選時預設選取
            if (acnt_type == 'twAcntNo') {
                this.inp_data.twAcntNo = this.showAcnt[0];
            } else {
                this.inp_data.frgnNo = this.showAcnt[0];
            }
        }
        // this._logger.step('FUND', 'checkShowAcnt do change end'
        //     , this._formateServcie.transClone(this.showAcnt)
        //     , this._formateServcie.transClone(this.inp_data.twAcntNo)
        //     , this._formateServcie.transClone(this.inp_data.frgnNo)
        // );

    }

    /**
     * 取消編輯
     */
    private cancelEdit() {
        this.confirm.cancelEdit({ type: 'edit' }).then(
            () => {
                // 返回投資理財選單
                // this.navgator.push('fund');
                this.onBack();
            },
            () => {
            }
        );
    }

    /**
     * 重設定header
     */
    private _resetHeader() {
        this._headerCtrl.setLeftBtnClick(() => {
            this.cancelEdit();
        });
    }

    selectBranch() {
        this.branchSelect = true;
    }
}
