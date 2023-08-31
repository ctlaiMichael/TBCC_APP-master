import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NocardMenuComponent } from '../nocard-menu/nocard-menu-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'menu', component: NocardMenuComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NocardMenuRoutingModule {}
