import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ContentSummaryService } from '@shared/template/deposit/content-summary/content-summary.service';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { A11yAlertService } from '@shared/popup/a11y/alert/alert.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { DateA11yService } from '../../shared/date-a11y.service'

@Component({
  selector: 'app-foreign-more-detail-a11y-page',
  templateUrl: './foreign-more-detail-a11y-page.component.html',
})
export class ForeignMoreDetailA11yPageComponent implements OnInit {

  /**
   * 參數設定
   */
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

  // == 首頁物件 == //
  headerObj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon: 'back',  // 要改上一頁箭頭
    rightBtnIcon: 'noshow',
    title: '外匯存款查詢',
    backPath: 'a11ytaiwandepositkey',
  };

  account: any;                      // 帳號
  account_state: any;                // 帳號狀態
  querytime: any;                    // 查詢時間
  real_balance: any;                 // 實質餘額
  avbl_balance: any;                 // 可用餘額
  payment_amt_today: any;            // 今交票金額
  payment_amt_tomo: any;             // 明交票金額
  detain_amt_tol: any;               // 扣押總額
  reload_amt_tol: any;               // 消費圈存
  frozen_amt_tol: any;               // 凍結總額
  rollout_amt: any;                  // 營業時間後提款及轉出
  rollin_amt: any;                   // 營業時間後存款及轉入
  finance_rate: any;                 // 融資利率
  finance_quota: any;                // 融資額度
  finance_date_start: any;           // 融資期間起
  finance_date_end: any;             // 融資期間迄
  currency: any;                     // 幣別
  currName: any;                     // 幣別名稱

  list_state = "展開";                    // 下拉按鈕-報讀title
  LIST_SHOW_FLAG = false;                 // 顯示或關閉詳細內容
  moredetail_style = {"display": "none"}; // 下拉按鈕控制樣式

  data_info: any;                         // 取得查詢頁傳值之資料

  // === 報讀 title 宣告 === //
  myquerytime: any;
  myreal_balance: any;
  myavbl_balance: any;
  mypayment_amt_today: any;
  mypayment_amt_tomo: any;
  mydetain_amt_tol: any;
  myreload_amt_tol: any;
  myfrozen_amt_tol: any;
  myrollout_amt: any;
  myrollin_amt: any;
  myfinance_rate: any;
  myfinance_quota: any;
  myfinance_date_start: any;
  myfinance_date_end: any;

  constructor(private headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private _mainService: ContentSummaryService,
    private _logger: Logger,
    private _formateService: FormateService,
    private _datea11yService: DateA11yService,
    private alert: A11yAlertService,
    private _handleError: HandleErrorService,)
    {
      this.headerCtrl.setOption(this.headerObj);
      this.headerCtrl.setLeftBtnClick(() => { // 左邊button
        this.gobackPage();
      });
  }

  ngOnInit() {
    // 取得時間
    let getTIME = this._datea11yService.getTIME();
    this.querytime = getTIME['querytime'];
    this.myquerytime = getTIME['myquerytime'];

    this.data_info = this.navgator.getParams();
    let reqObj: any = {};
    let acctObj = this.data_info['data']['acctObj'];

    this.account = acctObj['acctNo'];                                   // 帳號
    this.account_state = acctObj['acctTypeName'];                       // 帳號狀態
    this.currency = acctObj['currency'];                                // 幣別
    this.currName = acctObj['currName'];                                // 幣別名稱

    reqObj['acctNo'] = acctObj['acctNo'].replace(/[&\|\\\*^%$#@\-]/g,"");
    reqObj['acctType'] = acctObj['acctType'].replace(/[&\|\\\*^%$#@\-]/g,"");
    this.getService(reqObj);
  }

  /**
   * 取得電文
   */
  getService(reqObj){
    this._mainService.getSummaryData(reqObj).then(
      (result) => {
          result['data'] = this.transferdetail(result.data, result.dataTime);
      },
      (errorObj) => {
          this.onErrorBackEvent(errorObj);
    });
  }

  /**
   * 失敗回傳
   * @param error_obj 失敗物件
   */
  onErrorBackEvent(error_obj) {
    let output = {
        'page': 'list-item',
        'type': 'error',
        'data': error_obj
      };
      this._logger.error('ContentMoreDetailResult get error', error_obj);
      this._handleError.handleError(error_obj);
  }

  // 反回上一頁
  gobackPage() { // 左邊button
    this.navgator.push('a11yforeigndepositdetailkey', this.data_info);
  }

  goDetail() {
    // 換頁並把資料帶到下一頁面
    this.navgator.push('a11yforeigndepositdetailkey', this.data_info);
  }
  /**
   * 展開表單/收攏表單
   */
  onchangelist(){
    if(this.LIST_SHOW_FLAG === false){
      this.moredetail_style = {"display": "inline"};
      this.list_state = "收縮";
      this.LIST_SHOW_FLAG = !this.LIST_SHOW_FLAG;
    } else {
      this.moredetail_style = {"display": "none"};;
      this.list_state = "展開";
      this.LIST_SHOW_FLAG = !this.LIST_SHOW_FLAG;
    }
  }

  /**
   * 更多餘額查詢資料整理
   * @param result_data 電文data資料
   * @param result_dataTime 電文中的系統時間
   */
  transferdetail(result_data, result_dataTime){
    // 取得查詢時間
    // this.getTIME(result_dataTime);
    let getTIME = this._datea11yService.getTIME(result_dataTime);
    this.querytime = getTIME['querytime'];
    this.myquerytime = getTIME['myquerytime'];
    /**
     * 資料格式處理
     * realBalance          實質餘額
     * usefulBalance        可用餘額
     * todayCheckBalance    今交票金額
     * tomCheckBalance      明交票金額
     * icCard               消費圈存
     * freezeBalance        凍結總額
     * distrainBalance      扣押總額
     * afterRunBalance      營業時間後提款及轉出
     * afterRunPay          營業時間後存款及轉入
     * financeRate          透支利率
     * financeAmount        透支額度
     * financeStartDay      透支契約期間(起)
     * financeEndDay        透支契約期間(迄)
     * */

    this.real_balance = this._formateService.transMoney(result_data['realBalance'], 'TWD');
    this.avbl_balance = this._formateService.transMoney(result_data['usefulBalance'], 'TWD');
    this.payment_amt_today = this._formateService.transMoney(result_data['todayCheckBalance'], 'TWD');
    this.payment_amt_tomo = this._formateService.transMoney(result_data['tomCheckBalance'], 'TWD');
    this.reload_amt_tol = this._formateService.transMoney(result_data['icCard'], 'TWD');
    this.frozen_amt_tol = this._formateService.transMoney(result_data['freezeBalance'], 'TWD');
    this.detain_amt_tol = this._formateService.transMoney(result_data['distrainBalance'], 'TWD');
    this.rollout_amt = this._formateService.transMoney(result_data['afterRunBalance'], 'TWD');
    this.rollin_amt = this._formateService.transMoney(result_data['afterRunPay'], 'TWD');

    if(!!result_data['financeRate']){
      this.finance_rate = result_data['financeRate'] + "%";
      this.myfinance_rate = "融資利率 " + result_data['financeRate'] + "%";
    } else {
      this.myfinance_rate = "融資利率 ";
    }

    if(!!result_data['financeAmount']){
      this.finance_quota = "$" + this._formateService.transMoney(result_data['financeAmount'], 'TWD');
      this.myfinance_quota = "融資額度 " + this.currName +   this.finance_quota + "元";
    }else {
      this.myfinance_quota = "融資額度 ";
    }

    this.myreal_balance = "實質餘額 " + this.currName +  this.real_balance + "元";
    this.myavbl_balance = "可用餘額 " + this.currName +  this.avbl_balance + "元";
    this.mypayment_amt_today = "今交票金額 " + this.currName +  this.payment_amt_today + "元";
    this.mypayment_amt_tomo = "明交票金額 " + this.currName +  this.payment_amt_tomo + "元";
    this.myreload_amt_tol = "消費圈存 " + this.currName +  this.reload_amt_tol + "元";
    this.myfrozen_amt_tol = "凍結總額 " + this.currName +  this.frozen_amt_tol + "元";
    this.mydetain_amt_tol = "扣押總額 " + this.currName +  this.detain_amt_tol + "元";
    this.myrollout_amt = "營業時間後提款及轉出 " + this.currName +  this.rollout_amt + "元";
    this.myrollin_amt = "營業時間後存款及轉入 " + this.currName +  this.rollin_amt + "元";
    this.myfinance_date_start = "融資期間起始日 " + result_data['financeStartDay'] ;
    this.myfinance_date_end = "融資期間結束日" + result_data['financeEndDay'] ;

  }

}
