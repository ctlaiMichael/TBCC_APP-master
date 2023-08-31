/**
 * [模擬處理] paginator
 */
import { PAGE_SETTING } from '@conf/page';
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { PaginatedInfo } from '@base/api/model/paginated-info';

const totalPage = 5; // 模擬測試數量
export const PaginatorSimlationUtil = {
    /**
     * 模擬分頁處理
     * @param req 
     */
    getPaginatedInfo(req: object) {
        let pageSize, pageNumber, sortColName, sortDirection;
        if (req.hasOwnProperty('paginator')) {
            pageSize = FieldUtil.checkField(req['paginator'], 'pageSize');
            pageNumber = FieldUtil.checkField(req['paginator'], 'pageNumber');
            sortColName = FieldUtil.checkField(req['paginator'], 'sortColName');
            sortDirection = FieldUtil.checkField(req['paginator'], 'sortDirection');
        }
        if (!pageSize || pageSize == '') {
            pageSize = PAGE_SETTING.PAGE_SIZE;
        }
        if (!pageNumber || pageNumber == '') {
            pageNumber = 1;
        }
        if (!sortColName) {
            sortColName = '';
        }
        if (!sortDirection || sortDirection == '') {
            sortDirection = PAGE_SETTING.SORT;
        }


        let totalRowCount = totalPage * pageSize;

        if (totalPage < pageNumber) {
            // 超過比數
            return false;
        }
        return {
            totalRowCount: totalRowCount,
            pageSize: pageSize,
            pageNumber: pageNumber,
            sortColName: sortColName,
            sortDirection: sortDirection
        };
    },

    getResponse(data, paginatedInfo, field_list?: string) {
        if (!data.hasOwnProperty('MNBResponse')
            || !data['MNBResponse'].hasOwnProperty('result')
        ) {
            return ObjectUtil.clone(data);
        }
        let output = ObjectUtil.clone(data);
        // 2010-12-22T13:38:07.046+08:00
        output['MNBResponse']['resHeader']['responseTime'] = new Date().toISOString();
        output['MNBResponse']['result'] = this.modifyDetails(output['MNBResponse']['result'], paginatedInfo, field_list);
        output['MNBResponse']['result']['paginatedInfo'] = paginatedInfo;
        return output;
    },

    modifyDetails(data, paginatedInfo, field_list?: string) {
        let search_data = ObjectUtil.clone(data);
        let output: any = [];
        if (typeof field_list === 'undefined') {
            return search_data;
        }
        const field_key = field_list.split('.');
        if (field_key.length <= 0) {
            return search_data;
        }
        let tmp_data: any = ObjectUtil.clone(search_data);
        field_key.forEach(tmp_field => {
            if (!tmp_data.hasOwnProperty(tmp_field)) {
                return false;
            }
            tmp_data = tmp_data[tmp_field];
        });
        if (!(tmp_data instanceof Array) || tmp_data.length < 1) {
            return search_data;
        }
        const data_length = tmp_data.length;
        if (paginatedInfo.pageSize > data_length) {
            // 增長度
            let item_data = ObjectUtil.clone(tmp_data[0]);
            let diff_length = paginatedInfo.pageSize - data_length;
            tmp_data = tmp_data.concat(new Array(diff_length).fill(item_data));
        } else if (paginatedInfo.pageSize < data_length) {
            // 減長度
            tmp_data = tmp_data.slice(0, paginatedInfo.pageSize);
        }
        let i = 0;
        let tmp_data2 = search_data;
        let key_length = field_key.length;
        field_key.forEach(tmp_field => {
            i++;
            if (tmp_data2.hasOwnProperty(tmp_field)) {
                if (i === key_length) {
                    tmp_data2[tmp_field] = tmp_data;
                } else {
                    tmp_data2 = tmp_data2[tmp_field];
                }

            }
        });
        return search_data;
    }
};
