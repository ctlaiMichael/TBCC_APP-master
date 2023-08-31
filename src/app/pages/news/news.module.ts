import { NgModule } from '@angular/core';
import { NewsRoutingModule } from './news-routing.module';
import { SharedModule } from '@shared/shared.module';
import { MenuTempModule } from '@shared/template/select/menu/menu-temp.module';
// ---------------- Pages Start ---------------- //
import { NewsMenuComponent } from '@pages/news/news-menu/news-menu.component';



// ---------------- API Start ---------------- //


// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    NewsRoutingModule,
    MenuTempModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //

  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    NewsMenuComponent
  ]
})
export class NewsModule { }
