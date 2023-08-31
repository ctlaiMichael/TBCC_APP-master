import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// ---------------- Pages Start ---------------- //
import { QrCodeSavePageComponent } from './qr-code-save.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' }

  , {
    // == 服務條碼儲存區 == //
    path: 'list', component: QrCodeSavePageComponent
    // ,canActivate: [LogoutRequired]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrCodeSaveRoutingModule { }


