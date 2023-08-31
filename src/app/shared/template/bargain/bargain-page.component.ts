/**
 * 議價匯率
 */
import { Component, Input, Output, OnInit,EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';

// service
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { TimeDepositTerminateInfo } from '@conf/terms/forex/time-deposit-terminate-info';
import { InfomationService } from '@shared/popup/infomation/infomation.service';


@Component({
    selector: 'app-bargain',
    templateUrl: './bargain-page.component.html',
    styleUrls: [],
    providers: []
})
export class BargainPageComponent implements OnInit {
    /**
     * 參數設定
     */
    @Input() datas;    // 接收父層資料
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();

    showData=false;

   
    constructor(
        private _logger: Logger,
        private _handleError: HandleErrorService,
        private _headerCtrl: HeaderCtrlService,
        private confirm: ConfirmService,
        private navgator: NavgatorService,
        private infomationService: InfomationService
    ) {
    }

    ngOnInit() {
      if(this.datas!=undefined){
        this.showData=true;
      }
    }

   
    onSelectEvent(data){
        this.backPageEmit.emit(data);
    }

}
