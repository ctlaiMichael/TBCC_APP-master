export class CacheCheckData {
    background?: boolean;  // 資料取得是否請求非同步
    reget?: boolean;  // 是否請求強制取得

    constructor() {
        this.background = false;
        this.reget = false;
    }
}
