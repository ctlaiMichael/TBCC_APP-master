import { ResBody } from '@base/api/model/res-body';
import { ResHeader } from '@base/api/model/res-header';

export class FD000101Res {
    header: ResHeader;
    body: FD000101ResBody;
}

export class FD000101ResBody extends ResBody {
    custId: any;
    details: any;
}
