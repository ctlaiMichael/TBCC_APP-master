/**
 * 基本Date常用pipe
 */
import { Pipe, PipeTransform } from '@angular/core';
import { DateUtil } from '@shared/util/formate/date/date-util';


// --------------------------------------------------------------------------------------------
//     ___       __
//   __| _/____ _/  |_  ____
//  / __ |\__  \\   __\/ __ \
// / /_/ | / __ \|  | \  ___/
// \____ |(____  /__|  \___  >
//      \/     \/          \/   PART_BOX: date
// --------------------------------------------------------------------------------------------

/**
 * 日期pipe (適用舊版)
 * @param value 日期
 * @param args 格式
 * {{'2017/1/1' | htDate}}
 * {{'2017/1/1' | htDate:'date'}}
 */
@Pipe({
    name: 'htDate'
})
export class HtDatePipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: any, args?: any): any {
        return DateUtil.transDate(value, args);
    }

}

