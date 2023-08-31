/**
 * 常用check功能
 * 其他請直接使用Util
 */
import { Injectable } from '@angular/core';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { NumberCheckUtil } from '@shared/util/check/number-check-util';
import { StringCheckUtil } from '@shared/util/check/string-check-util';
import { DateCheckUtil } from '@shared/util/check/date-check-util';
import { ChineseCheckUtil } from '@shared/util/check/word/chinese-check-util';
import { UserCheckUtil } from '@shared/util/check/data/user-check-util';
import { AccountCheckUtil } from '@shared/util/check/data/account-check-util';
import { MoneyCheckUtil } from '@shared/util/check/data/money-check-util';
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { DateUtil } from '@shared/util/formate/date/date-util';

@Injectable()
export class CheckService {

    constructor(
    ) { }



    // --------------------------------------------------------------------------------------------
    //     ____________   ____   ____ |__|____  |  |
    //    /  ___/\____ \_/ __ \_/ ___\|  \__  \ |  |
    //    \___ \ |  |_> >  ___/\  \___|  |/ __ \|  |__
    //   /____  >|   __/ \___  >\___  >__(____  /____/
    //        \/ |__|        \/     \/        \/          PART_BOX: special
    // --------------------------------------------------------------------------------------------


    /**
     * [checkIdentity 身份證字號檢查]
     * @param  {string} identity [身分證字號檢查]
     * @return {obj}	{status:blooean,msg:'error msg'}
     */
    checkIdentity(identity: string) {
        return UserCheckUtil.checkIdentity(identity);
    }


    /**
     * [checkActNum 檢查銀行帳號]
     * @param val
     * @param set_data 其他檢驗項目
     *      return_type 回傳格式 true: boolean, false/undefined: Object (Default)
     *      check_length 檢驗長度 (Default)=3
     *      check_empty 檢查空值: true 檢查 (Default) , false 不檢查
     *      not_zero 允許0: true 不可有0  (Default), false 可有0
     *      check_formate 帳號允許特殊格式
     *          english_number
     *          number
     *          false 不檢查
     */
    checkActNum(val: string | number, set_data?: any) {
        return AccountCheckUtil.checkActNum(val, set_data);
    }


    // --------------------------------------------------------------------------------------------
    //       ___.        __               __
    //   ____\_ |__     |__| ____   _____/  |_
    //  /  _ \| __ \    |  |/ __ \_/ ___\   __\
    // (  <_> ) \_\ \   |  \  ___/\  \___|  |
    //  \____/|___  /\__|  |\___  >\___  >__|
    //            \/\______|    \/     \/       PART_BOX: object
    // --------------------------------------------------------------------------------------------
    checkUndefined(inp_data: Object, required_list: Array<any>) {
        return ObjectCheckUtil.checkUndefined(inp_data, required_list);
    }


    checkEmpty(str: string | number | object, type?: boolean, zero_type?: boolean) {
        return ObjectCheckUtil.checkEmpty(str, type, zero_type);
    }

    // --------------------------------------------------------------------------------------------
    //           __         .__
    //   _______/  |________|__| ____    ____
    //  /  ___/\   __\_  __ \  |/    \  / ___\
    //  \___ \  |  |  |  | \/  |   |  \/ /_/  >
    // /____  > |__|  |__|  |__|___|  /\___  /
    //      \/                      \//_____/   PART_BOX: string
    // --------------------------------------------------------------------------------------------

    /**
     * text檢查 (checkName)
     * 適用各種可輸入的文字框
     * @param str 字串
     */
    checkText(str: string, specail_symbol?: string) {
        return ChineseCheckUtil.checkText(str, specail_symbol);
    }

    /**
     * [checkEnglish 英文檢查]
     * @param  {string} str      [英文字串]
     * @param  {string} check_type [檢核類別]
     * @return {obj}	{status:blooean,msg:'error msg'}
     */
    checkEnglish(str: string, check_type?: string, return_type?: Boolean) {
        return StringCheckUtil.checkEnglish(str, check_type, return_type);
    }

    /**
         * [checkLength 字串長度檢查]
         * @param  {[type]} str    [字串]
         * @param  {[type]} length [檢核長度]
         * @param  {[type]} type [檢核類型]
         * @return {[type]}        [description]
         */

    checkLength(str: string, length, type) {
        return StringCheckUtil.checkLength(str, length, type);
    }
    // --------------------------------------------------------------------------------------------
    //                     ___
    //   ____  __ __  _____\_ |__   ___________
    //  /    \|  |  \/     \| __ \_/ __ \_  __ \
    // |   |  \  |  /  Y Y  \ \_\ \  ___/|  | \/
    // |___|  /____/|__|_|  /___  /\___  >__|
    //      \/            \/    \/     \/       PART_BOX: number
    // --------------------------------------------------------------------------------------------

    /**
     * 數值檢查 (NumberCheck)
     * @param val 判斷值
     * @param specail 特殊指定
     * @param return_flag 回傳boolean
     */
    checkNumber(val: string | number, specail?: string, return_flag?: any) {
        return NumberCheckUtil.checkNumber(val, specail, return_flag);
    }


    /**
     * 金額欄位檢查
     * @param money 金額
     * @param set_data 其他檢驗項目
     *      return_type 回傳格式 true: boolean, false/undefined: Object (Default)
     *      currency 幣別 (TWD或JPY時，金額只能為整數) (Default)=''
     *      check_empty 檢查空值: true 檢查 (Default) , false 不檢查
     *      not_zero 允許0: true 不可有0  (Default), false 可有0
     */
    checkMoney(money: string | number, set_data?: any) {
        return MoneyCheckUtil.checkMoney(money, set_data);
    }

    /**
     * 數值比較
     * @param n1
     * @param n2
     * @param checkType
     *  > : check n1 > n2
     *  < : check n1 < n2
     *  = : check n1 = n2
     *  >= : check n1 >= n2
     *  <= : check n1 <= n2
     * @param return_flag 回傳類型，true回傳boolean
     */
    compareNumber(n1: string | number, n2: string | number, checkType: string, return_flag?: any) {
        return NumberCheckUtil.compareNumber(n1, n2, checkType, return_flag);
    }

    // --------------------------------------------------------------------------------------------
    //     ___       __
    //   __| _/____ _/  |_  ____
    //  / __ |\__  \\   __\/ __ \
    // / /_/ | / __ \|  | \  ___/
    // \____ |(____  /__|  \___  >
    //      \/     \/          \/   PART_BOX: number
    // --------------------------------------------------------------------------------------------


    /**
     * 日期檢查
     * @param str 日期
     */
    checkDate(str: string, return_flag?: any) {
        return DateCheckUtil.checkDate(str, return_flag);
    }

    /**
     * 選擇日期檢查
     * 檢查所選日期與當下日期
     * d1:查詢日，d2:比較日
     *  > : check data1 > data2
     *  < : check data1 < data2
     *  = : check data1 = data2
     *  >= : check data1 >= data2
     *  <= : check data1 <= data2
     * @param data1
     * @param data2
     * @param checkType
     * @param return_flag
     */
    checkSelectedDate(data1: any, data2: any, checkType: string, return_flag?: any) {
        return DateCheckUtil.checkSelectedDate(data1, data2, checkType, return_flag);
    }


    /**
     * 取得頁面設定檔
     * @param dateObj 取得設定
     *       baseDate: 'today', // 基礎日
     *       rangeType: 'M', // "查詢範圍類型" M OR D
     *       rangeNum: '3', // 查詢範圍限制
     *       rangeDate: '', // 比較日
     *       rangeBaseDate: '' // 當rangeType為M時，的基礎日期
     * @param dataType 類型
     *  strict : (Default) 檢查範圍、最早起日、最晚迄日
     *  future : 查詢未來(預約取消)
     *  simple : 只檢查起始日不可大於結束日
     *
     *  @return [Object]
     *      minDate: (date string) 最小可輸入日期，空值表示不限制
     *      maxDate: (date string) 最大可輸入日期，空值表示不限制
     *      baseDate: (date string) 最大可輸入日期，空值表示不限制
     *      check_type: (strict/future/simple) 功能並不會使用!請直接往後送
     *      check_set 功能並不會使用!請直接往後送
     *      type 功能並不會使用!請直接往後送
     *      rang 查詢範圍限制 功能並不會使用!請直接往後送
     *      QuryLimt 指定日期 功能並不會使用!請直接往後送
     *      SysDate 系統日 功能並不會使用!請直接往後送
     */
    getDateSet(dateObj: object, dataType: string) {
        return DateCheckUtil.getDateSet(dateObj, dataType);
    }

    /**
     * 日期檢查
     * @param setDate 設定資料
     *  (Array): [startDate, endDate]
     *  (Object): {
     *      startDate 欲檢查之起始日
     *      endDate 欲檢查之結束日
     *  }
     * @param dateObj 設定資料 (來自getDateSet取得的response)
     * @param dataType 檢查類型
     */
    checkDateRange(setDate, dateObj: object) {
        const dataType = FieldUtil.checkField(dateObj, 'check_type');
        let set_data = dateObj;
        if (typeof dataType !== 'string' || dataType === '' || typeof dateObj['check_set'] === 'undefined') {
            // 無設定值，重新取得
            set_data = this.getDateSet(dateObj, dataType);
        }
        // 日期檢核
        return DateCheckUtil.checkAllDate(setDate, set_data);
    }



    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__| PART_BOX: private
    // --------------------------------------------------------------------------------------------

    /**
     * [checkTel 最基本電話檢核]
     * @param  {string} checkTel [最基本電話檢核]
     * @return {obj}	{status:blooean,msg:'error msg'}
     */
    checkTel(identity: string) {
        return UserCheckUtil.checkTel(identity);
    }


}

