import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { InsufficientBill } from './insufficient-bill-page.component';
import { InsufficientBillPaginator } from './insufficient-bill-paginator/insufficient-bill-paginator.component';


const routes: Routes = [
  { path: '', redirectTo: 'insufficient-bill', pathMatch: 'full' },
  {
    path: 'insufficient-bill'
    , component: InsufficientBill
    // , data: {
    // }
  },
  {
    path: 'insufficient-bill-paginator'
    , component: InsufficientBillPaginator
    // , data: {
    // }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsufficientBillRoutingModule { }
