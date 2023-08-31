import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoPredesignatedTransferPageComponent } from './no-predesignated-transfer-page/no-predesignated-transfer-page.component';
const routes: Routes = [
  { path: '', pathMatch: 'full',
    component: NoPredesignatedTransferPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoPredesignatedRoutingModule { }
