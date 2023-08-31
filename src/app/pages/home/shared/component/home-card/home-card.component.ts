/**
 * 信用卡專區box
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { UserHomeService } from '@pages/home/shared/service/user-home.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { OverAmountOptions } from '@shared/layout/over-amount-style/over-amount-options';

@Component({
    selector: 'app-home-card',
    templateUrl: './home-card.component.html',
    providers: [UserHomeService]
})
export class HomeCardComponent implements OnInit {
    /**
     * 參數處理
     */
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    showData = false;
    showCurrency = 'TWD';
    dataTime = '';
    data: any = {
        'allAmt': '0', // 所有額度
        'useAmt': '0', // 已用額度
        'usableAmt': '0', // 可用餘額
        'bill': '0', // 未繳金額
        'paidAmt': '0', // 當期信用卡已繳金額
        'percent': '0', // 比例
        'dateline': {
            'date': '00',
            'month': '00',
            'preMonth': '00',
            'day': '00'
        }
    };
    amountOption: OverAmountOptions;


    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private _mainService: UserHomeService
    ) {

        this.amountOption = new OverAmountOptions();
        this.amountOption.animate_flag = false;
        this.amountOption.currency = this.showCurrency;
    }


    ngOnInit() {
        this._mainService.getCardBill().then(
            (resObj) => {
                this.dataTime = resObj.dataTime;
                this.data = resObj.data;
                // debugger;
                let today = new Date(); // 獲得當前日期
                if (today.getDate() == 1) {
                    this.data.bill = '結帳日';
                    this.showData = true;
                    this.onBackPageData(resObj);
                } else {
                    this.data.bill = this.data.bill - this.data.paidAmt;
                    this.showData = true;
                    this.onBackPageData(resObj);
                }
            },
            (errorObj) => {
                this.onErrorBackEvent(errorObj);
            }
        );

    }

    onClickEvent(type: string) {
        let link_list = {
            'card': 'web:card',
            'pay': 'web:pay', // 立即繳款
            'bill': 'web:bill', // 帳單查詢
            'apply': 'web:apply', // 信用卡申請
        };
        let path = link_list['card'];
        if (link_list.hasOwnProperty(type)) {
            path = link_list[type];
        }
        this.navgator.push(path); // 前往外幣匯率
    }

    /**
     * 重新設定page data
     * @param item
     */
    onBackPageData(item) {
        let output = {
            'page': 'card',
            'type': 'success',
            'data': item
        };
        this._logger.step('HomePage', 'card', item);
        this.backPageEmit.emit(output);
    }

    /**
     * 失敗回傳
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(error_obj) {
        let output = {
            'page': 'card',
            'type': 'error',
            'data': error_obj
        };
        this._logger.error('HomePage', 'card', error_obj);
        this.errorPageEmit.emit(output);
    }

}

