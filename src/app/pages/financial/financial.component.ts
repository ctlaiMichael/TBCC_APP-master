/**
 * 金融資訊選單
 */
import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Component({
    selector: 'app-financial',
    templateUrl: './financial.component.html',
    styleUrls: [],
    providers: []
})
export class FinancialComponent implements OnInit {
    /**
     * 參數設定
     */

    constructor(
        private _logger: Logger,
        private navgator: NavgatorService,
        private errorHandler: HandleErrorService
    ) {
        this._logger.step('Financial', 'hi');
    }

    ngOnInit() {
    }
}
