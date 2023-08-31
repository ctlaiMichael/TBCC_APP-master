import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaterPageComponent } from './water-page.component';
// ---------------- Pages Start ---------------- //

const routes: Routes = [
	{ path: '', redirectTo: 'menu', pathMatch: 'full' },
	{ path: 'menu', component: WaterPageComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class WaterRoutingModule { }