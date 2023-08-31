# Template說明
## 目的
存款帳戶資訊功能



## 基本module引用

    import { DateRangeSearchComponentModule } from '@shared/template/text/date-range-search/date-range-search-component.module'; // 日期搜尋框


    @NgModule({
        imports: [
            DateRangeSearchComponentModule
        ]
    })..

## 頁面引用
#### HTML:
    <app-date-range-search [dateObj]="dateObj" ></app-date-range-search>

    dateObj 請取自 CheckService.getDateSet

