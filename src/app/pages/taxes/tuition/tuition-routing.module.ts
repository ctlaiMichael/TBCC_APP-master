import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TuitionPageComponent } from './tuition-page.component';
// ---------------- Pages Start ---------------- //

const routes: Routes = [
	{ path: '', redirectTo: 'menu', pathMatch: 'full' },
	{ path: 'menu', component: TuitionPageComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TuitionRoutingModule { }