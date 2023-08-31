/**
 * 文件上傳-結果頁
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { AlertService } from '@shared/popup/alert/alert.service';

@Component({
    selector: 'app-card-main-upload-result',
    templateUrl: './card-main-upload-result.component.html',
    styleUrls: [],
    providers: []
})

export class CardMainUploadResultComponent implements OnInit {

    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private alert: AlertService
    ) { }

    ngOnInit() {
        this._headerCtrl.updateOption({
			'leftBtnIcon': 'menu'
		});
    }
    backMenu() {
        this.navgator.push('web:card');
    }

}