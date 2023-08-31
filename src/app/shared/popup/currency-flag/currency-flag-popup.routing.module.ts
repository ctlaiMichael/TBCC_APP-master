import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrencyFlagPopupComponent } from './currency-flag-popup.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'currencyFlag', pathMatch: 'full' },
  { path: 'currencyFlag' , component: CurrencyFlagPopupComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForeignSavePageRoutingModule { }
