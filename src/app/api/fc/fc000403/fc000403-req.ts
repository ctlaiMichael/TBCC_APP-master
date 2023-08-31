/**
 * custId	身分證字號
 */
import { ReqBody } from '@base/api/model/req-body';

export class FC000403ReqBody extends ReqBody {
    custId = '';
    constructor() {
        super();
    }
}
