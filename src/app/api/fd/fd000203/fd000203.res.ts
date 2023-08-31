import { ResBody } from '@base/api/model/res-body';
import { ResHeader } from '@base/api/model/res-header';

export class FD000203Res {
    header: ResHeader;
    body: FD000203ResBody;
}

export class FD000203ResBody extends ResBody {
    trnsRsltCode: string;
    hostCode: string;
    hostCodeMsg: string;
    debitAcnt: string;
    caApplyDt: string;
    caEndDt: string;
    caPaymentAmount: string;
    balanceAmount: string;

}
