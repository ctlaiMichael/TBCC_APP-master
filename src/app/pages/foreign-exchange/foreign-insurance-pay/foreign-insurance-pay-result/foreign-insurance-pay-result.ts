/**
 * 外幣繳保費(結果頁)
 */
import { Component, OnInit, transition, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ForeignInsurancePayService } from '../../shared/service/foreign-insurance-pay.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AlertService } from '@shared/popup/alert/alert.service';

@Component({
    selector: 'app-foreign-insurance-pay-result',
    templateUrl: './foreign-insurance-pay-result.html',
    styleUrls: [],
    providers: [ForeignInsurancePayService]
})

export class ForeignInsurancePayResultComponent implements OnInit {
    @Input() result_data: any;
    @Input() info_data: any;
    @Input() resTitle: string;
    @Input() trnsRsltCode: string;
    @Input() hostCodeMsg: string;
    sucess: boolean; //交易成功
    failed: boolean; //交易失敗

    constructor(
        private _logger: Logger
        , private _checkSecurityService: CheckSecurityService
        , private _headerCtrl: HeaderCtrlService
        , private _authService: AuthService
        , private navgator: NavgatorService
        , private _mainService: ForeignInsurancePayService
        , private _handleError: HandleErrorService
        , private alert: AlertService
    ) { }

    ngOnInit() {
        //左側返回
        this._headerCtrl.setLeftBtnClick(() => {
            this.navgator.push('foreign-exchange');
        });
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '外幣繳保費'
        });
        this.sucess = true;
        this.failed = false;
        if (this.info_data['trnsRsltCode'] == '1' || this.info_data['trnsRsltCode'] == 'X') {
            this.sucess = false;
            this.failed = true;
        }
    }

    onBackMenu() {
        this.navgator.push('foreign-exchange');
    }

    onHome() {
        this.navgator.push('foreign-exchange');
    }
}
