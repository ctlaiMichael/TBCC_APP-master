/**
 * Amount Pipe
 */
import { Pipe, PipeTransform } from '@angular/core';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { Logger } from '@core/system/logger/logger.service';


/**
 * 匯率試算專用
 * @param  money    
 * @param  item 轉入賣匯
 * @param  baserate 轉出買匯
 * @param  count   使用者輸入 
 */
@Pipe({
    name: 'rateTrans'
})
export class RatetransPipe implements PipeTransform {
    constructor(
        private _logger: Logger
    ) { }
    transform(money: any, item: any, baserate: any, count: any): any {
        this._logger.log('RatetransPipe money :', money, ' ,RatetransPipe item:', item, ' ,RatetransPipe baserate:', baserate.buyRate,
            'RatetransPipe count:', count);
        let transMoney;
        //剛載入第一次 count為underfined
        if(count==undefined){
            transMoney = baserate.buyRate / item.sell * 1;
            this._logger.log('undefined',transMoney);
            return transMoney;
        };
        
        if (item.hasOwnProperty('sell') && baserate.buyRate!="") {
            transMoney = baserate.buyRate / item.sell * count;
            this._logger.log('transMoney',transMoney);
            return transMoney;
        } else {
            this._logger.log('item.sell',item.sell);
            return item.sell;
        }
    }

}

