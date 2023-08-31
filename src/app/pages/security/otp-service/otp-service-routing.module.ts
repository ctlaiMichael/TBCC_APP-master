import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtpServicePageComponent } from '@pages/security/otp-service/otp-service-page.component';


const routes: Routes = [
  {
    // == 安控管理選單 == //
    path: '', redirectTo: 'otp-service', pathMatch: 'full'
  }
  // OTP服務
  , {
    path: 'otp-service',
    component: OtpServicePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtpServiceRoutingModule { }
