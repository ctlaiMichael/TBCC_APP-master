export class PersonalInfo {
    deposit: string; // 總資產
    bill: string; // 信用卡（目前無)
    twd: string; // 台幣
    forex: string; // 外幣摺台
    fund: string; // 基金折台
    gold: string; // 黃金折台

    constructor() {
        this.deposit = '';
        this.bill = '';
        this.twd = '';
        this.forex = '';
        this.fund = '';
        this.gold = '';
    }
}
