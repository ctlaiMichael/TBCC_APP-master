import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { HaspayQueryPageComponent } from '@pages/hospital/haspay-query/haspay-query-page.component';
import { HaspayQueryListPageComponent } from './haspay-query-list/haspay-query-list.component';
import { HaspayQueryDetailPageComponent } from './haspay-query-detail/haspay-query-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' }
  ,{
    // == 已繳醫療費查詢 == //
    path: 'haspay-query', component: HaspayQueryPageComponent
    // ,canActivate: [LogoutRequired]
  }
  ,{
    // == 已繳醫療費表單 == //
    path: 'haspay-query-list', component: HaspayQueryListPageComponent
    // ,canActivate: [LogoutRequired]
  }
  ,{
    // == 已繳醫療費明細 == //
    path: 'haspay-query-detail', component: HaspayQueryDetailPageComponent
    // ,canActivate: [LogoutRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HaspayQueryRoutingModule { }