import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
    selector: 'app-goldterms-result-page',
    templateUrl: 'goldterms-result-page.component.html'
})

export class GoldtermsResultPageComponent implements OnInit {
    @Input() goldtermsInfo;
    @Output() goldtermsPage: EventEmitter<any> = new EventEmitter<any>();

    goldTermStatus = '';
    goldtermsConfirmInfo = {
        'goldAccount': '',
        'trnsfrOutAccount': '',
        'fixAmount6': '',
        'fixAmount16': '',
        'fixAmount26': '',
        'fixFee': '',
        'fixCloseDay': '',
        'pauseCode': '',
        'pauseBeginDay': '',
        'pauseEndDay': '',
        'fixCode': '',
        'trnsToken': ''
    };
    securityObj = {
        'action': 'init',
        'sendInfo': {}
    };
    returnObj = {
        'pageName': 'result',
        'data': {},
        'security': {},
        'editData' : {}
    };
    btnName = '回功能首頁';
    successMsg = '交易成功';
    successDetail = '';
    isSuccess = true;
    goldtermsInfoOrg: any;

    constructor(
        private _logger: Logger
        , private _headerCtrl: HeaderCtrlService
        , private navgator: NavgatorService
    ) { }

    ngOnInit() {
        // logger.debug('GoldtermsResultPageComponent goldtermsInfo:' + JSON.stringify(this.goldtermsInfo));
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': 'GOLD.TERMS.TITLE_RESULT'
        });

        this.goldtermsInfoOrg = this.goldtermsInfo.confirmData.org;

        switch (this.goldtermsInfoOrg.fixCode) {
            case '1':
                this.goldTermStatus = '未約定';
                break;
            case '2':
                switch (this.goldtermsInfoOrg.pauseCode) {
                    case '' || null:
                        this.goldTermStatus = '正常扣款';
                        break;
                    case '1':
                        this.goldTermStatus = '暫停扣款';
                        break;
                    case '2':
                        this.goldTermStatus = '恢復扣款';
                        break;
                }
                break;
        }
        this._headerCtrl.setLeftBtnClick(() => {
            this.navgator.popTo('gold-business');
        });
        this.securityObj = {
            'action': 'init',
            'sendInfo': this.goldtermsInfo.SEND_INFO
        };
    }

    // 回功能首頁
    onBackEvent() {
        this.navgator.popTo('gold-business');
    }
}
