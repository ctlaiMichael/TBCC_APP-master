import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { PersonalQuotaComponent } from './inquiry/personal-quota-page.component';


const routes: Routes = [
  { path: '', redirectTo: 'personal-quota', pathMatch: 'full' },
  {
    path: 'personal-quota'
    , component: PersonalQuotaComponent
    // , data: {
    // }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalQuotaRoutingModule { }
