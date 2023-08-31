import { ResBody } from '@base/api/model/res-body';
import { ResHeader } from '@base/api/model/res-header';

export class FD000202Res {
    header: ResHeader;
    body: FD000202ResBody;
}

export class FD000202ResBody extends ResBody {
    trnsRsltCode: string;
    hostCode: string;
    hostCodeMsg: string;
    caStatus: string;
    caApplyDt: string;
    caEndDt: string;
    caPaymentAmount: string;
}
