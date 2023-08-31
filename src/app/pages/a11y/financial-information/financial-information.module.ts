import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FinancialInformationRoutingModule } from "./financial-information-routing.module";
import { ForeignExchangeRateA11yPageComponent } from "./foreign-exchange-rate-a11y-page/foreign-exchange-rate-a11y-page.component";
import { TaiwanDepositsRateA11yPageComponent } from "./taiwan-deposits-rate-a11y-page/taiwan-deposits-rate-a11y-page.component";
import { ExchangeService } from "@pages/financial/shared/service/exchange.service";
import { TranslateModule } from "@ngx-translate/core";
import { ExchangeRoutingModule } from "@pages/financial/exchange/exchange.routing.module";
import { SharedModule } from "@shared/shared.module";
import { FlagFormateModule } from "@shared/formate/view/flag/flag-formate.module";
import { RateFormateModule } from "@shared/formate/number/rate/rate-formate.module";
import { FB000201ApiService } from "@api/fb/fb000201/fb000201-api.service";
import { ExchangePageComponent } from "@pages/financial/exchange/exchange-page.component";
import { TwdSaveService } from "@pages/financial/shared/service/twdSave.service";
import { TwdLoanService } from "@pages/financial/shared/service/twdLoan.service"; // 台幣放款利率
import { FB000101ApiService } from "@api/fb/fb000101/fb000101-api.service";
import { FB000102ApiService } from "@api/fb/fb000102/fb000102-api.service";
import { MenuTempModule } from "@shared/template/select/menu/menu-temp.module";
import { FormsModule } from "@angular/forms";
import { BookmarkModule } from "@shared/template/select/bookmarka11y/bookmark.module";
import { ForeignDepositsRateA11yPageComponent } from "./foreign-deposits-rate-a11y-page/foreign-deposits-rate-a11y-page.component";
import { ForeignLoanRateA11yPageComponent } from "./foreign-loan-rate-a11y-page/foreign-loan-rate-a11y-page.component";
import { TaiwanLoanRateA11yPageComponent } from "./taiwan-loan-rate-a11y-page/taiwan-loan-rate-a11y-page.component";
import { DataExchange } from "./shared/Dataexchange";
import { ForeignSaveService } from "@pages/financial/shared/service/foreignSave.service";
import { FB000103ApiService } from "@api/fb/fb000103/fb000103-api.service";
import { ForeignDepositsMoreRateA11yPageComponent } from './foreign-deposits-more-rate-a11y-page/foreign-deposits-more-rate-a11y-page.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    FinancialInformationRoutingModule,
    TranslateModule,
    MenuTempModule,
    FlagFormateModule,
    BookmarkModule
  ],
  providers: [
    ExchangeService,
    TwdSaveService,
    TwdLoanService,
    FB000101ApiService,
    FB000201ApiService,
    DataExchange,
    ForeignSaveService,
    FB000102ApiService,
    FB000103ApiService,
    FB000201ApiService
  ],
  declarations: [
    ForeignExchangeRateA11yPageComponent,
    TaiwanDepositsRateA11yPageComponent,
    ForeignDepositsRateA11yPageComponent,
    ForeignLoanRateA11yPageComponent,
    TaiwanLoanRateA11yPageComponent,
    ForeignDepositsMoreRateA11yPageComponent
  ]
})
export class FinancialInformationModule { }
