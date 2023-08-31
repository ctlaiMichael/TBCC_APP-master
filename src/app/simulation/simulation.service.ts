import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as Simulations from './api';
import { SimulationApi } from './simulation-api';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { logger } from '@shared/util/log-util';
@Injectable()
export class SimulationService {

  constructor() { }

  getResponse(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    logger.warn('getResponse');
    // 依照req決定呼叫對應simulation-api
    const simulation = this.getService(req);
    // const res = { status: 200, body: { 'hello': 'world' } };
    const reqData = JSON.parse(req.body);
    const mnbRequest = reqData['co:MNBRequest'];
    const res = simulation.getResponse(mnbRequest['co:body'], mnbRequest['co:reqHeader']);
    return of(new HttpResponse({ body: ObjectUtil.clone(res) })); // 模擬回傳
  }

  /**
   * 取得模擬電文Service
   * @param req 上行資料
   */
  getService(req: HttpRequest<any>): SimulationApi {
    // TODO 加入判斷req決定呼叫對應simulation-api
    const tempUrlArray = req.url.split('/');
    const tempClassName = tempUrlArray[tempUrlArray.length - 1].toUpperCase() + 'SimulateService';
    const className = tempClassName;
    logger.warn('getService', className);
    return new Simulations[className]();
  }

}
