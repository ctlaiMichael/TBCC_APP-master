export class InputCertOptions {
    title?: string;     // 自定標題
    certUpdate?: boolean;   // 憑證更新作業

    constructor() {
        this.title = '憑證更新作業';
        this.certUpdate = true;
    }
}
