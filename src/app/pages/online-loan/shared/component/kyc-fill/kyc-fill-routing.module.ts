import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// ---------------- Pages Start ---------------- //
import { KycFillPageComponent } from './kyc-fill-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'kyc-fill', pathMatch: 'full' }
  , {
    // == 進入頁 == //
    path: 'kyc-fill', component: KycFillPageComponent
    // ,canActivate: [LogoutRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KycFillPageRoutingModule { }