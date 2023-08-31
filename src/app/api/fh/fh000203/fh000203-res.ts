import { ResBody } from '@base/api/model/res-body';
import { ResHeader } from '@base/api/model/res-header';

export class FH000203Res {
    header: ResHeader;
    body: FH000203ResBody;
}

export class FH000203ResBody extends ResBody {
    trnsToken: string;
}
