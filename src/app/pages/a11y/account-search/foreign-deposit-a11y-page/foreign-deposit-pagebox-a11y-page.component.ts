/**
 * 外匯存款查詢: 查詢列表(卡片總覽四)
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { DepositInquiryService } from '@pages/deposit/shared/service/deposit-inquiry.service';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
    selector: 'app-foreign-deposit-pagebox-a11y-page',
    templateUrl: './foreign-deposit-pagebox-a11y-page.component.html',
    providers: [DepositInquiryService]
})

export class ForeignDepositPageboxA11yPage implements OnInit {
    /**
     * 參數處理
     */
    @Input() page: string | number = 1;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    data: any;

    date_type: any;                 // 最後交易日 or 定存到期日

    constructor(
        private _logger: Logger,
        private _mainService: DepositInquiryService,
        private _formateService: FormateService,
        private _handleError: HandleErrorService,
        private navgator: NavgatorService,
    ) { }

    ngOnInit() {
        if (typeof this.page === 'undefined') {
            this.page = 1;
        } else {
            this.page = parseInt(this.page.toString());
        }
    this._mainService.getForexData(this.page, [], { reget: false }).then(
            (result) => {
        return Promise.resolve(result);
      },
      (errorObj) => {
        this.onErrorBackEvent(errorObj);
        return Promise.resolve(null);
      }
    )
      .then((allData: any) => {
        if (allData) {
        this._mainService.getForexData(1, [], { reget: false }, (allData.info_data.paginatedInfo.totalRowCount + 1))
          .then((allResult) => {
            allResult = this.formateData(allResult);
            allResult.data = this.transferdata(allResult.data);
            this.data = allResult.data;
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
     * 顯示內容頁
     * @param item 內容頁資料
     */
    onContentEvent(item) {
        let output = {
            'page': 'list-item',
            'type': 'content',
            'data': item,
        };
        this.backPageEmit.emit(output);
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
        this._handleError.handleError(error_obj);
        this.navgator.push('a11yhomekey');
        // this.errorPageEmit.emit(output);
    }

    /************************************************************************
     *                                                                      *
     *            可共用模組       TODO      改寫成service                    *
     *                                  *                                   *
     ************************************************************************/
    /**
     * 整理從電文來的資料格式
     * @param result
     */
  formateData(result) {
    if (result.hasOwnProperty('data')) {
            let result_data = result.data;
            let data_len = (<any>Object).keys(result_data).length;
      for (let i = 0; i < data_len; i++) {
                result_data[i]['acctNo'] = AccountMaskUtil.accountNoFormate(result_data[i]['acctNo']);
                result_data[i]['balance'] = this._formateService.transMoney(result_data[i]['balance'], 'TWD');
            }
            result.data = result_data;
        }
        return result;
    }

    /**
     * 將資料轉換成無障礙
     * 1. 將西元年改為民國年
     * 2. 增加屬性：報讀title-> mydeposit_account、myavbl_balance
     */
  transferdata(result_data) {
        let data_len = (<any>Object).keys(result_data).length;
    for (let i = 0; i < data_len; i++) {
            let time = DateUtil.getDateString(result_data[i]['lastTrnsDate'], true);
            let time_len = result_data[i]['lastTrnsDate'].length;
      let yy: any, mm: any, dd: any;
      if (time_len > 9) {
                let array = time.split("/");
                yy = parseInt(array[0]) - 1911;
                mm = array[1];
                dd = array[2];
            } else {
                let array = time.split("/");
                yy = array[0];
                mm = array[1];
                dd = array[2];
            }

            // 是否為定期存款
      if (result_data[i]['acctType'] == 'XF' || result_data[i]['acctType'] == 'XFS') {
                result_data[i]['date_type'] = "定存到期日";
            } else {
                result_data[i]['date_type'] = "最後交易日";
            }
            result_data[i]['lastTrnsDate'] = yy + "/" + mm + "/" + dd;
            result_data[i]['mylastTrnsDate'] = result_data[i]['date_type'] + yy + "年" + mm + "月" + dd + "日";
            result_data[i]['mydeposit_account'] = result_data[i]['acctTypeName'] + result_data[i]['acctNo'];
            result_data[i]['myavbl_balance'] = "可用餘額 " + result_data[i]['currName'] + result_data[i]['balance'] + "元";
        }
        return result_data;
    }
}
