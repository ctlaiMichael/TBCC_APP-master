import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SimulationHttpInterceptor } from './simulation-http-interceptor';
import { SimulationService } from './simulation.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    SimulationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SimulationHttpInterceptor,
      multi: true
    }
  ]
})
export class SimulationHttpInterceptorModule { }
