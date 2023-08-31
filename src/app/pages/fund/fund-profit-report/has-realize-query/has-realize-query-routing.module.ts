import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HasRealizeTagPageComponent } from './has-realize-tag/has-realize-tag-page.component';
import { HasRealizeTypePageComponent } from './has-realize-type/has-realize-type-page.component';
import { HasRealizeDetailPageComponent } from './has-realize-detail/has-realize-detail-page.component';
import { HasRealizeOverviewPageComponent } from './has-realize-overview/has-realize-overview-page.component';
import { HasRealizeDetailQueryPageComponent } from './has-realize-detail-query/has-realize-detail-query-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  {
    // == 已實現損益查詢(選擇年度type) == //
    path: 'has-realize-type', component: HasRealizeTypePageComponent
    // ,canActivate: [LogoutRequired]
  },
  {
    // == 已實現損益查詢(主控tag) == //
    path: 'has-realize-query', component: HasRealizeTagPageComponent
    // ,canActivate: [LogoutRequired]
  },
  {
    // == 已實現損益明細 == //
    path: 'has-realize-detail', component: HasRealizeDetailPageComponent
    // ,canActivate: [LogoutRequired]
  },
  {
    // == 已實現損益明細查詢 == //
    path: 'has-realize-detail-query', component: HasRealizeDetailQueryPageComponent
    // ,canActivate: [LogoutRequired]
  },  
  {
    // == 已實現損益總覽 == //
    path: 'has-realize-overview', component: HasRealizeOverviewPageComponent
    // ,canActivate: [LogoutRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HasRealizeQueryRoutingModule { }
