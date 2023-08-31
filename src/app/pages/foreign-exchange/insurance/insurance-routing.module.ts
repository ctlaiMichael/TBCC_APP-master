import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { InsuranceEditPageComponent } from './edit/insurance-edit-page.component';


const routes: Routes = [
  { path: '', redirectTo: 'edit', pathMatch: 'full' },
  {
    path: 'edit'
    , component: InsuranceEditPageComponent
    // , data: {
    // }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceRoutingModule { }
