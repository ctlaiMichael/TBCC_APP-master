import { Injectable } from '@angular/core';
import { FG000101ReqBody } from './fg000101-req';
import { FG000101ResBody } from './fg000101-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FG000101ApiService extends ApiBase<FG000101ReqBody, FG000101ResBody> {

  constructor(public telegram: TelegramService<FG000101ResBody>
    , public errorHandler: HandleErrorService
    , private authService: AuthService
    , private _logger: Logger) {
    super(telegram, errorHandler, 'FG000101');
  }

  // this.encryption();
  send(data: FG000101ReqBody): Promise<any> {
    /**
     * 網路連線密碼變更
     */
    const userData = this.authService.getUserInfo();
    if (!userData.hasOwnProperty("custId") || userData.custId == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    data.custId = userData.custId;
    data.connId=data.connId.toUpperCase();
    return this.doEncode(data).then(
      (endodeObj) => {
        if (!endodeObj.oldConnPswd || !endodeObj.newConnPswd) {
          return Promise.reject({
            title: '解密失敗',
            contnet: ''
          });
        }
        this._logger.step('USER-SET', 'USER-SET');

        return super.send(endodeObj).then(
          (resObj) => {
            this._logger.step('USER-SET', 'USER-SET-SEND');
            let output = {
              info_data: {},
              status: false,
              result: '1',
              msg: ''
            };

            let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
            if (telegram.hasOwnProperty('result') && telegram['result'] == '0') {
              output.status = true;
              output.result = '0';
              output.info_data = telegram;
              return Promise.resolve(output);
            } else {
              output.msg =resObj.msg;
              return Promise.reject(output);
            }
          },
          (errorObj) => {
            return Promise.reject(errorObj);
          }
        );
      },
      (encodeErrorObj) => {
        return Promise.reject({
          title: '解密失敗',
          contnet: ''
        });
      }
    );
  }


  private doEncode(data: FG000101ReqBody): Promise<any> {

    // return new Promise((resolve, reject) => {
    //   let p1 = '';
    //   let p2 = '';
    //   let doEnd = {
    //     p1: false,
    //     p2: false
    //   };
    //   const end_method = () => {
    //     if (!doEnd.p1 || !doEnd.p2) {
    //       return false;
    //     }
    //     if (p1!='' && p2 != '' ){
    //       // change data
    //       resolve(data);
    //     } else {
    //       reject({
    //         title: '',
    //         contnet: ''
    //       });
    //     }
    //   }

    //   this.authService.digitalEnvelop(data.oldConnPswd).then(
    //     (oldConnPswd1) => {
    //       doEnd.p1 = true;
    //       p1 = oldConnPswd1;
    //       end_method();
    //     },
    //     (errorObj) => {
    //       doEnd.p1 = true;
    //       end_method();
    //     }
    //   );
    //   this.authService.digitalEnvelop(data.newConnPswd).then(
    //     (newConnPswd2) => {
    //       doEnd.p2 = true;
    //       p2 = newConnPswd2;
    //       end_method();
    //     },
    //     (errorObj) => {
    //       doEnd.p2 = true;
    //       end_method();
    //     }
    //   );
    // }



    return this.authService.digitalEnvelop(data.oldConnPswd).then(
      (oldConnPswd1) => {

        this._logger.step('USER-SET', 'USER-SET-digitalEnvelop');
        return this.authService.digitalEnvelop(data.newConnPswd).then(
          (newConnPswd2) => {
            data.oldConnPswd = oldConnPswd1.value;
            data.newConnPswd = newConnPswd2.value;
            return Promise.resolve(data);
          },
          (errorObj1) => {
            return Promise.reject(errorObj1);
          }
        );
      },
      (errorObj2) => {
        return Promise.reject(errorObj2);
      }
    );



  }


}



/**
 * 加解密
 */
//   encryption() {

//     let data = new FG000101ReqBody();
//     let oldStatus = false;
//     let newStatus = false;
//     this.authService.digitalEnvelop(data.oldConnPswd).then(
//       (resObj) => {
//         oldStatus = true;
//         this.authService.digitalEnvelop(data.newConnPswd).then(
//           (resObj) => {
//             newStatus = true;
//             if (oldStatus && newStatus) {
//               return this.send(data).then(
//                 (resObj) => {
//                   let output = {
//                     info_data: {},
//                     status: false,
//                     result: '1',
//                     msg: ''
//                   };

//                   let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
//                   if (telegram.hasOwnProperty('result') && telegram['result'] == '0') {
//                     output.status = true;
//                     output.result = '0';
//                     output.info_data = telegram;
//                     return Promise.resolve(output);
//                   } else {
//                     output.msg = "處理失敗";
//                     return Promise.reject(output);
//                   }
//                 },
//                 (errorObj) => {
//                   return Promise.reject(errorObj);
//                 }
//               );
//             }
//             return Promise.resolve(resObj);
//           },
//           (errorObj) => {
//             return Promise.reject(errorObj);
//           }
//         )
//         return Promise.resolve(resObj);
//       },
//       (errorObj) => {
//         return Promise.reject(errorObj);
//       }
//     )
//   }
// }



