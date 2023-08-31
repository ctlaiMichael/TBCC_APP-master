/**
 * Epay常用pipe
 */
import { Pipe, PipeTransform } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { EpayFormateService } from '@pages/epay/shared/pipe/epay-formate.service';

/**
     * 去除小數位數
     * 解析取得的金額資料會含小數點兩位
     * 1000 => 10.00
 */
@Pipe({
    name: 'epayAmt'
})
export class EpayAmtPipe implements PipeTransform {

    constructor(
        private _logger: Logger
        , private _formate: EpayFormateService
    ) { }

    transform(value, type?: string): any {
        return this._formate.epayAmount(value, type);
    }

}

/**
 * Epay 銷帳編號處理
 * 請依照不同類別進行追加處理，避免改變傳遞中資料
 * @param value 字串
 * @param type 類別
 *  fee: 繳費功能使用
 */
@Pipe({
    name: 'epayNoticeNbr'
})
export class EpayNoticNbrPipe implements PipeTransform {

    constructor(
        private _logger: Logger
        , private _formate: EpayFormateService
    ) { }

    transform(value: string|number, type?: string): any {
        return this._formate.epayNoticeNbr(value, type);
    }

}

