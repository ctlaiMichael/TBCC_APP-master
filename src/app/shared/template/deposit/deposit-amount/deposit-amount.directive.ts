/**
 * 交易明細 存入與支出
 * 當支出為負值(沖正) 需要特殊處理
 * 當存入為正值() 需要特殊處理
 * 冲正交易状态主要有三种：成功、失败和不确定。
 */
import {
    Directive, ElementRef, Input, Output, OnDestroy
    , HostListener, EventEmitter, OnInit

} from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';

@Directive({
    selector: '[depositAmount]'
})
export class DepositAmountDirective implements OnInit, OnDestroy {
    /**
     * 參數處理
     */
    @Input() data;
    showContent = ''; // 是否顯示內容
    withdraw = '';
    deposit = '';


    constructor(
        private _logger: Logger
        , private el: ElementRef
        , private _formateService: FormateService
        , private _checkService: CheckService
    ) {
    }


    ngOnDestroy() {
    }

    ngOnInit() {
        let withdraw = this._formateService.checkField(this.data, 'withdraw');
        let deposit = this._formateService.checkField(this.data, 'deposit');
        const check_withdraw = this._checkService.checkEmpty(withdraw, true, true);
        const check_deposit = this._checkService.checkEmpty(deposit, true, true);

        if (!check_withdraw && !check_deposit) {
            // 都為0
            this.showContent = 'Empty';
            this.withdraw = this._formateService.transMoney('0');
            this.deposit = this._formateService.transMoney('0');
        } else if (check_withdraw) {
            this.showContent = 'withdraw';
            if (parseFloat(withdraw) < 0) {
                // 支出沖正
                this.showContent = 'deposit';
                const tmp_deposit = Math.abs(parseFloat(withdraw));
                this.deposit = this._formateService.transMoney(tmp_deposit);
            } else {
                this.withdraw = '-' + this._formateService.transMoney(withdraw);
            }
        } else {
            this.showContent = 'deposit';
            if (parseFloat(deposit) < 0) {
                // 存入沖正
                this.showContent = 'withdraw';
                const tmp_withdraw = Math.abs(parseFloat(deposit));
                this.withdraw = '-' + this._formateService.transMoney(tmp_withdraw);
            } else {
                this.deposit = this._formateService.transMoney(deposit);
            }
        }
        // 沖正處理

        this.showPage();
    }


    private showPage() {
        let text = '- -';
        let set_class = '';
        switch (this.showContent) {
            case 'withdraw':
                // 支出:-d,ddd,ddd,ddd,ddd.dd
                text = this.withdraw;
                set_class = 'color_ded';
                break;
            case 'deposit':
                // 存入: d,ddd,ddd,ddd,ddd.dd
                text = this.deposit;
                set_class = 'font_money_blu';
                break;
            case 'Empty':
                // empty: 0.00/0.00
                text = this.withdraw + '/' + this.deposit;
                break;
            // case 'reverse':
            //     break;
        }
        this.el.nativeElement.innerHTML = text;
        if (set_class !== '') {
            this.el.nativeElement.classList.add(set_class);
        }
        // 目前先不處理
        // if (text.length > 8) {
        //     // 金額太長跑版
        //     this.el.nativeElement.classList.add('over_amount');
        // }
    }


}

