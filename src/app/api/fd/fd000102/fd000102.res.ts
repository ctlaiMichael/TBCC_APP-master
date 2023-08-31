import { ResBody } from '@base/api/model/res-body';
import { ResHeader } from '@base/api/model/res-header';

export class FD000102Res {
    header: ResHeader;
    body: FD000102ResBody;
}

export class FD000102ResBody extends ResBody {
    custId: any;
    certCN: any;
    signCertData: any;
    encCertData: any;
}
