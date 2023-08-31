# Template說明
## 目的
存款帳戶帳戶彙總資訊



## 基本module引用

    import { ContentSummaryComponentModule } from '@shared/template/deposit/content-summary/content-summary-component.module'; // 帳戶彙總資訊


    @NgModule({
        imports: [
            ContentSummaryComponentModule
        ]
    })..

## 頁面引用
### 台幣存款帳戶
#### HTML:
    <app-content-summary [acctObj]="acctObj" [acctGroup]="'TW'"></app-content-summary>

acctObj:

    {
        "acctNo": "0800-899-300865", // 帳號
        "acctType": "FD" // 帳戶代碼
    }

returnObj:


    {
        dataTime: '',
        data: {
            branch: '', // 帳務行(台幣存摺無此資料)
            branchName: '', // 帳務行名稱(台幣存摺無此資料)
            saveBookBalance: '', // 存款餘額(台幣存摺無此資料)
            realBalance: '', // 實質餘額
            usefulBalance: '', // 可用餘額
            todayCheckBalance: '', // 今交票金額
            tomCheckBalance: '', // 明交票金額
            icCard: '', // 消費圈存
            freezeBalance: '', // 凍結總額
            distrainBalance: '', // 扣押總額
            afterRunBalance: '', // 營業時間後提款及轉出
            afterRunPay: '', // 營業時間後存款及轉入
            _showFinance: true, // 顯示融資資料
            financeRate: '', // 融資利率
            financeAmount: '', // 融資額度
            financeStartDay: '', // 融資期間(起)
            financeEndDay: '', // 融資期間(訖)
            _showFD: false, // 顯示轉定存資料
            afterFDBalance: '', // 轉定存總存餘額
            toFDAmt: '', // 約定轉定存金額
        }
    }


### 外匯存款帳戶
請依照狀況進行調整

#### HTML:

    <app-content-summary [acctObj]="acctObj" [acctGroup]="'FOREX'"></app-content-summary>

acctObj:

    {
        "acctNo": "0800-899-300865", // 帳號
        "acctType": "FD" // 帳戶代碼
    }

### 黃金存摺帳戶

#### HTML:
    <app-content-summary [acctObj]="acctObj" [acctGroup]="'GOLD'"></app-content-summary>


acctObj:

    {
        "acctNo": "0800-899-300865"
    }


returnObj:

    {
        dataTime: '',
        data: {
            branch: '', // 帳務行
            branchName: '', // 帳務行名稱
            saveBookBalance: '', // 存款餘額
            realBalance: '', // 實質餘額
            usefulBalance: '', // 可用餘額
            todayCheckBalance: '', // 今交票金額
            tomCheckBalance: '', // 明交票金額
            icCard: '', // 消費圈存
            freezeBalance: '', // 凍結總額
            distrainBalance: '', // 扣押總額
            afterRunBalance: '', // 營業時間後提款及轉出
            afterRunPay: '', // 營業時間後存款及轉入
            _showFinance: true, // 顯示融資資料
            financeRate: '', // 融資利率
            financeAmount: '', // 融資額度
            financeStartDay: '', // 融資期間(起)
            financeEndDay: '', // 融資期間(訖)
            _showFD: false, // 顯示轉定存資料
            afterFDBalance: '', // 轉定存總存餘額
            toFDAmt: '', // 約定轉定存金額
            // 特殊欄位:
            realBalUS '', // GD實質餘額公克數—美元
            usefulBalUS '', // GD可用餘額公克數—美元
            saveBookBalUS '' // GD存摺餘額公克數—美元
        }
    }