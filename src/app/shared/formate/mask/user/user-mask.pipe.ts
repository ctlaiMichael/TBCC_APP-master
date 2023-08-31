/**
 * 遮碼Pipe: 使用者個資
 */
import { Pipe, PipeTransform } from '@angular/core';
import { UserMaskUtil } from '@shared/util/formate/mask/user-mask-util';


/**
 * 身分證
 * @param value 日期
 * @param args 格式
 * {{'a123456789' | identityMask }} => A12***6789
 */
@Pipe({
    name: 'identityMask'
})
export class IdentityMaskPipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: string): string {
        return UserMaskUtil.identity(value);
    }

}


/**
 * mail
 * @param value 日期
 * @param applyType 是否直接回傳
 * {{'test123@test.com' | emailMask }} => test123@test.com
 */
@Pipe({
    name: 'emailMask'
})
export class EmailMaskPipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: string,applyType): string {
        if(applyType=='1'){
            return value;
        }
        return UserMaskUtil.email(value);
    }

}

/**
 * 電話
 * @param value 日期
 * @param args 格式
 * {{'+852-1211-1178' | telMask }} => 
 */
@Pipe({
    name: 'telMask'
})
export class TelMaskPipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: string): string {
        return UserMaskUtil.tel(value);
    }

}

/**
 * 手機
 * @param value 日期
 * @param args 格式
 * {{'0911111111' | phoneMask }} => 
 */
@Pipe({
    name: 'phoneMask'
})
export class PhoneMaskPipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: string): string {
        return UserMaskUtil.phone(value);
    }

}
/**
 * mail
 * {{'陳大寶' | acntNameMask }} => *大寶
 */
@Pipe({
    name: 'acntNameMask'
})
export class AcntNameMaskPipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: any): string {
        let output = '';
        if (typeof value === 'object' && !!value) {
            if (typeof value['acctName'] == 'string' && !!value['acctName']) {
                output = value['acctName'];
                output = UserMaskUtil.acntName(output);
            } else if (typeof value['accntName'] == 'string' && !!value['accntName']) {
                output = value['accntName'];
                output = UserMaskUtil.acntName(output);
            } else if (typeof value['acctNickName'] == 'string' && !!value['acctNickName']) {
                output = value['acctNickName'];
            } else if (typeof value['accntNickName'] == 'string' && !!value['accntNickName']) {
                output = value['accntNickName'];
            }
        } else {
            output = UserMaskUtil.acntName(value);
        }

        return output;
    }

}