/**
 * 列表金額顯示樣式處理
 */
import {
    Directive, ElementRef, Input, Output, OnDestroy
    , HostListener, EventEmitter, OnInit

} from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';

@Directive({
    selector: '[listAmount]'
})
export class ListAmountDirective implements OnInit, OnDestroy {
    /**
     * 參數處理
     */
    @Input() data;
    showContentType = ''; // 是否顯示內容
    content = ''; // 顯示的金額內容


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
        const check_number = this._formateService.transNumber(this.data, 'float');
        if (check_number === false) {
            // 不明
            this.showContentType = 'Unknow';
            this.content = this.data;
        } else {
            const check_empty = this._checkService.checkEmpty(this.data, true, true);
            if (!check_empty) {
                this.showContentType = 'Empty';
                this.content = this._formateService.transNumber(this.data, '0');
            } else if (check_number < 0) {
                this.content = this._formateService.transMoney(Math.abs(check_number));
                this.showContentType = 'negative';
            } else {
                this.content = this._formateService.transMoney(check_number);
                this.showContentType = 'positive';
            }
        }

        this.showPage();
    }


    private showPage() {
        let text = '- -';
        let set_class = '';
        switch (this.showContentType) {
            case 'positive':
                // 正數: d,ddd,ddd,ddd,ddd.dd
                text = this.content;
                set_class = 'font_money_blu';
                break;
            case 'negative':
                // 負數: -d,ddd,ddd,ddd,ddd.dd
                text = '-' + this.content;
                set_class = 'color_ded';
                break;
            case 'Empty':
                // empty: 0.00
                text = this.content;
                break;
            case 'Unknow': // 非數值
                text = this.content;
                break;
            default:
                break;
        }

        this.el.nativeElement.innerHTML = text;
        if (set_class !== '') {
            this.el.nativeElement.classList.add(set_class);
        }
        // if (text.length > 8) {
        //     // 金額太長跑版
        //     this.el.nativeElement.classList.add('over_amount');
        // }

    }


}

