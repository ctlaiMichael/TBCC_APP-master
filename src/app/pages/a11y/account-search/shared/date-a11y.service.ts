/**
 * 無障礙民國年/月/日
 * 時間相關計算：取得時間、西元年轉換民國年
 * 查詢時間報讀
 */
import { Injectable } from '@angular/core';

@Injectable()
export class DateA11yService {
    /**
     * 參數處理
     */

    constructor() {
    }

    /**
     * 取得時間，電文有回傳時間則套用電文回傳時間，否則取本機時間
     * @param result_datatime 
     */
    getTIME(result_datatime?){
        let querytime: any;   // 查詢時間畫面呈現使用
        let myquerytime: any; // 查詢時間報讀 title 使用
        let today: any;
        if( result_datatime ) {
            today = new Date(result_datatime);
        } else {
            today = new Date();
        }
    
        let year = today.getFullYear() - 1911;
        let month = this.paddingLeft(today.getMonth() + 1);
        let todate = this.paddingLeft(today.getDate());
        let hour = this.paddingLeft(today.getHours());
        let minute = this.paddingLeft(today.getMinutes());
        let seconds = this.paddingLeft(today.getSeconds());
        querytime = year + "/" + month + "/" + todate + "  " + hour + ":" + minute + ":" + seconds;
        myquerytime = "查詢時間" + year + "年" + month + "月" + todate + "日" + hour + "點" + minute + "分" + seconds + "秒";

        let output = {
            'querytime': querytime,
            'myquerytime': myquerytime
        }
        return output;
    }

    /**
     * 月、日要補零
     * @param year 
     */
    paddingLeft(str ) : string {
        let str1 = str.toString();
        if(str1.length >= 2)
        return str1;
        else
        return str1 = "0" + str1;
    }

    /**
     * 查詢區間報讀
     * @param timeintvl_start 開始區間
     * @param timeintvl_end   結束區間
     */
    transfertitle(timeintvl_start, timeintvl_end){
        let timeintvltitle = '';
        let array1 = timeintvl_start.split("/");
        let array2 = timeintvl_end.split("/");
        timeintvltitle = "查詢區間" + array1[0] + "年" + array1[1] + "月" + array1[2] + "日" + "到" 
        + array2[0] + "年" + array2[1] + "月" + array2[2] + "日";
        return timeintvltitle;
    }

}