/**
 * 台幣存款查詢-交易明細
 */
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { Logger } from '@core/system/logger/logger.service';
import { DepositInquiryDetailService } from '@pages/deposit/shared/service/deposit-inquiry-detail.service';
import { FormateService } from '@shared/formate/formate.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { DateA11yService } from '../../shared/date-a11y.service';
import { ContentSummaryService } from '@shared/template/deposit/content-summary/content-summary.service';

@Component({
  selector: 'app-detail-a11y-page',
  templateUrl: './detail-a11y-page.component.html',
})
export class DetailA11yPageComponent implements OnInit {

  /**
   * 參數設定
   */
  @Input() acctObj; // 取得列表頁資料
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  page: any;      // 頁面
  data: any;      // 電文回傳資料

  // == 首頁物件 == //
  headerObj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon: 'back',  // 要改上一頁箭頭
    rightBtnIcon: 'noshow',
    title: '台幣存款查詢',
    backPath: 'a11ytaiwandepositsearchkey',
  };

  // 其他帳戶類型變數宣告
  isFD: any;             // 是否為定存帳戶
  isWithdraw: any;       // 是否為提款
  isDeposit: any;         // 是否為存款
  data_info: any;        // 取得查詢頁傳值之資料
  querytime: any;        // 查詢時間
  timeintvl_start: any;   // 查詢區間起
  timeintvl_end: any;    // 查詢區間迄
  deposit_account: any;  // 存款帳號 (與定期存款共用同變數)
  account_state: any;    // 帳號狀態
  avbl_balance: any;     // 可用餘額 (與定期存款共用同變數)

  // 定期存款帳戶變數宣告
  lastTrnsDate: any;      // 定存到期日
  openBranchName: any;    // 開戶分行

  // === 報讀 title 宣告 === //
  // 其他存款帳戶 title
  myquerytime: any;      // 查詢時間報讀：
  mytimeintvl: any;      // 查詢區間報讀：
  myavbl_balance: any;   // 餘額報讀： '可用餘額 新台幣' + this.avbl_balance + '元'
  mywithdraw_money: any; // 提款報讀： '提款金額新台幣' + withdraw + '元'
  mydeposit_money: any;  // 存款報讀： '存款金額新台幣' + deposit + '元'
  mybalance_money: any;  // 結餘報讀： '結餘金額新台幣' + balance1 + '元'

  // 定期存款帳戶 title
  mylastTrnsDate: any;      // 定存到期日

  // 分頁物件
  pageCounter: number; // 當前頁次
  totalPages: number; // 全部頁面

  reqObj: any; // request params
  acctType: any; // 是否為定存

  // 畫面 more
  list_state = '展開';                    // 下拉按鈕-報讀title
  LIST_SHOW_FLAG = false;                 // 顯示或關閉詳細內容
  moredetail_style = { 'display': 'none' }; // 下拉按鈕控制樣式

  // more detail
  real_balance: any;                 // 實質餘額
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

  // more detail 報讀宣告
  myreal_balance: any;
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

  constructor(
    private _headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private _logger: Logger,
    private _handleError: HandleErrorService,
    private _mainService: DepositInquiryDetailService,
    private authService: AuthService,
    private _formateService: FormateService,
    private _datea11yService: DateA11yService,
    private contentSummaryService: ContentSummaryService,
  ) {
    this._headerCtrl.setOption(this.headerObj);
    this._headerCtrl.setLeftBtnClick(() => { // 左邊button
      this.gobackPage();
    });
  }

  ngOnInit() {

    // 確認是否登入
    if (this.authService.isLoggedIn()) {

      // 重置 page 相關參數
      this._resetPage();

      // 取得查詢時間
      let getTIME = this._datea11yService.getTIME();
      this.querytime = getTIME['querytime'];
      this.myquerytime = getTIME['myquerytime'];

      // 確認page頁面
      if (typeof this.page === 'undefined') {
        this.page = 1;
      } else {
        this.page = parseInt(this.page.toString());
      }

      // 區分是否為定存帳戶，定存的分頁參考轉置案(無分頁)
      if (!!this.acctObj) {
        this.isFD = true;
        // 畫面呈現
        this.lastTrnsDate = this.acctObj['lastTrnsDate'];
        this.openBranchName = this.acctObj['openBranchName'];
        this.deposit_account = this.acctObj['acctNo'];
        this.avbl_balance = this.acctObj['balance'];
        // 報讀
        let str_lasTrDate = this.lastTrnsDate.split('/');
        this.mylastTrnsDate = '定存到期日' + str_lasTrDate[0] + '年' + str_lasTrDate[1] + '月' + str_lasTrDate[2] + '日';
        this.myavbl_balance = '可用餘額 新台幣' + this.avbl_balance + '元';
        let acc_No = this.acctObj['acctNo'].replace(/[&\|\\\*^%$#@\-]/g, '');

        let fd_reqObj = {
          'startDate': this.acctObj['startDate'],
          'endDate': this.acctObj['endDate'],
          'acctNo': acc_No,
          'acctType': this.acctObj['acctType']
        };

        // 取得各類型帳戶電文
        this.getService(fd_reqObj, this.acctObj['acctType']);

      } else {
        this.isFD = false;
        this.data_info = this.navgator.getParams();
        // 畫面呈現
        this.timeintvl_start = this.data_info['data']['s_Date'];
        this.timeintvl_end = this.data_info['data']['e_Date'];
        this.deposit_account = this.data_info['data']['acctObj']['acctNo'];
        this.account_state = this.data_info['data']['acctObj']['acctTypeName'];
        this.avbl_balance = this.data_info['data']['acctObj']['balance'];
        // 報讀
        this.mytimeintvl = this._datea11yService.transfertitle(this.timeintvl_start, this.timeintvl_end);
        this.myavbl_balance = '可用餘額 新台幣' + this.avbl_balance + '元';

        let reqObj = {
          'id': this.data_info['id'],
          'startDate': this.data_info['data']['startDate'],
          'endDate': this.data_info['data']['endDate'],
          'acctNo': this.data_info['data']['acctObj']['acctNo'].replace(/[&\|\\\*^%$#@\-]/g, ''),
          'acctType': this.data_info['data']['acctObj']['acctType']
        };
        this.reqObj = reqObj;
        this.acctType = this.data_info['data']['acctObj']['acctType'];

        let moreDetailReqObj: any = {};
        let acctObj = this.data_info['data']['acctObj'];
        moreDetailReqObj['acctNo'] = acctObj['acctNo'].replace(/[&\|\\\*^%$#@\-]/g, '');
        moreDetailReqObj['acctType'] = acctObj['acctType'].replace(/[&\|\\\*^%$#@\-]/g, '');
        this.getMoreDetailService(moreDetailReqObj);
        // 取得各類型帳戶電文
        this.getService(reqObj, this.data_info['data']['acctObj']['acctType']);
      }
    }
  }

  /**
   * 返回上一頁
   */
  gobackPage() { // 左邊button
    if (this.isFD) {
      this.headerObj['bathpath'] = 'a11ytaiwandepositkey';
      let output = {
        'page': 'list-item',
        'type': 'page_info',
        'showContent': 'false'
      };

      this.backPageEmit.emit(output);
      this.navgator.push('a11ytaiwandepositkey');
    } else {
      this.headerObj['bathpath'] = 'a11ytaiwandepositsearchkey';
      this.navgator.push('a11ytaiwandepositsearchkey', this.data_info);
    }
  }

  goMoreDetail() {
    // 換頁並把資料帶入下一頁面
    // this.navgator.push('a11ytaiwandepositmoredetailkey', this.data_info);
    const obj = { back: true };
    this.navgator.push('a11ytaiwandepositkey', obj);
  }

  /**
   * 取得電文
   */
  getService(reqObj, acctType) {
    if (acctType == 'FD') {
      this._mainService.getTimeDepoist(reqObj).then(
        (result) => {
          this.data = result.data;
          let getTIME = this._datea11yService.getTIME(result.dataTime);
          this.querytime = getTIME['querytime'];
          this.myquerytime = getTIME['myquerytime'];
          this.transferdetail(this.data, acctType);
        },
        (errorObj) => {
          this.onErrorBackEvent(errorObj);
        }
      );
    }
  }

  /**
   * 取得更多詳細資料電文
   */
  /**
   * 取得電文
   */
  getMoreDetailService(reqObj) {
    this.contentSummaryService.getSummaryData(reqObj).then(
      (result) => {
        result['data'] = this.transferMoredetail(result.data, result.dataTime);
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
    this._logger.error('ContentDetailResult get error', error_obj);
    this._handleError.handleError(error_obj);
  }

  /**
   * 區分定期存款類別，將交易明細資料轉換成無障礙
   * 1. 將西元年改為民國年
   * 2. 增加屬性：報讀title
   */
  transferdetail(result_data, acctType) {
    let len_i = 0;
    let data_len = (<any>Object).keys(result_data).length;
    for (len_i = 0; len_i < data_len; len_i++) {
      // 是否為定期存款
      if (acctType == 'FD') {
        // 西元年轉民國年
        let time1 = DateUtil.getDateString(result_data[len_i]['startAcctDate'], true);
        let time1_len = result_data[len_i]['startAcctDate'].length;
        let time2 = DateUtil.getDateString(result_data[len_i]['endAcctDate'], true);
        let time2_len = result_data[len_i]['endAcctDate'].length;
        let yy: any, mm: any, dd: any;
        let _yy: any, _mm: any, _dd: any;
        if (time1_len > 9 && time2_len > 9) {
          let array = time1.split('/');
          yy = parseInt(array[0]) - 1911;
          mm = array[1];
          dd = array[2];
          let _array = time2.split('/');
          _yy = parseInt(_array[0]) - 1911;
          _mm = _array[1];
          _dd = _array[2];
        } else {
          let array = time1.split('/');
          let _array = time2.split('/');
          yy = array[0];
          mm = array[1];
          dd = array[2];
          _yy = _array[0];
          _mm = _array[1];
          _dd = _array[2];
        }

        // 判斷是否有存單號碼，有則畫面顯示
        if (result_data[len_i]['depositNo']) {
          result_data[len_i]['isdepositNo'] = true;
        } else {
          result_data[len_i]['isdepositNo'] = false;
        }

        // 資料格式化
        result_data[len_i]['saveListBal'] = this._formateService.transMoney(result_data[len_i]['saveListBal'], 'TWD');

        result_data[len_i]['startAcctDate'] = yy + '/' + mm + '/' + dd;
        result_data[len_i]['endAcctDate'] = _yy + '/' + _mm + '/' + _dd;
        result_data[len_i]['mystartAcctDate'] = '起息日' + yy + '年' + mm + '月' + dd + '日';
        result_data[len_i]['myendAcctDate'] = '到期日' + _yy + '年' + _mm + '月' + _dd + '日';
        result_data[len_i]['mysaveListBal'] = '存單面額 新台幣' + result_data[len_i]['saveListBal'] + '元';

      } else {
        // 西元年轉民國年
        let time = DateUtil.getDateString(result_data[len_i]['transDate'], true);
        let time_len = result_data[len_i]['transDate'].length;
        let yy: any, mm: any, dd: any;
        let hour = result_data[len_i]['transTime'];
        let hh: any, minu: any, ss: any;
        if (time_len > 9) {
          let array = time.split('/');
          yy = parseInt(array[0]) - 1911;
          mm = array[1];
          dd = array[2];
          hh = hour.substring(0, 2);
          minu = hour.substring(2, 4);
          ss = hour.substring(4);
        } else {
          let array = time.split('/');
          yy = array[0];
          mm = array[1];
          dd = array[2];
          hh = hour.substring(0, 2);
          minu = hour.substring(2, 4);
          ss = hour.substring(4);
        }

        // 判斷是否有提款金額 or 存款金額 or 摘要訊息，有則畫面顯示
        // 存款
        if (result_data[len_i]['deposit'].length > 0) {
          if (parseInt(result_data[len_i]['deposit']) !== 0) {
            result_data[len_i]['isDeposit'] = true;
          } else {
            result_data[len_i]['isDeposit'] = false;
          }
        } else {
          result_data[len_i]['isDeposit'] = false;
        }
        // 提款
        if (result_data[len_i]['withdraw'].length > 0) {
          if (parseInt(result_data[len_i]['withdraw']) !== 0) {
            result_data[len_i]['isWithdraw'] = true;
          } else {
            result_data[len_i]['isWithdraw'] = false;
          }
        } else {
          result_data[len_i]['isWithdraw'] = false;
        }
        if (!!result_data[len_i]['digest']) {
          result_data[len_i]['isdigest'] = false;
        } else {
          result_data[len_i]['isdigest'] = true;  // true
        }
        // 資料格式化
        result_data[len_i]['withdraw'] = this._formateService.transMoney(result_data[len_i]['withdraw'], 'TWD');
        result_data[len_i]['deposit'] = this._formateService.transMoney(result_data[len_i]['deposit'], 'TWD');
        result_data[len_i]['balance1'] = this._formateService.transMoney(result_data[len_i]['balance1'], 'TWD');

        result_data[len_i]['transDate'] = yy + '/' + mm + '/' + dd;
        result_data[len_i]['transTime'] = hh + ':' + minu + ':' + ss;
        result_data[len_i]['mywithdraw_money'] = '提款金額新台幣' + result_data[len_i]['withdraw'] + '元';
        result_data[len_i]['mydeposit_money'] = '存款金額新台幣' + result_data[len_i]['deposit'] + '元';
        result_data[len_i]['mybalance_money'] = '結餘金額新台幣' + result_data[len_i]['balance1'] + '元';
      }
    }
    return result_data;
  }

  /**
   * 更多餘額查詢資料整理
   * @param result_data 電文data資料
   * @param result_dataTime 電文中的系統時間
   */
  transferMoredetail(result_data, result_dataTime) {
    // 取得查詢時間
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

    if (!!result_data['financeRate']) {
      this.finance_rate = result_data['financeRate'] + '%';
      this.myfinance_rate = '融資利率 ' + result_data['financeRate'] + '%';
    } else {
      this.myfinance_rate = '融資利率 ';
    }

    if (!!result_data['financeAmount']) {
      this.finance_quota = 'NT$ ' + this._formateService.transMoney(result_data['financeAmount'], 'TWD');
      this.myfinance_quota = '融資額度 ' + '新台幣' + this.finance_quota + '元';
    } else {
      this.myfinance_quota = '融資額度 ';
    }

    this.myreal_balance = '實質餘額 ' + '新台幣' + this.real_balance + '元';
    this.myavbl_balance = '可用餘額 ' + '新台幣' + this.avbl_balance + '元';
    this.mypayment_amt_today = '今交票金額 ' + '新台幣' + this.payment_amt_today + '元';
    this.mypayment_amt_tomo = '明交票金額 ' + '新台幣' + this.payment_amt_tomo + '元';
    this.myreload_amt_tol = '消費圈存 ' + '新台幣' + this.reload_amt_tol + '元';
    this.myfrozen_amt_tol = '凍結總額 ' + '新台幣' + this.frozen_amt_tol + '元';
    this.mydetain_amt_tol = '扣押總額 ' + '新台幣' + this.detain_amt_tol + '元';
    this.myrollout_amt = '營業時間後提款及轉出 ' + '新台幣' + this.rollout_amt + '元';
    this.myrollin_amt = '營業時間後存款及轉入 ' + '新台幣' + this.rollin_amt + '元';
    this.myfinance_date_start = '融資期間起始日 ' + result_data['financeStartDay'];
    this.myfinance_date_end = '融資期間結束日' + result_data['financeEndDay'];
  }


  /**
  * 子層返回事件
  * @param e
  */
  onBackPage(e) {
    this._logger.step('loan-a11y-result', 'onBackPage', e);
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
    if (pageType === 'page_info') {
      this._logger.step('Deposit', 'set page', this.pageCounter, tmp_data);
      // 設定頁面資料
      if (this.pageCounter == 1) {
        this.data = tmp_data['info_data'];
        if (tmp_data.hasOwnProperty('page_info')) {
          // 第一頁才要設定，其他不變
          this.totalPages = tmp_data['page_info']['totalPages'];
        }
      }
      return false;
    }
  }

  /**
  * 頁面切換
  * @param pageType 頁面切換判斷參數
  *        'list' : 顯示額度使用明細查詢頁(page 1)
  *        'content' : 顯示額度使用明細結果頁(page 2)
  * @param pageData 其他資料
  */
  onChangePage(pageType: string, pageData?: any) {
    if (pageType === 'content') {
      // 內容頁
      // this.content_data = pageData;
      // this.acctObj = pageData;
      this.navgator.displayCloneBox(true); // 進入內容頁clone start
    }
  }

  /**
   * 重設分頁資訊
   */
  private _resetPage() {
    this.pageCounter = 1;
    this.totalPages = 0;
  }

  /**
   * 展開表單/收攏表單
   */
  onchangelist() {
    let show_flag = this.LIST_SHOW_FLAG
    if (show_flag === false) {
      this.moredetail_style = { 'display': 'inline' };
      this.list_state = '收縮';
      this.LIST_SHOW_FLAG = !show_flag;
    } else {
      this.moredetail_style = { 'display': 'none' };
      this.list_state = '展開';
      this.LIST_SHOW_FLAG = !show_flag;
    }
  }

}
