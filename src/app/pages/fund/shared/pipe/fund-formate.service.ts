/**
 * fund formate
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FundFormateService {

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
    ) { }


    /**
     * 基金金額樣式
     * @param amount
     * @param type
     */
    fundAmtClass(amount, type?: string) {
        let output = '';
        let check_data = parseFloat(amount);
        if (check_data != 0) {
            if (check_data > 0) {
                output = 'font_red';
            } else {
                output = 'font_bl_gre';
            }
        }

        return output;
    }


}
