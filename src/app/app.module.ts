import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from '@core/core.module';
import { LoadingSpinnerModule } from '@core/layout/loading/loading.module';
import { ScanModule } from '@pages/scan/scan.module';
import { microInteractionModule } from '@shared/popup/micro-interaction/micro-interaction.module';
import { HeaderComponent } from '@shared/layout/header/header.component';
import { LeftMenuComponent } from '@shared/layout/left-menu/left-menu.component';
// import { TopBoxComponent } from '@shared/layout/top-box/top-box.component';
import { TopBoxModule } from '@shared/layout/top-box/top-box.module';
import { I18nPath } from '@conf/i18n-path';
import { NavSliderFrameComponent } from '@shared/layout/header/nav-slider-frame.component';
// import { UserHomePageComponent } from '@pages/home/user-home-page/user-home-page.component';
import { OverAmountStyleModule } from '@shared/layout/over-amount-style/over-amount-style.module'; // 長度樣式處理
import { AutoFocusDirective } from '@shared/directive/autofocus.directive';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, I18nPath);
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavSliderFrameComponent,
    LeftMenuComponent,
    AutoFocusDirective
    // TopBoxComponent
    // UserHomePageComponent
  ],
  imports: [
    BrowserModule,
    LoadingSpinnerModule,
    ScanModule,
    microInteractionModule,
    CoreModule,
    AppRoutingModule,
    TopBoxModule,
    OverAmountStyleModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
