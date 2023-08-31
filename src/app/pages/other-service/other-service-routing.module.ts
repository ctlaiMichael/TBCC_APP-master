import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { OtherMenuComponent } from './other-menu/other-menu.component';


const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  // 最新消息選單
  { path: 'menu', component: OtherMenuComponent
    , data: {}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherServiceRoutingModule { }
