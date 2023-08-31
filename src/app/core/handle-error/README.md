# 主要區塊說明
## 功能: 錯誤處理

#### alert & confirm

    errorObj['type'] = 'confirm';
    this._handleError.handleError(errorObj).then(
        () => {
            // check
        },
        () => {
            // cancle
        }
    );


