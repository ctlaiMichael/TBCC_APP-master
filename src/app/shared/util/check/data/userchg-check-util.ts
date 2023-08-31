/**
使用者資訊變更相關檢核
 */

export const UserChgUtil = {
    /**
     * 檢核 新密碼 是否與 使用者代碼 相同
     * @param newpwds 新密碼
     * @param userId  userId
     */
    /**
     * 檢核前後參數是否相同 不相同回傳true (此處檢核不應相同)
     * @param newpwds 
     * @param userId 
     */
    isSameAsUserId(newpwds, userId) { 
        const data = {
            status: false,
            msg: 'CHECK.PSWD.SAMECUST'
        };
        if (newpwds == userId) {


        } else {
            data.status = true;
            data.msg = '';
        }
        return data;
    },
     /**
     * // 檢核 新密碼(代號) 與 舊密碼(代號) 是否相同
     * @param newpwds 新密碼(代號)
     * @param oldpwd  舊密碼(代號)
     */
    newEqualOld(newpwds, oldpwd) {
        const data = {
            status: false,
            msg: 'CHECK.PSWD.SAMEOLD'
        };
        if (newpwds == oldpwd) {

        } else {
            data.status = true;
            data.msg = '';
        }

        return data;
    },
    /**
     * 檢核 確認新密碼 與 新密碼 是否一致
     * @param newpwds 
     * @param checkpwd 
     */
    newNotEqualOld(newpwds, checkpwd) {
        const data = {
            status: false,
            msg: 'CHECK.PSWD.SAMECHECK'
        };
        if (newpwds !== checkpwd) {

        } else {
            data.status = true;
            data.msg = '';
        }

        return data;
    },
    /**
     * 新代號是否與登入密碼相同
     * @param newpwds 
     * @param checkpwd 
     */
    isSameAsPw(newNetCode, pwd) {  
        const data = {
            status: false,
            msg: 'CHECK.PSWD.SAMECHECK'
        };
        if (newNetCode == pwd) {


        } else {
            data.status = true;
            data.msg = '';
        }

        return data;
    }

};
