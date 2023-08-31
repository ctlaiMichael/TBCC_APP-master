/**
 * 匯率試算
 */
import { Component, OnInit, Input, Output, EventEmitter, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ExchangeService } from '@pages/financial/shared/service/exchange.service';
import { ClassMethod } from '@angular/compiler/src/output/output_ast';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
@Component({
    selector: 'app-exchange-calculate-page',
    templateUrl: './exchange-calculate-page.component.html',
    styleUrls: [],
    providers: [ExchangeService]
})
/**
 * 換匯試算
 */
export class ExchangeCalculatePageComponent implements OnInit {
    /**
     * 參數處理
     */
    @Input() rateData = [];
    @Input() baseCurrency = {
        name: 'TWD',
        currencyName: '',
        buyRate: '1'
    };
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    new_table = [];

    count = '1';
    errorMsg = ''; // 錯誤訊息

    constructor(
        private _mainService: ExchangeService
        , private _logger: Logger
        , private _handleError: HandleErrorService
    ) { }

    ngOnInit() {
        this.onSortnewData(this.rateData);

    }



    /**
      * 整理資料(新)
      */
    onSortnewData(sortarr) {
        let exArr=[];
        sortarr.forEach(element => {
            if(!element.spotFlag){
                exArr.push(element);
            }
        });
        this.new_table = this._mainService.onSortnewData(exArr);
        this.count = '';
    }


    popOpen() {
        this.backPageEmit.emit(this.new_table);
    }



}
