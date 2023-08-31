/**
 * 外匯存款查詢-列表
 */
import { NgModule } from '@angular/core';
import { ForeignDepositRoutingModule } from './foreign-deposit-routing.module';
import { SharedModule } from '@shared/shared.module';

// ---------------- Module Start ---------------- //
import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module'; // 分頁
import { BookmarkModule } from '@shared/template/select/bookmark/bookmark.module'; // 頁籤
import { ExpandListModule } from '@shared/template/list/expand/expand-list.module'; // 展開列表
// ---------------- Module Start (Deposti) ---------------- //
import { DepositMaskModule } from '@shared/formate/mask/account/deposit-mask.module'; // 帳戶別相關處理
import { DepositInquiryServiceModule } from '@pages/deposit/shared/deposit-inquiry-service.module'; // 存款查詢
// ---------------- Pages Start ---------------- //
import { ForeignDepositPageComponent } from './foreign-deposit-page.component';
import { ForeignListComponent } from './list/foreign-list-page.component';

// ---------------- Pages Start ---------------- //
// 定存
import { ForexTimeDepositPageModule } from './forex-time-deposit/forex-time-deposit-page.module';
// 活存
import { ForexDemandDepositPageModule } from './forex-demand-deposit/forex-demand-deposit-page.module';


// ---------------- API Start ---------------- //
// ---------------- Service Start ---------------- //
// ---------------- Shared Start ---------------- //


@NgModule({
  imports: [
    SharedModule
    , ForeignDepositRoutingModule
    // == library == //
    , PaginatorCtrlModule // 分頁
    , ExpandListModule // 展開列表
    , DepositMaskModule // 帳戶別
    // == service == //
    , DepositInquiryServiceModule // 存款查詢
    // == page == //
    , ForexDemandDepositPageModule // 外幣交易明細(活)
    , ForexTimeDepositPageModule // 外幣交易明細(定)
  ],
  providers: [
    // ---------------- Service Start ---------------- //
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    ForeignDepositPageComponent
    , ForeignListComponent
  ],

  // hostListener設定
  entryComponents: [
    ForeignListComponent
  ]
})
export class ForeignDepositModule { }
