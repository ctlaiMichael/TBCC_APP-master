import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { InquiryPageComponent } from './inquiry-page.component';
import { LoanInquiryMainComponent } from './mainPage/loan-inquiry-mainpage.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    //   {
    //     path: 'list', component: InquiryPageComponent, data: {

    //     }
    //     // , data: {
    //     // }
    //   }
    {
        path: 'list', component: LoanInquiryMainComponent, data: {

        }
        // , data: {
        // }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InquiryRoutingModule { }
