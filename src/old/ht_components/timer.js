'use strict';
/**
 * Created by kie0723 on 15/8/13.
 */

angular.module('timer', [])
    .factory('timer', function($rootScope, $timeout) {

     function Instance(counter_start, callback, countDown ){
            var self = this;
            self.counter = counter_start;
            self.counter_start = counter_start;
            self.timerRunning = false;
            self.callback = callback;
            self.mytimeout ;

            this.run = function(){

                self.counter--;

                if(self.counter){

                    if(countDown != null){
                        countDown(self.counter);
                    }

                    self.mytimeout = $timeout(self.run,1000);
                }else{
                    self.stop();
                    self.callback();
                }
            };

            this.stop = function(){
                $timeout.cancel(self.mytimeout);
                self.timerRunning = false;
            };

            this.start = function(){
                if(self.timerRunning)return;
                if(self.counter<=0){
                    self.counter = self.counter_start;
                }
                self.timerRunning = true;
                self.mytimeout = $timeout(self.run,1000);
            };

            this.restart = function(){
                self.counter = self.counter_start;
                self.start();
            };

        }

        return {
            Instance: Instance
        }
    });