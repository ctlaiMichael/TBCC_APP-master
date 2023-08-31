import { FormControl, FormGroup } from '@angular/forms';
import { ChineseCheckUtil } from '@shared/util/check/word/chinese-check-util';
import { StringCheckUtil } from '@shared/util/check/string-check-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';

export function ValidatorcustId(control: FormControl): any {
    const val = control.value;
    for (let i = 0; i < val.length; i++) {
        const check_str = val.charCodeAt(i);
        if (!((check_str >= 48 && check_str <= 57) ||
            (check_str >= 65 && check_str <= 90) ||
            (check_str >= 97 && check_str <= 122))) {
            return { custId: { info: 'ERROR_CUST_ID' } };
        }
    }
}

export function ValidatoruserId(control: FormControl): any {
    const val = control.value;
    for (let i = 0; i < val.length; i++) {
        const check_str = val.charCodeAt(i);
        if (!(check_str >= 21 && check_str <= 126)) {
            return { userId: { info: 'ERROR_USER_ID' } };
        }
    }
}

export function Validatorpwd(control: FormControl): any {
    const val = control.value;
    for (let i = 0; i < val.length; i++) {
        const check_str = val.charCodeAt(i);
        if (!(check_str >= 21 && check_str <= 126)) {
            return { pwd: { info: 'ERROR_PWD' } };
        }
    }
}

/**
 * 英數字檢核
 * @param control value
 */
export function ValidatorEngNum(control: FormControl): any {
    const val = control.value;
    const res = /^[A-Za-z0-9]+$/;
    if (!res.test(val)) {
        return { pwd: { info: 'ERROR_PWD' } };
    }
}

/**
 * 英數字符號檢核
 * @param control value
 */
export function ValidatorEngNumSymbol(control: FormControl): any {
    const val = control.value;

    let empty = ObjectCheckUtil.checkEmpty(val);
    //檢查空值
    if (empty.status == false) {
        return { pwd: { info: 'ERROR_PWD' } };
    };
    //檢查中文
    let chineseCheck = ChineseCheckUtil.notChinese(val);
    if (!chineseCheck.status) {
        return { pwd: { info: 'ERROR_PWD' } };
    };
    //表情符號
    let emojCheck = StringCheckUtil.emojiCheck(val);
    if (!emojCheck.status) {
        return { pwd: { info: 'ERROR_PWD' } };
    };
}

export function validatorSame(control: FormControl) {
    const val = control.value;
    
    if (val.length > 2){
        const firstOne = val[0];
        const regexp = new RegExp('^[' + firstOne +']+$');
          
        if (regexp.test(val)){
            return { 'vaildSame': true } };
    }
    return null;
}

export function vaildContinuous(control: FormControl) {
    const val = control.value;
    let countIsSame = 0;
    if (val.length > 2) {
        for (let i = 0; i < val.length; i++) {
            if (i + 1 < val.length) {
              let one = val.charCodeAt(i);
              let two = val.charCodeAt(i + 1);
              if (two == one + 1) {
                countIsSame++;
              }
            }
          }
        if (countIsSame == val.length - 1)
            return { 'vaildContinuous': true }
    }
    return null; 
}