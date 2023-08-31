# Template說明: 頁籤
## 目的
第一層與第二層選單


## 層級



## 選單設定
### 第一層
    {
      id: '選單編號',
      name: '選單名稱',
      sort: 1, // 選擇性設定，排序順序，預設ASC
      default: '7D', // 預設選擇項目,未設定預設第一個
      data: [] // 第二層選單，最多設定8個
    }

### 第二層
    data: [
        {
            id: '選單編號', 
            name: '選單名稱', 
            sort: 1  // 選擇性設定，排序順序，預設ASC
        },
        { id: '7D', name: '7周', sort: 1 },
        { id: '1M', name: '1月', sort: 2 }
    ]

### 範例
  bookmarkData = [
    {
      id: 'trans',
      name: '交易明細',
      sort: 1,
      default: '7D',
      data: [
        { id: '7D', name: '7周', sort: 1 },
        { id: '1M', name: '1月', sort: 2 }
      ]
    },
    {
      id: 'acct',
      name: '帳戶彙總',
      sort: 2
    },
    {
      id: 'mark',
      name: '匯率試算',
      sort: 3,
      default: '1M',
      data: [
        { id: '1D', name: '近一天', sort: 1 },
        { id: '7D', name: '近一周', sort: 2 },
        { id: '1M', name: '1月', sort: 3 },
        { id: '2M', name: '2月', sort: 4 },
        { id: '3M', name: '3月', sort: 5 },
        { id: '4M', name: '4月', sort: 6 },
        { id: '5M', name: '5月', sort: 7 },
        { id: '6M', name: '6月', sort: 8 }
      ]
    },
    {
      id: 'acct3',
      name: '帳戶1總',
      sort: 4
    }
  ];

## 基本module引用
    import { BookmarkModule } from '@shared/template/select/bookmark/bookmark.module';
    
    @NgModule({
        imports: [
            BookmarkModule
        ]
    })...

## component

  onBookMarkBack(e) {
    this._logger.step('Bookmark', 'onBookMarkBack', e);
    let page = 'list';
    let pageType = 'list';
    let errorObj: any;
    if (typeof e === 'object') {
      if (e.hasOwnProperty('page')) {
        page = e.page;
      }
      if (e.hasOwnProperty('type')) {
        pageType = e.type;
      }
      if (e.hasOwnProperty('data')) {
        errorObj = e.data;
      }
    }
  }


## html
    <app-bookmark [setData]="bookmarkData" [defaultKey]="'mark'" (backPageEmit)="onBookMarkBack($event)"></app-bookmark>