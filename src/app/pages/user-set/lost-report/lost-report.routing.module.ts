import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LostReportPageComponent } from './lost-report-page.component';
import { LoginRequired } from '@core/auth/login-required.service';

// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'lost-report', pathMatch: 'full' }
  , { path: 'lost-report', component: LostReportPageComponent , canActivate: [LoginRequired] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LostReportRoutingModule { }
