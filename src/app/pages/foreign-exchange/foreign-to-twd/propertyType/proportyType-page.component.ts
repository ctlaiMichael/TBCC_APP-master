/**
 * 台幣轉外幣
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
// import { LayoutService, PopupService, ConfigService, SystemService } from '@service/global';

@Component({
    selector: 'app-proportyType',
    templateUrl: './proportyType-page.component.html',
    styleUrls: [],
    providers: []
})
export class ProportyType implements OnInit {
    /**
     * 參數處理
     */
    // @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();

       //從外匯 台外轉頁面導過來 
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();    //傳回外匯
    constructor(
        private _logger: Logger
        , private router: Router
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
    ) {
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back'
        });
        // this._headerCtrl.setLeftBtnClick(() => {
        //     this.onBackPageData();
        // });
    }

    ngOnInit() {
        this._headerCtrl.setLeftBtnClick(() => {
            let output = {
                'formPage': 'proportyType',
                'assignPage': 'edit_page',
            };
            this.backPageEmit.emit(output);
        });

    }

    /**
     * go
     *
     */


}
