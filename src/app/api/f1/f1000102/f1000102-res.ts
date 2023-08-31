import { ResBody } from '@base/api/model/res-body';
import { ResHeader } from '@base/api/model/res-header';

export class F1000102Res {
    header: ResHeader;
    body: F1000102ResBody;
}

export class F1000102ResBody extends ResBody {
    nbCert: string;
}
