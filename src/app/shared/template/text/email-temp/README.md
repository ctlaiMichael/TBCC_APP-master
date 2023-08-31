# Template說明
## 目的
email輸入



## 基本module引用

    import { EmailTempComponentModule } from '@shared/template/text/email-temp/email-temp-component.module'; // 手機輸入

    @NgModule({
        imports: [
            EmailTempComponentModule
        ]
    })..

## 頁面引用
#### HTML:

    <app-email-temp [setData]="inpSetData" (backValueEmit)="onInputBack($event)"></app-email-temp>

    inpSetData = {
        title: '欄位標題',
        placeholder: '欄位說明'
    }
