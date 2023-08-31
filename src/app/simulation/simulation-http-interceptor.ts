import { HttpEvent, HttpHandler, HttpRequest, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { SimulationService } from './simulation.service';

@Injectable()
export class SimulationHttpInterceptor implements HttpInterceptor {

  constructor(private simulation: SimulationService) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf(environment.SERVER_URL) === -1 || environment.ONLINE) { // 只過濾api路徑的連線
      // 連線模式
      return next.handle(req);
    } else {
      // 離線模式
      return this.simulation.getResponse(req);
    }
  }
}
