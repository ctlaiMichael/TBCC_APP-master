/**
 * 線上約據下載
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';

@Component({
    selector: 'app-download-result',
    templateUrl: './download-result-page.component.html',
    styleUrls: [],
    providers: []
})

export class DownloadResultPageComponent implements OnInit {
    
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    nowPage = 'resultPage';

    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private alert: AlertService
        , private confirm: ConfirmService
    ) { }

    ngOnInit() {
        this._logger.error("into download!");
        
        this._headerCtrl.updateOption({
			'leftBtnIcon': 'menu'
		});
    }
    
    onDownload() {
        this.confirm.show('請選擇欲下載的資料', {
            title: '提醒您',
            btnYesTitle: '申請書',
            btnNoTitle: '借款契約'
        }).then(
            () => {
                this.nowPage = 'resultPage';
            },
            () => {
                this.nowPage = 'resultPage';
            }
        );
    }
    backLoan() {
        this.navgator.push('online-loan');
    }
    test() {
        this.nowPage = 'testPage';
    }
    onTestBack() {
        this.navgator.push('online-loan');
    }
}