import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ForeignDepositService } from '@pages/foreign-exchange/shared/service/foreign-deposit.service';
import { FormateService } from '@shared/formate/formate.service';
import { DateA11yService } from '../../shared/date-a11y.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { Logger } from '@core/system/logger/logger.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
  selector: 'app-foreign-detail-pagebox-a11y-page',
  templateUrl: './foreign-detail-pagebox-a11y-page.component.html'
})
export class ForeignDetailPageboxA11yPageComponent implements OnInit {

  /**
    * 參數處理
    */
  @Input() page: string | number = 1;
  @Input() reqObj: any;
  @Input() acctType: any;
  @Input() isXFS: boolean;
  @Input() acctObj: any;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

  data: any; // 取回來的Data
  info_data: any = {}; // 送回父層的Data

  constructor(
    private _mainService: ForeignDepositService,
    private _formateService: FormateService,
    private _datea11yService: DateA11yService,
    private _logger: Logger,
    private navgator: NavgatorService
  ) { }

  ngOnInit() {
    const acctNo = this._formateService.checkField(this.reqObj, 'acctNo');
    const currCode = this._formateService.checkField(this.reqObj, 'currCode');
    this._mainService.removeAllCache('deposit-forex-demand@' + acctNo + '_' + currCode);
    this._mainService.getDetailData(this.reqObj, this.page).then(
      (result) => {
        return Promise.resolve(result);
      },
      (errorObj) => {
        // this.alert.show('本帳號並無交易明細可查詢。');
        this.onErrorBackEvent(errorObj);
        return Promise.resolve(null);
      })
      .then((allData: any) => {
        if (allData) {
        this._mainService.removeAllCache('deposit-forex-demand@' + acctNo + '_' + currCode);
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
        result_data[len_i]['balance1'] = this._formateService.transMoney(result_data[len_i]['balance1'], this.acctObj['currency']);
        result_data[len_i]['grossInterest'] = this._formateService.transMoney(result_data[len_i]['grossInterest'], this.acctObj['currency']);
        result_data[len_i]['tax'] = this._formateService.transMoney(result_data[len_i]['tax'], this.acctObj['currency']);
        result_data[len_i]['interest'] = this._formateService.transMoney(result_data[len_i]['grossInterest'], this.acctObj['currency']);
        result_data[len_i]['balance2'] = this._formateService.transMoney(result_data[len_i]['balance2'], this.acctObj['currency']);

        result_data[len_i]['transDate'] = yy + '/' + mm + '/' + dd;
        result_data[len_i]['mytransDate'] = '交易日' + yy + '年' + mm + '月' + dd + '日';
        result_data[len_i]['mybalance1'] = '本金金額' + this.acctObj['currName'] + result_data[len_i]['balance1'] + '元';
        result_data[len_i]['mygrossInterest'] = '原幣毛息' + this.acctObj['currName'] + result_data[len_i]['grossInterest'] + '元';
        result_data[len_i]['mytax'] = '原幣稅' + this.acctObj['currName'] + result_data[len_i]['tax'] + '元';
        result_data[len_i]['myinterest'] = '原幣淨息' + this.acctObj['currName'] + result_data[len_i]['interest'] + '元';
        result_data[len_i]['mybalance2'] = '續存本金' + this.acctObj['currName'] + result_data[len_i]['balance2'] + '元';
        result_data[len_i]['mycurrency'] = '幣別' + this.acctObj['currName'];

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
        result_data[len_i]['withdraw'] = this._formateService.transMoney(result_data[len_i]['withdraw'], this.acctObj['currency']);
        result_data[len_i]['deposit'] = this._formateService.transMoney(result_data[len_i]['deposit'], this.acctObj['currency']);
        result_data[len_i]['balance'] = this._formateService.transMoney(result_data[len_i]['balance'], this.acctObj['currency']);

        result_data[len_i]['transDate'] = yy + '/' + mm + '/' + dd;
        result_data[len_i]['mytransDate'] = '交易日' + yy + '年' + mm + '月' + dd + '日';
        result_data[len_i]['mywithdraw_money'] = '提款金額' + this.acctObj['currName'] + result_data[len_i]['withdraw'] + '元';
        result_data[len_i]['mydeposit_money'] = '存款金額' + this.acctObj['currName'] + result_data[len_i]['deposit'] + '元';
        result_data[len_i]['mybalance_money'] = '結餘金額' + this.acctObj['currName'] + result_data[len_i]['balance'] + '元';
        result_data[len_i]['mycurrency'] = '幣別' + this.acctObj['currName'];
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
    this._logger.error('ContentDetailResult get error', error_obj);
    this.errorPageEmit.emit(error_obj);
  }

}
