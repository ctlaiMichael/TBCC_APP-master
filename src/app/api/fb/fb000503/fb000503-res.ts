import { ResHeader } from '@base/api/model/res-header';

export class BannerDetail {
    BANNER_ID: string;
    BANNER_IMG: string;
    IMG_TYPE: string;
    BANNER_URL?: string;    // 由F1000103取回
}

export class BannerDetails {
    BannerDetail: BannerDetail[];
}

export class Fb000503ResBody {
    BannerDetails: BannerDetails;
}

export class Fb000503Res {
    header: ResHeader;
    body: Fb000503ResBody;
}
