# Template說明
## 目的
如果只有一個option時，預設選擇



## 基本module引用

## 頁面引用

data:

    listData = [
        {value: 1, name: 'data1'},
        {value: 2, name: 'data2'},
        {value: 3, name: 'data3'},
        {value: 4, name: 'data4'}
    ];


    onChange(item) {
        console.log('now val:', item, this.testData);
    }

html:

    <select class="inner_select" (change)="onChange(testData)" [(ngModel)]="testData" selectCheck [listData]="testList">
        <option [value]="null">請選擇</option>
        <option *ngFor="let item of testList" [value]="item">{{item.name}}</option>
    </select>

