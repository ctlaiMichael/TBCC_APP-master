
import { NgModule, ModuleWithProviders } from '@angular/core';
import { LoadingSpinnerService } from './loading-spinner.service';
import { LoadingSpinnerComponent } from '@shared/layout/loading-spinner/loading-spinner.component';
// export * from './loading-spinner.service';
// export * from '@shared/component/layout/loading-spinner/loading-spinner.component';
@NgModule({
  imports: [
  ],
  declarations: [LoadingSpinnerComponent],
  exports: [LoadingSpinnerComponent],
  providers: [LoadingSpinnerService]
})
export class LoadingSpinnerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LoadingSpinnerModule,
      providers: [LoadingSpinnerService]
    };
  }
}
