import { NgModule } from '@angular/core';
import { FundRoutingModule } from '@pages/fund/fund-routing.module';
import { SharedModule } from '@shared/shared.module';

// ---------------- Model Start ---------------- //
import { OneProvisionComponentModule } from '@shared/template/provision/one-provision/one-provision-component.module'; // 條款公版
import { FundFormateModule } from '@pages/fund/shared/pipe/fund-formate.module'; // 基金formate
// ---------------- Pages Start ---------------- //
import { FundMenuComponent } from '@pages/fund/fund-menu/fund-menu-page.component';
import { FI000605ApiService } from '@api/fi/fI000605/fi00605-api.service'; // 停損停利通知
import { FI000401ApiService } from '@api/fi/fI000401/fI000401-api.service'; // 基金帳號&換約
import { FI000712ApiService } from '@api/fi/fI000712/fi000712-api.service'; // 基金換約
import { FI000705ApiService } from '@api/fi/fi000705/fI000705-api.service'; // 停損獲利點設定查詢
// ---------------- API Start ---------------- //



// ---------------- Service Start ---------------- //
import { FundRequired } from '@pages/fund/shared/policy/fund-required.service';


@NgModule({
  imports: [
    SharedModule
    , FundRoutingModule
    , OneProvisionComponentModule // 同意條款
    , FundFormateModule
  ],
  exports: [
    FundFormateModule
  ],
  providers: [
    FundRequired, // 基金安控
    // ---------------- Service Start ---------------- //
    FI000401ApiService, // 基金帳號&換約
    FI000605ApiService, // 停損停利通知
    FI000705ApiService, // 停損獲利點設定查詢
    FI000712ApiService  // 基金換約
  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    FundMenuComponent
  ]
})
export class FundModule { }
