/**
 * 定期不定額查詢異動內容頁
 */
import { Component, OnChanges, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { PayChangeResultService } from '@pages/fund/shared/service/pay-change-result.service';
import { logger } from '@shared/util/log-util';
import { FormateService } from '@shared/formate/formate.service';

@Component({
  selector: 'app-pay-change-result',
  templateUrl: './pay-change-result.component.html',
  styleUrls: [],
  providers: [
    PayChangeResultService
  ]
})
export class PayChangeResultComponent implements OnInit, OnChanges {
  @Input() code: any;
  @Input() setData: any;
  @Input() e: any;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

  newsNo: any = ''; // 消息編號
  unitType: string;
  trnsInAccts = []; // 轉入帳號
  nowType: any = {};
  trnsRsltCode = '';
  showDateStr = '';
  payAcntStatusName = '';
  erroMsg = '';
  isSuccess = '-1';
  resultData: any = {};

  fullData = {
    trnsRsltCode: '' // trnsRsltCode	交易結果代碼
    , hostCode: '' // hostCode	交易結果
    , hostCodeMsg: '' // hostCodeMsg	主機代碼訊息
    , trnsToken: '' // 交易控制碼
    , custId: '' // custId	身分證字號
    , trustAcnt: '' // trustAcnt	信託帳號
    , transCode: '' // transCode	交易編號
    , fundCode: '' // fundCode	基金代碼
    , fundType: '' // fundType	業務別
    , payTypeFlag: '' // 扣款狀況變更
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
    , investAmnt: ''
  };
  constructor(
    private _logger: Logger
    , private _handleError: HandleErrorService
    , private _headerCtrl: HeaderCtrlService
    , private navgator: NavgatorService
    , private route: ActivatedRoute
    , private _mainService: PayChangeResultService
    , private confirm: ConfirmService
    , private _formateService: FormateService
  ) {
  }

  ngOnInit() {
    // --- 頁面設定 ---- //
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'menu',
      'style': 'result'
    });
    // this._headerCtrl.setLeftBtnClick(() => {
    //   this.onBackPageData();
    // });
    // --- 頁面設定 End ---- //
    // 設定header
  }

  ngOnChanges() {
    logger.step('FUND', 'setData:[e] ', this.e);
    logger.step('FUND', 'get result Data: ', this.setData);
    this.getData(this.e);
  }

  private getData(e) {
    // let reqData = {
    //   // custId : '',
    //   // trustAcnt : '',
    //   // transCode : '',
    //   // fundCode : '',
    //   // investAmntFlag : '',
    //   // investAmnt : '',
    //   // payDateFlag : '',
    //   // payDate1 : '',
    //   // payDate2 : '',
    //   // payDate3 : '',
    //   // payDate4 : '',
    //   // payDate5 : '',
    //   // payTypeFlag : '',
    //   // changeBegin : '',
    //   // changeEnd : '',
    //   // payAcntStatus : '',
    //   // payAcnt : '',
    //   // profitAcntFlag : '',
    //   // oriProfitAcnt : '',
    //   // profitAcnt : '',
    //   // effectDate : '',
    //   // INCurrency : '',
    //   // trnsToken : '',
    //   // payFundFlag : 'N',
    //   // newFund : '',
    //   // payDate31 : '',
    //   // payDate5W : '',
    //   // payEvaFlag : 'N',
    //   // decline1Cd : '+',
    //   // decline1 : '0',
    //   // decline2Cd : '+',
    //   // decline2 : '0',
    //   // decline3Cd : '+',
    //   // decline3 : '0',
    //   // decline4Cd : '+',
    //   // decline4 : '0',
    //   // decline5Cd : '+',
    //   // decline5 : '0',
    //   // gain1Cd : '+',
    //   // gain1 : '0',
    //   // gain2Cd : '+',
    //   // gain2 : '0',
    //   // gain3Cd : '+',
    //   // gain3 : '0',
    //   // gain4Cd : '+',
    //   // gain4 : '0',
    //   // gain5Cd : '+',
    //   // gain5 : '0'


    //   custId: '', // 身分證字號
    //   trustAcnt: '', // 信託帳號
    //   transCode: '', // 交易編號
    //   fundCode: '', // 基金代碼
    //   investAmntFlag: '', // 投資金額變更狀態
    //   investAmnt: '', // 投資金額
    //   payDateFlag: '', // 扣款日期變更狀態
    //   payDate1: '', // 扣款日期變更1
    //   payDate2: '', // 扣款日期變更2
    //   payDate3: '', // 扣款日期變更3
    //   payDate4: '', // 扣款日期變更4
    //   payDate5: '', // 扣款日期變更5
    //   payTypeFlag: '', // 扣款狀況變更
    //   changeBegin: '', // 變更起日
    //   changeEnd: '', // 變更迄日
    //   payAcntStatus: '', // 扣款帳號變更狀態
    //   payAcnt: '', // 扣款帳號
    //   profitAcntFlag: '', // 現金收益存入帳號變更狀態
    //   oriProfitAcnt: '', // 原現金收益存入帳號
    //   profitAcnt: '', // 現金收益存入帳號
    //   effectDate: '', // 生效日期
    //   INCurrency: '', // 投資幣別
    //   trnsToken: '' // 交易控制碼
    // };
    let reqData = this.setData;
    logger.error('FUND', 'result e: ', reqData, e);
    // if(reqData['decline1']=='0.00') {
    //   reqData['decline1'] = '0';
    // } 
    // if(reqData['decline2']=='0.00') {
    //   reqData['decline2'] = '0';
    // }
    // if(reqData['decline3']=='0.00') {
    //   reqData['decline3'] = '0';
    // }
    // if(reqData['decline4']=='0.00') {
    //   reqData['decline4'] = '0';
    // }
    // if(reqData['decline5']=='0.00') {
    //   reqData['decline5'] = '0';
    // }
    // if(reqData['gain1']=='0.00') {
    //   reqData['gain1'] = '0';
    // }
    // if(reqData['gain2']=='0.00') {
    //   reqData['gain2'] = '0';
    // }
    // if(reqData['gain3']=='0.00') {
    //   reqData['gain3'] = '0';
    // }
    // if(reqData['gain4']=='0.00') {
    //   reqData['gain4'] = '0';
    // }
    // if(reqData['gain5']=='0.00') {
    //   reqData['gain5'] = '0';
    // }
    this._logger.log("component reqData:", this._formateService.transClone(reqData), JSON.stringify(reqData));
    this._mainService.getData(reqData, e).then(
      (result) => {
        this.fullData = result.info_data;
        let resObj = result.data;
        if (result.status) {
          // success
          this.fullData.investAmnt = (parseInt(this.fullData.investAmnt) / 100).toString();
          this.isSuccess = '0';

          this.trnsRsltCode = this.fullData.trnsRsltCode;
          // this.showDateStr = (typeof this.fullData.payDate1 != 'undefined' && this.fullData.payDate1 != '' && this.fullData.payDate1 !== '00') ? this.fullData.payDate1 + '日' : '';
          // this.showDateStr += (typeof this.fullData.payDate2 != 'undefined' && this.fullData.payDate2 != '' && this.fullData.payDate2 !== '00') ? '、' + this.fullData.payDate2 + '日' : '';
          // this.showDateStr += (typeof this.fullData.payDate3 != 'undefined' && this.fullData.payDate3 != '' && this.fullData.payDate3 !== '00') ? '、' + this.fullData.payDate3 + '日' : '';
          // this.showDateStr += (typeof this.fullData.payDate4 != 'undefined' && this.fullData.payDate4 != '' && this.fullData.payDate4 !== '00') ? '、' + this.fullData.payDate4 + '日' : '';
          // this.showDateStr += (typeof this.fullData.payDate5 != 'undefined' && this.fullData.payDate5 != '' && this.fullData.payDate5 !== '00') ? '、' + this.fullData.payDate5 + '日' : '';

          //2020/04/20修正扣款日放錯欄位，比照原程式放 payDate31
          if (this.fullData.hasOwnProperty('payDate31') && this.fullData.payDate31) {
            //以防中台回傳格式會變動，無','
            if (this.fullData.payDate31.indexOf(',') != 0) {
              let temp = this.fullData.payDate31.split(',');
              for (let i = 0; i < temp.length; i++) {
                if (i == 0) {
                  this.showDateStr = temp[i] + '日';
                } else {
                  this.showDateStr += '、' + temp[i] + '日';
                }
              }
            } else {
              this.showDateStr = this.fullData.payDate31 + '日';
            }
          }

          if (this.fullData.payTypeFlag == 'R') {
            this.payAcntStatusName = '恢復扣款';
          } else if (this.fullData.payTypeFlag == 'B') {
            this.payAcntStatusName = '終止扣款';
          } else if (this.fullData.payTypeFlag == 'S') {
            this.payAcntStatusName = '暫停扣款';
          } else if (this.fullData.payTypeFlag == 'N') {
            this.payAcntStatusName = '不變更';
          } else if (this.fullData.payTypeFlag == 'G') {
            this.payAcntStatusName = '終止扣款復扣';
          }
          this._logger.step('FUND', 'result result.info_data', result.info_data);
        } else {
          this.isSuccess = '1';
          this.resultData = {
            title: resObj.title, // 結果狀態
            content_params: {}, // 副標題i18n
            content: resObj.msg, // 結果內容
            classType: resObj.classType, // 結果樣式
            detailData: [],
            button: '返回投資理財', // 返回合庫E Pay
            err_btn: '返回投資理財'
          };
        }
      },
      (errorObj) => {
        errorObj['type'] = 'message';
        this._handleError.handleError(errorObj);
      }
    );
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
