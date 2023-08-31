# Template說明
## 目的
手機輸入



## 基本module引用

    import { PhoneTempComponentModule } from '@shared/template/text/phone-temp/phone-temp-component.module'; // 手機輸入

    @NgModule({
        imports: [
            PhoneTempComponentModule
        ]
    })..

## 頁面引用
#### HTML:

    <app-phone-temp [setData]="inpSetData" (backValueEmit)="onInputBack($event)"></app-phone-temp>

    inpSetData = {
        title: '欄位標題',
        placeholder: '欄位說明'
    }
