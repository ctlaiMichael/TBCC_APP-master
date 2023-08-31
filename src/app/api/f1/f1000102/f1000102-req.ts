import { ReqBody } from '@base/api/model/req-body';

export class F1000102ReqBody extends ReqBody {
    userId: string;
    password: string;

    constructor() {
        super();
    }
}

