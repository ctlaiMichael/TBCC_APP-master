/**
 * 系統框架相關
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
const routes: Routes = [
  // 導覽頁
  {
    path: 'guide', loadChildren: './guide/guide.module#GuideModule'
    , data: {
      preload: false
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
