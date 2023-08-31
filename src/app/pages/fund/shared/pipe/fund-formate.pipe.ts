/**
 * Fund常用pipe
 */
import { Pipe, PipeTransform } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FundFormateService } from './fund-formate.service';

/**
 * 基金金額顏色
 */
@Pipe({
    name: 'fundAmtClass'
})
export class FundAmtClassPipe implements PipeTransform {

    constructor(
        private _logger: Logger
        , private _formate: FundFormateService
    ) { }

    transform(value, type?: string): any {
        return this._formate.fundAmtClass(value, type);
    }

}


