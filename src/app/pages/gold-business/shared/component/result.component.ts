/**
 * Header
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { logger } from '@shared/util/log-util';

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

    @Input() isSuccess: boolean;
    @Input() successMsg: string;
    @Input() successDetail: string;
    @Input() successContent: any;
    @Input() btnName: string;

    constructor(
        // private _logger: Logger
        private router: Router,
        private navgator: NavgatorService,
        private _headerCtrl: HeaderCtrlService,
    ) { }

    ngOnInit() {
        logger.debug("this.isSuccess = " + this.isSuccess);
        logger.debug("this.successMsg = " + this.successMsg);
        logger.debug("this.successDetail = " + this.successDetail);
        logger.debug("this.successContent = " + JSON.stringify(this.successContent));
        // 未設定交易是否成功，直接視為成功
        if (typeof this.isSuccess === 'undefined') {
            this.isSuccess = true;
        }
        this._headerCtrl.setLeftBtnClick(() => {
            this.navgator.popTo('gold-business');
        });
        switch (this.btnName) {
            case 'CHECK':
                this.btnName = 'BTN.CHECK'; // 確定
                return;
            case 'RETURN':
                this.btnName = '回功能首頁';
                return;
        }
    }
    onBackEvent() {
        this.navgator.popTo('gold-business');
    }
}
