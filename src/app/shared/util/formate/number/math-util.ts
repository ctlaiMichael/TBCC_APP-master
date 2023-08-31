/**
 * Util Math
 * 數學處理
 */
import { ObjectUtil } from '../modify/object-util';
import { EmptyUtil } from '../string/empty-util';
import { NumberUtil } from '../number/number-util';
import { NumberCheckUtil } from '@shared/util/check/number-check-util';

export const MathUtil = {

    /**
     * 數值加總 (transSumNumber)
     * @param n1 原數值
     * @param n2 加總數值
     * @param isSum true 為+(預設), false 為-
     * MathUtil.sum('23111.01','3') // 23114.01
     * MathUtil.sum('23111.01', 3) // 23114.01
     * MathUtil.sum('23111.01', 1, false]) // 23110.01
     */
    sum(n1: string | number, n2?: string | number, isSum?: any): number {
        let data = 0;
        if (typeof isSum === 'undefined' || isSum) {
            isSum = true;
        } else {
            isSum = false;
        }

        // == 數值檢查 == //
        const check_n1 = NumberUtil.toNumber(n1);
        const check_n2 = NumberUtil.toNumber(n2);
        if (check_n1 === false || check_n2 === false) {
            return data;
        }
        n1 = check_n1;
        n2 = check_n2;
        // n1 = n1.toString().replace(/,/g, '');
        // n2 = n2.toString().replace(/,/g, '');
        // == 數值檢查 == //
        // const Reg = /^(0|(\-|)([1-9]|[0-9]+\.[0-9]*|)[0-9][0-9]*)$/;
        // if (!Reg.test(n1) || !Reg.test(n2)) {
        //     return n1;
        // }
        // if (!NumberCheckUtil.checkNumber(n1, 'number', true) || !NumberCheckUtil.checkNumber(n2, 'number', true)) {
        //     return n1;
        // }
        let max_decimail = 2;
        const decimail_n1 = n1.toString().split('.');
        const decimail_n2 = n2.toString().split('.');
        if (typeof decimail_n1[1] !== 'undefined' && decimail_n1[1].length > max_decimail) {
            max_decimail = decimail_n1[1].length;
        }
        if (typeof decimail_n2[1] !== 'undefined' && decimail_n2[1].length > max_decimail) {
            max_decimail = decimail_n2[1].length;
        }
        const decimail_point = Math.pow(10, max_decimail);
        if (isSum) {
            data = (Number(n1) * decimail_point) + (Number(n2) * decimail_point);
        } else {
            data = (Number(n1) * decimail_point) - (Number(n2) * decimail_point);
        }
        data = Number(data / decimail_point);
        return data;
    },

    /**
     * 百分比轉換
     * @param n1 分子
     * @param n2 分母
     * MathUtil.toPercent(100,200) // 50
     * MathUtil.toPercent(300,200) // 300
     */
    toPercent(n1: string|number, n2: string|number): number {
        let data = 0;

        // == 數值檢查 == //
        n1 = n1.toString().replace(/,/g, '');
        n2 = n2.toString().replace(/,/g, '');
        if (!NumberCheckUtil.checkNumber(n1, 'number', true) || !NumberCheckUtil.checkNumber(n2, 'number', true)) {
            return data;
        }
        n1 = parseFloat(n1);
        n2 = parseFloat(n2);
        if (n1 > n2) {
            return data;
        }
        data = (n1 / n2) * 100;
        data = Math.round(data * 100) / 100; // 無條件進位會導致數值膨脹
        return data;
    }


};
