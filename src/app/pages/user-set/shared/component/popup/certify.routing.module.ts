import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertifyComponent } from './certify.component';


// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'certify', pathMatch: 'full' }

  , { path: 'certify', component: CertifyComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSetCertifyRoutingModule { }
