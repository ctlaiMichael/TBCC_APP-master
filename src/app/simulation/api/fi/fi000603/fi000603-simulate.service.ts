/**
 * [模擬]定期(不)定額異動資料查詢
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000603_res_01 } from './fi000603-res-01';

export class FI000603SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    let set_data: any;

    return fi000603_res_01;
  }

}
