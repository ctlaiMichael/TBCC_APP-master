import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NetPswdChgPageComponent } from './netpswd-change-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'netPwdChg', pathMatch: 'full' }
  , { path: 'netPwdChg', component: NetPswdChgPageComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetPswdChgRoutingModule { }
