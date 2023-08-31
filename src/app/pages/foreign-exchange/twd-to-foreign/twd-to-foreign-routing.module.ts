import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { TwdToForeignEditComponent } from './edit/twd-to-foreign-edit.component';
import { TwdForeignMainComponent } from './twd-to-foreign-main/twd-foreign-mainpage.component';


const routes: Routes = [
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    {
        path: 'edit'
        , component: TwdToForeignEditComponent
        // , data: {
        // }
    },
  {
        path: 'main'
        , component: TwdForeignMainComponent
        // , data: {
        // }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TwdToForeignRoutingModule { }
