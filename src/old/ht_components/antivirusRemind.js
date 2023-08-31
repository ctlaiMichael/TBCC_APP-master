/**
 * Created by kie0723 on 2016/5/31.
 */

angular.module('antivirusRemind', [])
.service('antivirusRemind', function(i18n, framework) {
    var self = this;

    function showMsg(title,content){
        var show_title = i18n.getStringByTag(title);
        var show_content = i18n.getStringByTag(content);
        if(typeof MainUiTool === 'object'){
            MainUiTool.openDialog({
                title : show_title,
                content : show_content
            });
        }else{
            alert('【'+show_title+'】'+show_content);
        }
    }

    this.isRoot = function(isJailbroken){
    	if(isJailbroken){
            showMsg('NOTE_JBROOT_TITLE','NOTE_JBROOT_CONTENT');
    	}
    }
    this.checkFail = function(){

    }
    this.show = function(){
        if(!window.localStorage.antivirus){
            showMsg('NOTE_ANTIVIRUS_TITLE','NOTE_ANTIVIRUS_CONTENT');
        }
        framework.checkRootJB(self.isRoot, self.checkFail);
        i18n.getStringByTag('LOGIN_KEY_ACCOUNT_PWD');
    }

});