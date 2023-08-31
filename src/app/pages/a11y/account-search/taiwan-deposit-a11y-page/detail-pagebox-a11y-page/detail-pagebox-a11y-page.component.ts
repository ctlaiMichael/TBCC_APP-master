import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { Logger } from '@core/system/logger/logger.service';
import { DepositInquiryDetailService } from '@pages/deposit/shared/service/deposit-inquiry-detail.service';
import { FormateService } from '@shared/formate/formate.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { DateA11yService } from '../../shared/date-a11y.service';

@Component({
  selector: 'app-detail-pagebox-a11y-page',
  templateUrl: './detail-pagebox-a11y-page.component.html'
})
export class DetailPageboxA11yPageComponent implements OnInit {

  /**
  * 參數處理
  */
  @Input() page: string | number = 1;
  @Input() reqObj: any;
  @Input() acctType: any;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

  data: any; // 取回來的Data
  info_data: any = {}; // 送回父層的Data

  constructor(
    private _mainService: DepositInquiryDetailService,
    private _datea11yService: DateA11yService,
    private _formateService: FormateService,
    private _logger: Logger,
    private navgator: NavgatorService,
  ) { }

  /**
   * 初始化
   * 1. 判斷是否為下一頁回來的，如果是則不清除cache，不是則清除
   * 2. 先call第一頁取得總筆數，將總筆數 + 1 後再送查詢
   */
  ngOnInit() {
    const params = this.navgator.getParams();
    if (!(params && params.back)) {
      const acctNo = this._formateService.checkField(this.reqObj, 'acctNo');
      this._mainService.removeAllCache('deposit-tw-demand@' + acctNo);
    }
    this._mainService.getDetailData(this.reqObj, this.page).then(
      (result) => {
        return Promise.resolve(result);
      },
      (errorObj) => {
        this.onErrorBackEvent(errorObj);
        return Promise.resolve(null);
      })
      .then((allData: any) => {
        if (!(params && params.back)) {
          const acctNo = this._formateService.checkField(this.reqObj, 'acctNo');
          this._mainService.removeAllCache('deposit-tw-demand@' + acctNo);
        }
        if (allData) {
        this._mainService.getDetailData(this.reqObj, this.page, {}, (allData.info_data.paginatedInfo.totalRowCount + 1))
          .then((allResult) => {
            this.data = allResult.data;
            let getTIME = this._datea11yService.getTIME(allResult.dataTime);
            this.info_data.querytime = getTIME['querytime'];
            this.info_data.myquerytime = getTIME['myquerytime'];
            this.transferdetail(this.data, this.acctType);
            this.onBackPageData(allResult);
          },
            (errorObj) => {
              this.onErrorBackEvent(errorObj);
            }
          );
        }
      });
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
	 * 重新設定page data
	 * @param item
	 */
  onBackPageData(item) {
    let output = {
      'page': 'list-item',
      'type': 'page_info',
      'data': item
    };
    this._logger.step('loan result', 'detail back', item);
    this.backPageEmit.emit(output);
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
    this.errorPageEmit.emit(error_obj);
  }

}
