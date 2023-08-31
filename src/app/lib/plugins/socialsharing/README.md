# 社群分享
## plugin
`cordova-plugin-x-socialsharing`

[version] `5.4.1`

[url] `https://www.npmjs.com/package/cordova-plugin-x-socialsharing`

### 功能說明
提供社群分享

---

## 引用

    import { SocialsharingPluginService } from '@lib/plugins/socialsharing-plugin.service';

    constructor(
        private socialShare: SocialsharingPluginService
    ) {
    }

---


## shareMsg 分享純文字
### 呼叫方法

    this.socialShare.shareMsg({
        subject: '分享的標題(email)',
        message: '分享的訊息',
        url: '分享的連結'
    }).then(
        () => {
            // success
        },
        () => {
            // error
        }
    );


## shareMsg 分享圖片
### 呼叫方法 (圖片)

    this.socialShare.shareMsg(
        {
            subject: '分享的標題(email)',
            message: '分享的訊息',
            url: '分享的連結'
        }
        , 'assets/data/ad/card/footer.jpg'
    ).then(
        () => {
            // success
        },
        () => {
            // error
        }
    );


### 呼叫方法 (圖片+圖片上有文字)

    this.socialShare.shareMsg(
        {
            subject: '分享的標題(email)',
            message: '分享的訊息',
            url: '分享的連結'
        }
        , 'assets/data/ad/card/footer.jpg'
        , {
            content: '圖片上加上文字',
            font: '30px Arial',
            x: 30,
            y: 100,
            width: 0,
            height: 50
        }
    ).then(
        () => {
            // success
        },
        () => {
            // error
        }
    );




