/**
 * Util Date
 * 日期formate
 *
 * [transDate]
 * DateUtil.transDate(new Date()); // 2017/01/01 12:33:33
 * DateUtil.transDate(new Date(), 'date'); // 2017/01/01
 * DateUtil.transDate('2017/01/01'); // 2017/01/01 00:00:00
 * DateUtil.transDate('2017/01/01', 'date'); // 2017/01/01
 * DateUtil.transDate('2017/01/01', 'number'); // 20170101000000
 * DateUtil.transDate('2017/01/01', 'timestamp'); // 回傳timestamp
 * DateUtil.transDate('2017/01/01', 'object'); // 回傳date物件
 * DateUtil.transDate('2017/01/01', ['yyyy/MM/dd','datepipe']); // (目前不提供)使用datePipe 2017/01/01
 * DateUtil.transDate('2017/01/01', {'formate': 'yyy/MM/dd','datepipe': true}); // 轉換民國年
 * DateUtil.transDate('2017/01/01', ['yyyy/MM/dd','chinaYear']); // 民國年處理
 * DateUtil.transDate('2017/01/01', {'formate': 'yyy/MM/dd','chinaYear': true}); // 轉換民國年
 */
// import { DatePipe } from '@angular/common';
import { PadUtil } from '../string/pad-util';

export const DateUtil = {
    /**
     * 取得設定資訊
     */
    getSet(args?: any): Object {
        let chinaYear = false; // 是否判斷民國年(可設定)
        let option = 'yyyy/MM/dd HH:mm:ss'; // 預設日期formate(可設定)
        let datepieFlag = false;
        if (typeof args !== 'undefined' && args) {
            let check_type = args;
            if (args instanceof Object && args.hasOwnProperty('formate')) {
                check_type = args.formate;
                if (args.hasOwnProperty('datepipe') && args.datepipe) {
                    datepieFlag = true;
                }
                if (args.hasOwnProperty('chinaYear') && args.chinaYear) {
                    chinaYear = true;
                }
            } else if ((args instanceof Array) && args.length < 3 && args[0]) {
                check_type = args[0];
                if (args[1] === 'datepipe') {
                    datepieFlag = true;
                } else if (args[1] === 'chinaYear') {
                    chinaYear = true;
                }
            }
            switch (check_type) {

                case 'date':
                    option = 'yyyy/MM/dd';
                    break;
                case 'dateInpt':
                    option = 'yyyy-MM-dd';
                    break;
                case 'number':
                    option = 'yyyyMMddHHmmss';
                    break;
                case 'timestamp':
                    option = 'timestamp';
                    break;
                case 'object':
                    option = 'object';
                    break;
                default:
                    option = check_type;
                    break;
            }
        }

        return {
            datepieFlag: datepieFlag,
            option: option,
            chinaYear: chinaYear
        };
    },
    /**
     * 取得日期物件
     * @param obj_val
     * @param chinaYear
     */
    getDateObj(obj_val, chinaYear: boolean): any {
        const dt = new Date(obj_val);
        const timestamp = dt.getTime();
        if (timestamp) {
            let year = dt.getFullYear();
            if (chinaYear) {
                year -= 1911;
            }
            const month = PadUtil.pad(dt.getMonth() + 1, 2);
            const day = PadUtil.pad(dt.getDate(), 2);
            const hour = PadUtil.pad(dt.getHours(), 2);
            const min = PadUtil.pad(dt.getMinutes(), 2);
            const sec = PadUtil.pad(dt.getSeconds(), 2);
            return {
                date_obj: dt,
                timestamp: timestamp,
                year: year.toString(),
                month: month,
                day: day,
                hour: hour,
                min: min,
                sec: sec
            };
        } else {
            return timestamp;
        }
    },


    /**
     * 日期字串判斷
     * @param value 日期
     * @param chinaYear 是否民國年
     */
    getDateString(value: string | number, chinaYear: boolean): string {
        let date = value.toString();
        // ==特殊文字處理== //
        if (date === 'NOW_TIME') {
            const tmp_dt = new Date();
            date = tmp_dt.getFullYear()
                + '' + PadUtil.pad(tmp_dt.getMonth() + 1, 2)
                + '' + PadUtil.pad(tmp_dt.getDate(), 2)
                + '' + PadUtil.pad(tmp_dt.getHours(), 2)
                + '' + PadUtil.pad(tmp_dt.getMinutes(), 2)
                + '' + PadUtil.pad(tmp_dt.getSeconds(), 2)
                ;
        }

        let show_time_flag = true;
        let obj_val = date.replace(/[\/|\-|\.|\:|\s]/g, '');
        const res = /^[0-9]+$/;
        if (res.test(obj_val)) {
            const obj_length = obj_val.length;
            const date_list = ['', '', ''];
            switch (obj_length) {
                case 6: // 780101 民國78.01.01
                case 7: // 1010101 民國101.01.01
                    date_list[1] = obj_val.substr(-4, 2);
                    date_list[2] = obj_val.substr(-2, 2);
                    if (obj_length == 6) {
                        date_list[0] = obj_val.substr(0, 2);
                    } else {
                        date_list[0] = obj_val.substr(0, 3);
                    }
                    obj_val = date_list.join('/');
                    show_time_flag = false;
                    break;
                case 8: // 19890101 西元1989.01.01
                    date_list[0] = obj_val.substr(0, 4);
                    date_list[1] = obj_val.substr(4, 2);
                    date_list[2] = obj_val.substr(6, 2);
                    obj_val = date_list.join('/');
                    show_time_flag = false;
                    break;
                case 12: // 780101126060
                case 13: // 1060124140713
                    date_list[1] = obj_val.substr(-10, 2);
                    date_list[2] = obj_val.substr(-8, 2);
                    date_list[3] = obj_val.substr(-6, 2);
                    date_list[4] = obj_val.substr(-4, 2);
                    date_list[5] = obj_val.substr(-2, 2);
                    if (obj_length == 12) {
                        date_list[0] = obj_val.substr(0, 2);
                    } else {
                        date_list[0] = obj_val.substr(0, 3);
                    }
                    obj_val = date_list[0]
                        + '/' + date_list[1]
                        + '/' + date_list[2]
                        + ' ' + date_list[3]
                        + ':' + date_list[4]
                        + ':' + date_list[5]
                        ;
                    break;
                case 14: // 19890101125959 西元1989.01.01 12:59:59
                default: // 有毫秒iOS會出錯
                    obj_val = obj_val.substr(0, 4)
                        + '/' + obj_val.substr(4, 2)
                        + '/' + obj_val.substr(6, 2)
                        + ' ' + obj_val.substr(8, 2)
                        + ':' + obj_val.substr(10, 2)
                        + ':' + obj_val.substr(12, 2)
                        ;
                    break;
            }

            // == 民國轉換 == //
            const tmp_date = obj_val.split('/');
            // tslint:disable-next-line:radix
            if (parseInt(tmp_date[0]) <= 1911 && tmp_date[0].length < 4) {
                tmp_date[0] = (parseInt(tmp_date[0], 10) + 1911).toString();
                obj_val = tmp_date.join('/');
            }
        } else {
            obj_val = date;
        } // obj_val end

        const check_date = this.getDateObj(obj_val, chinaYear);
        if (check_date) {
            if (show_time_flag) {
                date = check_date.year + '/' + check_date.month + '/' + check_date.day
                    + ' ' + check_date.hour + ':' + check_date.min + ':' + check_date.sec;
            } else {
                date = check_date.year + '/' + check_date.month + '/' + check_date.day;
            }
        }

        return date;
    },

    /**
     * 日期轉換
     * @param value object
     * @param args
     */
    transDate(value: any, args?: any): any {
        // console.log('value:', value);
        // console.log('args:', args);
        let date = value;
        const get_set = this.getSet(args); // 參數判斷
        const datepieFlag = get_set.datepieFlag;
        const option = get_set.option;
        const chinaYear = get_set.chinaYear; // 民國年

        if (typeof value === 'string' || typeof value === 'number') {
            date = this.getDateString(value, false); // 民國年統一轉換(下方處理)
        } // string end

        if (datepieFlag) {
            // 效能太差，不到必要請勿使用
            // return this.datePipe.transform(date, option); // 效能太差
        } else {

            let pie_str: any;
            const check_date = this.getDateObj(date, chinaYear);
            if (!check_date) {
                return date;
            } else {
                const timestamp = check_date.timestamp;
                const date_obj = check_date.date_obj;
                const year = check_date.year;
                const month = check_date.month;
                const day = check_date.day;
                const hour = check_date.hour;
                const min = check_date.min;
                const sec = check_date.sec;

                const timeObj = {
                    time: timestamp,
                    date: date_obj,
                    formate: '',
                    data: {
                        year: year,
                        month: month,
                        day: day,
                        hour: hour,
                        min: min,
                        sec: sec
                    }
                };

                let set_formate = option;
                let is_default = false;
                if (option === 'object') {
                    is_default = true;
                    set_formate = 'yyyy/MM/dd HH:mm:ss';
                }
                if (chinaYear) {
                    if (!is_default && set_formate.search('yyyy') > -1) {
                        // 假設不超過民國999年
                        set_formate = set_formate.replace(/yyyy/g, '0yyy');
                    } else {
                        set_formate = set_formate.replace(/yyyy/g, 'yyy');
                    }
                    timeObj.formate = set_formate.replace(/yyy/g, year.toString());
                } else {
                    timeObj.formate = set_formate.replace(/yyyy/g, year.toString());
                }

                timeObj.formate = timeObj.formate.replace(/MM/g, month);
                timeObj.formate = timeObj.formate.replace(/dd/g, day);
                timeObj.formate = timeObj.formate.replace(/HH/g, hour);
                timeObj.formate = timeObj.formate.replace(/mm/g, min);
                timeObj.formate = timeObj.formate.replace(/ss/g, sec);

                switch (option) {
                    case 'timestamp':
                        pie_str = timestamp;
                        break;
                    case 'object':
                        pie_str = timeObj;
                        break;
                    default:
                        pie_str = timeObj.formate;
                        break;
                }
            }

            return pie_str;
        }
    },

    /**
     * 日期transfer (民國年轉為西元年)
     * 民國年特殊處理
     * @param value
     * @param args
     */
    transChinDate(value: string, formate?: string) {
        let tmp_date = value;
        tmp_date = tmp_date.replace(/年|月|日|\-/g, '/');
        if (tmp_date.substr(-1, 1) == '/') {
            tmp_date = tmp_date.substr(0, tmp_date.length - 1);
        }
        let date_list = tmp_date.split('/');
        let date_len = date_list.length;
        let date_formate = (!!formate) ? formate : 'yyyyMMdd';
        let set_date = '';
        if (date_len == 1) {
            let year_len = date_list[0].length;
            if (year_len <= 3) {
                date_formate = date_formate.replace(/MM|dd/g, '');
                set_date = date_list[0] + '0101';
            } else {
                switch (year_len) {
                    case 4: // 7801
                    case 5: // 10801
                        date_formate = date_formate.replace(/dd/g, '');
                        set_date = date_list[0] + '01';
                        break;
                    case 6: // 780101
                    case 7: // 1080101
                        // 直接處理(transDate有)
                        break;
                }
            }
        } else if (date_len == 2) {
            date_formate = date_formate.replace(/dd/g, '');
            set_date = date_list[0] + PadUtil.pad(date_list[1], 2) + '01';
        } else if (date_len == 3) {
            set_date = date_list[0]
                        + PadUtil.pad(date_list[1], 2)
                        + PadUtil.pad(date_list[2], 2);
        } else {
            // change error
            return value;
        }

        let output = this.transDate(set_date, date_formate);
        return output;
    },

    /**
     * 比較兩個日期
     * startDate : yyyy/MM/dd字串
     * endDate : yyyy/MM/dd字串
     *
     * return 1 : endDate晚於startDate
     *        0 : endDate等於startDate
     *       -1 : endDate早於startDate
     */
    compareDate(startDate, endDate) {
        startDate = startDate.replace(/-/g, '/');
        endDate = endDate.replace(/-/g, '/');
        let fd = new Date(startDate).getTime();
        let ed = new Date(endDate).getTime();

        if (ed > fd) {
            return 1;
        } else if (ed == fd) {
            return 0;
        } else {
            return -1;
        }
    }

};
