/**
 * 匯率試算
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ExchangeService } from '@pages/financial/shared/service/exchange.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { element } from 'protractor';
@Component({
    selector: 'app-currency-flag-popup',
    templateUrl: './currency-flag-popup.component.html',
    styleUrls: [],
    providers: []
})
/**
 * 換匯試算
 */
export class CurrencyFlagPopupComponent implements OnInit {
    /**
     * 參數處理
     */
    @Input() new_table;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();

    baseCurrency = {
        name: 'TWD',
        currencyName: '',
        buyRate: '1'
    };

    constructor(
        private _mainService: ExchangeService
        , private _logger: Logger
        , private _handleError: HandleErrorService
    ) { }

    ngOnInit() {
    }






    chooseOver(item) {
        let output = {
            name: item.country,
            currencyName: item.currencyName,
            buyRate: ''
        };
  
        // this._logger.log('this.new_table.length', this.new_table, this.new_table.length);
        if (this.new_table.length > 0) {
            this.new_table.forEach(elem => {
                // this._logger.log('elem[output.name]', elem['country'], output.name);
                if (elem['country'] == output.name) {
                    output.buyRate = elem['buy'];
                }
                if(elem.hasOwnProperty('type')){
                    output['type']=elem['type'];
                }
            });
        }
        // this._logger.log('choose', this.baseCurrency.name, this.baseCurrency.buyRate);
        // this.onSortData(this.baseCurrency.name);
        this.baseCurrency = output;
        this._logger.log('this.baseCurrency', this.baseCurrency);
        this.backPageEmit.emit({
            baseCurrency: this.baseCurrency
        });
    }

}
