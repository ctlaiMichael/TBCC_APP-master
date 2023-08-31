import { Injectable } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { FB000301ApiService } from "@api/fb/fb000301/fb000301-api.service";
import { FB000302ApiService } from "@api/fb/fb000302/fb000302-api.service";
import { FB000301ReqBody } from '@api/fb/fb000301/fb000301-req';
import { FB000302ReqBody } from '@api/fb/fb000302/fb000302-req';
import { environment } from '@environments/environment';
import { JsonConvertUtil } from "@shared/util/json-convert-util";
import { fb000301_res_01 } from "@api-simulation/api/fb/fb000301/fb000301-res-01";
import { fb000302_res_01 } from "@api-simulation/api/fb/fb000302/fb000302-res-01";
import { from } from "rxjs/observable/from";
@Injectable()
export class LocationService {
  constructor(
    private _logger: Logger,
    //private fh000301: FH000301ApiService
    private FB000301: FB000301ApiService,
    private FB000302: FB000302ApiService
  ) { }
  /**
   * 取得地區據點列表之電文
   * 
   */
  getLocationPointSearch(): Promise<any> {
    return new Promise((resolve, reject) => {
      // 地區據點查詢
      const form = new FB000302ReqBody();
      this.FB000302.send(form).then(
        (fb000302res) => {
          resolve(fb000302res.body);
        }).catch(
          (err) => {
            this._logger.error(err);
          });
    });
  }
  /**
     * 取得服務據點查詢之電文
     * 
     */
  getServicePointSearch(obj): Promise<any> {
    // return new Promise((resolve, reject) => {
    // 服務據點查詢
    // const form = new FB000301ReqBody();
    // form.nodeType = obj.nodeType;
    // form.area = obj.area;
    // form.searchText = obj.searchText;
    // form.lon = obj.lon;
    // form.lat = obj.lat;
    // form.searchScope = obj.searchScope;
    // form.paginator = obj.paginator;
    // this.FB000301.send(form).then(
    //   (fb000301res) => {
    //     resolve(fb000301res.body);
    //   }).catch(
    //     (err) => {
    //       console.error(err);
    //     });
    return this.FB000301.getData(obj).then(
      (output) => {
        return Promise.resolve(output);
      },
      (error_obj) => {
        return Promise.reject(error_obj);
      }
    );
  }
}
