import { ReqBody } from '@base/api/model/req-body';
export class FB000502ReqBody extends ReqBody {
    newsNo: string ;
    constructor() {
        super();
        this.newsNo = '';
    }
}
