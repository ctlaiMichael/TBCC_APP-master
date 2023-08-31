export class OverAmountOptions {
    zero_type?: boolean; // 是否允許顯示0，true 不允許顯示0(預設)/false 允許顯示0
    empty_str?: string; // 空值時顯示的文字，預設「- -」
    over_length?: number; // 超過多少字加上class
    over_class?: string; // 超過自數加上的class
    animate_flag?: boolean; // 是否顯示動畫效果 true 顯示，false 不顯示(預設)
    other_class?: Array<any>; // 加上的其他class
    currency?: string; // 幣別(預設TW)
    show_currency?: boolean; // 顯示幣別 (預設false)
    constructor() {
        this.zero_type = false;
        this.empty_str = '- -';
        this.animate_flag = false;
        this.over_length = 8;
        this.over_class = 'over_amount';
        this.currency = 'TWD';
        this.show_currency = false;
    }
}
