import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { RichReportPageComponent } from './rich-report-tag/rich-report-page.component';
import { RichOverviewPageComponent } from './rich-overview/rich-overview-page.component';
import { RichDetailPageComponent } from './rich-detail/rich-detail-page.component';
import { RichDetailQueryPageComponent } from './rich-detail-query/rich-detail-query-page.component';

const routes: Routes = [
  {
    // == 智富投資損益報告(主控tag) == //
    path: 'rich-report', component: RichReportPageComponent
    // ,canActivate: [LogoutRequired]
  }
 ,{
    // == 智富庫存總覽 == //
    path: 'rich-overview', component: RichOverviewPageComponent
    // ,canActivate: [LogoutRequired]
  }
  ,{
    // == 智富庫存明細 == //
    path: 'rich-detail', component: RichDetailPageComponent
    // ,canActivate: [LogoutRequired]
  }
  ,{
    // == 智富庫存明細查詢 == //
    path: 'rich-detail-query', component: RichDetailQueryPageComponent
    // ,canActivate: [LogoutRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RichProfitReportRoutingModule { }
