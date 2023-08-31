import { ResBody } from '@base/api/model/res-body';
import { ResHeader } from '@base/api/model/res-header';

export class FG000501Res {
    header: ResHeader;
    body: FG000501ResBody;
}

export class FG000501ResBody extends ResBody {
    custId: string;
    result: string;
}
