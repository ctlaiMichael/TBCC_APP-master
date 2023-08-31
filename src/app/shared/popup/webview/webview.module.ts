import { NgModule } from '@angular/core';
import { WebviewComponent } from './webview.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { WebviewService } from './webview.service';
import { TranslateModule } from '@ngx-translate/core';
import { IframeComponent } from '@shared/layout/iframe/iframe.component';

@NgModule({
  imports: [
    OverlayModule,
    TranslateModule
  ],
  declarations: [
    WebviewComponent,
    IframeComponent
  ],
  providers: [
    WebviewService
  ],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    WebviewComponent
  ]
})
export class WebviewModule { }
