import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TwdTransferPageComponent } from './twd-transfer-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' }, 
  { path: 'twd-transfer', component: TwdTransferPageComponent }
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TwdTransferRoutingModule { }
