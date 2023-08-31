import { fq000307_res_01, fq000307_res_02 } from './fq000307-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FQ000307SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    let countT = localStorage.getItem('times');

    if (!countT) {
      localStorage.setItem('times', '1');
    } else {
      countT = (parseInt(countT, 10) + 1).toString();
      localStorage.setItem('times', countT);
    }

    
    if (countT == '5') {
      return fq000307_res_01;
    } else {
      return fq000307_res_02;
    }

  }
}
