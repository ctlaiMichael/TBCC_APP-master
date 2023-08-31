import { fn000103_res_01 } from './fn000103-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FN000103SimulateService implements SimulationApi{
  getResponse(reqObj) {
    console.log('我在模擬電文囉Q_Q  reqObj:', reqObj);
    return fn000103_res_01;
  }

  constructor() { }

}
