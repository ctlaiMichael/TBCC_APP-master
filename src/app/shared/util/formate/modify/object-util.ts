/**
 * Util 物件轉換
 */
import { EmptyUtil } from '../string/empty-util';
import { DateUtil } from '../date/date-util';
export const ObjectUtil = {

    /**
     * 複製物件
     * @param value object
     * @param args
     *  ObjectUtil.clone({1: 123});
     *  ObjectUtil.clone([1,2,3]);
     *  ObjectUtil.clone(123);
     */
    clone(value: any): any {

        if (typeof value === 'object') {
            return JSON.parse(JSON.stringify(value));
        } else {
            return value;
        }
    },


    /**
     * object to array (transArrayFillter)
     * @param set_obj 物件
     * @param args 參數
     */
    toArray(set_obj: any, args?: any): any {
        let obj = this.clone(set_obj);
        let order_list: any = false;
        let order_key = '';
        let data = [];
        if (typeof args !== 'undefined' && args) {
            if (args === 'key') {
                obj = Object.keys(obj);
            } else if (args instanceof Array) {
                order_list = args;
                order_key = '_htSort';
                if (!(order_list instanceof Array)) {
                    order_list = false;
                    order_key = '';
                }
            } else if (typeof args === 'string') {
                order_key = args;
            }
        }
        if (typeof obj !== 'object') {
            return [obj];
        }
        if (obj instanceof Object) {
            data = Object.keys(obj).map(function (key) {
                let tmp_data = obj[key];
                if (order_list) {
                    tmp_data[order_key] = order_list.indexOf(key);
                }
                return obj[key];
            });
        } else if (obj instanceof Array) {
            data = obj;
        }
        if (order_list || order_key) {
            // == 指定排序 == //
            data = this.sort(data, order_key);
        }
        if (typeof data[0] != 'undefined' && typeof data[0]['SHOW_FLAG'] != 'undefined') {
            data[0]['SHOW_FLAG'] = true;
        }

        return data;
    },


    /**
     * 重新排序 (transArraySort)
     * @param value object
     * @param args
     * ObjectUtil.transArraySort(data, '_sort')
     * ObjectUtil.transArraySort(data, ['_sort', 'DESC'])
     * ObjectUtil.transArraySort(data, { sort: '_sort', reverse: 'DESC', special: 'date/amount' })
     * ObjectUtil.transArraySort(data, { sort: [
     *                          { sort: 'total', reverse: 'DESC', special: 'date' },
     *                          { sort: ['total', 'time'], reverse: 'DESC', special: 'date' },
     *                          { sort: '_sort', reverse: 'ASC', special: 'amount' }
     *                        ] , reverse: 'DESC' })
     */
    sort(data: Array<any>, arg: any): Array<any> {
        let sort_key: any = '';
        let reverse = 'ASC';
        let special = '';
        if (typeof arg === 'string') {
            sort_key = arg;
        } else if (arg instanceof Array && arg.length > 0) {
            sort_key = arg[0];
            if (typeof arg[1] !== 'undefined') {
                reverse = arg[1];
            }
        } else if (arg instanceof Object) {
            if (arg.hasOwnProperty('sort')) {
                sort_key = arg.sort;
            }
            if (arg.hasOwnProperty('reverse')) {
                reverse = arg.reverse;
            }
            if (arg.hasOwnProperty('special')) {
                special = arg.special;
            }
        } else {
            return data;
        }
        if (reverse.toString().toLocaleUpperCase() !== 'ASC') {
            reverse = 'DESC';
        } else {
            reverse = 'ASC';
        }
        let sort_list: any = sort_key;
        if (typeof sort_key === 'string') {
            sort_list = [
                { sort: sort_key, reverse: reverse, special: special }
            ];
        }
        // console.log('sort:', sort_list, sort_list instanceof Array, data);


        if (!(sort_list instanceof Array)) {
            return data;
        }

        // == 排序 == //
        const new_data = data.sort((a, b) => {
            let check = 0;
            sort_list.forEach((sort_check) => {
                if (check === 0) {
                    // console.log('check=0', sort_check);
                    let itme_sort = sort_check;
                    let item_reverse = reverse;
                    if (sort_check instanceof Object) {
                        itme_sort = (sort_check.hasOwnProperty('sort')) ? sort_check['sort'] : '';
                        if (sort_check.hasOwnProperty('reverse')) {
                            item_reverse = sort_check['reverse'];
                        }
                    }
                    let a_sort: any = '';
                    let b_sort: any = '';
                    let item_field_specail = false;
                    if (itme_sort instanceof Array) {
                        item_field_specail = true;
                        a_sort = 'AFTER';
                        b_sort = 'AFTER';
                    } else {
                        a_sort = (a.hasOwnProperty(itme_sort) && a[itme_sort] !== '' && a[itme_sort] !== '-1')
                            ? a[itme_sort] : 'AFTER';
                        b_sort = (b.hasOwnProperty(itme_sort) && b[itme_sort] !== '' && b[itme_sort] !== '-1')
                            ? b[itme_sort] : 'AFTER';
                    }
                    if (sort_check.hasOwnProperty('special') && sort_check.special !== '') {
                        // a_sort, b_sort
                        switch (sort_check.special) {
                            // == 時間比較 == //
                            case 'date':
                                // == 日期欄位處理 == //
                                if (item_field_specail) {
                                    let tmp_key: any;
                                    let tmp_a_data = [];
                                    let tmp_b_data = [];
                                    for (tmp_key in itme_sort) {
                                        if (!itme_sort.hasOwnProperty(tmp_key)) {
                                            continue;
                                        }
                                        if (a.hasOwnProperty(itme_sort[tmp_key]) && a[itme_sort[tmp_key]] !== '') {
                                            tmp_a_data.push(EmptyUtil.trim(a[itme_sort[tmp_key]]));
                                        }
                                        if (b.hasOwnProperty(itme_sort[tmp_key]) && b[itme_sort[tmp_key]] !== '') {
                                            tmp_b_data.push(EmptyUtil.trim(b[itme_sort[tmp_key]]));
                                        }
                                    }
                                    a_sort = (tmp_a_data.length > 0) ? tmp_a_data.join(' ') : '';
                                    b_sort = (tmp_b_data.length > 0) ? tmp_b_data.join(' ') : '';
                                    if (!a_sort || a_sort === '' || a_sort === '-1') {
                                        a_sort = 'AFTER';
                                    }
                                    if (!b_sort || b_sort === '' || b_sort === '-1') {
                                        b_sort = 'AFTER';
                                    }
                                } else {
                                    a_sort = EmptyUtil.trim(a_sort);
                                    b_sort = EmptyUtil.trim(b_sort);
                                }

                                // == 日期判斷處理 == //
                                if (a_sort !== 'AFTER') {
                                    let tmpDate = '';
                                    tmpDate = DateUtil.transDate(a_sort, 'timestamp');
                                    // console.log("tmpDate",tmpDate);
                                    if (a_sort !== tmpDate) {
                                        a_sort = tmpDate;
                                    } else {
                                        a_sort = 'AFTER';
                                    }
                                }
                                if (b_sort !== 'AFTER') {
                                    let tmpDate = '';
                                    tmpDate = DateUtil.transDate(b_sort, 'timestamp');
                                    if (b_sort !== tmpDate) {
                                        b_sort = tmpDate;
                                    } else {
                                        b_sort = 'AFTER';
                                    }
                                }

                                break;
                            // == 數字整理 == //
                            case 'amount':

                                let patt = /^(0|(\-|)([1-9]|[0-9]+\.[0-9]*|)[0-9][0-9]*)$/;
                                a_sort = EmptyUtil.trim(a_sort.toString());
                                b_sort = EmptyUtil.trim(b_sort.toString());
                                if (a_sort !== 'AFTER') {
                                    a_sort = a_sort.replace(/\,/g, '');

                                    if (patt.test(a_sort)) {
                                        // 判斷為金額格式
                                        a_sort = parseFloat(a_sort);
                                    } else {
                                        a_sort = 'AFTER';
                                    }

                                }

                                if (b_sort !== 'AFTER') {
                                    b_sort = b_sort.replace(/\,/g, '');

                                    if (patt.test(b_sort)) {

                                        b_sort = parseFloat(b_sort);

                                    } else {

                                        b_sort = 'AFTER';
                                    }

                                }
                                break;
                        }
                    }

                    // == check == //
                    if (a_sort === 'AFTER' || b_sort === 'AFTER') {
                        if (a_sort === 'AFTER' && b_sort !== 'AFTER') {
                            check = 1;
                        }
                        if (a_sort !== 'AFTER' && b_sort === 'AFTER') {
                            check = -1;
                        }
                    } else {
                        if (a_sort > b_sort) {
                            check = (item_reverse === 'DESC') ? -1 : 1;
                        } else if (a_sort < b_sort) {
                            check = (item_reverse === 'DESC') ? 1 : -1;
                        }
                    }
                    // console.log('chekc:', check, a_sort, b_sort);
                } // check is 0
            });
            return check;
        });


        return this.clone(new_data);
    }

};
