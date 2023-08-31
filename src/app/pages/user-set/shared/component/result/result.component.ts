/**
 * 個人設定結果頁
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: [],
    providers: []
})
/**
 * 結果頁
 */

export class ResultComponent implements OnInit {

    @Input() successMsg: string;
    @Input() successDetail: string;
    @Input() successContent: any;
    @Input() notice: any;
    // 返回台幣專用
    @Input() toTwdTransfer: any;
    @Output() backToTWDTransfer: EventEmitter<any> = new EventEmitter<any>();
    btnName = '返回個人設定';
    constructor(
        private _logger: Logger
        , private router: Router
        , private navgator: NavgatorService
        , private _headerCtrl: HeaderCtrlService
    ) { }

    ngOnInit() {


        this._headerCtrl.updateOption({
            style: 'result',
            'leftBtnIcon': 'menu'
            // , 'title': '交易成功'
        });
        if (!!this.toTwdTransfer) {
            this.btnName = '返回台幣轉帳';
        }
    }

    onBackEvent() {
        if (!!this.toTwdTransfer) {

            this.backToTWDTransfer.emit(this.toTwdTransfer);
            this.navgator.push('twd-transfer', {});
        } else {
            this.navgator.push('user-set', {});
        }

    }
}
