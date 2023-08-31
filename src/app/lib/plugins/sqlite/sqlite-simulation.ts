/**
 * Sqlite plugin 模擬
 * (方便開發)
 */
export class OpenDatabaseSimulation {

    /**
     * To check the data using the single SQL statement API:
     * @param str sql
     */
    executeSql(str: string, list: Array<any>, successCallback, errorCallback) {
        let output = {
            rows: {
                item: [
                    {
                        trans_date: '20160626143746',
                        trans_person: '本人',
                        trans_amount: '1000',
                        qr_code: 'iahasdsdkxkzlzx',
                        trnsNo: '100022300010',
                        stan: '8786544'
                    },
                    {
                        trans_date: '20160628153850',
                        trans_person: '非本人',
                        trans_amount: '1500',
                        qr_code: 'iaaaxdshhjkzlzx',
                        trnsNo: '100066300552',
                        stan: '8786566'
                    },
                    {
                        trans_date: '20160630153946',
                        trans_person: '本人',
                        trans_amount: '1300',
                        qr_code: 'iahasdsdkxkzlzx',
                        trnsNo: '100031300090',
                        stan: '8786685'
                    }
                ]
            }
        };
        successCallback(output);
    }

}
