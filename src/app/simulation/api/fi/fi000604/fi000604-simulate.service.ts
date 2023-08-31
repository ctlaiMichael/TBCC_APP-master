/**
 * [模擬]定期(不)定額異動資料查詢
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000604_res_01 } from './fi000604-res-01';


export class FI000604SimulateService implements SimulationApi {

  public getResponse(reqObj) {

      return fi000604_res_01;
  }

}
