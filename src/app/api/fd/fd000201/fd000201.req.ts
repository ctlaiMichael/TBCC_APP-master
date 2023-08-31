import { ReqBody } from '@base/api/model/req-body';

export class FD000201ReqBody extends ReqBody {
    custId = '';
    certCN = '';
    signCSR = '';
    signSig = '';
    signSN = '';
    encCSR = '';
    encSig = '';
    encSN = '';
    certAplyPswd = '';
    chgType = '';
}

