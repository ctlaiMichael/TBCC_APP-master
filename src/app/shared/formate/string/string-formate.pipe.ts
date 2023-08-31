/**
 * 基本String常用pipe
 */
import { Pipe, PipeTransform } from '@angular/core';
import { EmptyUtil } from '@shared/util/formate/string/empty-util';
import { PadUtil } from '@shared/util/formate/string/pad-util';


/**
 * string trim pipe
 * @param value 字串
 * @param args 類別
 * {{' 　  Hellow Word! 　  ' | trimStr}} // "Hellow Word!"
 * {{' 　  Hellow Word! 　  ' | trimStr:'left'}} // "Hellow Word! 　  "
 * {{' 　  Hellow Word! 　  ' | trimStr:'right'}} // " 　  Hellow Word!"
 * {{' 　  Hellow Word! 　  ' | trimStr:'all'}} // "HellowWord!"
 * {{' 　  Hellow Wo  rd! 　  ' | trimStr:'spe'}} // "Hellow Word!"
 */
@Pipe({
    name: 'trimStr'
})
export class TrimStrPipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: string | number, type?: string): any {
        return EmptyUtil.done(value, type);
    }

}



/**
 * string trim pipe
 * @param value 字串
 * @param args 資訊 [長度, 取代字串, left|right] => 預設: [原字串長度, '0', 'left']
 * {{'abcde' | padStr: [10]}} // "00000abcde"
 * {{'abcde' | padStr: [10, 'ab']}} // "ababaabcde"
 * {{'abcde' | padStr: [10, '0', 'right']}} // "abcde00000"
 * {{'abcde' | padStr: [10, 'ab', 'right']}} // "abcdeababa"
 */
@Pipe({
    name: 'padStr'
})
export class PadStrPipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: string | number, arg: Array<any>): string {
        let output = value.toString();
        const len = (typeof arg[0] !== 'undefined') ? arg[0] : output.length;
        const append = (typeof arg[1] !== 'undefined') ? arg[1] : '0'; // 預設補0
        const type = (typeof arg[2] !== 'undefined') ? arg[2].toString().toLowerCase() : 'left'; // 預設補左

        output = PadUtil.pad(output, len, type, append);
        return output;
    }

}

/**
 * 假設傳進來的不是string則回傳空值
 */
@Pipe({
    name: 'ObjToEmpty'
})
export class ObjToEmptyPipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: any): string {
        if (typeof value !== 'string') {
            return '';
        }
        return value;
    }

}


/**
 * 假設傳進來的不是string則回傳空值
 */
@Pipe({
    name: 'subStr'
})
export class SubStrPipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: any, cut_num: number): string {
        if (typeof value !== 'string') {
            return '';
        }
        return value.substring(0, cut_num);
    }

}
