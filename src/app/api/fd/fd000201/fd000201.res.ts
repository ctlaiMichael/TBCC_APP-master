import { ResBody } from '@base/api/model/res-body';
import { ResHeader } from '@base/api/model/res-header';

export class FD000201Res {
    header: ResHeader;
    body: FD000201ResBody;
}

export class FD000201ResBody extends ResBody {
    custId: string;
    certCN: string;
    signCertData: string;
    encCertData: string;
}
