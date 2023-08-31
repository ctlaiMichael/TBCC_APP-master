/**
 * 變更現金收益存入帳號內容頁
 */
import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { ConvertResultService } from '@pages/fund/shared/service/convert-result.service';
import { ConvertResultReserveService } from '@pages/fund/shared/service/convert-result-reserve.service';
import { ConvertResultMultipleService } from '@pages/fund/shared/service/convert-result-multiple.service';

@Component({
  selector: 'app-fund-convert-result',
  templateUrl: './fund-convert-result.component.html',
  styleUrls: [],
  providers: [
    ConvertResultService,
    ConvertResultReserveService,
    ConvertResultMultipleService
  ]
})
export class FundConvertResultComponent implements OnInit {
  @Input() convertTypeContent: any;
  @Input() reservFlag: any;
  @Input() setData: any;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

  newsNo: any = ''; // 消息編號
  unitType: string;
  trnsInAccts = []; // 轉入帳號
  nowType: any = {};
  trnsRsltCode = '';
  hostCodeMsg = '';
  showDateStr = '';
  payAcntStatusName = '';
  erroMsg = '';
  processing = true; // 顯示處理中

  fullData = {
    custId: '',
    hostCode: '',
    hostCodeMsg: '',
    trnsRsltCode: '',
    trnsDatetime: '',
    item: '',
    trustAcnt: '',
    transCode: '',
    fundCode: '',
    fundName: '',
    investType: '',
    investTypeDesc: '',
    currency: '',
    inCurrency: '',
    amount: '',
    unit: '',
    outAmount: '',
    outUnit: '',
    enrollDate: '',
    effectDate: '',
    payAccount: '',
    redeemType: '',
    redeemTypeDesc: '',
    inFundCode: '',
    inFundName: '',
    bankSrvFee: '',
    fndComSrvFee: '',
    totalFee: '',
    shortLineAmt: '',
  };
  fullData2 = {
    custId: '',
    hostCode: '',
    hostCodeMsg: '',
    trnsRsltCode: '',
    trnsDatetime: '',
    item: '',
    trustAcnt: '',
    transCode: '',
    fundCode: '',
    fundName: '',
    investType: '',
    investTypeDesc: '',
    currency: '',
    inCurrency: '',
    amount: '',
    unit: '',
    outAmount1: '',
    outAmount2: '',
    outAmount3: '',
    outUnit1: '',
    outUnit2: '',
    outUnit3: '',
    enrollDate: '',
    effectDate: '',
    payAccount: '',
    redeemType: '',
    redeemTypeDesc: '',
    inFundCode1: '',
    inFundName1: '',
    inFundCode2: '',
    inFundName2: '',
    inFundCode3: '',
    inFundName3: '',
    bankSrvFee1: '',
    bankSrvFee2: '',
    bankSrvFee3: '',
    fndComSrvFee1: '',
    fndComSrvFee2: '',
    fndComSrvFee3: '',
    totalFee: '',
    shortLineAmt: '',
  };
  //一轉多使用，判斷是否為空or物件
  inFundName2Empty = false;
  inFundName3Empty = false;
  @Input() e;
  constructor(
    private _logger: Logger
    , private _handleError: HandleErrorService
    , private _headerCtrl: HeaderCtrlService
    , private navgator: NavgatorService
    , private route: ActivatedRoute
    , private confirm: ConfirmService
    , private _convertResult: ConvertResultService
    , private _convertResultReserve: ConvertResultReserveService
    , private _convertResultMultiple: ConvertResultMultipleService
  ) {
  }

  ngOnInit() {
    // --- 頁面設定 ---- //
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'menu'
    });

    this._logger.step('FUND', 'setData:[e] ', this.e);
    this._logger.step('FUND', 'get result Data: ', this.setData);
    this.getData(this.e);
    // this._headerCtrl.setLeftBtnClick(() => {
    //   this.onBackPageData();
    // });
    // --- 頁面設定 End ---- //
    // 設定header
  }

  private getData(e) {
    this._logger.log("into result page getData, e:", e);
    this._logger.log("into result page getData, setData:", this.setData);
    if (this.convertTypeContent == 'SelectSingle') {
      // 一轉一
      let reqData = {
        custId: '',
        trustAcnt: '',
        transCode: '',
        fundCode: '',
        investType: '',
        currency: '',
        inCurrency: '',
        amount: '',
        unit: '',
        outAmount: '',
        outUnit: '',
        enrollDate: '',
        effectDate: '',
        payAccount: '',
        redeemType: '',
        inFundCode: '',
        bankSrvFee: '',
        fndComSrvFee: '',
        trnsToken: ''
      };
      reqData = this.setData;
      this._logger.step('FUND', 'result reqData: ', reqData);
      if (this.reservFlag == false) {
        // 即時轉換
        this._convertResult.getData(reqData, e).then(
          (result) => {
            this.processing = false;
            this.fullData = result.info_data;
            this.trnsRsltCode = this.fullData.trnsRsltCode;
            this.hostCodeMsg = this.fullData.hostCodeMsg;
            this._logger.step('FUND', 'result trnsRsltCode: ', this.trnsRsltCode);
            this._logger.step('FUND', 'result result.info_data', result.info_data);
            this._logger.step('FUND', 'fullData', this.fullData);
            if (this.trnsRsltCode == 'X') {
              this._headerCtrl.updateOption({
                'title': '交易異常'
              });
            } else if (this.trnsRsltCode == '1') {
              this._headerCtrl.updateOption({
                'title': '交易失敗'
              });
            }
          },
          (errorObj) => {
            this.processing = false;
            if (errorObj.hasOwnProperty('body')) {
              this.erroMsg = errorObj.body.respCodeMsg;
            } else {
              this.erroMsg = errorObj.content;
            }
            errorObj['type'] = 'message';
            this._handleError.handleError(errorObj);
          }
        );
      } else {
        // 預約轉換
        this.fullData['reserveTransCode'] = '';
        this._convertResultReserve.getData(reqData, e).then(
          (result) => {
            this.processing = false;
            this.fullData = result.info_data;
            this.trnsRsltCode = this.fullData.trnsRsltCode;
            this.hostCodeMsg = this.fullData.hostCodeMsg;
            this._logger.step('FUND', 'fullData Reserve', this.fullData);
            if (this.trnsRsltCode == 'X') {
              this._headerCtrl.updateOption({
                'title': '交易異常'
              });
            } else if (this.trnsRsltCode == '1') {
              this._headerCtrl.updateOption({
                'title': '交易失敗'
              });
            }
          },
          (errorObj) => {
            this.processing = false;
            if (errorObj.hasOwnProperty('status')) {
              this.erroMsg = errorObj['statusText'];
            } else {
              if (errorObj.hasOwnProperty('respCode')) {
                this.erroMsg = errorObj['respCodeMsg'];
              }
              this.erroMsg = errorObj;
            }
            errorObj['type'] = 'message';
            this._handleError.handleError(errorObj);
          }
        );
      }
    } else {
      // 一轉多
      let reqData = {
        custId: '',
        trustAcnt: '',
        transCode: '',
        fundCode: '',
        investType: '',
        currency: '',
        inCurrency: '',
        amount: '',
        unit: '',
        outAmount1: '',
        outAmount2: '',
        outAmount3: '',
        outUnit1: '',
        outUnit2: '',
        outUnit3: '',
        enrollDate: '',
        effectDate: '',
        payAccount: '',
        redeemType: '',
        inFundCode1: '',
        inFundCode2: '',
        inFundCode3: '',
        bankSrvFee1: '',
        bankSrvFee2: '',
        bankSrvFee3: '',
        fndComSrvFee1: '',
        fndComSrvFee2: '',
        fndComSrvFee3: '',
        trnsToken: ''
      };
      reqData = this.setData;
      this._logger.step('FUND', 'result reqData: ', reqData);
      this._convertResultMultiple.getData(reqData, e).then(
        (result) => {
          this.processing = false;
          this.fullData2 = result.info_data;
          this.trnsRsltCode = this.fullData2.trnsRsltCode;
          this.hostCodeMsg = this.fullData2.hostCodeMsg;
          this._logger.step('FUND', 'fullData', this.fullData2);
          //第2組基金名稱不為空
          if (this.fullData2.inFundCode2 != '' && this.fullData2.inFundCode2 != null &&
            typeof this.fullData2.inFundCode2 != 'object' && this.fullData2.inFundName2 != '' &&
            this.fullData2.inFundName2 != null && typeof this.fullData2.inFundName2 != 'object') {
            this.inFundName2Empty = false;
          } else {
            this.inFundName2Empty = true;
          }
          //第3組基金名稱不為空
          if (this.fullData2.inFundCode3 != '' && this.fullData2.inFundCode3 != null &&
            typeof this.fullData2.inFundCode3 != 'object' && this.fullData2.inFundName3 != '' &&
            this.fullData2.inFundName3 != null && typeof this.fullData2.inFundName3 != 'object') {
            this.inFundName3Empty = false;
          } else {
            this.inFundName3Empty = true;
          }
        },
        (errorObj) => {
          this.processing = false;
          if (errorObj.hasOwnProperty('status')) {
            this.erroMsg = errorObj['statusText'];
          } else {
            if (errorObj.hasOwnProperty('respCode')) {
              this.erroMsg = errorObj['respCodeMsg'];
            }
            this.erroMsg = errorObj;
          }
          errorObj['type'] = 'message';
          this._handleError.handleError(errorObj);
        }
      );
    }

  }

  /**
   * 失敗回傳
   * @param error_obj 失敗物件
   */
  onErrorBackEvent(error_obj) {
    const output = {
      'page': 'result',
      'type': 'error',
      'data': error_obj
    };
    this.errorPageEmit.emit(output);
  }

  public backMenuPage() {
    this.navgator.push('fund');
  }

}
