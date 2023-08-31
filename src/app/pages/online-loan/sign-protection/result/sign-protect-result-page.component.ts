/**
 * 線上簽約對保-結果頁
 * 
 */
import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { SignProtectService } from '@pages/online-loan/shared/service/sign-protect.service';
import { FormateService } from '@shared/formate/formate.service';

@Component({
    selector: 'app-sign-protect-result',
    templateUrl: './sign-protect-result-page.component.html',
    styleUrls: [],
    providers: [SignProtectService]
})

export class SignProtectResultPageComponent implements  OnInit {


    @Input() resultInfo: any;
    @Input() todayDate: any;
    @Input() signDate: any;
    @Input() resultFlag: any;   // 結果頁切換

    date: any;
    today: any;
    finalDate: any;
    resultPage = '';

    constructor(
        private _logger: Logger,
        private _headerCtrl: HeaderCtrlService,
        private navgator: NavgatorService,
        private _mainService: SignProtectService,
        private _formateService: FormateService
    ) { }

    ngOnInit() {
        this._logger.error('this.resultFlag:', this.resultFlag);
        this.resultPage = this.resultFlag;
       
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'menu',
            'title': '交易結果',
            'style': 'result'
        });
    }

    // 返回線上申貸
    backLoan() {
        this.navgator.push('online-loan');
    }
}