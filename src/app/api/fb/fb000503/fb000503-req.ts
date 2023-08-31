export class BannerDetail {
    BANNER_ID = '';
    constructor(bannerId: string) {
        this.BANNER_ID = bannerId;
    }
}

export class BannerDetails {
    detail: BannerDetail[] = [];

    public addBanner(bannerId: string) {
        const banner = new BannerDetail(bannerId);
        this.detail.push(banner);
    }
}

export class Fb000503Req {
    BannerDetails: BannerDetails;
}
