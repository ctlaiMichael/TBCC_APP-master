import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NocardTransEditComponent } from './nocard-trans-edit/nocard-trans-edit-page.component';


const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' }, 
  { path: 'nocard-transaction-reservation', component: NocardTransEditComponent } 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NocardReservationRoutingModule { }
