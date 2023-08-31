export class HeaderOptions {
    style: string;  // 背景樣式 normal/login/user_home normal:一般頁面 user_home:登入後顯示帳戶資訊
    showMainInfo: boolean; // 是否顯示帳戶資訊(only for user-home)
    leftBtnIcon: string; // 'menu'為選單, 'back'時為上一頁(可在component中覆寫動作), 其他則為className
    backPath: string; // 返回路徑預設為前頁
    title: string; // 'logo'時顯示"合庫金庫銀行"圖片，其他則為i18n KeyName
    rightBtnIcon: string; // nav_right_edit_button/nav_right_remind_button initPage
    rightSecBtn: string; // 第二個右側按鈕，跟著右側第一個按鈕出現/隱藏，當noshow時隱藏第二個右側按鈕(第一個仍存在)，規則尚未確定

    constructor() {
        this.style = 'normal';
        this.showMainInfo = false;
        this.leftBtnIcon = 'back';
        this.rightBtnIcon = '';
        this.title = 'logo';
        this.backPath = '';
        this.rightBtnIcon = '';
        this.rightSecBtn = '';
    }
}
