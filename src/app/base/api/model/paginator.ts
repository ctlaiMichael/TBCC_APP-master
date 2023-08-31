/**
 * 分頁設定檔
 */
import { PAGE_SETTING } from '@conf/page';

export class Paginator {
    // totalRowCount = 0;
    pageSize: string | number = 0;
    pageNumber: string | number = 0;
    sortColName = '';
    sortDirection = ''; // ASC, DSC
    constructor() {
        this.pageNumber = 1;
        this.pageSize = PAGE_SETTING.PAGE_SIZE;
        this.sortDirection = PAGE_SETTING.SORT;
    }
}
