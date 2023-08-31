import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// ---------------- Pages Start ---------------- //
import { QueryMainPageComponent } from './query-main/query-main-page.component';
import { QueryEditPageComponent } from './query-edit/query-edit-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'query-main', pathMatch: 'full' }
  , {
    // == 主控 == //
    path: 'query-main', component: QueryMainPageComponent
    // ,canActivate: [LogoutRequired]
  }
  , {
    // == 編輯頁 == //
    path: 'QueryEditPageComponent', component: QueryEditPageComponent
    // ,canActivate: [LogoutRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleQueryRoutingModule { }