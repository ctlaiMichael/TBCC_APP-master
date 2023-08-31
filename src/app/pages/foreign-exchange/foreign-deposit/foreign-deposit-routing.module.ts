import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForeignDepositPageComponent } from './foreign-deposit-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list'
    , component: ForeignDepositPageComponent
    // , data: {
    // }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForeignDepositRoutingModule { }
