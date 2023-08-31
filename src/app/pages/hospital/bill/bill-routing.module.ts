import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillMenuPageComponent } from '@pages/hospital/bill/bill-menu/bill-menu-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'bill', pathMatch: 'full' }
  , {
    // == 查詢(ex:輸入身分證) == //
    path: 'bill', component: BillMenuPageComponent
    // ,canActivate: [LogoutRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillRoutingModule { }