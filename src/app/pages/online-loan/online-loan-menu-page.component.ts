/**
 * 線上申貸
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';

@Component({
    selector: 'app-online-loan-menu',
    templateUrl: './online-loan-menu-page.component.html',
    styleUrls: [],
    providers: []
})

export class OnlineLoanMenuPageComponent implements OnInit {

    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private _formateService: FormateService
        , private navgator: NavgatorService
    ) { }

    ngOnInit() {
        this._logger.error("into online-loan!");
        this._headerCtrl.updateOption({
			'leftBtnIcon': 'menu'
		});
    }
}