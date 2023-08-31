/**
 * 基本Number: Math pipe
 */
import { Pipe, PipeTransform } from '@angular/core';
import { MathUtil } from '@shared/util/formate/number/math-util';


/**
 * 加總
 * @param n1 原數值
 * @param n2 加總數值
 * @param isSum true 為+(預設), false 為-
 * {{'23111.01' | mathSum:'3'}} // 23114.01
 * {{'23111.01' | mathSum: [3]}} // 23114.01
 * {{'23111.01' | mathSum: [1, false]}} // 23110.01
 */
@Pipe({
    name: 'mathSum'
})
export class MathSumPipe implements PipeTransform {
    constructor(
    ) { }
    transform(n1: string | number, arg: any): any {
        let n2: string | number;
        let isSum: any;
        if (typeof arg === 'string' || typeof arg === 'number') {
            n2 = arg;
            isSum = true;
        } else if (arg instanceof Array) {
            n2 = (typeof arg[0] !== 'undefined') ? arg[0] : 0;
            isSum = (typeof arg[1] !== 'undefined') ? arg[1] : true;
        } else {
            return n1;
        }
        return MathUtil.sum(n1, n2, isSum);
    }
}


/**
 * 百分比
 * @param n1 分子
 * @param n2 分母
 * {{'23111.01' | mathSum:'3'}} // 23114.01
 * {{'23111.01' | mathSum: [3]}} // 23114.01
 * {{'23111.01' | mathSum: [1, false]}} // 23110.01
 */
@Pipe({
    name: 'mathPercent'
})
export class MathPercentPipe implements PipeTransform {
    constructor(
    ) { }
    transform(n1: string | number, n2: string | number): any {
        return MathUtil.toPercent(n1, n2);
    }
}
