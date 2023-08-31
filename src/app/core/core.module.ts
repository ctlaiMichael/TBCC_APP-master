import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Logger } from '@core/system/logger/logger.service';
import { SelectivePreloadingStrategy } from './navgator/selective-preloading-strategy'; // pre load lazy loading
import { NavgatorService } from './navgator/navgator.service';
import { BarcodeService } from '@lib/plugins/barcode.service';
import { QrcodeService } from '@lib/plugins/qrcode.service';
import { TelegramService } from './telegram/telegram.service';
import { HandshakeTelegramService } from './telegram/handshake-telegram.service';
import { RequestLogHttpInterceptorModule } from './interceptor/request-log-interceptor/request-log-interceptor.module';
import { CertCheckInterceptorModule } from './interceptor/cert-check-interceptor/cert-check-interceptor.module';
import { SimulationHttpInterceptorModule } from '@api-simulation/simulation.module';
import { SystemParameterService } from './system/system-parameter/system-parameter.service';
import { EnviromentService } from './system/enviroment/enviroment.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { SessionStorageService } from '@lib/storage/session-storage.service';
import { XML2JSService } from '@lib/xml2js/xml2js.service';
import { AuthModule } from './auth/auth.module';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { InitModule } from '@core/system/init/init.module';
import { HandleErrorService } from './handle-error/handle-error.service';
// UI-Content
import { UiContentModule } from '@shared/layout/ui-content/ui-content.module';
// import { HeaderComponent } from '@shared/layout/header/header.component';
import { AppLinkModule } from '@shared/layout/app-link/app-link.module';

import { SplashScreenService } from '@lib/plugins/splash-screen.service';
import { DeviceService } from '@lib/plugins/device.service';
import { CryptoService } from '@lib/plugins/crypto.service';
import { LeftMenuModule } from './layout/left-menu/left-menu.module';
import { HeaderCtrlService } from './layout/header/header-ctrl.service';
import { HandshakeService } from './telegram/handshake.service';
import { RegisterApiService } from '@api/handshake/register/register-api.service';
import { HandshakeApiService } from '@api/handshake/handshake/handshake-api.service';
import { ExchangekeyApiService } from '@api/handshake/exchangekey/exchangekey-api.service';
import { CommonApiService } from '@api/handshake/common/common-api.service';
import { AlertModule } from '@shared/popup/alert/alert.module';
import { ConfirmModule } from '@shared/popup/confirm/confirm.module';
import { ConfirmCheckBoxModule } from '@shared/popup/confirm-checkbox/confirm-checkbox.module';
import { ConfirmDualContentModule } from '@shared/popup/confirm-dual-content/confirm-dual-content.module';
import { StartAppService } from '@lib/plugins/start-app/start-app.service';
import { InAppBrowserService } from '@lib/plugins/in-app-browser/in-app-browser.service';
import { NetworkInfoService } from '@lib/plugins/network-info.service';
import { TcbbService } from '@lib/plugins/tcbb/tcbb.service';
// import { LeftMenuComponent } from '@shared/layout/left-menu/left-menu.component';

// formate service
import { FormateService } from '@shared/formate/formate.service';
// check Service
import { CheckService } from '@shared/check/check.service';
import { A11yService } from '@lib/plugins/a11y.service';
import { ExitAppService } from '@lib/plugins/exit-app.service';
import { A11yAlertModule } from '@shared/popup/a11y/alert/alert.module';
import { A11yConfirmModule } from '@shared/popup/a11y/confirm/confirm.module';
import { CurrentPositionService } from '@lib/plugins/currentposition.service';
import { CacheService } from './system/cache/cache.service';
import { InfomationModule } from '@shared/popup/infomation/infomation.module';  //資訊條款pop
import { DateService } from './date/date.service';
import { MicroInteractionService } from './layout/micro-interaction.service';
import { PushService } from '@lib/plugins/push.service';
import { MenuPopupModule } from '@shared/popup/menu-popup/menu-popup.module'; // 選單popup (目前使用於測試用)
import { ScreenshotPreventionService } from '@lib/plugins/screenshotprevention.service';
import { SlideCtrlService } from './slide/slide-ctrl.service';
import { ShortcutService } from '@lib/plugins/shortcut.service';
import { Shortcut3dtouchService } from '@lib/plugins/shortcut3dtouch.service';
import { TrustcertsService } from '@lib/plugins/trustcerts.service';

// const COMPONENTS = [
//   HeaderComponent,
//   LeftMenuComponent
// ];

const DIRECTIVES = [
  UiContentModule,
  AppLinkModule
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RequestLogHttpInterceptorModule, // 電文記錄
    CertCheckInterceptorModule,
    SimulationHttpInterceptorModule,
    LeftMenuModule,
    AuthModule,
    InitModule,
    AlertModule,
    ConfirmModule,
    ConfirmCheckBoxModule,
    ConfirmDualContentModule,
    A11yAlertModule,
    A11yConfirmModule,
    InfomationModule,
    MenuPopupModule,
    ...DIRECTIVES
  ],
  providers: [
    Logger,
    StartAppService,
    SelectivePreloadingStrategy,
    NavgatorService,
    BarcodeService,
    QrcodeService,
    TelegramService,
    CacheService,
    HandshakeTelegramService,
    SystemParameterService,
    EnviromentService,
    UiContentService,
    SplashScreenService,
    DeviceService,
    CurrentPositionService,
    CryptoService,
    LocalStorageService,
    SessionStorageService,
    XML2JSService,
    HandshakeService,
    RegisterApiService,
    HandshakeApiService,
    ExchangekeyApiService,
    CommonApiService,
    HeaderCtrlService,
    InAppBrowserService,
    HandleErrorService,
    FormateService, // formate Service
    A11yService,
    NetworkInfoService, // 網路狀態
    ExitAppService, // 結束APP
    CheckService,
    TcbbService,
    MicroInteractionService, // 微交互
    DateService,
    ScreenshotPreventionService,  // 禁止截圖
    PushService,  // 推播
    SlideCtrlService, // 滑動
    ShortcutService,
    Shortcut3dtouchService,
    TrustcertsService
  ],
  declarations: [
    // ...COMPONENTS,
  ],
  // For AppComponent
  exports: [
    // ...COMPONENTS,
    ...DIRECTIVES
  ]
})
export class CoreModule { }
