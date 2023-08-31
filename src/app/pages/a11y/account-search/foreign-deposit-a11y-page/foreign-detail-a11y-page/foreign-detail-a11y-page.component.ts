/**
 * 外匯存款查詢-交易明細
 */
import { Component, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { DateA11yService } from '../../shared/date-a11y.service';

@Component({
  selector: 'app-foreign-detail-a11y-page',
  templateUrl: './foreign-detail-a11y-page.component.html',
})
export class ForeignDetailA11yPageComponent implements OnInit {

  /**
   * 參數設定
   */
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  page: any;      // 頁面
  data: any;      // 電文回傳資料
  acctObj: any;
  reqObj: any;

  // == 首頁物件 == //
  headerObj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon: 'back',  // 要改上一頁箭頭
    rightBtnIcon: 'noshow',
    title: '外匯存款查詢',
    backPath: 'a11yforeigndepositsearchkey',
  };

  // 其他帳戶類型變數宣告
  isXFS: any;            // 是否為定存帳戶
  isWithdraw: any;       // 是否為提款
  isDeposit: any;         // 是否為存款

  data_info: any;        // 取得查詢頁傳值之資料
  querytime: any;        // 查詢時間
  timeintvl_start: any;   // 查詢區間起
  timeintvl_end: any;    // 查詢區間迄
  deposit_account: any;  // 存款帳號
  avbl_balance: any;     // 可用餘額
  currency: any;         // 幣別
  currName: any;          // 幣別名稱

  // 定期存款帳戶變數宣告
  lastTrnsDate: any;      // 定存到期日
  openBranchName: any;    // 開戶分行

  // === 報讀 title 宣告 === //
  myquerytime: any;      // 查詢時間報讀：
  mytimeintvl: any;      // 查詢區間報讀：
  myavbl_balance: any;   // 餘額報讀： '可用餘額' + this.avbl_balance + '元'
  mywithdraw_money: any; // 提款報讀： '提款金額' + withdraw + '元'
  mydeposit_money: any;  // 存款報讀： '存款金額' + deposit + '元'
  mybalance_money: any;  // 結餘報讀： '結餘金額' + balance1 + '元'

  // 定期存款帳戶 title
  mylastTrnsDate: any;   // 定存到期日

  // 分頁物件
  pageCounter: number; // 當前頁次
  totalPages: number; // 全部頁面
  reqParams: any; // request params
  acctType: any; // 是否為XFS

  constructor(
    private _headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private _logger: Logger,
    private _handleError: HandleErrorService,
    private authService: AuthService,
    private _formateService: FormateService,
    private _datea11yService: DateA11yService,
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
      // this.getTIME();
      let getTIME = this._datea11yService.getTIME();
      this.querytime = getTIME['querytime'];
      this.myquerytime = getTIME['myquerytime'];

      // 確認page頁面
      if (typeof this.page === 'undefined') {
        this.page = 1;
      } else {
          this.page = parseInt(this.page.toString());
      }

      this.data_info = this.navgator.getParams();
      this.acctObj = this.data_info['data']['acctObj'];
      this.reqObj = this.data_info['data'];

      if (this.acctObj['acctType'] == 'XF' || this.acctObj['acctType'] == 'XFS') {
        this.isXFS = true;
        // 畫面呈現
        this.lastTrnsDate = this.acctObj['lastTrnsDate'];
        this.openBranchName = this.acctObj['openBranchName'];
        this.deposit_account = this.acctObj['acctNo'];
        this.avbl_balance = this.acctObj['balance'];
        this.currency = this.acctObj['currency'];
        this.currName = this.acctObj['currName'];
        // 報讀
        let str_lasTrDate = this.lastTrnsDate.split('/');
        this.mylastTrnsDate = '定存到期日' + str_lasTrDate[0] + '年' + str_lasTrDate[1] + '月' + str_lasTrDate[2] + '日';
        this.myavbl_balance = this.acctObj['myavbl_balance'];

      } else {
        this.isXFS = false;
        // 畫面呈現
        this.timeintvl_start = this.data_info['data']['s_Date'];
        this.timeintvl_end = this.data_info['data']['e_Date'];
        this.deposit_account = this.acctObj['acctNo'];
        this.avbl_balance = this.acctObj['balance'];
        this.currency = this.acctObj['currency'];
        this.currName = this.acctObj['currName'];
        // 報讀
        this.mytimeintvl = this._datea11yService.transfertitle(this.timeintvl_start, this.timeintvl_end);
        this.myavbl_balance = this.acctObj['myavbl_balance'];

      }

      let reqObj = {
        'id': this._formateService.checkField(this.data_info, 'id'),              // 日期快篩類別： 7D/1M/custom
        'startDate': this._formateService.checkField(this.reqObj, 'startDate'),   // 起始日：YYYY/MM/DD
        'endDate': this._formateService.checkField(this.reqObj, 'endDate'),       // 結束日：YYYY/MM/DD
        'acctNo': this.acctObj['acctNo'].replace(/[&\|\\\*^%$#@\-]/g, ''),         // 帳號
        'acctType': this._formateService.checkField(this.acctObj, 'acctType'),    // 帳戶類別：XF/XFS/XM/XS
        'currCode': this._formateService.checkField(this.acctObj, 'currency')     // 幣別：USD/
      };

      this.reqParams = reqObj;
      this.acctType = reqObj['acctType'];
    }
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
   * 返回上一頁
   */
  gobackPage() { // 左邊button
    this.headerObj['bathpath'] = 'a11yforeigndepositsearchkey';
    this.navgator.push('a11yforeigndepositsearchkey', this.data_info);
  }

  /**
   * 更多餘額查詢
   */
  goMoreDetail() {
    // 換頁並把資料帶入下一頁面
    this.navgator.push('a11yforeigndepositmoredetailkey', this.data_info);
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
      if ((acctType == 'XFS') || (acctType == 'XF')) {
        // 西元年轉民國年
        let time1 = DateUtil.getDateString(result_data[len_i]['transDate'], true);
        let time1_len = result_data[len_i]['transDate'].length;
        let yy: any, mm: any, dd: any;
        if (time1_len > 9) {
          let array = time1.split('/');
          yy = parseInt(array[0]) - 1911;
          mm = array[1];
          dd = array[2];
        } else {
          let array = time1.split('/');
          yy = array[0];
          mm = array[1];
          dd = array[2];
        }

        // 資料格式化
        /**
         * transDate          交易日
         * balance1           本金金額
         * balance2           續存本金
         * grossInterest      原幣毛息
         * tax                原幣稅
         * interest           原幣淨息
         */
        result_data[len_i]['balance1'] = this._formateService.transMoney(result_data[len_i]['balance1'], this.currency);
        result_data[len_i]['grossInterest'] = this._formateService.transMoney(result_data[len_i]['grossInterest'], this.currency);
        result_data[len_i]['tax'] = this._formateService.transMoney(result_data[len_i]['tax'], this.currency);
        result_data[len_i]['interest'] = this._formateService.transMoney(result_data[len_i]['grossInterest'], this.currency);
        result_data[len_i]['balance2'] = this._formateService.transMoney(result_data[len_i]['balance2'], this.currency);

        result_data[len_i]['transDate'] = yy + '/' + mm + '/' + dd;
        result_data[len_i]['mytransDate'] = '交易日' + yy + '年' + mm + '月' + dd + '日';
        result_data[len_i]['mybalance1'] = '本金金額' + this.currName + result_data[len_i]['balance1'] + '元';
        result_data[len_i]['mygrossInterest'] = '原幣毛息' + this.currName + result_data[len_i]['grossInterest'] + '元';
        result_data[len_i]['mytax'] = '原幣稅' + this.currName + result_data[len_i]['tax'] + '元';
        result_data[len_i]['myinterest'] = '原幣淨息' + this.currName + result_data[len_i]['interest'] + '元';
        result_data[len_i]['mybalance2'] = '續存本金' + this.currName + result_data[len_i]['balance2'] + '元';
        result_data[len_i]['mycurrency'] = '幣別' + this.currName;

      } else {
        // 西元年轉民國年
        let time = DateUtil.getDateString(result_data[len_i]['transDate'], true);
        let time_len = result_data[len_i]['transDate'].length;
        let yy: any, mm: any, dd: any;
        if (time_len > 9) {
          let array = time.split('/');
          yy = parseInt(array[0]) - 1911;
          mm = array[1];
          dd = array[2];
        } else {
          let array = time.split('/');
          yy = array[0];
          mm = array[1];
          dd = array[2];
        }

        // 判斷是否有提款金額 or 存款金額 or 摘要訊息，有則畫面顯示
        // 存款
        if (result_data[len_i]['deposit'].length > 0) {
          if (result_data[len_i]['deposit'] !== '0.00') {
            result_data[len_i]['isDeposit'] = true;
          } else {
            result_data[len_i]['isDeposit'] = false;
          }
        } else {
          result_data[len_i]['isDeposit'] = false;
        }
        // 提款
        if (result_data[len_i]['withdraw'].length > 0) {
          if (result_data[len_i]['withdraw'] !== '0.00') {
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
          result_data[len_i]['isdigest'] = true;
        }

        // 資料格式化
        result_data[len_i]['withdraw'] = this._formateService.transMoney(result_data[len_i]['withdraw'], this.currency);
        result_data[len_i]['deposit'] = this._formateService.transMoney(result_data[len_i]['deposit'], this.currency);
        result_data[len_i]['balance'] = this._formateService.transMoney(result_data[len_i]['balance'], this.currency);

        result_data[len_i]['transDate'] = yy + '/' + mm + '/' + dd;
        result_data[len_i]['mytransDate'] = '交易日' + yy + '年' + mm + '月' + dd + '日';
        result_data[len_i]['mywithdraw_money'] = '提款金額' + this.currName + result_data[len_i]['withdraw'] + '元';
        result_data[len_i]['mydeposit_money'] = '存款金額' + this.currName + result_data[len_i]['deposit'] + '元';
        result_data[len_i]['mybalance_money'] = '結餘金額' + this.currName + result_data[len_i]['balance'] + '元';
        result_data[len_i]['mycurrency'] = '幣別' + this.currName;
      }
    }
    return result_data;
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
   * 重設分頁資訊
   */
  private _resetPage() {
    this.pageCounter = 1;
    this.totalPages = 0;
  }
}
