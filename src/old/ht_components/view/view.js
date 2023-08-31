/**
 * Created by kie0723 on 2016/4/27.
 *
 * 頁面流程記錄控制
 */


angular.module('view', []).service('view', function($rootScope, $log, boundle, serviceStatus) {
    var self = this;
    this.history = [];
    this.push = function(url){
        $rootScope.slide = 'slide-left';
        var onServiceReady = function(){
    		var lastPage = window.location.hash;
            self.history.push(lastPage);
            window.location.replace(url);
    	};
    	serviceStatus.checkServer(onServiceReady);
    };

    this.pop = function(){
        //$log.debug('pop');
        //$log.debug(self.history);
        $rootScope.slide = 'slide-right';
        var currentUrl = window.location.hash;
        // boundle.remove(currentUrl);
        var url = '#/home';
        var len = self.history.length;

        if(len>0){
            var array = self.history.splice(len-1,1);
            url = array[0];
        }
        //$log.debug(url);

        window.location.replace(url);
    }

    //
    this.replace = function(url){
        $rootScope.slide = 'slide-left';
        var onServiceReady = function(){
        	var currentUrl = window.location.hash;
            // boundle.remove(currentUrl);
            window.location.replace(url);
    	};
        if(url=='#/n1002'||url=='#/home'){
            onServiceReady();
        }else{
            serviceStatus.checkServer(onServiceReady);
        }
    }

    this.cleanHistory = function(){
        var keys = boundle.keys();
        for(key in keys){
            boundle.remove(keys[key]);
        }
        this.history = [];
    }

    this.switch = function(url){
        self.cleanHistory();
        self.replace(url);

    }
    /**
     *
     */
    this.scrollToEl = function(id){

        if ($location.hash() !== id) {
            $location.hash(id);
        } else {
            $anchorScroll();
        }

    }

});