/**
 * Epay - 主掃解析
 *
 * 依照 QRCodeTestCase 找到模擬對文對應的response
 * Step 1. 請將QR Code加到檔案qrcode-testcase內，並給予一個key名稱
 * Step 2. 請將模擬對文加入fq000104-res-real檔案，且key名稱對應qrcode-testcase的key名稱
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { QRCodeTestCase } from '@pages/epay/shared/service/qrcode-testcase';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { fq000104_real } from './fq000104-res-real';
import { fq000104_res_01} from './fq000104-res-01';
import { FieldUtil } from '@shared/util/formate/modify/field-util';

export class FQ000104SimulateService implements SimulationApi {
  public getResponse(reqObj) {
    let qrcode = FieldUtil.checkField(reqObj, 'QRCode');
    return this._modifyResponse(qrcode);
  }


  private _modifyResponse(Qrcode: string) {
    // QRCodeTestCase
    let output = ObjectUtil.clone(fq000104_res_01);
    if (!Qrcode || Qrcode == '') {
      return output;
    }
    let case_key = '';
    let tk: any;
    for (tk in QRCodeTestCase) {
      let tmp_qrcode = (!!QRCodeTestCase[tk]['qrcode']) ? QRCodeTestCase[tk]['qrcode'] : QRCodeTestCase[tk];
      if (tmp_qrcode === Qrcode) {
        case_key = tk;
        break;
      }
    }
    if (fq000104_real.hasOwnProperty(case_key) && !!fq000104_real[case_key]) {
      output = ObjectUtil.clone(fq000104_real[case_key]);
    }
    return output;
  }

}
