import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignProtectMainPageComponent } from './sign-main/sign-protect-main-page.component';
import { SignProtectSearchPageComponent } from './search/sign-protect-search-page.component';

const routes: Routes = [
	{ path: '', redirectTo: 'sign-main', pathMatch: 'full' },
	{ path: 'sign-main', component: SignProtectMainPageComponent },
	{ path: 'sign-search', component: SignProtectSearchPageComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SignProtectionRoutingModule { }