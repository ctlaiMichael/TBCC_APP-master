import { Component, OnInit, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { NavgatorService } from '@core/navgator/navgator.service';
@Component({
    selector: 'app-search-set-detail',
    templateUrl: './search-set-detail.component.html',
    styleUrls: [],

})
export class SearchSetDetailComponent implements OnChanges {
    /**
     * 參數處理
     */
    @Input() reqObj: any; // 查詢條件
    @Input() group_data: any;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() backWebEmit: EventEmitter<any> = new EventEmitter<any>();
    showData = true;
    showError = '';
    info_data = {};

    constructor(
        private _logger: Logger,
        private _handleError: HandleErrorService,
        private _formateService: FormateService,
        private navgator: NavgatorService

    ) {
    }

    ngOnChanges() {
        console.log('this.group_data', this.group_data);

        if (this.group_data) {
            this.showData = true;
        }
        let reqObj = {
            'id': this._formateService.checkField(this.reqObj, 'id'),
        };

    }
    //前往理財金庫
    goWeb(item){
        this.backWebEmit.emit(item);
    }
    //前往快速申購
    onPurchase(item) {
        this.backPageEmit.emit(item);
    }
}
