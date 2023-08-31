# Template說明
## 目的
存款帳戶資訊功能



## 基本module引用

    import { AccountContentComponentModule } from '@shared/template/deposit/account-content/account-content-component.module'; // 帳戶資訊


    @NgModule({
        imports: [
            AccountContentComponentModule
        ]
    })..

## 頁面引用
### 台幣存款帳戶
#### HTML:
    <app-account-content [acctObj]="acctObj" [acctGroup]="'TW'"></app-account-content>

acctObj:

    {
        "acctNo": "0800-899-300865", // 帳號
        "openBranchId": "0800", // 開戶分行代碼
        "openBranchName": "港乾分行", // 開戶分行名稱
        "acctType": "FD", // 帳戶代碼
        "acctTypeName": "定期存款", // 帳戶代碼名稱
        "balance": "10000", // 餘額
        "lastTrnsDate": "20101101", // 最後交易日/定存到期日
    }

### 外匯存款帳戶
請依照狀況進行調整

#### HTML:

    <app-account-content [acctObj]="acctObj" [acctGroup]="'FOREX'"></app-account-content>

acctObj:

### 黃金存摺帳戶
請依照狀況進行調整

#### HTML:
    <app-account-content [acctObj]="acctObj" [acctGroup]="'GOLD'"></app-account-content>


acctObj:

