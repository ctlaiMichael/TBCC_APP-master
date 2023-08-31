import { Injectable } from '@angular/core';
import { FB000703ApiService } from '@api/fb/fb000703/fb000703-api.service';
import { FB000703ReqBody } from '@api/fb/fb000703/fb000703-req';
import { FB000704ApiService } from '@api/fb/fb000704/fb000704-api.service';
import { FB000704ReqBody } from '@api/fb/fb000704/fb000704-req';
import { logger } from '@shared/util/log-util';

@Injectable()
export class CheckActivationService {
  goldTxFlag: string;

  constructor(
    // private _logger: Logger,
    private fb000703: FB000703ApiService,
    private fb000704: FB000704ApiService,
  ) {

  }

  sendResult(reqObj, security): Promise<any> {
    if (typeof security.SecurityType == 'undefined') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    const form = new FB000704ReqBody();
    form.custId = reqObj.custId;
    form.goldTxFlag = reqObj.goldTxFlag;
    return new Promise((resolve, reject) => {
      this.fb000704.sendData(form, security).then(
        (S) => {
          logger.debug(S);
          this.goldTxFlag = S.body.goldTxFlag;
          resolve(S.body);
        },
        (F) => {
          logger.debug(F);
          reject(F);
        }
      ).catch(errObj => {
        reject(errObj);
      });
    });
  }

  getStatus(reqObj): Promise<any> {
    const form = new FB000703ReqBody();
    form.custId = reqObj.custId;
    return new Promise((resolve, reject) => {
      this.fb000703.send(form).then(
        (S) => {
          logger.debug(S);
          this.goldTxFlag = S.body.goldTxFlag;
          resolve(S.body);
        },
        (F) => {
          logger.debug(F);
          reject(F);
        }
      );
    });
  }
}
