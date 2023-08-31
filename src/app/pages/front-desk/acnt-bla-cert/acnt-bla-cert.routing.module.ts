import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcntBlaCertPageComponent } from './acnt-bla-cert-page.component';
import { LoginRequired } from '@core/auth/login-required.service';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' }
   , { path: 'main', component: AcntBlaCertPageComponent , canActivate: [LoginRequired]}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcntBlaCertRoutingModule { }
