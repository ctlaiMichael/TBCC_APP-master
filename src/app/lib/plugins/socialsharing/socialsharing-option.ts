/**
 * 社群設定檔
 */
export class SocialsharingOption {
    subject: string; // 分享的標題(for Email)
    message: string; // 分享的訊息
    url: string; // 分享的連結
    files: Array<string>; // 分享檔案路徑: an array of filenames either locally or remotely
    // appPackageName: string; // Android only
    // chooserTitle: string; // Android only
}

/**
 * 文字設定檔
 */
export class SocialsharingImgTxtOption {
    content: string;
    font: string;
    x: number;
    y: number;
    width: number;
    height: number;

    constructor() {
        this.content = '';
        this.font = '30px Arial';
        this.x = 30;
        this.y = 100;
        this.width = 0;
        this.height = 50;
    }
}
