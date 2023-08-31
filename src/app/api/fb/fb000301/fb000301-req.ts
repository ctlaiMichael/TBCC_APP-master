import { ReqBody } from '@base/api/model/req-body';

export class FB000301ReqBody extends ReqBody {
    //custId: string;
    nodeType: string;
    area: string;
    searchText: string;
    lon: string;
    lat: string;
    searchScope: string;
    paginator: string[];
    constructor() {
        super();
        //this.custId = '';
        this.nodeType = '';
        this.area = '';
        this.searchText = '';
        this.lon = '24.56436';
        this.lat = '120.19505';
        this.searchScope = '150';
        //this.paginator = new this.paginator[];
        
    }
}
