import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransferPageComponent } from './transfer-page.component';
import { LoginRequired } from '@core/auth/login-required.service';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: 'menu', component: TransferPageComponent },
  {
    path: 'fixed-release', loadChildren: './fixed-release/fixed-release.module#FixedReleaseModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferRoutingModule { }
