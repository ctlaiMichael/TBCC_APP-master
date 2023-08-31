/**
 * Util Date
 * 日期區間計算
 *
 */
import { PadUtil } from '../string/pad-util';
import { DateUtil } from './date-util';
import { logger } from '@shared/util/log-util';

export const DateRangeUtil = {

    /**
     * 取得日期範圍
     * @param set_date 基礎日
     * @param dateObj 物件設定
     *      returnType: 依照設定格式，所有日期格式會轉成DateUtil.transDate的回傳格式(預設date)
     *      rangeType: M 月份, D 日期
     *      rangeNum: 差異時間(負值代表計算最小日，正值代表計算最大日)
     *      rangeBaseDate: 當rangeType為M時，的基礎日期
     */
    getRange(set_date: any, dateObj: object) {
        let output: any = {
            'baseDate': '', // 基準日
            'rangeDate': '', // 計算日
            'rangeType': '', // M or D
            'rangeNum': 0 // 必為整數(-XX~XX)
        };
        if (set_date === 'today') {
            set_date = 'NOW_TIME';
        }
        const baseDate = DateUtil.transDate(set_date, 'object');
        if (typeof baseDate !== 'object' || baseDate == set_date || typeof baseDate['data'] === 'undefined') {
            logger.step('DATE', 'baseDate Error', baseDate);
            return output;
        }
        const returnType = (dateObj.hasOwnProperty('returnType')) ? dateObj['returnType'] : 'date';
        const rangeType = (dateObj.hasOwnProperty('rangeType') && dateObj['rangeType'] === 'M') ? 'M' : 'D';
        // tslint:disable-next-line:radix
        const rangeNum = (dateObj.hasOwnProperty('rangeNum')) ? parseInt(dateObj['rangeNum']) : 0;
        let rangeBaseDate = baseDate['data']['day'];
        if (dateObj.hasOwnProperty('rangeBaseDate')
            // tslint:disable-next-line:radix
            && parseInt(dateObj['rangeBaseDate']) < 12 && parseInt(dateObj['rangeBaseDate']) > 0
        ) {
            rangeBaseDate = dateObj['rangeBaseDate'];
        }

        output.baseDate = DateUtil.transDate(set_date, returnType);
        output.rangeNum = rangeNum;
        output.rangeType = rangeType;
        // tslint:disable-next-line:radix
        if (rangeType === 'M' && parseInt(baseDate['data']['day']) > parseInt(rangeBaseDate) ) {
            // 指定日期處理
            if (output.rangeNum < 0) {
                output.rangeNum = output.rangeNum - 1;
            } else {
                output.rangeNum = output.rangeNum + 1;
            }
        }


        logger.step('DATE', 'set: baseDate dateObj', baseDate, dateObj);
        let now_date = baseDate['data'];

        if (rangeNum === 0) {
            logger.step('DATE', '無計算大小日', rangeNum);
            return output;
        }

        let rangeDate: any = '';
        if (rangeType === 'M') {
            // Month
            let yearNum = 0;
            let monthNum = 0;
            let date_data: any = {
                year: '',
                month: '',
                day: ''
            };
            // tslint:disable-next-line:radix
            let tmp_range = parseInt(now_date.month) + rangeNum;
            if (tmp_range <= 0) {
                tmp_range = Math.abs(tmp_range);
                yearNum = ((tmp_range / 12) + 1) * -1; // 小於0一定過一年度了
                monthNum = 12 - (tmp_range % 12);
            } else if (tmp_range > 12) {
                yearNum = tmp_range / 12;
                monthNum = tmp_range % 12;
            } else {
                monthNum = tmp_range;
            }
            // tslint:disable-next-line:radix
            date_data.year = (parseInt(now_date.year) + parseInt(yearNum.toString())).toString();
            // tslint:disable-next-line:radix
            date_data.month = PadUtil.pad(monthNum, 2);

            date_data.day = rangeBaseDate;
            rangeDate = date_data.year + '/' + date_data.month + '/' + date_data.day + ' 00:00:00';
        } else {
            // Date
            let dateNum = 0;
            dateNum = rangeNum * 86400000; // 一天多少毫秒
            rangeDate = new Date(baseDate.time + dateNum);
        }
        output.rangeDate = DateUtil.transDate(rangeDate, returnType);

        return output;
    }

};
