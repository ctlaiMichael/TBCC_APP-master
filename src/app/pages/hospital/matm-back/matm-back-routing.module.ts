import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { NtuhMenuPageComponent } from '@pages/hospital/ntuh/ntuh-menu/ntuh-menu-page.component';
import { NtuhPayComponent } from '@pages/hospital/ntuh/ntuh-pay/ntuh-pay-page.component';
import { MatmBackPageComponent } from './matm-back-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'matm-back', pathMatch: 'full' }
  
  , {
    // == 繳費單繳費matm回傳 == //
    path: 'matm-back', component: MatmBackPageComponent
    // ,canActivate: [LogoutRequired]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatmBackRoutingModule { }