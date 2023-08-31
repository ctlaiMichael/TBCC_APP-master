import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForeignInsurancePayComponent } from './foreign-insurance-pay-edit/foreign-insurance-pay.component';
import { ForeignInsurancePayConfirmComponent } from './foreign-insurance-pay-confirm/foreign-insurance-pay-confirm';
import { ForeignInsurancePayResultComponent } from './foreign-insurance-pay-result/foreign-insurance-pay-result';
// ---------------- Pages Start ---------------- //

const routes: Routes = [
    {
        //外幣繳保費(編輯頁)
        path: 'foreign-insurance-pay', component: ForeignInsurancePayComponent
    },
    {
        //外幣繳保費(確認頁)
        path: 'foreign-insurance-pay-confirm', component: ForeignInsurancePayConfirmComponent
    },
    {
        //外幣繳保費(結果頁)
        path: 'foreign-insurance-pay-result', component: ForeignInsurancePayResultComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ForeignInsurancePayRoutingModule { }
