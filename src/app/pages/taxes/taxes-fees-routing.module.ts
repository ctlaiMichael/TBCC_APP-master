import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxesFeesPageComponent } from './taxes-fees-page.component';
import { LoginRequired } from '@core/auth/login-required.service';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
	{ path: '', redirectTo: 'menu', pathMatch: 'full' },
	{ path: 'menu', component: TaxesFeesPageComponent },
	// 各類稅類款
	{
		path: 'taxes', loadChildren: './all-taxes/taxes.module#TaxesModule'
		, data: {
			preload: true
		}, canActivate: [LoginRequired]
	},
	// 中華電信費
	{
		path: 'hinet-fee', loadChildren: './hinet-fee/hinet-fee.module#HinetFeeModule'
		, data: {
			preload: true
		}, canActivate: [LoginRequired]
	},
	// 台灣自來水費
	{
		path: 'water', loadChildren: './water/water.module#WaterModule'
		, data: {
			preload: true
		}, canActivate: [LoginRequired]
	},
	// 臺北自來水費
	{
		path: 'taipei-water', loadChildren: './taipei-water/taipei-water.module#TaipeiWaterModule'
		, data: {
			preload: true
		}, canActivate: [LoginRequired]
	},
	// 電費
	{
		path: 'electricity', loadChildren: './electricity/electricity.module#ElectricityModule'
		, data: {
			preload: true
		}, canActivate: [LoginRequired]
	},
	// 勞保.健保.國民年金費
	{
		path: 'labor-health-national', loadChildren: './labor-health-national/labor-health-national.module#LaborHealthNationalModule'
		, data: {
			preload: true
		}, canActivate: [LoginRequired]
	},
	// 學費
	{
		path: 'tuition', loadChildren: './tuition/tuition.module#TuitionModule'
		, data: {
			preload: true
		}, canActivate: [LoginRequired]
	},
	// 汽機車燃料使用費
	{
		path: 'fuel-fee', loadChildren: './all-taxes/taxes.module#TaxesModule'
		, data: {
			preload: true
		}, canActivate: [LoginRequired]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TaxesFeesRoutingModule { }

