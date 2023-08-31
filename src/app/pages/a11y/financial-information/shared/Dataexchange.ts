/**
 * 日期轉換
 *
 */
import { Injectable } from '@angular/core';
import { DateUtil } from '@shared/util/formate/date/date-util';
@Injectable()

export class DataExchange {
    /**
     * 參數處理
     */

    constructor() { }
    /**
     * 
     * @param datatime "YYYY/MM/DD HH:MM:SS"或"YYYY/MM/DD"
     */
    exchangeData(datatime) {//包含時分秒HH:MM:SS
        // 西元年轉民國年        
        let time2 = DateUtil.getDateString(datatime, true);
        let onlyData = time2.split(" ");
        let time = DateUtil.getDateString(onlyData[0], true);
        let time_len = time.length;
        let yy: any, mm: any, dd: any;
        if (time_len > 9) {
            let array = time.split("/");
            yy = parseInt(array[0]) - 1911;
            mm = array[1];
            dd = array[2];
        } else {
            let array = time.split("/");
            yy = array[0];
            mm = array[1];
            dd = array[2];
        }
        let newData
        if (!!onlyData[1]) {
            newData = yy + '/' + mm + '/' + dd + ' ' + onlyData[1];
        } else {
            newData = yy + '/' + mm + '/' + dd;
        }

        return newData;
    }

}
