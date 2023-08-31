/**
 * 導覽頁
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuidePageComponent } from './guide-page/guide-page.component';
const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {
    path: 'main',
    component: GuidePageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuideRoutingModule { }
