import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// ---------------- Pages Start ---------------- //
import { HospitalMenuPageComponent } from '@pages/hospital/hospital-menu/hospital-menu-page.component';
import { BranchMenuPageComponent } from '@pages/hospital/branch-menu/branch-menu-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' }
  , {
    // == 醫院清單 == //
    path: 'menu', component: HospitalMenuPageComponent
    // ,canActivate: [LogoutRequired]
  }
  , {
    // == 分院清單 == //
    path: 'branch-menu', component: BranchMenuPageComponent
    // ,canActivate: [LogoutRequired]
  }
  , {
    // == 繳費用 == //
    path: 'pay', loadChildren: './bill/bill.module#BillModule'
    // ,canActivate: [LogoutRequired]
  }
  , {
    // == 台大 == //
    path: 'ntuh', loadChildren: './ntuh/ntuh.module#NtuhModule'
    // ,canActivate: [LogoutRequired]
  }
  , {
    // == 繳費單繳費 == //
    path: 'debit-card', loadChildren: './debit-card/debit-card.module#DebitCardModule'
    // ,canActivate: [LogoutRequired]
  }
  , {
    // == 繳費單繳費 == //
    path: 'matm-back', loadChildren: './matm-back/matm-back.module#MatmBackModule'
    // ,canActivate: [LogoutRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HospitalRoutingModule { }


