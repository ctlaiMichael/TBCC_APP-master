/**
 * Date Select option
 */
export class DateSelectOptions {
    title?: string;     // 自定標題
    dateType?: string; // 類型: 1 多選月份, 2 單選週期
    dateArr?: Array<string>; // 當前選擇

    constructor() {
        this.title = '';
        this.dateType = '2';
        this.dateArr = [];
    }
}
