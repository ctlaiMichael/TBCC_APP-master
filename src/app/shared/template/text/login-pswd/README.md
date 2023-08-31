# Template說明
## 目的
網銀密碼輸入框



## 基本module引用

    import { LoginPswdComponentModule } from '@shared/template/text/login-pswd/login-pswd-component.module'; // 網銀登入密碼

    @NgModule({
        imports: [
            LoginPswdComponentModule
        ]
    })..

## 頁面引用
#### HTML:

    <app-login-pswd [setData]="inpSetData" (backValueEmit)="onInputBack($event)"></app-login-pswd>

    inpSetData = {
        title: '欄位標題',
        placeholder: '欄位說明'
    }
