/**
 * epay formate
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class EpayFormateService {

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
    ) { }

    /**
     * 加入小數位數
     * 解析取得的金額資料會含小數點兩位
     * 1000 => 10.00
     */
    epayAmount(amount, type?: string) {
        // tslint:disable-next-line:radix
        let output = parseInt(amount) / 100;
        return output;
    }

    /**
     * epay API專用格式
     * 解析取得的金額資料會含小數點兩位，但不標是小數點
     * 10.00 => 10000
     */
    epaySendAmount(amount, type?: string) {
        // tslint:disable-next-line:radix
        let output = parseFloat(amount) * 100;
        return output;
    }

    /**
     * Epay 銷帳編號處理
     * 請依照不同類別進行追加處理，避免改變傳遞中資料
     * @param value 字串
     * @param type 類別
     *  fee: 繳費功能使用
     */
    epayNoticeNbr(value: string | number, type?: string): any {
        let output = value.toString();
        let tmp: any;
        if (type === 'fee') {
            tmp = output.replace(/%2B|\+/g, '%20'); // 顯示時把+換成空白
            output = decodeURI(tmp);
        }

        if (output == '10000000000000000') {
            output = '9999999999999999';
        }
        // this._logger.log('epayNoticeNbr', value, type, output);
        return output;
    }

}
