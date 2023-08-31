import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanSearchA11yPageComponent } from './loan-search-a11y-page/loan-search-a11y-page.component';
import { LoanResultA11yPageComponent } from './loan-result-a11y-page/loan-result-a11y-page.component';

const routes: Routes = [
  {
    path: 'a11yloansearchkey',
    component: LoanSearchA11yPageComponent
  },
  {
    path: 'a11yloanresultkey',
    component: LoanResultA11yPageComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanRoutingModule { }
