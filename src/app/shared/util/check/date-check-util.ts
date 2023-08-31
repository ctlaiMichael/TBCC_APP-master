/**
 * Util Date Check
 * 日期檢查處理
 */
import { CommonUtil } from '@shared/util/common-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { DateRangeUtil } from '@shared/util/formate/date/date-range-util';

export const DateCheckUtil = {


    /**
     * 日期檢查
     * @param str 日期
     */
    checkDate(str: string, return_flag?: any) {
        const data = {
            status: false,
            msg: 'CHECK.DATE.ERROR',
            formate: '',
            time: 0,
            data_list: {},
            date: {}
        };
        if (!ObjectCheckUtil.checkEmpty(str, true)) {
            return CommonUtil.modifyReturn(data, return_flag);
        }
        const dt = new Date(str);
        const timestamp = dt.getTime();
        if (timestamp) {
            const month = ((dt.getMonth() + 1) < 10) ? '0' + (dt.getMonth() + 1) : (dt.getMonth() + 1);
            const day = (dt.getDate() < 10) ? '0' + dt.getDate() : dt.getDate();
            const year = dt.getFullYear();
            data.status = true;
            data.msg = '';
            data.formate = year + '/' + month + '/' + day;
            data.time = timestamp;
            data.data_list = {
                'y': year,
                'm': month,
                'd': day,
                'h': dt.getHours(),
                'i': dt.getMinutes(),
                's': dt.getSeconds()
            };
            data.date = dt;
        }
        return CommonUtil.modifyReturn(data, return_flag);
    },

    /**
     * 日期格式檢核
     */
    dateformat(year: any, month?: any, day?: any) {
        const data = {
            status: false,
            msg: 'CHECK.DATE.ERROR',
            date: { year, month, day }
        };
        let dateStr;
        if (!month || !day) {
            if (month == '') {
                dateStr = year + '/1/1';
            } else if (day == '') {
                dateStr = year + '/' + month + '/1';
            } else {
                dateStr = year.replace(/[.-]/g, '/');
            }
        } else {
            dateStr = year + '/' + month + '/' + day;
        }
        dateStr = dateStr.replace(/\/0+/g, '/');

        const accDate = new Date(dateStr);
        let tempDate = accDate.getFullYear() + '/';
        tempDate += (accDate.getMonth() + 1) + '/';
        tempDate += accDate.getDate();

        if (dateStr == tempDate) {
            data.status = true;
            return data;
        }
        return data;
    },



    /**
     * 取得日期設定(回傳設定類型，搭配checkAllDate使用)
     * @param type
     *  strict : (Default) 檢查範圍、最早起日、最晚迄日
     *  future : 查詢未來(預約取消)
     *  simple : 只檢查起始日不可大於結束日
     *
     * check: 起始日不可大於結束日
     * min: 最小日期判斷 today: 同今天, range: 計算出來的, '' 不判斷
     * max: 最大日期判斷 today: 同今天, range: 計算出來的, '' 不判斷
     * range: range判斷
     * future: 可取得未來時間
     * check_method 執行check()要處理的method
     */
    getDateTypeSet(type) {
        let dfType = 'simple';
        const _typeSet = {
            // (Default) 檢查範圍、最早起日、最晚迄日 [非交易類查詢使用]
            'strict': { id: 'strict', check: true, min: 'range', max: 'today', range: true },
            // 查詢未來 [預約取消使用]
            'future': { id: 'future', check: true, min: 'today', max: '', range: false },
            // 交易類使用
            'simple': { id: 'simple', check: true, min: '', max: '', range: false }
        };

        if (!type || !_typeSet.hasOwnProperty(type)) {
            return _typeSet[dfType];
        }
        return _typeSet[type];
    },

    /**
     * 日期設定，對應代入checkAllDate
     * @param dateObj 取得設定
     *      baseDate: 'today', 基礎日
     *      rangeType: 'M', // "查詢範圍類型" M OR D
     *      rangeNum: '3', // 查詢範圍限制
     *      rangeDate: '' // 比較日
     *      rangeBaseDate: 當rangeType為M時，的基礎日期
     * @param dataType
     */
    getDateSet(dateObj: object, dataType: string) {
        const dataTypeSet = this.getDateTypeSet(dataType);
        let baseDate = FieldUtil.checkField(dateObj, 'baseDate');
        if (baseDate === '') {
            baseDate = DateUtil.transDate('NOW_TIME', 'date');
        }
        const rangeDate = FieldUtil.checkField(dateObj, 'rangeDate');
        const rangeBaseDate = FieldUtil.checkField(dateObj, 'rangeBaseDate');
        let reset_date = (rangeDate === '') ? true : false;
        if (!reset_date) {
            if (dataTypeSet.id === 'strict' && !this.checkSelectedDate(baseDate, rangeDate, '>=', true)) {
                reset_date = true;
            } else if (dataTypeSet.id === 'future' && !this.checkSelectedDate(baseDate, rangeDate, '<=', true)) {
                reset_date = true;
            }
        }

        const rangeType = FieldUtil.checkField(dateObj, 'rangeType');
        let rangeNum = FieldUtil.checkField(dateObj, 'rangeNum');

        let output = {
            'check_type': dataTypeSet.id,
            'check_set': dataTypeSet,
            'type': rangeType,
            'rang': rangeNum,
            'QuryLimt': rangeDate,
            'SysDate': baseDate,
            'minDate': '',
            'maxDate': '',
            'baseDate': ''
        };

        if (reset_date) {
            // 重新取得日期
            // tslint:disable-next-line:radix
            rangeNum = Math.abs(parseInt(rangeNum)).toString();
            if (dataTypeSet.id === 'strict') {
                rangeNum = '-' + rangeNum;
            }
            let set_data = {
                returnType: 'date',
                rangeType: rangeType,
                rangeNum: rangeNum,
                rangeBaseDate: rangeBaseDate
            };
            const dateRange = DateRangeUtil.getRange(baseDate, set_data);
            // console.error('Depoist', dateRange, dateObj, baseDate, set_data);
            output.type = dateRange['rangeType'];
            output.QuryLimt = dateRange['rangeDate'];
            output.SysDate = dateRange['baseDate'];
            output.rang = dateRange['rangeNum'];
        }

        output.baseDate = output.SysDate;
        if (dataTypeSet.id === 'strict') {
            output.minDate = output.QuryLimt;
            output.maxDate = output.SysDate;
        } else if (dataTypeSet.id === 'future') {
            output.minDate = output.SysDate;
            output.maxDate = output.QuryLimt;
        }

        // tslint:disable-next-line:radix
        output.rang = Math.abs(parseInt(output.rang)).toString();
        // console.error(JSON.parse(JSON.stringify(output)));
        return output;
    },

    /**
     * 檢核起迄日期是否在範圍內
     * @param type 範圍型態，D：天數，M：月數
     * @param sta_date : 起始日期
     * @param end_date : 結束日期
     * @param range : 範圍
     * @return true/false
     */
    checkDateRange(type, sta_date, end_date, range) {
        let data = {
            status: false,
            msg: 'Error samechar'
        };
        // console.error('checkDateRange', type, sta_date, end_date, range);
        // tslint:disable-next-line:radix
        let rangeInt = parseInt(range);
        if (type == 'D') {	// day
            let sta_dt = Date.parse(sta_date);
            let end_dt = Date.parse(end_date);
            let diff_dt = Math.ceil((end_dt - sta_dt) / (24 * 60 * 60 * 1000));

            if (diff_dt > rangeInt) {
                // console.error(data)
                return data;
            }
        } else if (type == 'M') {	// month
            let sta_dtM: any = new Date(sta_date);
            let end_dtM: any = new Date(end_date);
            let sss = sta_dtM.setMonth(sta_dtM.getMonth() + rangeInt);
            // checkDateRange 2160000000 25 3
            // console.warn('checkDateRange', (end_dtM - sss), Math.ceil((end_dtM - sss) / (86400000)), sta_dtM.getMonth() + rangeInt);
            if (Math.ceil((end_dtM - sss) / 86400000) > 0) {
                return data;
            }


        } else {
            // do nothing
        }
        data.status = true;
        data.msg = '';
        // console.error(data)
        return data;
    },



    /**
     * 日期檢核
     * @param dateObj
     * @param rangObj
     *
     * dateObj=[startDate,endDate];  順序為-> 起日, 迄日
     * rangObj=[type,rang,QuryLimt,SysDate];  順序為-> 限制類型, 限制範圍數, 最小日, 系統當日
     */
    checkAllDate(dateObj: object, rangObj: object) {
        // == 參數處理 == //
        let checkType = '';
        let checkDateData = {
            'status': true,
            'msg': '',
            'errorMsg': [],
            'err_flag': {
                'startDate': false,
                'endDate': false
            },
            'inputData': {
                'startDate': '',
                'endDate': ''
            },
            'rangData': {
                'type': 'M',
                'rang': '24',
                'QuryLimt': '', // minDay
                'QuryLimtMax': '', // maxDay
                'SysDate': '' // today
            }
        };

        // 日期轉換
        const eroMsgAry = {
            'emptyEroMsg': {
                // 'startDate': this._langTransService.instant('CHECK.DATE.CUSTOM01'), // '【查詢日期起日】不得為空白!',
                // 'endDate': this._langTransService.instant('CHECK.DATE.CUSTOM02'), // '【查詢日期迄日】不得為空白!',
                'startDate': '【查詢日期起日】不得為空白!', // '【查詢日期起日】不得為空白!',
                'endDate': '【查詢日期迄日】不得為空白!' // '【查詢日期迄日】不得為空白!',
            },
            'formatEroMsg': {
                // 'startDate': this._langTransService.instant('CHECK.DATE.CUSTOM03'), // '【查詢日期起日】格式不正確!',
                // 'endDate': this._langTransService.instant('CHECK.DATE.CUSTOM03_1'), // '【查詢日期迄日】格式不正確!',
                'startDate': '【查詢日期起日】格式不正確!', // '【查詢日期起日】格式不正確!',
                'endDate': '【查詢日期迄日】格式不正確!', // '【查詢日期迄日】格式不正確!',
            },
            'cantLessThenEroMsg': {
                // 'startDate': this._langTransService.instant('CHECK.DATE.CUSTOM04') + ':;:REPLACE1:;:',
                'startDate': '【查詢日期起日】不得小於最早查詢日期!' + ':;:REPLACE1:;:' + '',
                // '【查詢日期起日】不得小於最早查詢日期!(' +tmpdate + ')',
                'endDate': '',
            },
            'needLessEqualThenEroMsg': {
                // 'startDate': this._langTransService.instant('CHECK.DATE.CUSTOM05'), // '【查詢日期起日】必須小於等於【查詢日期迄日】!',
                'startDate': '【查詢日期起日】必須小於等於【查詢日期迄日】!', // '【查詢日期起日】必須小於等於【查詢日期迄日】!',
                'endDate': '',
            },
            'cantMoreThenEroMsg': {
                'startDate': '',
                'endDate': '【查詢日期迄日】不得大於系統當日!' + ':;:REPLACE2:;:' // '【查詢日期迄日】不得大於系統當日!',
                // 'endDate': this._langTransService.instant('CHECK.DATE.CUSTOM06') + ':;:REPLACE2:;:' // '【查詢日期迄日】不得大於系統當日!',
            },
            'outOfRangEroMsg': {
                // 'startDate': this._langTransService.instant('CHECK.DATE.CUSTOM07'), // '查詢日期的查詢範圍已超出系統設定範圍!',
                'startDate': '查詢日期的查詢範圍已超出系統設定範圍!', // '查詢日期的查詢範圍已超出系統設定範圍!',
                'endDate': ''
            }
        };

        if (dateObj instanceof Array) {
            checkDateData.inputData.startDate = (typeof dateObj[0] !== 'undefined') ? dateObj[0] : checkDateData.inputData.startDate;
            checkDateData.inputData.endDate = (typeof dateObj[1] !== 'undefined') ? dateObj[1] : checkDateData.inputData.endDate;
        } else if (dateObj instanceof Object) {
            checkDateData.inputData.startDate = (dateObj.hasOwnProperty('startDate'))
                ? dateObj['startDate'] : checkDateData.inputData.startDate;
            checkDateData.inputData.endDate = (dateObj.hasOwnProperty('endDate')) ? dateObj['endDate'] : checkDateData.inputData.endDate;
        }
        if (rangObj instanceof Array) {
            checkDateData.rangData.type = (typeof rangObj[0] !== 'undefined') ? rangObj[0] : checkDateData.rangData.type;
            checkDateData.rangData.rang = (typeof rangObj[1] !== 'undefined') ? rangObj[1] : checkDateData.rangData.rang;
            checkDateData.rangData.QuryLimt = (typeof rangObj[2] !== 'undefined') ? rangObj[2] : checkDateData.rangData.QuryLimt;
            checkDateData.rangData.SysDate = (typeof rangObj[3] !== 'undefined') ? rangObj[3] : checkDateData.rangData.SysDate;
        } else if (rangObj instanceof Object) {
            if (rangObj.hasOwnProperty('check_type')) {
                checkType = rangObj['check_type'];
            }
            checkDateData.rangData.type = (rangObj.hasOwnProperty('type')) ? rangObj['type'] : checkDateData.rangData.type;
            checkDateData.rangData.rang = (rangObj.hasOwnProperty('rang')) ? rangObj['rang'] : checkDateData.rangData.rang;
            checkDateData.rangData.SysDate = (rangObj.hasOwnProperty('SysDate')) ? rangObj['SysDate'] : checkDateData.rangData.SysDate;
            checkDateData.rangData.QuryLimt = (rangObj.hasOwnProperty('QuryLimt')) ? rangObj['QuryLimt'] : checkDateData.rangData.QuryLimt;
            // tslint:disable-next-line:max-line-length
            checkDateData.rangData.QuryLimtMax = (rangObj.hasOwnProperty('QuryLimtMax')) ? rangObj['QuryLimtMax'] : checkDateData.rangData.QuryLimtMax;
        }
        let checkTypeSet = this.getDateTypeSet(checkType);
        if (checkTypeSet.id === 'future') {
            if (checkDateData.rangData.QuryLimt !== '' && checkDateData.rangData.QuryLimtMax === ''
                && this.checkSelectedDate(checkDateData.rangData.QuryLimt, checkDateData.rangData.SysDate, '>', true)
            ) {
                checkDateData.rangData.QuryLimtMax = checkDateData.rangData.QuryLimt;
                checkDateData.rangData.QuryLimt = checkDateData.rangData.SysDate;
            } else if (checkDateData.rangData.QuryLimt === '') {
                checkDateData.rangData.QuryLimt = checkDateData.rangData.SysDate;
            }
        } else if (checkTypeSet.id === 'strict') {

            if (checkDateData.rangData.QuryLimt === '' && checkDateData.rangData.QuryLimtMax !== ''
                && this.checkSelectedDate(checkDateData.rangData.QuryLimtMax, checkDateData.rangData.SysDate, '<', true)
            ) {
                checkDateData.rangData.QuryLimt = checkDateData.rangData.QuryLimtMax;
                checkDateData.rangData.QuryLimtMax = checkDateData.rangData.SysDate;
            } else if (checkDateData.rangData.QuryLimtMax === '') {
                checkDateData.rangData.QuryLimtMax = checkDateData.rangData.SysDate;
            }
        }
        let obj_str = DateUtil.transDate(checkDateData['inputData']['startDate'], 'object');
        let obj_end = DateUtil.transDate(checkDateData['inputData']['endDate'], 'object');

        // 錯誤訊息文字替換
        // 日期轉換getFullYear

        // == 日期格式檢查 == //
        let key: any;
        for (key in checkDateData['inputData']) {
            if (!checkDateData['inputData'].hasOwnProperty(key)) {
                continue;
            }
            // 驗空值
            let empty = ObjectCheckUtil.checkEmpty(checkDateData['inputData'][key]);
            // 驗格式
            let dateformat = this.dateformat(checkDateData['inputData'][key]);
            if (empty.status == false) {
                checkDateData['errorMsg'].push(eroMsgAry.emptyEroMsg[key]);
                checkDateData['status'] = false;
                checkDateData['err_flag'][key] = true;
            } else if (dateformat.status == false) {
                checkDateData['errorMsg'].push(eroMsgAry.formatEroMsg[key]);
                checkDateData['status'] = false;
                checkDateData['err_flag'][key] = true;
            }
        }

        // == 驗範圍 == //
        if (checkTypeSet.range) {
            let checkRange = this.checkDateRange(checkDateData['rangData']['type']
                , checkDateData['inputData']['startDate']
                , checkDateData['inputData']['endDate']
                , checkDateData['rangData']['rang']);
            if (checkRange['status'] == false) {
                checkDateData['errorMsg'].push(eroMsgAry.outOfRangEroMsg['startDate']);
                checkDateData['status'] = false;
                checkDateData['err_flag']['startDate'] = true;
                checkDateData['err_flag']['endDate'] = true;
            }
        }

        const check_str = obj_str.time;
        const check_end = obj_end.time;

        // == 起始日不可大於結束日 == //
        if (checkTypeSet.check && check_str > check_end) {
            checkDateData['errorMsg'].push(eroMsgAry.needLessEqualThenEroMsg['startDate']);
            checkDateData['status'] = false;
            checkDateData['err_flag']['startDate'] = true;
        }
        // == 最小日 == //
        if (checkDateData['status'] && checkTypeSet.min !== '') {
            let obj_QURY_LIMT = DateUtil.transDate(checkDateData['rangData']['QuryLimt'], 'object');
            if (checkTypeSet.min === 'today') {
                obj_QURY_LIMT = DateUtil.transDate(checkDateData['rangData']['SysDate'], 'object');
            }
            let tmpdate = (obj_QURY_LIMT instanceof Object)
                ? '(' + obj_QURY_LIMT.data.year + '/' + obj_QURY_LIMT.data.month + '/' + obj_QURY_LIMT.data.day + ')'
                : '';
            eroMsgAry.cantLessThenEroMsg.startDate = eroMsgAry.cantLessThenEroMsg.startDate.replace(':;:REPLACE1:;:', tmpdate);
            if (check_str < obj_QURY_LIMT.time) {
                checkDateData['errorMsg'].push(eroMsgAry.cantLessThenEroMsg['startDate']);
                checkDateData['status'] = false;
                checkDateData['err_flag']['startDate'] = true;
            }
        }
        // == 最大日 == //
        if (checkDateData['status'] && checkTypeSet.max !== '') {
            let obj_SYS_DATE = DateUtil.transDate(checkDateData['rangData']['QuryLimtMax'], 'object');
            if (checkTypeSet.max === 'today') {
                obj_SYS_DATE = DateUtil.transDate(checkDateData['rangData']['SysDate'], 'object');
            }
            let tmpdate2 = (obj_SYS_DATE instanceof Object)
                ? '(' + obj_SYS_DATE.data.year + '/' + obj_SYS_DATE.data.month + '/' + obj_SYS_DATE.data.day + ')'
                : '';
            eroMsgAry.cantMoreThenEroMsg.endDate = eroMsgAry.cantMoreThenEroMsg.endDate.replace(':;:REPLACE2:;:', tmpdate2);
            if (check_end > obj_SYS_DATE.time) {
                checkDateData['errorMsg'].push(eroMsgAry.cantMoreThenEroMsg['endDate']);
                checkDateData['status'] = false;
                checkDateData['err_flag']['endDate'] = true;
            }
        }

        if (!checkDateData['status']) {
            checkDateData['msg'] = checkDateData['errorMsg'].join('<br>');
        }

        return checkDateData;
    },


    /**
     * 選擇日期檢查
     * 檢查所選日期與當下日期
     * @param data1
     * @param data2
     * @param checkType
     *  > : check data1 > data2
     *  < : check data1 < data2
     *  = : check data1 = data2
     *  >= : check data1 >= data2
     *  <= : check data1 <= data2
     * @param return_flag 回傳類型，true回傳boolean
     */
    checkSelectedDate(data1: any, data2: any, checkType: string, return_flag?: any) {
        // if(data1.)
        let output = {
            status: false,
            msg: 'CHECK.DATE.ERROR'
        };

        // d1:查詢日，d2:比較日
        const d1 = DateUtil.transDate(data1, 'timestamp');
        const d2 = DateUtil.transDate(data2, 'timestamp');
        if (!d1 || !d2) {
            return CommonUtil.modifyReturn(output, return_flag);
        }

        let same = false;
        let min = false;
        if (d1 > d2) {
            min = false;
        } else if (d1 < d2) {
            min = true;
        } else if (d1 == d2) {
            min = false;
            same = true;
        }


        switch (checkType) {
            case '>':
                output.status = !min;
                break;
            case '<':
                output.status = min;
                break;
            case '=':
                output.status = same;
                break;
            case '>=':
                if (!min || same) {
                    output.status = true;
                }
                break;
            case '<=':
                if (min || same) {
                    output.status = true;
                }
                break;
            default:
                output.msg = 'ERROR.DATA_FORMAT_ERROR';
                // 非預期參數
                break;
        }

        if (output.status) {
            output.msg = '';
        }
        return CommonUtil.modifyReturn(output, return_flag);
    }




};
