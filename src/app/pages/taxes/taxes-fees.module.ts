/**
 * 繳交各項費用稅款
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
import { TaxesFeesRoutingModule } from './taxes-fees-routing.module';

// ---------------- Pages Start ---------------- //
import { TaxesFeesPageComponent } from './taxes-fees-page.component';
import { BarcodeService } from '@lib/plugins/barcode.service';

// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //


@NgModule({
	imports: [
		SharedModule,
		MenuTempModule,
		TaxesFeesRoutingModule	   // 繳交各類稅費款列表
	],
	providers: [
		BarcodeService
	],
	declarations: [
		TaxesFeesPageComponent    // 繳交各項費用稅款
	]
})
export class TaxesFeesModule { }
