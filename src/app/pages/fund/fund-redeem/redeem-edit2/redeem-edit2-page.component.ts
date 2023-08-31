/**
 * 基金贖回(編輯頁2)
 */
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { FundRedeemService } from '@pages/fund/shared/service/fund-redeem.service';
import { CheckService } from '@shared/check/check.service';
import { checkAndUpdateElementInline } from '@angular/core/src/view/element';
import { AlertService } from '@shared/popup/alert/alert.service';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { FundInformationRedeemRestrict } from '@conf/terms/fund/fund-information-redeem.restrict';
import { FormateService } from '@shared/formate/formate.service';
import { FI000401ApiService } from '@api/fi/fI000401/fI000401-api.service'; // alex0520

@Component({
  selector: 'app-redeem-edit2',
  templateUrl: './redeem-edit2-page.component.html',
  styleUrls: [],
  providers: [FundRedeemService]
})
export class RedeemEdit2PageComponent implements OnInit {
  @Input() inputData: any;
  @Input() onTrnsType: string; // 前一頁傳回，判斷是否為預約
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

  minDay = '';      // 日期可選之最小值
  maxDay = '';      // 日期可選之最大值
  redeem_flag = true;
  show_disable = true; // 鎖住贖回金額
  show_deduction = false; // 顯示繼續扣款
  showPage = 'redeem-edit2'; // 控制頁面

  // 全部、部分
  redeem_obj = [
    { mode: '全部贖回' },
    { mode: '部分贖回' }
  ];
  // 繼續、部繼續
  redeem_continue = [
    { mode: '繼續' },
    { mode: '不繼續' }
  ];
  // 單筆、小額
  redeem_investType = [
    { mode: '單筆' },
    { mode: '小額' }
  ];
  // 綁ngModel值
  inp_data = {
    redeemAmnt: '',
    redeemAcnt: '',
    redeemType: '',
    isContinue: '',
    date: ''
  };
  reserveDate = '';
  // 初始值
  defaultAmnt = '';
  // 贖回方式(紀錄狀態)
  re_status = '';
  status = true;

  // 送fi000503request (確認頁)
  reqData = {
    custId: '',
    trustAcnt: '',
    transCode: '',
    fundCode: '',
    investType: '',
    inCurrency: '',
    amount: '',
    unit: '',
    redeemAmnt: '',
    redeemAcnt: '',
    redeemType: '',
    isContinue: '',
    redeem_date: '' // 存贖回日期
  };
  today = ''; // 預設今天
  today_clone = '';
  nowToResver = false;
  // 檢核flag(紅框)
  check_redeemType = false;
  check_isContinue = false;
  check_redeemAmnt = false;
  check_redeemAcnt = false;
  check_date = false;

  saveAmount = {}; // 檢核贖回金額
  amount_error = ''; // 金額error訊息
  saveDate = {}; // 檢核贖回日期
  date_error = ''; // 日期error訊息

  // fi000502 request (取得贖轉約定帳號) => 廢除by wei@20190903
  // req502 = {
  //   custId: '',
  //   trnsType: '1',
  //   currency: ''
  // };
  // fi000502 request (取得贖轉約定帳號,預約) => 廢除by wei@20190903
  // req502_resver = {
  //   custId: '',
  //   trnsType: '2',
  //   currency: ''
  // };
  info_data: any = {}; // 存502res
  data: any = []; // 存502res
  info_401: any = {}; // alex0520

  appli_info_data: any = {}; // 存503res(贖回申請)

  constructor(
    private _logger: Logger
    , private router: Router
    , private confirm: ConfirmService
    , private _handleError: HandleErrorService
    , private navgator: NavgatorService
    , private _headerCtrl: HeaderCtrlService
    , private _mainService: FundRedeemService
    , private _checkService: CheckService
    , private alert: AlertService
    , private infomationService: InfomationService
    , private _formateServcie: FormateService
    , private _fi000401Service: FI000401ApiService // alex0520

  ) {
  }

  ngOnInit() {
    this._initEvent();

    this._fi000401Service.getAgreeNew().then((resObj) => { // alex0520
      this.info_401 = resObj;
    });

    this.show_disable = true;
    this.show_deduction = false;
    if (this.inputData.iNCurrency == 'TWD' || this.inputData.iNCurrency == 'NTD' || this.inputData.iNCurrency == 'JPY') {
      //  台幣金額去掉小數點
      this.inp_data['redeemAmnt'] = this.inputData.invenAmount.substr(0, this.inputData.invenAmount.indexOf('.'));
    } else {
      this.inp_data['redeemAmnt'] = this.inputData.invenAmount;
    }
    // this._logger.log('FUND', 'inputData.redeemAmnt:', this.inp_data['redeemAmnt']);
    // this._logger.log('FUND', 'inputData.invenAmount:', this.inputData.invenAmount);
    this.defaultAmnt = this.inputData.invenAmount;
    // this.req502['currency'] = this.inputData['iNCurrency'];
    // this.req502_resver['currency'] = this.inputData['iNCurrency'];
    //  抓取今天時間，帶入預設日期
    let dateType = '';
    if (this.onTrnsType == '2') {
      dateType = 'resver';
      this.nowToResver = true;
    } else {
      dateType = 'now';
    }
    this.today = this._mainService.setToday(dateType);

    this.today_clone = this._formateServcie.transClone(this.today).replace(/-/g, '/');
    // this.today_clone yyyymmdd 2019/12/19
    this.inp_data['date'] = this.today;
    // this._logger.log('line 134 req502:', this.req502);
    // this._logger.log('line 135 req502_resver:', this.req502_resver);

    const date_data = this._checkService.getDateSet({
      baseDate: 'today', // 基礎日
      rangeType: 'M', // "查詢範圍類型" M OR D
      rangeNum: '6', // 查詢範圍限制
      rangeDate: '' // 比較日
    }, 'future');
    this.maxDay = date_data.maxDate;
    this.minDay = date_data.minDate;
    if (this.onTrnsType == '2') {
      this.minDay = this.today;
    }

    // == 取得存入帳號(約轉出) == //
    this._getRedeemAcnt(this.onTrnsType, true);

    // 將前一頁使用者資料帶入request [TODO: 要防呆判斷]
    this.reqData['amount'] = this.inputData['invenAmount'];
    this.reqData['fundCode'] = this.inputData['fundCode'];
    this.reqData['inCurrency'] = this.inputData['iNCurrency'];
    this.reqData['investType'] = this.inputData['investType'];
    this.reqData['transCode'] = this.inputData['transCode'];
    this.reqData['trustAcnt'] = this.inputData['trustAcnt'];
    this.reqData['unit'] = this.inputData['unit'];
  }

  private _initEvent() {
    this._logger.log('inputData:', this.inputData);
    this._headerCtrl.setLeftBtnClick(() => {
      this.onBackPageData2();
    });
  }


  // 贖回方式欄位變化
  onChangeRedeem() {
    this._logger.log('inp_data:', this.inp_data);
    // 全部贖回
    if (this.inp_data['redeemType']['mode'] == this.redeem_obj[0]['mode']) {
      this.check_redeemAmnt = false;
      // 不是小額：2，不出現選擇繼續or不繼續
      if (this.inputData['investType'] == '2') {
        this._logger.log('line 183 regular show!!');
        this.show_deduction = true;
      } else {
        this._logger.log('line 186 single display!!');
        this.show_deduction = false;
      }
      this.reqData['redeemType'] = '1';
      this.show_disable = true;
      //  this.show_deduction = true;
      this.inp_data['redeemAmnt'] = this.defaultAmnt; // 切回全部，給回初始值
      this.inp_data['isContinue'] = '';
      this.reqData['isContinue'] = '';
      this.re_status = 'all'; // 紀錄狀態
      // 部分贖回
    } else if (this.inp_data['redeemType']['mode'] == this.redeem_obj[1]['mode']) {
      this.reqData['redeemType'] = '2';
      this.show_disable = false;
      this.show_deduction = false;
      this.inp_data['redeemAmnt'] = '';
      this.reqData['isContinue'] = 'Y'; // 部分贖回，固定續扣(Y)
      this.re_status = 'part'; // 紀錄狀態
    }
    this._logger.log('line 104 reqData:', this.reqData);
  }

  // 繼續扣款欄位變化
  onChangeDeduction() {
    // 繼續
    if (this.inp_data['isContinue']['mode'] == this.redeem_continue[0]['mode']) {
      this.reqData['isContinue'] = 'Y'; // 繼續扣款
      // 不繼續
    } else if (this.inp_data['isContinue']['mode'] == this.redeem_continue[1]['mode']) {
      this.reqData['isContinue'] = 'N'; // 不繼續
    }
    this._logger.log('line 116 this.reqData:', this.reqData);
  }

  //檢核幣別金額級距
  checkMoneyRule(invenAmount) {
    this._logger.log("into checkMoneyRule");
    let output = {
      status: false,
      msg: '',
      value: invenAmount
    };
    let rule = {
      TWD: 10000,
      NTD: 10000,
      USD: 100,
      EUR: 100,
      GBP: 100,
      AUD: 100,
      CHF: 100,
      CAD: 100,
      HKD: 1000,
      SEK: 1000,
      JPY: 10000,
      CNY: 1000,
      ZAR: 1000,
      NZD: 100,
      SGD: 100
    };
    let moneyRange = 0;
    switch (this.inputData.iNCurrency) {
      case 'TWD':
        moneyRange = rule.TWD;
        break;
      case 'NTD':
        moneyRange = rule.NTD;
        break;
      case 'USD':
        moneyRange = rule.USD;
        break;
      case 'EUR':
        moneyRange = rule.EUR;
        break;
      case 'GBP':
        moneyRange = rule.GBP;
        break;
      case 'AUD':
        moneyRange = rule.AUD;
        break;
      case 'CHF':
        moneyRange = rule.CHF;
        break;
      case 'CAD':
        moneyRange = rule.CAD;
        break;
      case 'HKD':
        moneyRange = rule.HKD;
        break;
      case 'SEK':
        moneyRange = rule.SEK;
        break;
      case 'JPY':
        moneyRange = rule.JPY;
        break;
      case 'CNY':
        moneyRange = rule.CNY;
        break;
      case 'ZAR':
        moneyRange = rule.ZAR;
        break;
      case 'NZD':
        moneyRange = rule.NZD;
        break;
      case 'SGD':
        moneyRange = rule.SGD;
        break;
      default:
        moneyRange = 0;
        break;
    }
    if (invenAmount % moneyRange != 0) {
      output.status = false;
      output.msg = '輸入需為幣別單位' + moneyRange.toString();
    } else {
      output.status = true;
      output.msg = '';
    }
    return output;
  }

  /**
   * 重新設定page data
   * @param item
   */
  onBackPageData(item, page?) {
    const output = {
      'page': 'list-item',
      'type': 'page_info',
      'data': item
    };
    // 明細頁面點查詢
    if (page === 'stock-detail-query') {
      output.page = page;
    }
    this.backPageEmit.emit(output);
  }

  // 返回清單
  onBackPageData2() {
    // this._logger.log('FUND', '檢查onBackPageData2:');
    this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
      title: '提醒您'
    }).then(
      () => {
        const output = {
          'page': 'redeem-edit2',
          'type': 'page_info',
          'data': ''
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
      'page': 'list-item',
      'type': 'error',
      'data': error_obj
    };

    this.errorPageEmit.emit(output);
  }

  /**
   * 子層返回事件(接收)
   * @param e
   */
  onPageBackEvent(e) {
    this._logger.log('FUND', 'onPageBackEvent', e);
    let page = 'list';
    let pageType = 'list';
    let tmp_data: any;
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
    }
    if (page == 'redeem-restrict' && pageType == 'success') {
      this.showPage = 'redeem-edit2';
      // } else if (page == 'redeem-confirm' && pageType == 'page_info') {
      //   // confrim 回來的事件 繼續往清單拋送
      //   this.onBackPageData2();
    } else if (page == 'confirm') {
      this.showPage = 'redeem-edit2';
      this._initEvent();
    }
    // this._logger.log('page:', page);
    // this._logger.log('pageType:', pageType);
    // this._logger.log('tmp_data:', tmp_data);
  }

  /**
  * 失敗回傳(分頁)
  * @param error_obj 失敗物件
  */
  onErrorPageEvent(e) {
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
    //  列表頁：首次近來錯誤推頁
    errorObj['type'] = 'dialog';
    this._handleError.handleError(errorObj);
  }

  // 點擊下一步
  async onNext() {
    this._logger.log('line 105 inp_data:', this.inp_data);
    this.reqData['redeemAmnt'] = this.inp_data['redeemAmnt'];
    this.reqData['redeemAcnt'] = this.inp_data['redeemAcnt'];
    this._logger.log('line 166 reqData:', this.reqData);
    // 檢核贖回方式欄位
    if (this.inp_data['redeemType'] == '') {
      this.check_redeemType = true;
    } else {
      this.check_redeemType = false;
    }
    // 檢核贖回金額欄位
    this.saveAmount = this._checkService.checkMoney(this.inp_data.redeemAmnt);
    this._logger.log('saveAmount:', this.saveAmount);
    if (this.saveAmount['status'] == false) {
      this.check_redeemAmnt = true;
      this.amount_error = this.saveAmount['msg'];
    } else {
      this.check_redeemAmnt = false;
      this.reqData['redeemAmnt'] = this.inp_data['redeemAmnt'];
    }
    // 檢核存入帳號
    if (this.inp_data['redeemAcnt'] == '') {
      this.check_redeemAcnt = true;
    } else {
      this.check_redeemAcnt = false;
      this.reqData['redeemAcnt'] = this.inp_data['redeemAcnt']['account'];
    }
    // 檢核贖回日期
    this.saveDate = this._checkService.checkDate(this.inp_data['date']);
    this._logger.log('saveDate:', this.saveDate);
    if (this.saveDate['status'] == false) {
      this.check_date = true;
      this.date_error = this.saveDate['msg'];
    } else {
      this.check_date = false;
      this.date_error = '';
    }
    this.reqData['redeem_date'] = this.saveDate['formate'];

    // 部分贖回時
    if (this.inp_data['redeemType']['mode'] == this.redeem_obj[1]['mode']) {
      this._logger.log('line 296 into part redeem!');
      // 必須有值
      if (this.inp_data['redeemAmnt'] == '') {
        await this.alert.show('請輸入贖回金額。', {
          title: '提醒您',
          btnTitle: '我知道了',
        }).then(
          () => {
            //  選擇取消
          }
        );
        return false;
      }
      // 贖回金額大於信託本金，跳提示
      if (parseInt(this.inp_data['redeemAmnt']) >= parseInt(this.inputData['invenAmount'])) {
        await this.alert.show('贖回金額必須小於信託本金', {
          title: '提醒您',
          btnTitle: '我知道了',
        }).then(
          () => {
            //  選擇取消
          }
        );
        return false;
      }
      //2020/06/05 依據清福提出，目前關閉台幣相關金額 1.級距、2.最低金額
      // 幣別為NTD，贖回金額小於1萬，跳提示
      // if ((this.inputData['iNCurrency'] == 'NTD' || this.inputData['iNCurrency'] == 'TWD') && parseInt(this.inp_data['redeemAmnt']) < 10000) {
      //   await this.alert.show('贖回金額不得低於1萬元', {
      //     title: '提醒您',
      //     btnTitle: '我知道了',
      //   }).then(
      //     () => {
      //       //  選擇取消
      //     }
      //   );
      //   return false;
      // }
      //2020/06/05 依據清福提出，目前關閉台幣相關金額 1.級距、2.最低金額， 非台幣才會進去判斷金額級距
      if (this.inputData.iNCurrency != 'TWD' && this.inputData.iNCurrency != 'NTD') {
        this._logger.log("into another iNCurrency");
      //金額級距檢核
      let checkMoney = this.checkMoneyRule(this.inp_data.redeemAmnt);
      this.amount_error = checkMoney['msg'];
      if (checkMoney['status'] == false) {
        this.check_redeemAmnt = true;
        return false;
      } else {
        this.check_redeemAmnt = false;
      }
      } else {
        this.check_redeemAmnt = false;
      }
    }

    // 點擊下一步，該筆不是小額：2，繼續or不繼續欄位為空(request)
    if (this.inputData['investType'] !== '2') {
      this.reqData['isContinue'] = '';
    }
    // 狀態為：全部贖回
    if (this.re_status == 'all') {
      this.checkAll();
      // 狀態為：部分贖回
    } else if (this.re_status == 'part') {
      this.checkPart();
    } else {
      return false;
    }

    // 發fi000503電文(贖回申請)
    if (this.status == true && this.nowToResver == false) {
      // 非預約
      this._logger.log('line 388 503request reqData:', this.reqData);
      this._mainService.getRedeemAppli(this.reqData).then(
        (result) => {
          this.appli_info_data = result.info_data;
          this.appli_info_data.branchName = this.info_401.branchName; // alex0520
          this.appli_info_data.unitCall = this.info_401.unitCall;
          this.showPage = 'redeem-confirm';
          this._logger.log('appli_info_data:', this.appli_info_data);
        },
        (errorObj) => {
          this.onErrorBackEvent(errorObj);
        }
      );
      // 預約
    } else if (this.status == true && this.nowToResver == true) {
      this._mainService.getRedeemAppli_resver(this.reqData).then(
        (result) => {
          this.appli_info_data = result.info_data;
          this.appli_info_data.branchName = this.info_401.branchName; // alex0520
          this.appli_info_data.unitCall = this.info_401.unitCall;
          // 成功後，切換至確認頁
          this.showPage = 'redeem-confirm';
          this._logger.log('appli_info_data, resver:', this.appli_info_data);
        },
        (errorObj) => {
          this.onErrorBackEvent(errorObj);
        }
      );
    } else {
      return false;
    }
  }

  private checkAll() {
    // 檢核繼續扣款欄位
    if (this.inp_data['isContinue'] == '') {
      this.check_isContinue = true;
    } else {
      this.check_isContinue = false;
    }
    // 小額，需判斷使用者有無選擇續扣
    if (this.inputData['investType'] == '2') {
      if (this.inp_data['redeemType'] !== '' && this.inp_data['isContinue'] !== ''
        && this.saveAmount && this.inp_data['redeemAcnt'] !== ''
        && this.saveDate) {
        this.status = true;
        this._logger.log('reqData:', this.reqData);
      } else {
        this.status = false;
        return false;
      }
      // 不是小額，不須判斷續扣欄位
    } else {
      if (this.inp_data['redeemType'] !== '' && this.saveAmount
        && this.inp_data['redeemAcnt'] !== '' && this.saveDate) {
        this.status = true;
        this._logger.log('reqData:', this.reqData);
      } else {
        this.status = false;
        return false;
      }
    }
  }

  private checkPart() {
    // 全過才進下一頁(繼續扣款不須檢核)
    if (this.inp_data['redeemType'] !== '' && this.saveAmount
      && this.inp_data['redeemAcnt'] !== '' && this.saveDate) {
      this.status = true;
      this._logger.log('reqData:', this.reqData);
    } else {
      this.status = false;
      return false;
    }
  }

  // 選擇日期
  onInputBack(e) {
    // 判斷選擇日期

    let trnsType = '1';
    if (this.onTrnsType == '1') {
      if (e.replace(/-/g, '/') != this.today_clone.replace(/-/g, '/')) {
        trnsType = '2';
        this.nowToResver = true;
      } else {
        trnsType = '1';
        this.nowToResver = false;
      }
    } else if (this.onTrnsType == '2') {
      trnsType = '2';
    }
    this.inp_data['date'] = e;
    // 贖回
    this.inp_data['redeemAcnt'] = '';
    this._getRedeemAcnt(trnsType, false);
  }
  // 點擊上一步
  onCancel() {
    this.onBackPageData2();
  }

  //  贖回限制
  onRedeemRestrictPopoup() {
    // this.showPage = 'redeem-restrict-popuop';
    const set_data = new FundInformationRedeemRestrict();
    this.infomationService.show(set_data);
  }


  //  --------------------------------------------------------------------------------------------
  //   ____       _            _         _____                 _
  //   |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //   | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //   |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //   |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  //  --------------------------------------------------------------------------------------------

  /**
   * 存入帳號取得
   */
  private _getRedeemAcnt(trnsType, check?: boolean) {
    let send_data: any = {
      custId: '',
      trnsType: trnsType,
      currency: this._formateServcie.checkField(this.inputData, 'iNCurrency')
    };
    // this.req502.currency = send_data.currency;
    // this.req502_resver.currency = send_data.currency;
    this._mainService.getRedeemAct(send_data).then(
      (result) => {
        this.info_data = result.info_data;
        this.data = result.data;
        this._logger.log('get data:', this.data);

        // 不一定有資料
        if (!!check) {
          if (!this.data || this.data.length < 1) {
            this.alert.show('查無「存入帳號」', {
              title: '提醒您',
              btnTitle: '我知道了',
            }).then(
              () => {
                // no do
              }
            );
          }
        }
      },
      (errorObj) => {
        this.onErrorBackEvent(errorObj);
      }
    );
  }

}
