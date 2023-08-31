/**
 * 定期不定額查詢異動內容頁
 */
import { Component, OnChanges, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ActivatedRoute } from '@angular/router';
import { SearchDepositAccountService } from '@pages/fund/shared/service/searchDepositAccount.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { FundPurchaseTagService } from '@pages/fund/shared/service/fund-purchase-tag.service';
import { FormateService } from '@shared/formate/formate.service';
import { FundInformation1 } from '@conf/terms/fund/fund-information1';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { FundInformation2 } from '@conf/terms/fund/fund-information2';
import { CheckService } from '@shared/check/check.service';
import { AuthService } from '@core/auth/auth.service';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { NumberUtil } from '@shared/util/formate/number/number-util';
import { DateSelectService } from '@shared/popup/date-select-popup/date-select.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { flatMap } from 'rxjs/operators';
import { FI000401ApiService } from '@api/fi/fI000401/fI000401-api.service'; // alex0520

@Component({
  selector: 'app-pay-change-content',
  templateUrl: './pay-change-content.component.html',
  styleUrls: [],
  providers: [
    SearchDepositAccountService,
    FundPurchaseTagService,
    FormateService,
  ]
})
export class PayChangeContentComponent implements OnInit, OnChanges {
  @Input() setData: any;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  private regularResult401: any; // fi000401 response
  sendData: any;
  nowPageType: any = 'editPage'; // 頁面切換
  showContent = false; // false: 編輯頁, true 基金選擇頁
  showSetContent = false; // false: 基金選擇頁, true 設定頁
  showAgreeContent = false; // false: 設定頁, true 條款確認頁
  contentConfirmBox = false; // false: 條款確認頁, true 資料確認頁
  newsNo: any = ''; // 消息編號
  unitType: string;
  trnsInAccts = []; // 轉入帳號
  trnsOutAccts = []; // 轉出扣款帳號
  nowOutType: any = {
    trnsfrOutAccnt: ''
  };
  nowInType: any = {
    trnsfrInAccnt: ''
  };
  fundTypeName: string;
  fundName: string;
  fundCode: string;
  debitStatus: string;
  debitStatusName: string;
  purchAmnt: string;
  radioVal: any = '2';
  errorMsg = {
    money: ''
  };

  fullData: any = {
    trnsRsltCode: '' // trnsRsltCode	交易結果代碼
    , hostCode: '' // hostCode	交易結果
    , hostCodeMsg: '' // hostCodeMsg	主機代碼訊息
    , trnsToken: '' // 交易控制碼
    , custId: '' // custId	身分證字號
    , trustAcnt: '' // trustAcnt	信託帳號
    , transCode: '' // transCode	交易編號
    , fundCode: '' // fundCode	基金代碼
    , fundType: '' // fundType	業務別
    , payDate1: '' // payDate1	每月扣款日期1
    , payDate2: '' // payDate2	每月扣款日期2
    , payDate3: '' // payDate3	每月扣款日期3
    , payDate4: '' // payDate4	每月扣款日期4
    , payDate5: '' // payDate5	每月扣款日期5
    , payAcnt: '' // payAcnt	定期定額扣款帳號
    , profitAcnt: '' // profitAcnt	現金收益存入帳號
    , breakFlag: '' // breakFlag	定期定額終止扣款註記
    , INCurrency: '' // INCurrency 投資幣別
    , purchAmnt: '' // purchAmnt	定期定額申購金額
    , cost: ''  //每次扣款金額
    , code: '' // 套餐代碼 空白:定期定額 / 非空白:定期不定額-(01:前五營業日淨值, 02:前五日平均值)
    , VACurrency: '' // 計價幣別
    , payDate31: '' // 扣款日期 (1~31)
    , payDate5W: '' // 每週扣款(1~5)
    , evaCD: '' // 評價方式
    , evaCDText: '' // 評價方式
    , decline1Cd: '+' // 跌幅級距1 (-5 ~ -10) 加減碼 (-/+)
    , decline1: '' // 跌幅級距1 (-5 ~ -10)
    , decline2Cd: '+' // 跌幅級距2 (-5 ~ -10) 加減碼 (-/+)
    , decline2: '' // 跌幅級距2 (-5 ~ -10)
    , decline3Cd: '+' // 跌幅級距3 (-5 ~ -10) 加減碼 (-/+)
    , decline3: '' // 跌幅級距3 (-5 ~ -10)
    , decline4Cd: '+' // 跌幅級距4 (-5 ~ -10) 加減碼 (-/+)
    , decline4: '' // 跌幅級距4 (-5 ~ -10)
    , decline5Cd: '+' // 跌幅級距5 (-5 ~ -10) 加減碼 (-/+)
    , decline5: '' // 跌幅級距5 (-5 ~ -10)
    , gain1Cd: '+' // 漲幅級距1 (-5 ~ -10) 加減碼 (-/+)
    , gain1: '' // 跌幅級距1 (-5 ~ -10)
    , gain2Cd: '+' // 漲幅級距2 (-5 ~ -10) 加減碼 (-/+)
    , gain2: '' // 跌幅級距2 (-5 ~ -10)
    , gain3Cd: '+' // 漲幅級距3 (-5 ~ -10) 加減碼 (-/+)
    , gain3: '' // 跌幅級距3 (-5 ~ -10)
    , gain4Cd: '+' // 漲幅級距4 (-5 ~ -10) 加減碼 (-/+)
    , gain4: '' // 跌幅級距4 (-5 ~ -10)
    , gain5Cd: '+' // 漲幅級距5 (-5 ~ -10) 加減碼 (-/+)
    , gain5: '' // 跌幅級距5 (-5 ~ -10)

  };

  //檢核漲跌幅級距
  checkGain = {
    decline1: false,
    decline1_msg: '',
    decline2: false,
    decline2_msg: '',
    decline3: false,
    decline3_msg: '',
    decline4: false,
    decline4_msg: '',
    decline5: false,
    decline5_msg: '',
    gain1: false,
    gain1_msg: '',
    gain2: false,
    gain2_msg: '',
    gain3: false,
    gain3_msg: '',
    gain4: false,
    gain4_msg: '',
    gain5: false,
    gain5_msg: '',
    decline_status: false,
    gain_status: false
  };
  //最低金額
  leastAmount = '';

  ori: any = {};
  // defaultInAccount: string;
  // detaultOutAccount: string;

  // request
  userAddress = {
    'USER_SAFE': '',
    'SEND_INFO': ''
  };
  // 日期變數 start
  today = new Date();
  dd = String(this.today.getDate()).padStart(2, '0');
  mm = String(this.today.getMonth() + 1).padStart(2, '0');
  yyyy = this.today.getFullYear();
  todate = this.yyyy + '/' + this.mm + '/' + this.dd;
  TWtodate = '';

  // ====================== 基金選擇頁變數 start ============================
  req: any = {
    custId: '', // 身分證字號
    investType: '', // 交易別
    fundType: '', // 交易別，判斷 A:單筆、B:小額(定期定額)、C:轉換、D:小額(定期不定額)
    selectfund: '', // 是否精選
    compCode: '', // 基金公司代碼
    fundCode: '', // 轉出基金代碼\
  };
  search = '';
  // ====================== 基金選擇頁變數 end ============================
  // ====================== 設定頁變數 start ============================
  setRadio = '1'; // 1:月 2:週
  dateFlag = false;
  dateArr: any = [];
  showDateStr = '請選擇';
  regular_trust_data: any = []; // 小額,信託帳號列表
  nowSales: any;
  nowIntro: any;
  salesArr = [];
  introArr = [];
  salesChangeFlag = false;
  trnsferWeek = [
    { num: '1', zw: '週一' },
    { num: '2', zw: '週二' },
    { num: '3', zw: '週三' },
    { num: '4', zw: '週四' },
    { num: '5', zw: '週五' }
  ];
  // ====================== 設定頁變數 end ============================
  // ====================== 漲跌幅級距頁面 start ============================
  showVaryFlag: true;
  varyIcon = ['+', '-'];
  // 漲跌幅之幣別對比資料
  declineAndGainList = [
    { currency: 'TWD', data: [1000, 2000, 3000, 4000, 5000] },
    { currency: 'USD', data: [100, 200, 300, 400, 500] },
    { currency: 'AUD', data: [100, 200, 300, 400, 500] },
    { currency: 'CAD', data: [100, 200, 300, 400, 500] },
    { currency: 'CHF', data: [100, 200, 300, 400, 500] },
    { currency: 'EUR', data: [100, 200, 300, 400, 500] },
    { currency: 'GBP', data: [100, 200, 300, 400, 500] },
    { currency: 'HKD', data: [1000, 2000, 3000, 4000, 5000] },
    { currency: 'JPY', data: [10000, 20000, 30000, 40000, 50000] },
    { currency: 'SEK', data: [1000, 2000, 3000, 4000, 5000] },
    { currency: 'CNY', data: [1000, 2000, 3000, 4000, 5000] },
    { currency: 'ZAR', data: [1000, 2000, 3000, 4000, 5000] },
    { currency: 'NZD', data: [100, 200, 300, 400, 500] },
    { currency: 'SGD', data: [100, 200, 300, 400, 500] }
  ];
  getVaryList = [];
  // ====================== 漲跌幅級距頁面 end ============================

  // ====================== 同意事項頁變數 start ============================
  agreeNote = {
    note1: false,
    note2: false,
    note3: false
  };
  // ====================== 同意事項頁變數 end ============================
  // ====================== 確認頁變數 start ============================
  resultData = {
    custId: '', // 身分證字號
    trustAcnt: '', // 信託帳號
    transCode: '', // 交易編號
    fundCode: '', // 基金代碼
    investAmntFlag: '', // 投資金額變更狀態
    investAmnt: '', // 投資金額
    payDateFlag: 'N', // 扣款日期變更狀態
    payDate1: '', // 扣款日期變更1
    payDate2: '', // 扣款日期變更2
    payDate3: '', // 扣款日期變更3
    payDate4: '', // 扣款日期變更4
    payDate5: '', // 扣款日期變更5
    payTypeFlag: '', // 扣款狀況變更
    changeBegin: '', // 變更起日
    changeEnd: '', // 變更迄日
    payAcntStatus: '', // 扣款帳號變更狀態
    payAcnt: '', // 扣款帳號
    profitAcntFlag: '', // 現金收益存入帳號變更狀態
    oriProfitAcnt: '', // 原現金收益存入帳號
    profitAcnt: '', // 現金收益存入帳號
    effectDate: '', // 生效日期
    INCurrency: '', // 投資幣別
    trnsToken: '', // 交易控制碼
    payFundFlag: 'N' // 投資基金變更狀態 (Y:變更 N:不變更)
    , payEvaFlag: 'Y' // 不定額漲跌變更狀態 (Y:變更 N:不變更)
    , newFund: '' // 新扣款基金代碼
    , payDate31: '' // 扣款日期 (1~31)
    , payDate5W: '' // 每週扣款(1~5)
    , decline1Cd: '+' // 跌幅級距1 (-5 ~ -10) 加減碼 (-/+)
    , decline1: '' // 跌幅級距1 (-5 ~ -10)
    , decline2Cd: '+' // 跌幅級距2 (-5 ~ -10) 加減碼 (-/+)
    , decline2: '' // 跌幅級距2 (-5 ~ -10)
    , decline3Cd: '+' // 跌幅級距3 (-5 ~ -10) 加減碼 (-/+)
    , decline3: '' // 跌幅級距3 (-5 ~ -10)
    , decline4Cd: '+' // 跌幅級距4 (-5 ~ -10) 加減碼 (-/+)
    , decline4: '' // 跌幅級距4 (-5 ~ -10)
    , decline5Cd: '+' // 跌幅級距5 (-5 ~ -10) 加減碼 (-/+)
    , decline5: '' // 跌幅級距5 (-5 ~ -10)
    , gain1Cd: '+' // 漲幅級距1 (-5 ~ -10) 加減碼 (-/+)
    , gain1: '' // 跌幅級距1 (-5 ~ -10)
    , gain2Cd: '+' // 漲幅級距2 (-5 ~ -10) 加減碼 (-/+)
    , gain2: '' // 跌幅級距2 (-5 ~ -10)
    , gain3Cd: '+' // 漲幅級距3 (-5 ~ -10) 加減碼 (-/+)
    , gain3: '' // 跌幅級距3 (-5 ~ -10)
    , gain4Cd: '+' // 漲幅級距4 (-5 ~ -10) 加減碼 (-/+)
    , gain4: '' // 跌幅級距4 (-5 ~ -10)
    , gain5Cd: '+' // 漲幅級距5 (-5 ~ -10) 加減碼 (-/+)
    , gain5: '' // 跌幅級距5 (-5 ~ -10)
  };
  agreeConfirmNote = false;

  // ====================== 同意事項頁變數 end ============================
  // =====================  安控變數 start =============================
  'SEND_INFO': '';
  transactionObj = {
    serviceId: 'FI000703',
    categoryId: '6', // 基金業務
    transAccountType: '1',
  };

  securityObj = {
    'action': 'init',
    'sendInfo': {}
  };

  safeE = {};
  // ====================  安控變數 end =============================

  //ngClass控制
  monthDisable = false;
  weekDisable = false;
  //取得帳號 *2019/10/18 修改
  OutAC = []; //扣款帳號
  InAC = []; //收益帳號
  df_trnsfrOutAccnt = ''; //扣款帳號 預設(fi000702)
  df_trnsfrInAccnt = ''; //收益帳號 預設(fi000702)
  please_trnsfrOutAccnt = false;
  please_trnsfrInAccnt = false;
  info_401: any = {}; // alex0520

  constructor(
    private _logger: Logger
    , private _handleError: HandleErrorService
    , private _headerCtrl: HeaderCtrlService
    , private navgator: NavgatorService
    , private route: ActivatedRoute
    , private _mainService: SearchDepositAccountService
    , private confirm: ConfirmService
    , private _fundAccount: FundPurchaseTagService
    , private _checkSecurityService: CheckSecurityService
    , private _formateService: FormateService
    , private infomationService: InfomationService
    , private _errorCheck: CheckService
    , private _authService: AuthService
    , private _dateSelect: DateSelectService
    , private alert: AlertService
    , private _checkService: CheckService
    , private _fi000401Service: FI000401ApiService // alex0520
  ) {
  }

  ngOnInit() {

    this._fi000401Service.getAgreeNew().then((resObj) => { // alex0520
      this.info_401 = resObj;
    });

    // --- 頁面設定 ---- //
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back'
    });
    this._headerCtrl.setLeftBtnClick(() => {
      this.onBackPageData();
    });
    // --- 頁面設定 End ---- //
    // 安控變數初始化
    this.securityObj = {
      'action': 'init',
      'sendInfo': this.userAddress.SEND_INFO
    };
    this.showVaryFlag = true;
    this.TWtodate = this._formateService.transDate(this.todate, { formate: 'yyyMMdd', chinaYear: true });
    this._logger.log("dateArr:", this.dateArr);
  }

  ngOnChanges() {
    this._logger.log('扣款狀態', this.setData);
    // debitStatus 空白:正常扣款, 'S':暫停扣款, 'T':終止扣款
    if (this.setData['debitStatus'] == '' || this.setData['debitStatus'] == null || this.setData['debitStatus'] == undefined) {
      this.radioVal = '1';
    } else {
      this.radioVal = '2';
    }
    this.getData();
  }

  //702
  private getData() {
    const reqData = {
      trustAcnt: this.setData.trustAcnt,
      transCode: this.setData.transCode,
      fundCode: this.setData.fundCode,
      cost: this.setData.cost
    };
    this._logger.log('FUND', 'content reqData: ', reqData);
    this._mainService.getData(reqData).then(
      (result) => {
        this._logger.step('FUND', 'result: ', result);
        this.fullData = result.info_data;
        if (this.fullData.trnsRsltCode == '1') {
          this._logger.step('FUND', '交易失敗 ');
          this.onErrorBackEvent(result);
          return false;
        }
        //disable條件，EX:預設為每周不可改為設定每月，如果預設為每月，反之
        if (this.fullData['payDate31'] !== '' && this.fullData['payDate31'] !== null) {
          this._logger.log("into payDate31:", this.fullData['payDate31']);
          this.weekDisable = true;
        } else if (this.fullData['payDate5W'] !== '' && this.fullData['payDate5W'] !== null) {
          this._logger.log("into payDate5W:", this.fullData['payDate5W']);
          this.monthDisable = true;
        }
        this.fundName = this.setData.fundName;
        this.fundCode = this.setData.fundCode;

        if ((typeof this.fullData.payDate31).toString() !== 'object' && this.fullData.payDate31.length > 0) {
          this.dateArr = this.fullData.payDate31.split(',');
          this.setRadio = '1';
          this.showDateStr = '每月' + this.dateArr.toString() + '日';
        } else if ((typeof this.fullData.payDate5W).toString() !== 'object' && this.fullData.payDate5W.length > 0) {
          this.dateArr = this.fullData.payDate5W.split(',');
          this.showDateStr = '';
          for (let i = 0; i < this.dateArr.length; i++) {
            if (i > 0) {
              this.showDateStr += ',';
            }
            for (let j = 0; j < this.trnsferWeek.length; j++) {
              if (this.trnsferWeek[j].num == this.dateArr[i]) {
                this.showDateStr += this.trnsferWeek[j].zw;
                break;
              }
            }
          }
          this.setRadio = '2';
        } else {
          if (this.fullData.payDate1 !== '00' && this.fullData.payDate1 !== '') {
            this.dateArr.push(parseInt(this.fullData.payDate1, 10));
          }
          if (this.fullData.payDate2 !== '00' && this.fullData.payDate2 !== '') {
            this.dateArr.push(parseInt(this.fullData.payDate2, 10));
          }
          if (this.fullData.payDate3 !== '00' && this.fullData.payDate3 !== '') {
            this.dateArr.push(parseInt(this.fullData.payDate3, 10));
          }
          if (this.fullData.payDate4 !== '00' && this.fullData.payDate4 !== '') {
            this.dateArr.push(parseInt(this.fullData.payDate4, 10));
          }
          if (this.fullData.payDate5 !== '00' && this.fullData.payDate5 !== '') {
            this.dateArr.push(parseInt(this.fullData.payDate5, 10));
          }
          this.setRadio = '1';
          this.showDateStr = '每月' + this.dateArr.toString() + '日';
        }
        this._logger.step('FUND', '取出this.dateArr: ', this.dateArr);
        let declineData = this._mainService.formateDecline(this.fullData, 'decline');
        let gainData = this._mainService.formateDecline(this.fullData, 'gain');

        // this.fullData.decline1 = (AmountUtil.amount(this.fullData.decline1, this.fullData.INCurrency)).replace(',', '');
        // this.fullData.decline2 = (AmountUtil.amount(this.fullData.decline2, this.fullData.INCurrency)).replace(',', '');
        // this.fullData.decline3 = (AmountUtil.amount(this.fullData.decline3, this.fullData.INCurrency)).replace(',', '');
        // this.fullData.decline4 = (AmountUtil.amount(this.fullData.decline4, this.fullData.INCurrency)).replace(',', '');
        // this.fullData.decline5 = (AmountUtil.amount(this.fullData.decline5, this.fullData.INCurrency)).replace(',', '');
        // this.fullData.gain1 = (AmountUtil.amount(this.fullData.gain1, this.fullData.INCurrency)).replace(',', '');
        // this.fullData.gain2 = (AmountUtil.amount(this.fullData.gain2, this.fullData.INCurrency)).replace(',', '');
        // this.fullData.gain3 = (AmountUtil.amount(this.fullData.gain3, this.fullData.INCurrency)).replace(',', '');
        // this.fullData.gain4 = (AmountUtil.amount(this.fullData.gain4, this.fullData.INCurrency)).replace(',', '');
        // this.fullData.gain5 = (AmountUtil.amount(this.fullData.gain5, this.fullData.INCurrency)).replace(',', '');

        this.fullData.decline1 = this.formateViewRange((AmountUtil.amount(declineData['decline1'], this.fullData.INCurrency)).replace(',', ''));
        this.fullData.decline2 = this.formateViewRange((AmountUtil.amount(declineData['decline2'], this.fullData.INCurrency)).replace(',', ''));
        this.fullData.decline3 = this.formateViewRange((AmountUtil.amount(declineData['decline3'], this.fullData.INCurrency)).replace(',', ''));
        this.fullData.decline4 = this.formateViewRange((AmountUtil.amount(declineData['decline4'], this.fullData.INCurrency)).replace(',', ''));
        this.fullData.decline5 = this.formateViewRange((AmountUtil.amount(declineData['decline5'], this.fullData.INCurrency)).replace(',', ''));
        this.fullData.gain1 = this.formateViewRange((AmountUtil.amount(gainData['gain1'], this.fullData.INCurrency)).replace(',', ''));
        this.fullData.gain2 = this.formateViewRange((AmountUtil.amount(gainData['gain2'], this.fullData.INCurrency)).replace(',', ''));
        this.fullData.gain3 = this.formateViewRange((AmountUtil.amount(gainData['gain3'], this.fullData.INCurrency)).replace(',', ''));
        this.fullData.gain4 = this.formateViewRange((AmountUtil.amount(gainData['gain4'], this.fullData.INCurrency)).replace(',', ''));
        this.fullData.gain5 = this.formateViewRange((AmountUtil.amount(gainData['gain5'], this.fullData.INCurrency)).replace(',', ''));
        this.fullData.evaCDText = (this.fullData.evaCD == '01') ? '前五營業日淨值/平均成本' : '前五日平均淨值/年平均淨值';

        this.fullData.decline1Cd = declineData['decline1Cd'];
        this.fullData.decline2Cd = declineData['decline2Cd'];
        this.fullData.decline3Cd = declineData['decline3Cd'];
        this.fullData.decline4Cd = declineData['decline4Cd'];
        this.fullData.decline5Cd = declineData['decline5Cd'];
        this.fullData.gain1Cd = gainData['gain1Cd'];
        this.fullData.gain2Cd = gainData['gain2Cd'];
        this.fullData.gain3Cd = gainData['gain3Cd'];
        this.fullData.gain4Cd = gainData['gain4Cd'];
        this.fullData.gain5Cd = gainData['gain5Cd'];

        this.ori.purchAmnt = parseInt(this.fullData.cost);
        this.ori.payTypeFlag = 'N'; //??暫用??
        this.ori.Date = this.fullData.temp_DebitDateStr;
        this.ori.payAcnt = this.fullData.payAcnt;
        this.ori.profitAcnt = this.fullData.profitAcnt;
        this.ori.declineAndGain = {
          "decline1Cd": this.fullData.decline1Cd,
          "decline1": this.fullData.decline1,
          "decline2Cd": this.fullData.decline2Cd,
          "decline2": this.fullData.decline2,
          "decline3Cd": this.fullData.decline3Cd,
          "decline3": this.fullData.decline3,
          "decline4Cd": this.fullData.decline4Cd,
          "decline4": this.fullData.decline4,
          "decline5Cd": this.fullData.decline5Cd,
          "decline5": this.fullData.decline5,
          "gain1Cd": this.fullData.gain1Cd,
          "gain1": this.fullData.gain1,
          "gain2Cd": this.fullData.gain2Cd,
          "gain2": this.fullData.gain2,
          "gain3Cd": this.fullData.gain3Cd,
          "gain3": this.fullData.gain3,
          "gain4Cd": this.fullData.gain4Cd,
          "gain4": this.fullData.gain4,
          "gain5Cd": this.fullData.gain5Cd,
          "gain5": this.fullData.gain5
        };

        this._logger.step('FUND', '取出this.fullData: ', this.fullData);
        this.setDeclineAndGainList(this.fullData.INCurrency);
        this.purchAmnt = AmountUtil.amount(this.fullData.purchAmnt, this.fullData.INCurrency);
        this.purchAmnt = this.purchAmnt.replace(',', '');
        // if (this.fullData.INCurrency == 'TWD' || this.fullData.INCurrency == 'NTD' || this.fullData.INCurrency == 'JPY') {
        //2020/06/11 所有幣別都清除小數點
        if (this.purchAmnt.indexOf('.') > -1) {
          this.purchAmnt = this.purchAmnt.substring(0, this.purchAmnt.indexOf('.'));
        }
        // }
        this._logger.log('fundType', this.fullData.fundType);
        if (this.fullData.fundType == 'C') {
          this.fundTypeName = '國內基金';
          this.req.fundType = 'C';
          this.search = '1';
        } else {
          this.fundTypeName = '國外基金';
          this.req.fundType = 'D';
          this.search = '2';
        }
        // this.getTWDList();
        this.getFundAccount(); //401
        this._logger.log('dataArr', this.dateArr);
      },
      (errorObj) => {
        this.onErrorBackEvent(errorObj);
      }
    );
  }
  //級距預設有小數點就去除
  formateViewRange(range) {
    let returnValue = '';
    if (range.indexOf('.') > -1) {
      returnValue = range.substring(0, range.indexOf('.'));
    }
    return returnValue;
  }

  // 取得漲跌幅之幣別對比資料
  setDeclineAndGainList(currency) {
    this.declineAndGainList.forEach(item => {
      if (item.currency == currency) {
        this.getVaryList = item.data;
      }
    });
    this._logger.step('FUND', '取得 this.getVaryList: ', this.getVaryList);
  }

  // 日期陣列元素整理(value無值則移除)
  removeLenZero(tempArr) {
    let j = 0;
    let outArr = [];
    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i].length != 0) {
        outArr[j] = tempArr[i];
        j += 1;
      }
    }
    return outArr;
  }

  // private getTWDList() {
  //   let r_data = {};
  //   r_data = this.fullData;
  //   // this.defaultInAccount = r_data['profitAcnt'];
  //   // this.detaultOutAccount = r_data['payAcnt'];
  //   this._twdService.getData('B', this.defaultInAccount, this.detaultOutAccount).then(
  //     (resObj) => {
  //       // this.trnsOutAccts = resObj.trnsOutAccts;
  //       // if (resObj['_defaultOutAccount']) {
  //       //   this.trnsOutAccts.unshift(resObj['_defaultOutAccount']);
  //       // }
  //       this._logger.step('FUND', 'this.trnsOutAccts: ', this.trnsOutAccts);
  //       // this.nowOutType = (typeof this.trnsOutAccts[0] !== 'undefined') ? this.trnsOutAccts[0] : {};
  //       // this.nowOutType.trnsfrOutAccnt = this.detaultOutAccount;
  //       // this._logger.log('  this.nowOutType', this.nowOutType, this.trnsOutAccts, this.detaultOutAccount);
  //       // this.trnsInAccts = resObj.trnsInAccts;
  //       // if (resObj['_defaultInAccount']) {
  //       //   this.trnsInAccts.unshift(resObj['_defaultInAccount']);
  //       // }
  //       // this.nowInType = (typeof this.trnsInAccts[0] !== 'undefined') ? this.trnsInAccts[0] : {};
  //       //2019/08/15 預設 現金收益帳號 修改
  //       // if (typeof this.fullData['profitAcnt'] !== 'undefined' || this.fullData['profitAcnt'] !== null) {
  //       //   let nowAct = {
  //       //     trnsfrInAccnt: ''
  //       //   }
  //       //   nowAct['trnsfrInAccnt'] = this.fullData['profitAcnt'];
  //       //   this.nowInType = nowAct;
  //       //   this.trnsInAccts.unshift(nowAct);
  //       //   this._logger.log("trnsInAccts:", this.trnsInAccts);
  //       // }
  //     },
  //     (errorObj) => {
  //       // this.onErrorBackEvent(errorObj);
  //     });
  // }

  private getFundAccount() {
    // 定期定額查詢 trnsType帶2 (小額申購)
    let fundAcnt = {
      custId: this.fullData.custId,
      trnsType: '2'
    };
    this._fundAccount.getAccount(fundAcnt).then(
      (regularResult) => {
        this.regularResult401 = this._formateService.transClone(regularResult);
        this._logger.log("0. regularResult:", regularResult);
        this.regular_trust_data = regularResult.trust_data;
        this.salesArr = this.regular_trust_data[0].sales.split(',');
        for (let i = 0; i < this.salesArr.length; i++) {
          let tmp_index = this.salesArr[i].search('-');
          let tmp = this.salesArr[i].substring(tmp_index + 1, this.salesArr[i].length);
          let tmp_num = this.salesArr[i].substring(0, 5);
          this._logger.step('FUND', 'this.salesArr[i]: ', this.salesArr[i]);
          this.salesArr[i] = tmp + '-' + tmp_num;
        }
        this.introArr = this.regular_trust_data[0].intro.split(',');
        for (let i = 0; i < this.introArr.length; i++) {
          let tmp_index = this.introArr[i].search('-');
          let tmp = this.introArr[i].substring(tmp_index + 1, this.introArr[i].length);
          let tmp_num = this.introArr[i].substring(0, 5);
          this.introArr[i] = tmp + '-' + tmp_num;
        }
        this.salesArr.unshift('請選擇理財專員');
        this.introArr.unshift('請選擇轉介人員');
        this._logger.step('FUND', '[Test] this.salesArr after : ', this.salesArr);
        this.nowSales = this.salesArr[0];
        this.nowIntro = this.introArr[0];

        //取得帳號 *2019/10/18 修改  START---------------
        this.checkDefaultAcnt(this.regularResult401);
        //取得帳號 *2019/10/18 修改  END---------------
      },
      (regularError) => {
        this.regularResult401 = {};
        this.checkDefaultAcnt(this.regularResult401);
        this._logger.log('401 is error', regularError);
        // 目前查無帳號不跳訊息
        // regularError['type'] = 'dialog';
        // this._handleError.handleError(regularError);
        // this.onErrorBackEvent(regularError);
      }
    );
  }

  /**
   * 重新設定page data
   * @param item
   */
  onBackPageData(item?: any) {
    this.confirm.show('您是否放棄此次編輯?', {
      title: '提醒您'
    }).then(
      () => {
        // 返回投資理財選單
        const output = {
          'page': 'content',
          'type': 'back',
          'data': item
        };
        this.backPageEmit.emit(output);
      },
      () => {

      }
    );

  }

  /**
   * 失敗回傳
   * @param error_obj 失敗物件
   */
  onErrorBackEvent(error_obj) {
    const output = {
      'page': 'content',
      'type': 'error',
      'data': error_obj
    };
    this.errorPageEmit.emit(output);
  }

  // 安控函式
  securityOptionBak(e) {
    this._logger.step('FUND', 'securityOptionBak: ', e);
    if (e.status) {
      // 取得需要資料傳遞至下一頁子層變數
      this.userAddress.SEND_INFO = e.sendInfo;
      this.userAddress.USER_SAFE = e.sendInfo.selected;
      this.securityObj = {
        'action': 'init',
        'sendInfo': e.sendInfo
      };
    } else {
      // do errorHandle 錯誤處理 推業或POPUP
      e['type'] = 'message';
      this._handleError.handleError(e.ERROR);
    }
  }

  stepBack(e) {
    this._logger.step('FUND', 'changeResultPage 2: [e]', e);
    // 處理傳入下一頁參數物件
    // let send_data = {
    //   // 憑證 寫入簽章本文
    //   'custId': this._authService.getUserInfo().custId,
    //   'trustAcnt': this.resultData.trustAcnt,
    //   'transCode': this.resultData.transCode,
    //   'fundCode': this.resultData.fundCode,
    //   'investAmntFlag': this.resultData.investAmntFlag,
    //   'investAmnt': this.resultData.investAmnt,
    //   'payDateFlag': this.resultData.payDateFlag,
    //   'payDate1': this.resultData.payDate1,
    //   'payDate2': this.resultData.payDate2,
    //   'payDate3': this.resultData.payDate3,
    //   'payDate4': this.resultData.payDate4,
    //   'payDate5': this.resultData.payDate5,
    //   'payTypeFlag': this.resultData.payTypeFlag,
    //   'changeBegin': this.resultData.changeBegin,
    //   'changeEnd': this.resultData.changeEnd,
    //   'payAcntStatus': this.resultData.payAcntStatus,
    //   'payAcnt': this.resultData.payAcnt,
    //   'profitAcntFlag': this.resultData.profitAcntFlag,
    //   'oriProfitAcnt': this.resultData.oriProfitAcnt,
    //   'profitAcnt': this.resultData.profitAcnt,
    //   'effectDate': this.resultData.effectDate,
    //   'INCurrency': this.resultData.INCurrency,
    //   'trnsToken': this.resultData.trnsToken,
    //   'payFundFlag': this.resultData.payFundFlag,
    //   'newFund': this.resultData.newFund,
    //   'payDate31': this.resultData.payDate31,
    //   'payDate5W': this.resultData.payDate5W,
    //   'payEvaFlag': this.resultData.payEvaFlag,
    //   'decline1Cd': this.resultData.decline1Cd,
    //   'decline1': this.resultData.decline1,
    //   'decline2Cd': this.resultData.decline2Cd,
    //   'decline2': this.resultData.decline2,
    //   'decline3Cd': this.resultData.decline3Cd,
    //   'decline3': this.resultData.decline3,
    //   'decline4Cd': this.resultData.decline4Cd,
    //   'decline4': this.resultData.decline4,
    //   'decline5Cd': this.resultData.decline5Cd,
    //   'decline5': this.resultData.decline5,
    //   'gain1Cd': this.resultData.gain1Cd,
    //   'gain1': this.resultData.gain1,
    //   'gain2Cd': this.resultData.gain2Cd,
    //   'gain2': this.resultData.gain2,
    //   'gain3Cd': this.resultData.gain3Cd,
    //   'gain3': this.resultData.gain3,
    //   'gain4Cd': this.resultData.gain4Cd,
    //   'gain4': this.resultData.gain4,
    //   'gain5Cd': this.resultData.gain5Cd,
    //   'gain5': this.resultData.gain5
    // };

    // this._logger.log('API req', req);
    this._logger.log('send data start', this._formateService.transClone(this.resultData));
    let send_data: any = {};
    // this._logger.log('send data start', this._formateService.transClone(data));
    send_data.custId = this._authService.getCustId(); // user info;
    send_data.trustAcnt = this._formateService.checkField(this.resultData, 'trustAcnt');
    send_data.transCode = this._formateService.checkField(this.resultData, 'transCode');
    send_data.fundCode = this._formateService.checkField(this.resultData, 'fundCode');
    send_data.investAmntFlag = this._formateService.checkField(this.resultData, 'investAmntFlag');
    send_data.investAmnt = this._formateService.checkField(this.resultData, 'investAmnt').replace(',', '');
    send_data.payDateFlag = this._formateService.checkField(this.resultData, 'payDateFlag');
    send_data.payDate1 = this._formateService.checkField(this.resultData, 'payDate1');
    send_data.payDate2 = this._formateService.checkField(this.resultData, 'payDate2');
    send_data.payDate3 = this._formateService.checkField(this.resultData, 'payDate3');
    send_data.payDate4 = this._formateService.checkField(this.resultData, 'payDate4');
    send_data.payDate5 = this._formateService.checkField(this.resultData, 'payDate5');
    send_data.payTypeFlag = this._formateService.checkField(this.resultData, 'payTypeFlag');
    send_data.changeBegin = this._formateService.checkField(this.resultData, 'changeBegin');
    send_data.changeEnd = this._formateService.checkField(this.resultData, 'changeEnd');
    send_data.payAcntStatus = this._formateService.checkField(this.resultData, 'payAcntStatus');
    send_data.payAcnt = this._formateService.checkField(this.resultData, 'payAcnt');
    send_data.profitAcntFlag = this._formateService.checkField(this.resultData, 'profitAcntFlag');
    send_data.oriProfitAcnt = this._formateService.checkField(this.resultData, 'oriProfitAcnt');
    send_data.profitAcnt = this._formateService.checkField(this.resultData, 'profitAcnt');
    send_data.effectDate = this._formateService.checkField(this.resultData, 'effectDate');
    send_data.INCurrency = this._formateService.checkField(this.resultData, 'INCurrency');
    send_data.trnsToken = this._formateService.checkField(this.resultData, 'trnsToken');
    send_data.branchName = this.info_401.branchName; // alex0520
    send_data.unitCall = this.info_401.unitCall;
    send_data.payFundFlag = this._formateService.checkField(this.resultData, 'payFundFlag');
    send_data.newFund = this._formateService.checkField(this.resultData, 'newFund');
    send_data.payDate31 = this._formateService.checkField(this.resultData, 'payDate31');
    send_data.payDate5W = this._formateService.checkField(this.resultData, 'payDate5W');
    send_data.payEvaFlag = this._formateService.checkField(this.resultData, 'payEvaFlag');
    // this._logger.log('send_data.decline1 ', send_data.decline1, this._formateService.checkField(this.resultData, 'decline1'));
    send_data.decline1Cd = this._formateService.checkField(this.resultData, 'decline1Cd');
    send_data.decline1 = this._formateService.checkField(this.resultData, 'decline1');
    send_data.decline2Cd = this._formateService.checkField(this.resultData, 'decline2Cd');
    send_data.decline2 = this._formateService.checkField(this.resultData, 'decline2');
    send_data.decline3Cd = this._formateService.checkField(this.resultData, 'decline3Cd');
    send_data.decline3 = this._formateService.checkField(this.resultData, 'decline3');
    send_data.decline4Cd = this._formateService.checkField(this.resultData, 'decline4Cd');
    send_data.decline4 = this._formateService.checkField(this.resultData, 'decline4');
    send_data.decline5Cd = this._formateService.checkField(this.resultData, 'decline5Cd');
    send_data.decline5 = this._formateService.checkField(this.resultData, 'decline5');
    send_data.gain1Cd = this._formateService.checkField(this.resultData, 'gain1Cd');
    send_data.gain1 = this._formateService.checkField(this.resultData, 'gain1');
    send_data.gain2Cd = this._formateService.checkField(this.resultData, 'gain2Cd');
    send_data.gain2 = this._formateService.checkField(this.resultData, 'gain2');
    send_data.gain3Cd = this._formateService.checkField(this.resultData, 'gain3Cd');
    send_data.gain3 = this._formateService.checkField(this.resultData, 'gain3');
    send_data.gain4Cd = this._formateService.checkField(this.resultData, 'gain4Cd');
    send_data.gain4 = this._formateService.checkField(this.resultData, 'gain4');
    send_data.gain5Cd = this._formateService.checkField(this.resultData, 'gain5Cd');
    send_data.gain5 = this._formateService.checkField(this.resultData, 'gain5');

    if (send_data['decline1'] == '0.00') {
      send_data['decline1'] = '0';
    }
    if (send_data['decline2'] == '0.00') {
      send_data['decline2'] = '0';
    }
    if (send_data['decline3'] == '0.00') {
      send_data['decline3'] = '0';
    }
    if (send_data['decline4'] == '0.00') {
      send_data['decline4'] = '0';
    }
    if (send_data['decline5'] == '0.00') {
      send_data['decline5'] = '0';
    }
    if (send_data['gain1'] == '0.00') {
      send_data['gain1'] = '0';
    }
    if (send_data['gain2'] == '0.00') {
      send_data['gain2'] = '0';
    }
    if (send_data['gain3'] == '0.00') {
      send_data['gain3'] = '0';
    }
    if (send_data['gain4'] == '0.00') {
      send_data['gain4'] = '0';
    }
    if (send_data['gain5'] == '0.00') {
      send_data['gain5'] = '0';
    }
    this.sendData = send_data;
    this._logger.log('send data start', this._formateService.transClone(send_data)
      , this._formateService.transClone(this.sendData));

    if (e.status) {
      if (e.securityType === '3') {
        e.otpObj.depositNumber = ''; // 轉出帳號
        e.otpObj.depositMoney = ''; // 金額
        e.otpObj.OutCurr = ''; // 幣別
        e.transTypeDesc = ''; //
      } else if (e.securityType === '2') {
        e.signText = send_data;
      }
      // 統一叫service 做加密
      this._logger.log('signText', this._formateService.transClone(e.signText), this._formateService.transClone(this.resultData));
      this._checkSecurityService.doSecurityNextStep(e).then(
        (S) => {
          this._logger.step('FUND', 'changeResultPage 3: [S]', S);
          // this.safeE = S;
          // 把S做為output傳回;
          // this.backPageEmit.emit({
          //   type: 'goResult',
          //   value: true,
          //   securityResult: S
          // });
          this.safeE = {
            securityResult: S
          };
          this.nowPageType = 'resultPage';

        }, (F) => {
          this.backPageEmit.emit({
            type: 'goResult',
            value: false,
            securityResult: F
          });
        }
      );
    } else {
      return false;
    }
  }

  changeFund() {
    this.req.investType = 'D';

    this.nowPageType = 'fundSelectPage';
    // this.showContent = true;
    // this.showSetContent = false;
  }

  alertMsg() {
    this.alert.show("請先點選正常扣款");
  }

  /**
  * 子層返回事件(分頁)
  * @param e
  */
  onPageBackEvent(e) {
    this._logger.log('onPageBackEvent', e);
    let page = 'list';
    let pageType = 'list';
    let tmp_data = {
      fundCode: '',
      fundName: '',
      risk: '',
      currency: '',
      hiIncome: '',
      ourFund: ''
    };
    let fundStatus = {
      foreginFund: '', // 國內or國外(記錄狀態)
      selectFund: '' // 精選or自選(紀錄狀態)
    };
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
    this._logger.step('FUND', 'page:', page);
    this._logger.step('FUND', 'pageType:', pageType);
    this._logger.step('FUND', 'tmp_data:', tmp_data);
    this._logger.step('FUND', 'fundStatus:', fundStatus);

    // 基金選擇子頁，按左上角返回
    if (pageType == 'back' && page == 'select-subject') {
      this.nowPageType = 'editPage';
      this._headerCtrl.setLeftBtnClick(() => {
        this.onBackPageData();
      });
    }
    // 編輯頁面 - 基金選擇 子頁回傳
    if (pageType == 'success' && page == 'select-subject') {
      this.fundTypeName = fundStatus.foreginFund + '，' + fundStatus.selectFund;
      this.fundName = tmp_data.fundName;
      this.fundCode = tmp_data.fundCode;
      this.fullData.INCurrency = tmp_data.currency;
      // 更新漲跌幅幣別比對資料
      this.setDeclineAndGainList(this.fullData.INCurrency);
      this.nowPageType = 'editPage';
      this._headerCtrl.setLeftBtnClick(() => {
        this.onBackPageData();
      });
    }
    // 設定頁面 - 選擇扣款日期 子頁回傳
    // 20190510 待改，目前現行系統沒有週可以選
    if (pageType == 'success' && page == 'date-select') {
      this._logger.log('dateArr', tmp_data);
      // this.nowPageType = 'settingPage';
      this.nowPageType = 'editPage';
      // this._logger.step('FUND', 'date select get tmp_data: ', tmp_data);
      this.dateArr = tmp_data;
      if (this.dateArr.length == 0) {
        this.showDateStr = '請選擇';
      } else {
        if (this.setRadio == '1') {
          this.showDateStr = '每月';
          for (let i = 0; i < this.dateArr.length; i++) {
            if (i != 0) {
              this.showDateStr += ',';
            }
            this.showDateStr += this.dateArr[i];
          }
          this.showDateStr += '日';
        } else {
          this.showDateStr = '';
          for (let i = 0; i < this.dateArr.length; i++) {
            if (i != 0) {
              this.showDateStr += ',';
            }
            for (let j = 0; j < this.trnsferWeek.length; j++) {
              if (this.trnsferWeek[j].num == this.dateArr[i]) {
                this.showDateStr += this.trnsferWeek[j].zw;
                break;
              }
            }

          }
        }
      }
    }
    // 同意事項頁面 - 基金公開說明書 || 基金通路報酬通路資訊 子頁回傳
    if (pageType == 'success' && (page == 'fund-information1' || page == 'fund-information2')) {
      this.nowPageType = 'agreePage';
    }
  }

  public backMenuPage() {
    this.confirm.show('您是否放棄此次編輯?', {
      title: '提醒您'
    }).then(
      () => {
        this.navgator.push('fund');
      },
      () => {

      }
    );
  }

  // 切換扣款週期設定，清空內容
  switchRadio() {
    while (this.dateArr.length != 0) {
      this.dateArr.splice(0, 1);
    }
    this.showDateStr = '請選擇';
  }

  goSwitchVary(flag) {
    this.showVaryFlag = flag;
  }

  // 切換至設定頁面
  goToSetting() {

    //國外檢核金額100倍數 *(不定額異動，無判斷金額規則，只有漲跌幅級距有判斷，移除此判斷)
    // if(this.fullData.fundType == 'D'){
    //   if(parseFloat(this.purchAmnt)%100 !=0 ||parseFloat(this.purchAmnt)==0){
    //     this.errorMsg.money='輸入需為幣別單位100';
    //     return false;
    // }else{
    //     this.errorMsg.money='';
    // }
    // }
    // 比較扣款金額
    let amnt1 = AmountUtil.amount(this.fullData.purchAmnt, this.fullData.INCurrency);
    let amnt2 = AmountUtil.amount(this.purchAmnt, this.fullData.INCurrency);
    if (this.splitAmount(amnt1, true) != this.splitAmount(amnt2, true)) {
      this.resultData.investAmntFlag = 'Y';
      this.resultData.investAmnt = (parseInt(this.purchAmnt) * 100).toString();

    } else {
      this.resultData.investAmntFlag = 'N';
      this.resultData.investAmnt = (parseInt(this.purchAmnt) * 100).toString();
    }
    // this._logger.log('investAmntFlag', amnt1, amnt2, this.resultData.investAmnt, this.resultData.investAmntFlag)


    // debitStatus 空白:正常扣款, 'S':暫停扣款, 'T':終止扣款
    // if (this.setData['debitStatus'] == 'T') {
    //   this.debitStatus = 'T';
    //   this.debitStatusName = '終止';
    // } else {
    //   if (this.radioVal == '1') {
    //     this.debitStatus = this.setData['debitStatus'];
    //     this.debitStatusName = '正常';
    //   } else if (this.radioVal == '2') {
    //     this.debitStatus = 'S';
    //     this.debitStatusName = '暫停';
    //   }
    // }
    // this._logger.log('800', this.debitStatus, this.setData['debitStatus'])

    // 比較扣款狀態
    // debitStatus 空白:正常扣款, 'S':暫停扣款, 'T':終止扣款
    // payTypeFlag R︰恢復扣款, B︰終止扣款, S: 暫停扣款, N: 不變更, G:終止扣款復扣
    this._logger.log('patttyyyflag', this.setData, this.debitStatus);

    // if (this.setData['debitStatus'] == 'T') { //終止扣款
    //   this.resultData.payTypeFlag = 'N';
    // } else {
    //   if (this.setData['debitStatus'] == this.debitStatus) {
    //     this.resultData.payTypeFlag = 'N';
    //   } else {
    //     if (this.radioVal == '1') {
    //       // 選擇正常 -> 恢復扣款
    //       this.resultData.payTypeFlag = 'R';
    //     } else if (this.radioVal == '2') {
    //       // 選擇暫停 -> 暫停扣款
    //       this.resultData.payTypeFlag = 'S';
    //     }
    //   }
    // }
    //扣款狀態
    if (this.setData['debitStatus'] == '' || this.setData['debitStatus'] == null) { //正常扣款
      if (this.radioVal == '1') {
        this.resultData.payTypeFlag = 'N';  //不變
        this.debitStatusName = '正常扣款';
      } else {
        this.resultData.payTypeFlag = 'S';  //正常=>暫停
        this.debitStatusName = '暫停扣款';
      }
    } else if (this.setData['debitStatus'] == 'S') { //暫停
      if (this.radioVal == '2') {
        this.resultData.payTypeFlag = 'N';  //不變
        this.debitStatusName = '暫停扣款';
      } else {
        this.resultData.payTypeFlag = 'R';  //暫停=>正常
        this.debitStatusName = '正常扣款';
      }
    } else {  //終止
      if (this.radioVal == '1') {
        this.resultData.payTypeFlag = 'G';  //終止=>正常
        this.debitStatusName = '正常扣款';
      } else {
        this.resultData.payTypeFlag = 'S';  //終止=>暫停
        this.debitStatusName = '暫停扣款';
      }
    }


    this._logger.step('FUND', this.resultData.payTypeFlag);

    // 比較扣款帳號
    if (this.fullData.payAcnt != this.nowOutType.trnsfrOutAccnt) {
      this.resultData.payAcntStatus = 'Y';
    } else {
      this.resultData.payAcntStatus = 'N';
    }
    this.resultData.payAcnt = this.nowOutType.trnsfrOutAccnt;
    // this._logger.log('payAcntStatus', this.resultData.payAcntStatus, this.fullData.payAcnt, this.nowOutType, this.nowOutType.trnsfrOutAccnt);

    // 比較存入帳號
    if (this.fullData.profitAcnt != this.nowInType.trnsfrInAccnt) {
      this.resultData.profitAcntFlag = 'Y';
      this.resultData.oriProfitAcnt = this.fullData.profitAcnt;
      this.resultData.profitAcnt = this.nowInType.trnsfrInAccnt;
    } else {
      this.resultData.profitAcntFlag = 'N';

      this.resultData.profitAcnt = this.fullData.profitAcnt;
      this.resultData.oriProfitAcnt = this.fullData.profitAcnt;
    }
    // this._logger.log('現金收益存入: ', this.resultData.profitAcntFlag, this.fullData.profitAcnt, this.nowInType.trnsfrInAccnt);

    // if (this.fullData.code != '' && this.fullData.code != null) { //定期不定額
    if (this.dateArr.length == 0) {
      this._handleError.handleError({
        type: 'dialog',
        title: 'POPUP.NOTICE.TITLE',
        content: '請選擇扣款日。'
      });
      return false;
    }
    // }

    //檢核金額是否符合最低金額
    let checkAmount = this.checkLeastAmount(this.purchAmnt);
    //基本檢核，ex:空、不能輸入符號
    if (checkAmount.status == false && checkAmount.error_type == 'another_error') {
      this.errorMsg.money = checkAmount.msg;
      this._handleError.handleError({
        type: 'dialog',
        title: 'POPUP.NOTICE.TITLE',
        content: this.errorMsg.money
      });
      return false;
      //金額不為空，但不符合最低金額規則
    } else if (checkAmount.status == false && checkAmount.error_type == 'rule_error' && this.purchAmnt != '') {
      this.errorMsg.money = '最低金額不可低於 ' + this.fullData.INCurrency + ": " + this.leastAmount;
      return false;
      //金額倍數級距錯誤
    } else if (checkAmount.status == false && checkAmount.error_type == 'level_error') {
      this.errorMsg.money = '輸入需為幣別單位 ' + this.fullData.INCurrency + ": " + this.getVaryList[0];
    } else {
      this.errorMsg.money = '';
    }

    if (this.setRadio == '1') {
      // 比對原payDate1 - 5是否和dateArr一樣
      // 比對原payDate31 是否和dateArr一樣
      // payDateFlag = 'Y'
      if (this.fullData.payDate31 != this.dateArr.toString()) {
        this.resultData.payDate31 = this.dateArr.toString();
        this.resultData.payDateFlag = 'Y';
      } else {
        this.resultData.payDate31 = this.fullData.payDate31;
        this.resultData.payDateFlag = 'N';
      }
    } else {
      if (this.fullData.payDate5W != this.dateArr.toString()) {
        this.resultData.payDate5W = this.dateArr.toString();
        this.resultData.payDateFlag = 'Y';
      } else {
        this.resultData.payDate5W = this.fullData.payDate31;
        this.resultData.payDateFlag = 'N';
      }
      this._logger.log('payDateFlag', this.resultData.payDateFlag, this.fullData.payDate5W);
    }
    this.resultData.payDate1 = '00';
    this.resultData.payDate2 = '00';
    this.resultData.payDate3 = '00';
    this.resultData.payDate4 = '00';
    this.resultData.payDate5 = '00';

    for (let i = 0; i < this.dateArr.length; i++) {
      if (i == 0) {
        this.resultData.payDate1 = this.checkDtlength(this.dateArr[i]);
      }
      if (i == 1) {
        this.resultData.payDate2 = this.checkDtlength(this.dateArr[i]);
      }
      if (i == 2) {
        this.resultData.payDate3 = this.checkDtlength(this.dateArr[i]);
      }
      if (i == 3) {
        this.resultData.payDate4 = this.checkDtlength(this.dateArr[i]);
      }
      if (i == 4) {
        this.resultData.payDate5 = this.checkDtlength(this.dateArr[i]);
      }
    }




    let goFlag = true;
    if (this.radioVal == '1') {
      // 金額欄位顯示判斷訊息
      if (this.errorMsg.money != '') {
        this._handleError.handleError({
          type: 'dialog',
          title: 'POPUP.NOTICE.TITLE',
          content: this.errorMsg.money
        });
        goFlag = false;
        return false;
      }
    }

    if (goFlag == true) {
      this.resultData.newFund = this.fundCode;
      if (this.fundCode != this.setData.fundCode) {
        this.resultData.payFundFlag = 'Y';
      } else {
        this.resultData.payFundFlag = 'N';
      }
      // this.nowPageType = 'settingPage';
    }
    this._logger.log('this.resultData.payFundFlag', this.resultData.payFundFlag, this.resultData.newFund, this.resultData);
    //new Fund
    if (this.resultData.payFundFlag == "Y") {
      this.resultData.newFund = this.fundCode;
    } else {
      this.resultData.newFund = this.fullData.fundCode;
    }

    // this._logger.log('newFund', this.resultData.newFund);
    // let vestType = ((typeof this.fullData.code).toString() === "object" && Object.keys(this.fullData.code).length === 0 ? "B" : "D");
    let vestType = ((this.fullData.code != "" && this.fullData.code != null) && (this.fullData.code == '01' || this.fullData.code == '02')) ? 'D' : 'B';
    this._logger.log('vestType', vestType, this.fullData.code);
    if (vestType == 'D') {  //定期不定額
      this._logger.log('gotovary');
      this.goToVary();
    } else {

      this._logger.log('gotoAgree');
      this.goToAgree();
    }

  }

  checkLeastAmount(amount) {
    //error_type = 錯誤種類，rule_error：金額不符規則，another_error：其他錯誤，level_error:金額級距錯誤
    let output = {
      status: false,
      msg: '',
      data: amount,
      error_type: ''
    };
    //定期定額最低金額
    let regular = {
      TWD: '3000',//台幣
      USD: '100', //美元
      HKD: '1000', //港幣
      GBP: '100', //英鎊
      AUD: '100', //澳幣
      SGD: '100', //新加坡幣
      CHF: '100', //瑞士法郎
      CAD: '100', //加拿大幣
      JPY: '10000', //日圓
      CNY: '1000', //人民幣
      SEK: '1000', //瑞典幣
      NZD: '100', //紐西蘭幣
      EUR: '100', //歐元
      ZAR: '1000', //南非幣
    };

    //定期不定額最低金額
    let regular_not = {
      TWD: '5000',
      USD: '300', //美元
      HKD: '3000', //港幣
      GBP: '300', //英鎊
      AUD: '300', //澳幣
      SGD: '300', //新加坡幣
      CHF: '300', //瑞士法郎
      CAD: '300', //加拿大幣
      JPY: '30000', //日圓
      CNY: '3000', //人民幣
      SEK: '3000', //瑞典幣
      NZD: '300', //紐西蘭幣
      EUR: '300', //歐元
      ZAR: '3000', //南非幣
    };
    let rule = {};
    //檢核前先判斷是否無輸入，若無輸入直接回傳
    //not_zero: false 可輸入0
    let checkEmpty = this._checkService.checkMoney(amount, {
      currency: 'POSITIVE',
      not_zero: false
    });
    if (checkEmpty['status'] == false) {
      output.status = false;
      output.msg = checkEmpty['msg'];
      output.error_type = 'another_error';
      return output;
    }

    //判斷不定額
    if ((this.fullData.code != "" && this.fullData.code != null) && (this.fullData.code == '01' || this.fullData.code == '02')) {
      rule = regular_not;
      //定額
    } else {
      rule = regular;
    }
    switch (this.fullData.INCurrency) {
      case 'TWD':
        this.leastAmount = rule['TWD'];
        break;
      case 'USD':
        this.leastAmount = rule['USD'];
        break;
      case 'HKD':
        this.leastAmount = rule['HKD'];
        break;
      case 'GBP':
        this.leastAmount = rule['GBP'];
        break;
      case 'AUD':
        this.leastAmount = rule['AUD'];
        break;
      case 'SGD':
        this.leastAmount = rule['SGD'];
        break;
      case 'CHF':
        this.leastAmount = rule['CHF'];
        break;
      case 'CAD':
        this.leastAmount = rule['CAD'];
        break;
      case 'JPY':
        this.leastAmount = rule['JPY'];
        break;
      case 'CNY':
        this.leastAmount = rule['CNY'];
        break;
      case 'SEK':
        this.leastAmount = rule['SEK'];
        break;
      case 'NZD':
        this.leastAmount = rule['NZD'];
        break;
      case 'EUR':
        this.leastAmount = rule['EUR'];
        break;
      case 'ZAR':
        this.leastAmount = rule['ZAR'];
        break;
      default:
        this.leastAmount = rule['TWD'];
        break;
    }
    //因為可輸入0，因此多判斷不能為0
    if (parseInt(amount) < parseInt(this.leastAmount) && parseInt(amount) != 0) {
      output.status = false;
      output.msg = 'error';
      output.error_type = 'rule_error';
    } else if (parseInt(amount) % parseInt(this.getVaryList[0]) != 0) {
      output.status = false;
      output.msg = 'error';
      output.error_type = 'level_error';
    } else {
      output.status = true;
      output.msg = '';
      output.error_type = '';
    }
    return output;
  }


  // 切換至編輯頁面
  goToEdit() {
    this.nowPageType = 'editPage';
  }
  goToVary() {
    // 比較扣款日期
    // 20190510 待改，目前現行系統沒有週可以選
    // if (this.setRadio == '1') {
    //   this.showDateStr = (this.resultData.payDate1 != '') ? this.resultData.payDate1 + '日' : '';
    //   this.showDateStr += (this.resultData.payDate2 != '') ? '、' + this.resultData.payDate2 + '日' : '';
    //   this.showDateStr += (this.resultData.payDate3 != '') ? '、' + this.resultData.payDate3 + '日' : '';
    //   this.showDateStr += (this.resultData.payDate4 != '') ? '、' + this.resultData.payDate4 + '日' : '';
    //   this.showDateStr += (this.resultData.payDate5 != '') ? '、' + this.resultData.payDate5 + '日' : '';
    // } else {
    //   this.showDateStr = (this.resultData.payDate1 != '') ? this.resultData.payDate1 : '';
    //   this.showDateStr += (this.resultData.payDate2 != '') ? '、' + this.resultData.payDate2 : '';
    //   this.showDateStr += (this.resultData.payDate3 != '') ? '、' + this.resultData.payDate3 : '';
    //   this.showDateStr += (this.resultData.payDate4 != '') ? '、' + this.resultData.payDate4 : '';
    //   this.showDateStr += (this.resultData.payDate5 != '') ? '、' + this.resultData.payDate5 : '';
    // }


    // if (this.dateArr.length == 0) {
    //   // 未勾選扣款日
    //   this._handleError.handleError({
    //     type: 'dialog',
    //     title: 'POPUP.NOTICE.TITLE',
    //     content: '請選擇扣款日。'
    //   });
    // } else {
    // 20190510 待改，目前線上版本的選擇上限為選擇5天
    // if (this.dateArr.length > 5) {
    //   this._handleError.handleError({
    //     type: 'dialog',
    //     title: 'POPUP.NOTICE.TITLE',
    //     content: '選擇扣款日不得超過五天。'
    //   });
    // } else {
    // if (this.nowSales == '請選擇理財專員') {
    //   this._handleError.handleError({
    //     type: 'dialog',
    //     title: 'POPUP.NOTICE.TITLE',
    //     content: '請選擇理財專員。'
    //   });
    // this.salesChangeFlag = !this.salesChangeFlag;
    // } else {

    this.nowPageType = 'settinigVaryPage';
    // }
    // }
    // }
  }

  checkDtlength(str) {
    if (str.length == 1) {
      return '0' + str;
    } else {
      return str;
    }
  }

  // 切換至同意事項頁面
  goToAgree() {
    // 檢查漲跌幅
    this._logger.log('FUND', '檢查漲跌幅: ', parseInt(this.fullData.decline1, 10) % this.getVaryList[0]);
    // if (parseInt(this.fullData.decline1, 10) % this.getVaryList[0] !== 0) {
    //   this._handleError.handleError({
    //     type: 'dialog',
    //     title: 'POPUP.NOTICE.TITLE',
    //     content: '-5% >= 評價 >= -10% 須為' + this.getVaryList[0] + ' 倍數'
    //   });
    //   return false;
    // }

    // if (parseInt(this.fullData.decline2, 10) % this.getVaryList[0] !== 0) {
    //   this._handleError.handleError({
    //     type: 'dialog',
    //     title: 'POPUP.NOTICE.TITLE',
    //     content: '-10% >= 評價 >= -15% 須為' + this.getVaryList[0] + ' 倍數'
    //   });
    //   return false;
    // }

    // if (parseInt(this.fullData.decline3, 10) % this.getVaryList[0] !== 0) {
    //   this._handleError.handleError({
    //     type: 'dialog',
    //     title: 'POPUP.NOTICE.TITLE',
    //     content: '-15% >= 評價 >= -20% 須為' + this.getVaryList[0] + ' 倍數'
    //   });
    //   return false;
    // }

    // if (parseInt(this.fullData.decline4, 10) % this.getVaryList[0] !== 0) {
    //   this._handleError.handleError({
    //     type: 'dialog',
    //     title: 'POPUP.NOTICE.TITLE',
    //     content: '-20% >= 評價 >= -25% 須為' + this.getVaryList[0] + ' 倍數'
    //   });
    //   return false;
    // }

    // if (parseInt(this.fullData.decline5, 10) % this.getVaryList[0] !== 0) {
    //   this._handleError.handleError({
    //     type: 'dialog',
    //     title: 'POPUP.NOTICE.TITLE',
    //     content: '-25% >= 評價 須為' + this.getVaryList[0] + ' 倍數'
    //   });
    //   return false;
    // }

    // if (parseInt(this.fullData.gain1, 10) % this.getVaryList[0] !== 0) {
    //   this._handleError.handleError({
    //     type: 'dialog',
    //     title: 'POPUP.NOTICE.TITLE',
    //     content: '+5% >= 評價 >= +10% 須為' + this.getVaryList[0] + ' 倍數'
    //   });
    //   return false;
    // }

    // if (parseInt(this.fullData.gain2, 10) % this.getVaryList[0] !== 0) {
    //   this._handleError.handleError({
    //     type: 'dialog',
    //     title: 'POPUP.NOTICE.TITLE',
    //     content: '+10% >= 評價 >= +15% 須為' + this.getVaryList[0] + ' 倍數'
    //   });
    //   return false;
    // }

    // if (parseInt(this.fullData.gain3, 10) % this.getVaryList[0] !== 0) {
    //   this._handleError.handleError({
    //     type: 'dialog',
    //     title: 'POPUP.NOTICE.TITLE',
    //     content: '+15% >= 評價 >= +20% 須為' + this.getVaryList[0] + ' 倍數'
    //   });
    //   return false;
    // }

    // if (parseInt(this.fullData.gain4, 10) % this.getVaryList[0] !== 0) {
    //   this._handleError.handleError({
    //     type: 'dialog',
    //     title: 'POPUP.NOTICE.TITLE',
    //     content: '+20% >= 評價 >= +25% 須為' + this.getVaryList[0] + ' 倍數'
    //   });
    //   return false;
    // }

    // if (parseInt(this.fullData.gain5, 10) % this.getVaryList[0] !== 0) {
    //   this._handleError.handleError({
    //     type: 'dialog',
    //     title: 'POPUP.NOTICE.TITLE',
    //     content: '+25% >= 評價 須為' + this.getVaryList[0] + ' 倍數'
    //   });
    //   return false;
    // }
    let vestType = ((this.fullData.code != "" && this.fullData.code != null) && (this.fullData.code == '01' || this.fullData.code == '02')) ? 'D' : 'B';

    if (vestType == 'D') {
      if (this.resultData.payDateFlag == "Y" ||     //扣款日期變更狀態
        this.resultData.investAmntFlag == "Y" ||    //投資金額變更狀態
        this.resultData.payAcntStatus == "Y" ||     //扣款帳號變更狀態
        this.resultData.profitAcntFlag == "Y" ||    //現金收益存入帳號變更狀態
        this.resultData.payTypeFlag != 'N' ||       //扣款狀態變更
        this.resultData.payFundFlag == "Y" ||      //投資基金變更狀態
        this.getPayEvaFlag() == 'Y') { } else {
        // this._logger.log('this.getPayEvaFlag()', this.getPayEvaFlag())
        this._handleError.handleError({
          type: 'dialog',
          content: '您未變更任何資料．．．'
        });
        return false;
      }
    } else {
      if (this.resultData.payDateFlag == "Y" || this.resultData.investAmntFlag == "Y" || this.resultData.payAcntStatus == "Y" ||
        this.resultData.profitAcntFlag == "Y" || this.resultData.payTypeFlag != 'N' || this.resultData.payFundFlag == "Y") {
      } else {
        this._handleError.handleError({
          type: 'dialog',
          content: '您未變更任何資料．．．'
        });
        return false;
      }
    }
    //定期不定額才檢核
    if (vestType == 'D') {
    //若漲跌幅未輸入
    this.checkGain = this.checkLevel();
    this._logger.log("checkGain:", this.checkGain);
    if (this.checkGain.decline_status == false && this.checkGain.gain_status == false) {
      this._logger.log("checkGain error");
      this._handleError.handleError({
        type: 'BTN.CHECK',
        title: 'ERROR.INFO_TITLE',
        content: '漲幅級距、跌幅級距皆輸入錯誤，請切換查看資訊。'
      });
      return false;
    } else if (this.checkGain.decline_status == false && this.checkGain.gain_status == true) {
      this._handleError.handleError({
        type: 'BTN.CHECK',
        title: 'ERROR.INFO_TITLE',
        content: '跌幅級距輸入錯誤，請切換至「跌幅級距」查看資訊。'
      });
      return false;
    } else if (this.checkGain.decline_status == true && this.checkGain.gain_status == false) {
      this._handleError.handleError({
        type: 'BTN.CHECK',
        title: 'ERROR.INFO_TITLE',
        content: '漲幅級距輸入錯誤，請切換至「漲幅級距」查看資訊。'
      });
      return false;
      }
    }
    this.nowPageType = 'agreePage';
  }

  //檢核級距
  checkLevel() {
    let checkDecline = {
      decline1: false,
      decline1_msg: '',
      decline2: false,
      decline2_msg: '',
      decline3: false,
      decline3_msg: '',
      decline4: false,
      decline4_msg: '',
      decline5: false,
      decline5_msg: '',
      gain1: false,
      gain1_msg: '',
      gain2: false,
      gain2_msg: '',
      gain3: false,
      gain3_msg: '',
      gain4: false,
      gain4_msg: '',
      gain5: false,
      gain5_msg: '',
      decline_status: false, //跌幅狀態，全部欄位皆輸入正確為true
      gain_status: false
    };
    //跌幅
    let checkDecline1 = this._checkService.checkMoney(this.fullData.decline1, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkDecline1['status'] == false) {
      checkDecline.decline1 = true;
      checkDecline.decline1_msg = checkDecline1['msg'];
    } else if (parseInt(this.fullData.decline1, 10) % this.getVaryList[0] !== 0) {
      checkDecline.decline1 = true;
      checkDecline.decline1_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      checkDecline.decline1 = false;
      checkDecline.decline1_msg = '';
    }

    let checkDecline2 = this._checkService.checkMoney(this.fullData.decline2, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkDecline2['status'] == false) {
      checkDecline.decline2 = true;
      checkDecline.decline2_msg = checkDecline2['msg'];
    } else if (parseInt(this.fullData.decline2, 10) % this.getVaryList[0] !== 0) {
      checkDecline.decline2 = true;
      checkDecline.decline2_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      checkDecline.decline2 = false;
      checkDecline.decline2_msg = '';
    }

    let checkDecline3 = this._checkService.checkMoney(this.fullData.decline3, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkDecline3['status'] == false) {
      checkDecline.decline3 = true;
      checkDecline.decline3_msg = checkDecline3['msg'];
    } else if (parseInt(this.fullData.decline3, 10) % this.getVaryList[0] !== 0) {
      checkDecline.decline3 = true;
      checkDecline.decline3_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      checkDecline.decline3 = false;
      checkDecline.decline3_msg = '';
    }

    let checkDecline4 = this._checkService.checkMoney(this.fullData.decline4, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkDecline4['status'] == false) {
      checkDecline.decline4 = true;
      checkDecline.decline4_msg = checkDecline4['msg'];
    } else if (parseInt(this.fullData.decline4, 10) % this.getVaryList[0] !== 0) {
      checkDecline.decline4 = true;
      checkDecline.decline4_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      checkDecline.decline4 = false;
      checkDecline.decline4_msg = '';
    }

    let checkDecline5 = this._checkService.checkMoney(this.fullData.decline5, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkDecline5['status'] == false) {
      checkDecline.decline5 = true;
      checkDecline.decline5_msg = checkDecline5['msg'];
    } else if (parseInt(this.fullData.decline5, 10) % this.getVaryList[0] !== 0) {
      checkDecline.decline5 = true;
      checkDecline.decline5_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      checkDecline.decline5 = false;
      checkDecline.decline5_msg = '';
    }
    //漲幅
    let checkGain1 = this._checkService.checkMoney(this.fullData.gain1, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkGain1['status'] == false) {
      checkDecline.gain1 = true;
      checkDecline.gain1_msg = checkGain1['msg'];
    } else if (parseInt(this.fullData.gain1, 10) % this.getVaryList[0] !== 0) {
      checkDecline.gain1 = true;
      checkDecline.gain1_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      checkDecline.gain1 = false;
      checkDecline.gain1_msg = '';
    }

    let checkGain2 = this._checkService.checkMoney(this.fullData.gain2, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkGain2['status'] == false) {
      checkDecline.gain2 = true;
      checkDecline.gain2_msg = checkGain2['msg'];
    } else if (parseInt(this.fullData.gain2, 10) % this.getVaryList[0] !== 0) {
      checkDecline.gain2 = true;
      checkDecline.gain2_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      checkDecline.gain2 = false;
      checkDecline.gain2_msg = '';
    }

    let checkGain3 = this._checkService.checkMoney(this.fullData.gain3, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkGain3['status'] == false) {
      checkDecline.gain3 = true;
      checkDecline.gain3_msg = checkGain3['msg'];
    } else if (parseInt(this.fullData.gain3, 10) % this.getVaryList[0] !== 0) {
      checkDecline.gain3 = true;
      checkDecline.gain3_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      checkDecline.gain3 = false;
      checkDecline.gain3_msg = '';
    }

    let checkGain4 = this._checkService.checkMoney(this.fullData.gain4, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkGain4['status'] == false) {
      checkDecline.gain4 = true;
      checkDecline.gain4_msg = checkGain4['msg'];
    } else if (parseInt(this.fullData.gain4, 10) % this.getVaryList[0] !== 0) {
      checkDecline.gain4 = true;
      checkDecline.gain4_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      checkDecline.gain4 = false;
      checkDecline.gain4_msg = '';
    }

    let checkGain5 = this._checkService.checkMoney(this.fullData.gain5, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkGain5['status'] == false) {
      checkDecline.gain5 = true;
      checkDecline.gain5_msg = checkGain5['msg'];
    } else if (parseInt(this.fullData.gain5, 10) % this.getVaryList[0] !== 0) {
      checkDecline.gain5 = true;
      checkDecline.gain5_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      checkDecline.gain5 = false;
      checkDecline.gain5_msg = '';
    }

    if (checkDecline.decline1_msg == '' && checkDecline.decline2_msg == '' && checkDecline.decline3_msg == ''
      && checkDecline.decline4_msg == '' && checkDecline.decline5_msg == '') {
      checkDecline.decline_status = true;
    } else {
      checkDecline.decline_status = false;
    }
    if (checkDecline.gain1_msg == '' && checkDecline.gain2_msg == '' && checkDecline.gain3_msg == ''
      && checkDecline.gain4_msg == '' && checkDecline.gain5_msg == '') {
      checkDecline.gain_status = true;
    } else {
      checkDecline.gain_status = false;
    }
    return checkDecline;
  }

  // 切換至資料確認頁面
  goToConfirm() {
    if (this.agreeNote.note1 == true && this.agreeNote.note2 == true && this.agreeNote.note3 == true) {
      this.setDataResultPage();

      this.nowPageType = 'confirmPage';
    } else {
      // 未勾選同意事項
      this._handleError.handleError({
        type: 'dialog',
        title: 'POPUP.NOTICE.TITLE',
        content: '未勾選同意事項或閱讀條款。'
      });
    }
  }

  setDataResultPage() {
    this._logger.log('setDataResultPage', this.fullData);
    this.resultData.custId = this.fullData.custId;
    this.resultData.trustAcnt = this.fullData.trustAcnt;
    this.resultData.fundCode = this.fullData.fundCode;
    this.resultData.transCode = this.fullData.transCode;

    // let vestType = ((typeof this.fullData.code).toString() === "object" && Object.keys(this.fullData.code).length === 0 ? "B" : "D");
    let vestType = ((this.fullData.code != "" && this.fullData.code != null) && (this.fullData.code == '01' || this.fullData.code == '02')) ? 'D' : 'B';
    this.resultData.payEvaFlag = (vestType == 'D' ? this.getPayEvaFlag() : 'N'); // invest_type = D 定期不定額
    this.resultData.decline1Cd = (typeof this.fullData.decline1Cd).toString() === 'object' ? '-' : this.fullData.decline1Cd;
    this.resultData.decline2Cd = (typeof this.fullData.decline2Cd).toString() === 'object' ? '-' : this.fullData.decline2Cd;
    this.resultData.decline3Cd = (typeof this.fullData.decline3Cd).toString() === 'object' ? '-' : this.fullData.decline3Cd;
    this.resultData.decline4Cd = (typeof this.fullData.decline4Cd).toString() === 'object' ? '-' : this.fullData.decline4Cd;
    this.resultData.decline5Cd = (typeof this.fullData.decline5Cd).toString() === 'object' ? '-' : this.fullData.decline5Cd;
    this.resultData.decline1 = (typeof this.fullData.decline1).toString() === 'object' ? '0' : this.fullData.decline1;
    this.resultData.decline2 = (typeof this.fullData.decline2).toString() === 'object' ? '0' : this.fullData.decline2;
    this.resultData.decline3 = (typeof this.fullData.decline3).toString() === 'object' ? '0' : this.fullData.decline3;
    this.resultData.decline4 = (typeof this.fullData.decline4).toString() === 'object' ? '0' : this.fullData.decline4;
    this.resultData.decline5 = (typeof this.fullData.decline5).toString() === 'object' ? '0' : this.fullData.decline5;
    this.resultData.gain1Cd = (typeof this.fullData.gain1Cd).toString() === 'object' ? '+' : this.fullData.gain1Cd;
    this.resultData.gain2Cd = (typeof this.fullData.gain2Cd).toString() === 'object' ? '+' : this.fullData.gain2Cd;
    this.resultData.gain3Cd = (typeof this.fullData.gain3Cd).toString() === 'object' ? '+' : this.fullData.gain3Cd;
    this.resultData.gain4Cd = (typeof this.fullData.gain4Cd).toString() === 'object' ? '+' : this.fullData.gain4Cd;
    this.resultData.gain5Cd = (typeof this.fullData.gain5Cd).toString() === 'object' ? '+' : this.fullData.gain5Cd;
    this.resultData.gain1 = (typeof this.fullData.gain1).toString() === 'object' ? '0' : this.fullData.gain1;
    this.resultData.gain2 = (typeof this.fullData.gain2).toString() === 'object' ? '0' : this.fullData.gain2;
    this.resultData.gain3 = (typeof this.fullData.gain3).toString() === 'object' ? '0' : this.fullData.gain3;
    this.resultData.gain4 = (typeof this.fullData.gain4).toString() === 'object' ? '0' : this.fullData.gain4;
    this.resultData.gain5 = (typeof this.fullData.gain5).toString() === 'object' ? '0' : this.fullData.gain5;

    this.resultData.changeBegin = this.TWtodate;
    this.resultData.changeEnd = '9991231';
    this.resultData.effectDate = this.TWtodate;
    this.resultData.INCurrency = this.fullData.INCurrency;
    this.resultData.trnsToken = this.fullData.trnsToken;
  }
  //0717新增
  getPayEvaFlag() {
    if ((this.fullData.decline1Cd !== this.ori.declineAndGain.decline1Cd)
      || (this.fullData.decline1 !== this.splitAmount(this.ori.declineAndGain.decline1))
      || (this.fullData.decline2Cd !== this.ori.declineAndGain.decline2Cd)
      || (this.fullData.decline2 !== this.splitAmount(this.ori.declineAndGain.decline2))
      || (this.fullData.decline3Cd !== this.ori.declineAndGain.decline3Cd)
      || (this.fullData.decline3 !== this.splitAmount(this.ori.declineAndGain.decline3))
      || (this.fullData.decline4Cd !== this.ori.declineAndGain.decline4Cd)
      || (this.fullData.decline4 !== this.splitAmount(this.ori.declineAndGain.decline4))
      || (this.fullData.decline5Cd !== this.ori.declineAndGain.decline5Cd)
      || (this.fullData.decline5 !== this.splitAmount(this.ori.declineAndGain.decline5))
      || (this.fullData.gain1Cd !== this.ori.declineAndGain.gain1Cd)
      || (this.fullData.gain1 !== this.splitAmount(this.ori.declineAndGain.gain1))
      || (this.fullData.gain2Cd !== this.ori.declineAndGain.gain2Cd)
      || (this.fullData.gain2 !== this.splitAmount(this.ori.declineAndGain.gain2))
      || (this.fullData.gain3Cd !== this.ori.declineAndGain.gain3Cd)
      || (this.fullData.gain3 !== this.splitAmount(this.ori.declineAndGain.gain3))
      || (this.fullData.gain4Cd !== this.ori.declineAndGain.gain4Cd)
      || (this.fullData.gain4 !== this.splitAmount(this.ori.declineAndGain.gain4))
      || (this.fullData.gain5Cd !== this.ori.declineAndGain.gain5Cd)
      || (this.fullData.gain5 !== this.splitAmount(this.ori.declineAndGain.gain5))) {
      return "Y";
    }
    this._logger.log('EvaFlag', this.fullData.decline5Cd, this.ori.declineAndGain.decline5Cd)
    return "N";
  }

  splitAmount(amount, type?: boolean) {
    let returnData = '';
    returnData = amount.split('.');
    if (!!type) {
      if (returnData.length == 2) {
        if (returnData[1] != '00') {
          return amount;
        }
      }
    }
    return returnData[0];
  }

  // 切換至結果頁面
  goToResult() {
    this._logger.step('FUND', 'agreeConfirmNote: ', this.agreeConfirmNote);
    // 安控變數設置
    this.securityObj = {
      'action': 'submit',
      'sendInfo': this.userAddress.SEND_INFO
    };
  }

  dateSelect() {
    this.nowPageType = 'dateSelectPage';
    // this._dateSelect.show(this.dateArr, this.setRadio , {
    //   title: '日期選單'
    // }).then(
    //   (S) => {
    //     this._logger.step('FUND', '成功:', S);
    //   },
    //   (F) => {

    //   }
    // );
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
  // 同意事項頁面- 條款一勾選
  agreeNote1Click() {
    this.agreeNote.note1 = !this.agreeNote.note1;
  }
  // 同意事項頁面- 條款二勾選
  agreeNote2Click() {
    this.agreeNote.note2 = !this.agreeNote.note2;
  }
  // 同意事項頁面- 條款三勾選
  agreeNote3Click() {
    this.agreeNote.note3 = !this.agreeNote.note3;
  }
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
      p: this.fundCode
    };
    this._logger.step('FUND', 'linkToBook2: ', params);
    this.navgator.push('web:fund-info', {}, params);
  }
  // 確認頁 - 勾選已閱讀上開條款
  agreeConfirm() {
    this.agreeConfirmNote = !this.agreeConfirmNote;
  }

  salesChange() {
    if (this.nowSales != '請選擇理財專員') {
      this.salesChangeFlag = false;
    } else {
      this.salesChangeFlag = true;
    }
  }

  amntChange() {
    const check_obj = this._errorCheck.checkMoney(this.purchAmnt, { currency: this.fullData.INCurrency, not_zero: false }); // 金額檢核
    if (check_obj.status) {
      this.errorMsg.money = '';
    } else {
      this.errorMsg.money = check_obj.msg;
    }
    this._logger.step('FUND', 'CHnage: ', check_obj);
  }

  // 檢查漲跌幅
  checkDecline1() {
    //先做基本檢核，是否為數字
    let checkBasic = this._checkService.checkMoney(this.fullData.decline1, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkBasic['status'] == false) {
      this.checkGain.decline1 = true;
      this.checkGain.decline1_msg = checkBasic['msg'];
      return;
    }
    this._logger.step('FUND', '檢查漲跌幅: ', parseInt(this.fullData.decline1, 10) % this.getVaryList[0]);
    if (parseInt(this.fullData.decline1, 10) % this.getVaryList[0] !== 0) {
      this._handleError.handleError({
        type: 'dialog',
        title: 'POPUP.NOTICE.TITLE',
        content: '-5% >= 評價 >= -10% 須為' + this.getVaryList[0] + ' 倍數'
      });
      this.checkGain.decline1 = true;
      this.checkGain.decline1_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      this.checkGain.decline1 = false;
      this.checkGain.decline1_msg = '';
    }

  }

  checkDecline2() {
    //先做基本檢核，是否為數字
    let checkBasic = this._checkService.checkMoney(this.fullData.decline2, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkBasic['status'] == false) {
      this.checkGain.decline2 = true;
      this.checkGain.decline2_msg = checkBasic['msg'];
      return;
    }
    if (parseInt(this.fullData.decline2, 10) % this.getVaryList[0] !== 0) {
      this._handleError.handleError({
        type: 'dialog',
        title: 'POPUP.NOTICE.TITLE',
        content: '-10% >= 評價 >= -15% 須為' + this.getVaryList[0] + ' 倍數'
      });
      this.checkGain.decline2 = true;
      this.checkGain.decline2_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      this.checkGain.decline2 = false;
      this.checkGain.decline2_msg = '';
    }
  }

  checkDecline3() {
    //先做基本檢核，是否為數字
    let checkBasic = this._checkService.checkMoney(this.fullData.decline3, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkBasic['status'] == false) {
      this.checkGain.decline3 = true;
      this.checkGain.decline3_msg = checkBasic['msg'];
      return;
    }
    if (parseInt(this.fullData.decline3, 10) % this.getVaryList[0] !== 0) {
      this._handleError.handleError({
        type: 'dialog',
        title: 'POPUP.NOTICE.TITLE',
        content: '-15% >= 評價 >= -20% 須為' + this.getVaryList[0] + ' 倍數'
      });
      this.checkGain.decline3 = true;
      this.checkGain.decline3_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      this.checkGain.decline3 = false;
      this.checkGain.decline3_msg = '';
    }
  }

  checkDecline4() {
    //先做基本檢核，是否為數字
    let checkBasic = this._checkService.checkMoney(this.fullData.decline4, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkBasic['status'] == false) {
      this.checkGain.decline4 = true;
      this.checkGain.decline4_msg = checkBasic['msg'];
      return;
    }
    if (parseInt(this.fullData.decline4, 10) % this.getVaryList[0] !== 0) {
      this._handleError.handleError({
        type: 'dialog',
        title: 'POPUP.NOTICE.TITLE',
        content: '-20% >= 評價 >= -25% 須為' + this.getVaryList[0] + ' 倍數'
      });
      this.checkGain.decline4 = true;
      this.checkGain.decline4_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      this.checkGain.decline4 = false;
      this.checkGain.decline4_msg = '';
    }
  }

  checkDecline5() {
    //先做基本檢核，是否為數字
    let checkBasic = this._checkService.checkMoney(this.fullData.decline5, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkBasic['status'] == false) {
      this.checkGain.decline5 = true;
      this.checkGain.decline5_msg = checkBasic['msg'];
      return;
    }
    if (parseInt(this.fullData.decline5, 10) % this.getVaryList[0] !== 0) {
      this._handleError.handleError({
        type: 'dialog',
        title: 'POPUP.NOTICE.TITLE',
        content: '-25% >= 評價 須為' + this.getVaryList[0] + ' 倍數'
      });
      this.checkGain.decline5 = true;
      this.checkGain.decline5_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      this.checkGain.decline5 = false;
      this.checkGain.decline5_msg = '';
    }
  }

  checkGain1() {
    //先做基本檢核，是否為數字
    let checkBasic = this._checkService.checkMoney(this.fullData.gain1, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkBasic['status'] == false) {
      this.checkGain.gain1 = true;
      this.checkGain.gain1_msg = checkBasic['msg'];
      return;
    }
    if (parseInt(this.fullData.gain1, 10) % this.getVaryList[0] !== 0) {
      this._handleError.handleError({
        type: 'dialog',
        title: 'POPUP.NOTICE.TITLE',
        content: '+10% >= 評價 >= +15% 須為' + this.getVaryList[0] + ' 倍數'
      });
      this.checkGain.gain1 = true;
      this.checkGain.gain1_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      this.checkGain.gain1 = false;
      this.checkGain.gain1_msg = '';
    }
  }

  checkGain2() {
    //先做基本檢核，是否為數字
    let checkBasic = this._checkService.checkMoney(this.fullData.gain2, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkBasic['status'] == false) {
      this.checkGain.gain2 = true;
      this.checkGain.gain2_msg = checkBasic['msg'];
      return;
    }
    if (parseInt(this.fullData.gain2, 10) % this.getVaryList[0] !== 0) {
      this._handleError.handleError({
        type: 'dialog',
        title: 'POPUP.NOTICE.TITLE',
        content: '+10% >= 評價 >= +15% 須為' + this.getVaryList[0] + ' 倍數'
      });
      this.checkGain.gain2 = true;
      this.checkGain.gain2_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      this.checkGain.gain2 = false;
      this.checkGain.gain2_msg = '';
    }
  }

  checkGain3() {
    //先做基本檢核，是否為數字
    let checkBasic = this._checkService.checkMoney(this.fullData.gain3, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkBasic['status'] == false) {
      this.checkGain.gain3 = true;
      this.checkGain.gain3_msg = checkBasic['msg'];
      return;
    }
    if (parseInt(this.fullData.gain3, 10) % this.getVaryList[0] !== 0) {
      this._handleError.handleError({
        type: 'dialog',
        title: 'POPUP.NOTICE.TITLE',
        content: '+15% >= 評價 >= +20% 須為' + this.getVaryList[0] + ' 倍數'
      });
      this.checkGain.gain3 = true;
      this.checkGain.gain3_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      this.checkGain.gain3 = false;
      this.checkGain.gain3_msg = '';
    }
  }

  checkGain4() {
    //先做基本檢核，是否為數字
    let checkBasic = this._checkService.checkMoney(this.fullData.gain4, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkBasic['status'] == false) {
      this.checkGain.gain4 = true;
      this.checkGain.gain4_msg = checkBasic['msg'];
      return;
    }
    if (parseInt(this.fullData.gain4, 10) % this.getVaryList[0] !== 0) {
      this._handleError.handleError({
        type: 'dialog',
        title: 'POPUP.NOTICE.TITLE',
        content: '+20% >= 評價 >= +25% 須為' + this.getVaryList[0] + ' 倍數'
      });
      this.checkGain.gain4 = true;
      this.checkGain.gain4_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      this.checkGain.gain4 = false;
      this.checkGain.gain4_msg = '';
    }
  }
  checkGain5() {
    //先做基本檢核，是否為數字
    let checkBasic = this._checkService.checkMoney(this.fullData.gain5, {
      // currency: this.fullData.INCurrency,
      currency: 'POSITIVE',
      not_zero: false //允許輸入0
    });
    if (checkBasic['status'] == false) {
      this.checkGain.gain5 = true;
      this.checkGain.gain5_msg = checkBasic['msg'];
      return;
    }
    if (parseInt(this.fullData.gain5, 10) % this.getVaryList[0] !== 0) {
      this._handleError.handleError({
        type: 'dialog',
        title: 'POPUP.NOTICE.TITLE',
        content: '+25% >= 評價 須為' + this.getVaryList[0] + ' 倍數'
      });
      this.checkGain.gain5 = true;
      this.checkGain.gain5_msg = '須為' + this.getVaryList[0] + ' 倍數';
    } else {
      this.checkGain.gain5 = false;
      this.checkGain.gain5_msg = '';
    }
  }

  showDisabled(val) {
    this.radioVal = val;
    this.nowOutType.trnsfrOutAccnt = this.df_trnsfrOutAccnt; //扣款帳號
    this.nowInType.trnsfrInAccnt = this.df_trnsfrInAccnt; //收益帳號
  }

  /**
   * 檢查帳號狀態
   * 無帳號時，暫不提示客戶
   */
  private checkDefaultAcnt(regularResult) {
    // from 702
    this.OutAC = [];
    this.InAC = [];
    this.df_trnsfrOutAccnt = this._formateService.checkField(this.fullData, 'payAcnt'); //702預設 扣款
    this.df_trnsfrInAccnt = this._formateService.checkField(this.fullData, 'profitAcnt'); //702預設 收益
    let check_curr = this.fullData['INCurrency'].toString().toUpperCase(); //中台有可能傳不是大寫
    let listData = [];
    let data_name = '';
    if (check_curr != 'NTD' && check_curr != 'TWD') {
      // 外幣
      listData = (typeof regularResult.frgn_data != 'undefined') ? regularResult.frgn_data : [];
      data_name = 'frgnAcntNo';
    } else {
      // 台幣
      listData = (typeof regularResult.twAcnt_data != 'undefined') ? regularResult.twAcnt_data : [];
      data_name = 'twAcntNo';
    }
    if (typeof listData == 'object' && (listData instanceof Array) && listData.length > 0) {
      // 清單不為空
      let i = 0;
      listData.forEach((itemList) => {
        let set_tmp_acnt = this._formateService.checkField(itemList, data_name);
        if (set_tmp_acnt != '') {
          this.OutAC[i] = set_tmp_acnt;
          this.InAC[i] = set_tmp_acnt;
          if (this.df_trnsfrOutAccnt == this.OutAC[i]) {
            this.nowOutType.trnsfrOutAccnt = this.OutAC[i];
            this._logger.log("outAcct ==");
          }
          if (this.df_trnsfrInAccnt == this.InAC[i]) {
            this.nowInType.trnsfrInAccnt = this.InAC[i];
            this._logger.log("inAcct ==");
          }
          i++;
        }
      });
      // 有清單，但預設不再清單內(例外)
      setTimeout(() => {
        if (!!this.df_trnsfrOutAccnt
          && (!this.nowOutType.trnsfrOutAccnt || this.nowOutType.trnsfrOutAccnt == '')
        ) {
          this._logger.log("outAcct !==");
          this.OutAC[i] = this.df_trnsfrOutAccnt;
          this.nowOutType.trnsfrOutAccnt = this.OutAC[i];
        } else if (!this.df_trnsfrOutAccnt) {
          this.please_trnsfrOutAccnt = true;
        }
        if (!!this.df_trnsfrInAccnt
          && (!this.nowInType.trnsfrInAccnt || this.nowInType.trnsfrInAccnt == '')
        ) {
          this._logger.log("inAcct !==");
          this.InAC[i] = this.df_trnsfrInAccnt;
          this.nowInType.trnsfrInAccnt = this.InAC[i];
        } else if (!this.df_trnsfrInAccnt) {
          this.please_trnsfrInAccnt = true;
        }
      }, 500);
    } else {
      // 清單為空
      // 702 default: tempTw is empty
      if (!!this.df_trnsfrOutAccnt) {
        this.OutAC = [this.df_trnsfrOutAccnt];
        this.nowOutType.trnsfrOutAccnt = this.OutAC[0];
      } else {
        this.OutAC = [];
        this.nowOutType.trnsfrOutAccnt = '';
      }
      if (!!this.df_trnsfrInAccnt) {
        this.InAC = [this.df_trnsfrInAccnt];
        this.nowInType.trnsfrInAccnt = this.InAC[0];
      } else {
        this.InAC = [];
        this.nowInType.trnsfrInAccnt = '';
      }
    }
    this._logger.log("6. OutAC:", this._formateService.transClone(this.OutAC), this.nowOutType.trnsfrOutAccnt);
    this._logger.log("7. InAC:", this._formateService.transClone(this.InAC), this.nowInType.trnsfrInAccnt);
  }


}
