import { ResBody } from '@base/api/model/res-body';
import { ResHeader } from '@base/api/model/res-header';

export class FD000301Res {
    header: ResHeader;
    body: FD000301ResBody;
}

export class FD000301ResBody extends ResBody {
    custId: string;
    certCN: string;
}
