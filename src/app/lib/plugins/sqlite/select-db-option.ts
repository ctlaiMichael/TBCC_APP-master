/**
 * Sqlite DB 設定介面
 */
export class SelectDbOption {
    name: string; // table name
    fields: string | Array<any>; // 欄位
    order: string | Array<any>; // 排序
    constructor() {
        this.name = '';
        this.fields = '';
        this.order = '';
    }
}


