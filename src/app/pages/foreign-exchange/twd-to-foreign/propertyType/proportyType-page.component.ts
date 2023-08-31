/**
 * 台幣轉外幣
 */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private _logger: Logger
        , private router: Router
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
    ) {
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title':'結購來源說明'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.onBackPageData();
        });
    }

    ngOnInit() {

    }

    /**
     * go
     *
     */




    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------
    onBackPageData(item?: any) {

        // 返回
        let output = {
            'formPage': 'proportyType',
            'assignPage': 'edit_page',
        };
        this.backPageEmit.emit(output);


    }
}
