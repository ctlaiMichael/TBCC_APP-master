/**
 * 子層paginator
 * 近一週
 *
 * [Detail]:
 *      <f21:transDate>20101208</f21:transDate> 交易日
 *      <f21:digest>degs</f21:digest> 摘要
 *      <f21:withdraw>100</f21:withdraw> 支出
 *      <f21:deposit>200</f21:deposit> 存入
 *      <f21:balance1>300</f21:balance1> 結餘
 *      <f21:rcvBankId>001</f21:rcvBankId> 交易行庫代碼
 *      <f21:rcvBankName>bankname</f21:rcvBankName> 交易行庫名稱
 *      <f21:checkNumber>1010101</f21:checkNumber> 支票號碼
 *      <f21:remarks>remarks</f21:remarks> 備註
 *      <f21:transTime>235959</f21:transTime> 交易時間
 */
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { DepositInquiryDetailService } from '@pages/deposit/shared/service/deposit-inquiry-detail.service';
import { NavgatorService } from '@core/navgator/navgator.service';
@Component({
    selector: 'app-content-detail-result',
    templateUrl: './content-detail-result.component.html',
    styleUrls: [],

})
export class ContentDetailResultComponent implements OnInit {
    /**
     * 參數處理
     */
    @Input() page: string | number = 1;
    @Input() reqObj: {}; // 查詢條件
    @Input() acctObj: {}; // 帳戶資訊
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    showData = true;
    showError = '';
    data: any;
    info_data = {};

    constructor(
        private _logger: Logger,
        private _handleError: HandleErrorService,
        private _formateService: FormateService,
        private navgator: NavgatorService,
        private _mainService: DepositInquiryDetailService

    ) {
    }

    ngOnInit() {
        if (typeof this.page === 'undefined') {
            this.page = 1;
        } else {
            // tslint:disable-next-line:radix
            this.page = parseInt(this.page.toString());
        }

        let reqObj = {
            'id': this._formateService.checkField(this.reqObj, 'id'),
            'startDate': this._formateService.checkField(this.reqObj, 'startDate'),
            'endDate': this._formateService.checkField(this.reqObj, 'endDate'),
            'acctNo': this._formateService.checkField(this.acctObj, 'acctNo'),
            'acctType': this._formateService.checkField(this.acctObj, 'acctType')
        };
        this._logger.step('Deposit', this.reqObj, this.acctObj, reqObj);


        this._mainService.getDetailData(reqObj, this.page).then(
            (result) => {
                this.showData = true;
                this.data = result.data;
                if (this.page === 1) {
                    this.navgator.pageInitEnd(); // 取得資料後顯示頁面
                }
                this.onBackPageData(result);
            },
            (errorObj) => {
                if (this.page === 1) {
                    this.showData = false;
                    this.showError = (!!errorObj.content) ? errorObj.content : '';
                    this.navgator.pageInitEnd(); // 取得資料後顯示頁面
                } else {
                    this.showData = true;
                }
                this.onErrorBackEvent(errorObj);
            }
        );

    }

    /**
     * 顯示內容頁
     * @param item 內容頁資料
     */
    onContentEvent(item) {
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
        this._logger.step('Deposit', 'detail back', item);
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
        this.errorPageEmit.emit(output);
    }

}
