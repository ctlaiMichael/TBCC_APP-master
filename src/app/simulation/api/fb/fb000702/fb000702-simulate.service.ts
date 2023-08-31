
import { fb000702_res_01 } from './fb000702-res-01';
import { fb000702_res_02 } from './fb000702-res-01';
import { fb000702_res_03 } from './fb000702-res-01';
import { fb000702_res_04 } from './fb000702-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FB000702SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    if (reqObj.hasOwnProperty('queryType')) {
      if (reqObj['queryType'] == "1D") {
        return fb000702_res_01;
      } else if (reqObj['queryType'] == "3M") {
        return fb000702_res_02;
      } else if (reqObj['queryType'] == "6M") {
        return fb000702_res_03;
      } else {
        let lastarr = [];
        let time = fb000702_res_01.MNBResponse.result.details.detail;
        time.forEach(element => {
          if (element.trandDate >= reqObj.searchDateStart && element.trandDate <= reqObj.searchDateEnd) {
            lastarr.push(element);
          }
        });
        fb000702_res_01.MNBResponse.result.details.detail = lastarr;

      }
      return fb000702_res_04;
    }





  }

}
