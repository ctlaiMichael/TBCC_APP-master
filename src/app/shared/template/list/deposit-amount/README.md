# Template說明
## 目的
支出/存入 元素



## 基本module引用

    import { DepositAmountComponentModule } from '@shared/template/deposit/deposit-amount/deposit-amount-component.module'; // 支出存入


    @NgModule({
        imports: [
            DepositAmountComponentModule
        ]
    })..

## 頁面引用
### 台幣存款帳戶
#### HTML:
    <app-deposit-amount [data]="data"></app-deposit-amount>

data:
    {
        transDate: '20101208', // 交易日
        digest: '摘要text', // 摘要
        withdraw: '', // 支出
        deposit: '200', // 存入
        balance1: '300', // 結餘
        rcvBankId: '001', // 交易行庫代碼
        rcvBankName: 'bankname', // 交易行庫名稱
        checkNumber: '1010101', // 支票號碼
        remarks: 'remarks', // 備註
        transTime: '235959' // 交易時間
    }

### 外匯存款帳戶
請依照狀況進行調整

#### HTML:

    <app-deposit-amount [data]="data"></app-deposit-amount>

data:

### 黃金存摺帳戶
請依照狀況進行調整

#### HTML:
    <app-deposit-amount [data]="data"></app-deposit-amount>


acctObj:

