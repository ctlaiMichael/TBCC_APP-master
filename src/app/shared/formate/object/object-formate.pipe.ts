/**
 * 基本Object常用pipe
 */
import { Pipe, PipeTransform } from '@angular/core';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { FieldUtil } from '@shared/util/formate/modify/field-util';


// --------------------------------------------------------------------------------------------
//       ___.        __               __
//   ____\_ |__     |__| ____   _____/  |_
//  /  _ \| __ \    |  |/ __ \_/ ___\   __\
// (  <_> ) \_\ \   |  \  ___/\  \___|  |
//  \____/|___  /\__|  |\___  >\___  >__|
//            \/\______|    \/     \/       PART_BOX: object
// --------------------------------------------------------------------------------------------

/**
 * obj clone
 * @param value 物件clone
 */
@Pipe({
    name: 'objClone'
})
export class ObjClonePipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: any): any {
        return ObjectUtil.clone(value);
    }

}


/**
 * Obj轉array
 * @param value HTML string
 * @param args 格式
 * *ngFor="let srotKey of (orderList | htArray);"
 * *ngFor="let srotKey of (orderList | htArray:'key');"
 * *ngFor="let srotKey of (orderList | htArray:['order1', 'order2']);"
 */
@Pipe({
    name: 'htArray'
})
export class ArrayFormatePipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: any, args: any): any {
        return ObjectUtil.toArray(value, args);
    }

}

/**
 * array排序
 * @param value HTML string
 * @param args 格式
 * *ngFor="let srotKey of (orderList | htSort:'key');"
 */
@Pipe({
    name: 'htSort'
})
export class SortFormatePipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: any, args: any): any {
        return ObjectUtil.sort(value, args);
    }
}


/**
 * 欄位檢核
 * @param value 檢查的資料
 * @param args 格式
 *      {{ data | fieldCheck: 'checkFieldName' }}
 *      {{ data | fieldCheck: ['checkFieldName', {zero_type: true, empty_str: '- -'} ] }}
 *      zero_type: true 允許0 (預設), false 不允許0
 *      empty_str: 空值回傳資料，預設空值
 */
@Pipe({
    name: 'fieldCheck'
})
export class FieldCheckFormatePipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: any, args: any): any {
        let field = '';
        let other_set: any;
        if (typeof args !== 'object') {
            field = args;
        } else if (args instanceof Array) {
            field = (typeof args[0] !== 'undefined') ? args[0] : '';
            if (typeof args[1] !== 'undefined' && typeof args[1] === 'object') {
                other_set = args[1];
            }
        }
        return FieldUtil.checkField(value, field, other_set);
    }
}
