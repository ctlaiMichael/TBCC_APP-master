export class CacheData {
    value?: any;  // 資料
    ttl?: number;  // (Time to live)有效時間(分鐘)
    effectTime?: number; // Timestemp
    keepAlive?: string; // 是否保存 login(登入時有效)/always(總是保留)
    group?: string; // 群組類型
    groupList?: Array<any>; // 群組類型(多組)
    // location?: string; // 地區
    // lang?: string; // 語系

    constructor() {
        this.ttl = 5;
        this.groupList = [];
        this.group = '';
        this.keepAlive = 'login';
    }
}
