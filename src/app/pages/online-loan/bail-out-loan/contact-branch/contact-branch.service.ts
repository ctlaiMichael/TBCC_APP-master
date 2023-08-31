/**
 *線上申貸 往來分行(共用)
 */
import { Injectable } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { F9000410ApiService } from "@api/f9/f9000410/f9000410-api.service";

@Injectable()

export class ContactBranchService {

    constructor(
        private _logger: Logger,
        private f9000410: F9000410ApiService
    ) { }


    //無委託扣款帳號時，取的中文科目
    getAccountcd(setAcount) {
        let output = {
            status: false,
            msg: '',
            account: '', //帳號，去'-'
            data: '' //中文科目
        };
        //帳號間有'-'區隔
        if (setAcount.indexOf('-') != -1) {
            this._logger.log("into has -");
            let account = setAcount.replace(/-/g, '');
            output.account = account;
            let temp = this.formateAccountcd(account);
            output.data = temp.data;
            //帳號間無'-'區隔
        } else {
            this._logger.log("into has not -");
            output.account = setAcount;
            let temp = this.formateAccountcd(setAcount);
            output.data = temp.data;
        }
        output.status = true;
        output.msg = 'success';
        this._logger.log("return output:", output);
        return output;
    }
    //指定撥入帳號科目中文
    formateAccountcd(setData) {
        let output: any = {
            status: false,
            data: '',
            msg: 'failed'
        };
        let accountcd_MAP: any = [
            '行員活期儲蓄存款', //227
            '活期儲蓄存款', //699
            '活期存款', //717
            '活期儲蓄存款', //765
            '活期儲蓄存款', //766
            '綜合活期存款', //871
            '綜合活期儲蓄存款', //872
            '財富管理帳戶綜合活儲' //899
        ];
        this._logger.log('formateAccountcd, setData:', setData);
        let str = setData.substring(4, 7);
        switch (str) {
            case '227':
                this._logger.log('227');
                output.data = accountcd_MAP[0];
                break;
            case '699':
                this._logger.log('699');
                output.data = accountcd_MAP[1];
                break;
            case '717':
                this._logger.log('717');
                output.data = accountcd_MAP[2];
                break;
            case '765':
                this._logger.log('765');
                output.data = accountcd_MAP[3];
                break;
            case '766':
                this._logger.log('766');
                output.data = accountcd_MAP[4];
                break;
            case '871':
                this._logger.log('871');
                output.data = accountcd_MAP[5];
                break;
            case '872':
                this._logger.log('872');
                output.data = accountcd_MAP[6];
                break;
            case '899':
                this._logger.log('899');
                output.data = accountcd_MAP[7];
                break;
            default:
                output.data = '--';
        }
        output.status = true;
        output.msg = 'success';
        return output;
    }

    //預填單發送req
    public sendAPI410(setData):Promise<any> {
        return this.f9000410.sendData(setData).then(
            (success) => {
                this._logger.log("success:",success);
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.log("failed:",failed);
                return Promise.reject(failed);
            }
        );
    }
}
