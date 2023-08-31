/**
 * Created by kie0723 on 2016/4/15.
 */

function padLeft(str,lenght){
    if(str.length >= lenght)
        return str;
    else
        return padLeft("0" +str,lenght);
}

angular.module('spinningWheelDirectiveModule', [])
    .directive('spinningWheel', ['i18n', function(i18n){
        return {
            template: "<input type ='text' ng-click='onClick()' ng-model='default'  placeholder='{{placeholder}}' onfocus='this.blur()' readonly class='spinningWheelInput' >",
            restrict: 'AE',
            scope:{
                type: '@',
                max: '@',
                min: '@',
                ngModel: '=',
                options: '=',
                default: '@',
                placeholder:'@'
            },
            link: function($scope, $rootScope,  $element, $attrs){
                $scope.wheel;


                var destroyWheel = function (elementId, results){
                    $scope.wheel = null;
                    var ev = document . createEvent ( 'HTMLEvents' );
                    ev . initEvent ( 'spinningWheelClosed' , false , false );
                    document.dispatchEvent(ev);
                    if(elementId != "" && typeof results !== 'undefined' && results != null){
                        var keys = results.keys;
                        //console.log(results);
                        if($scope.type == 'date'){
                            $scope.default = results.values[0]+'/'+padLeft(results.values[1],2)+'/'+padLeft( results.values[2].toString(),2 );// 左邊補0
                            $scope.ngModel = $scope.default;
                        }else if($scope.type == 'time'){
                            $scope.default = results.values[0]+':'+results.values[1]+' '+results.values[2];
                            $scope.ngModel = $scope.default;
                        }else if($scope.type == 'keyValue'){
                            $scope.default =$scope.options[results.keys[0]].value;
                            $scope.ngModel = $scope.options[results.keys[0]].key;

                        }else if($scope.type == 'account'){
                            $scope.default =$scope.options[results.keys[0]].acctNo;
                            $scope.ngModel = results.keys[0];

                        }else{
                            $scope.default =$scope.options[results.keys[0]];
                            $scope.ngModel = results.keys[0];
                        }

                    }

                    $scope.$apply();
                };

                $scope.onClick = function(){
                    var ev = document . createEvent ( 'HTMLEvents' );
                    ev . initEvent ( 'spinningWheelOpened' , false , false );
                    document.dispatchEvent(ev);
                    //time default '12:34 PM'
                    //date default '1987/2/3'
                    //option default ''
                    if($scope.ngModel==null){
                        $scope.ngModel = '';
                    }

                    if($scope.type == 'option'){
                        //console.log($scope.options);
                        //var values = [];
                        //for(var i =0;i< $scope.options.length ;i++){
                        //    values.push($scope.options[i].value);
                        //}
                        $scope.wheel = new ScrollWheel('id', $scope.ngModel, destroyWheel, "custom", [$scope.options]);

                    }else if($scope.type == 'keyValue'){
                        //console.log($scope.options);
                        //var values = [];
                        //for(var i =0;i< $scope.options.length ;i++){
                        //    values.push($scope.options[i].value);
                        //}
                    	var defaultModel = '';
                    	$scope.values = [];
                    	for(var i=0;i<$scope.options.length;i++){
                    		var value = $scope.options[i].value;
                    		$scope.values.push(value);
                            if($scope.options[i].key===$scope.ngModel){
                            	defaultModel = i.toString();
                            }
                    	}
                        $scope.wheel = new ScrollWheel('id', defaultModel, destroyWheel, "custom", [$scope.values]);

                    }else if($scope.type == 'account'){

                        if($scope.options == null || $scope.options.length < 1){
                            if(typeof MainUiTool === 'object'){
                                MainUiTool.openDialog(i18n.getStringByTag('NO_ACCOUNT_LIST'));
                            }
                        }else{

                            $scope.accounts = [];

                            for(var i=0;i<$scope.options.length;i++){
                                var acct = $scope.options[i];
                                var acct_str = acct.accountingName + '-' + acct.branchName + '<br>' + acct.acctNo;
                                $scope.accounts.push(acct_str);

                            }


                            $scope.wheel = new ScrollWheel('id', $scope.ngModel, destroyWheel, "custom", [$scope.accounts]);
                        }
                    }else{
                        $scope.wheel = new ScrollWheel('id', $scope.ngModel, destroyWheel, $scope.type, {min:$scope.min, max:$scope.max});
                    }

                }

            }
        };
    }])

;


var SpinningWheel = {
    cellHeight: 44,
    friction: 0.003,
    slotData: [],


    /**
     *
     * Event handler
     *
     */

    handleEvent: function (e) {
        //console.log(e.type+':'+e.currentTarget.id);
        if (e.type == 'touchstart') {
            this.lockScreen(e);
            if (e.currentTarget.id == 'sw-cancel' || e.currentTarget.id == 'sw-done') {
                this.tapDown(e);
            } else if (e.currentTarget.id == 'sw-frame') {
                this.scrollStart(e);
            }
        } else if (e.type == 'touchmove') {
            this.lockScreen(e);

            if (e.currentTarget.id == 'sw-cancel' || e.currentTarget.id == 'sw-done') {
                //this.tapCancel(e);
            } else if (e.currentTarget.id == 'sw-frame') {
                this.scrollMove(e);
            }
        } else if (e.type == 'touchend') {
            if (e.currentTarget.id == 'sw-cancel' || e.currentTarget.id == 'sw-done') {
                this.tapUp(e);
            } else if (e.currentTarget.id == 'sw-frame') {
                this.scrollEnd(e);

                //setTimeout($.proxy(this.scrollEndAction(this.activeSlot), this), 100); <-- use if you are using a js library
                var self = this;
                setTimeout(function () {
                    self.scrollEndAction.apply(self, [self.activeSlot])
                }, 100);
            }
        } else if (e.type == 'webkitTransitionEnd') {
            if (e.target.id == 'sw-wrapper') {
                this.destroy();
            } else {
                this.backWithinBoundaries(e);
            }
        } else if (e.type == 'orientationchange') {
            this.onOrientationChange(e);
        } else if (e.type == 'scroll') {
            this.onScroll(e);
        } else if (e.type == 'onReturn') {
            this.tapUp(e);
        }
    },


    /**
     *
     * Global events
     *
     */

    onOrientationChange: function (e) {
        window.scrollTo(0, 0);
        this.swWrapper.style.top = window.innerHeight + window.pageYOffset + 'px';
        this.calculateSlotsWidth();
    },

    onScroll: function (e) {
        this.swWrapper.style.top = window.innerHeight + window.pageYOffset + 'px';
    },

    lockScreen: function (e) {
        e.preventDefault();
        e.stopPropagation();
    },


    /**
     *
     * Initialization
     *
     */

    reset: function () {
        this.slotEl = [];

        this.activeSlot = null;

        this.swWrapper = undefined;
        this.swSlotWrapper = undefined;
        this.swSlots = undefined;
        this.swFrame = undefined;
    },

    calculateSlotsWidth: function () {
        var div = this.swSlots.getElementsByTagName('div');
        for (var i = 0; i < div.length; i += 1) {
            this.slotEl[i].slotWidth = div[i].offsetWidth;
        }
    },

    create: function () {
        var i, l, out, ul, div;

        this.reset();	// Initialize object variables

        var mask = document.createElement('div');
        mask.id='sw-mask';
        // Create the Spinning Wheel main wrapper
        div = document.createElement('div');
        div.id = 'sw-wrapper';
        div.style.top = window.innerHeight + window.pageYOffset -60 + 'px';		// Place the SW down the actual viewing screen
        div.style.webkitTransitionProperty = '-webkit-transform';
        div.innerHTML = '<div id="sw-header"><div id="sw-cancel">&nbsp;取消&nbsp;</' + 'div><div id="sw-done">&nbsp;完成&nbsp;</' + 'div></' + 'div><div id="sw-slots-wrapper"><div id="sw-slots"></' + 'div></' + 'div><div id="sw-frame"></' + 'div></' + 'div>';

        mask.appendChild(div);
        document.body.appendChild(mask);

        this.swWrapper = div;													// The SW wrapper
        this.swSlotWrapper = document.getElementById('sw-slots-wrapper');		// Slots visible area
        this.swSlots = document.getElementById('sw-slots');						// Pseudo table element (inner wrapper)
        this.swFrame = document.getElementById('sw-frame');						// The scrolling controller

        // Create HTML slot elements
        for (l = 0; l < this.slotData.length; l += 1) {
            // Create the slot
            ul = document.createElement('ul');
            out = '';
            for (i in this.slotData[l].values) {
                var str = this.slotData[l].values[i].toString();
                var style = '';
                if(str.indexOf('<br>')>0){
                    style = 'style="font: bold 16px/22px Helvetica,sans-serif;"';
                }
                out += '<li id="' + l + "_" + this.slotData[l].values[i] + 'LI" '+ style +' >' + this.slotData[l].values[i] + '<' + '/li>';
            }
            ul.innerHTML = out;

            div = document.createElement('div');		// Create slot container
            div.className = this.slotData[l].style;		// Add styles to the container
            div.appendChild(ul);

            // Append the slot to the wrapper
            this.swSlots.appendChild(div);

            ul.slotPosition = l;			// Save the slot position inside the wrapper
            ul.slotYPosition = 0;
            ul.slotWidth = 0;
            ul.slotMaxScroll = this.swSlotWrapper.clientHeight - ul.clientHeight - 86;
            ul.style.webkitTransitionTimingFunction = 'cubic-bezier(0, 0, 0.2, 1)';		// Add default transition

            this.slotEl.push(ul);			// Save the slot for later use

            // Place the slot to its default position (if other than 0)
            if (this.slotData[l].defaultValue) {
                this.scrollToValue(l, this.slotData[l].defaultValue);
            }
        }

        this.calculateSlotsWidth();

        // Global events
        document.addEventListener('touchstart', this, false);			// Prevent page scrolling
        document.addEventListener('touchmove', this, false);			// Prevent page scrolling
        window.addEventListener('orientationchange', this, true);		// Optimize SW on orientation change
        window.addEventListener('scroll', this, true);				// Reposition SW on page scroll
        // Cancel/Done buttons events
        document.getElementById('sw-cancel').addEventListener('touchstart', this, false);
        document.getElementById('sw-done').addEventListener('touchstart', this, false);

        // Add scrolling to the slots
        this.swFrame.addEventListener('touchstart', this, false);
        document . addEventListener ( "onReturn" , this , false );
    },

    open: function () {
        this.create();

        this.swWrapper.style.webkitTransitionTimingFunction = 'ease-out';
        this.swWrapper.style.webkitTransitionDuration = '100ms';
        this.swWrapper.style.webkitTransform = 'translate3d(0, -260px, 0)';
    },


    /**
     *
     * Unload
     *
     */

    destroy: function () {
        this.swWrapper.removeEventListener('webkitTransitionEnd', this, false);

        this.swFrame.removeEventListener('touchstart', this, false);

        document.getElementById('sw-cancel').removeEventListener('touchstart', this, false);
        document.getElementById('sw-done').removeEventListener('touchstart', this, false);

        document.removeEventListener('touchstart', this, false);
        document.removeEventListener('touchmove', this, false);
        window.removeEventListener('orientationchange', this, true);
        window.removeEventListener('scroll', this, true);
        document.removeEventListener ( "onReturn" , this , false );
        this.slotData = [];
        this.cancelAction = function () {
            return false;
        };

        this.cancelDone = function () {
            return true;
        };

        this.scrollEndAction = function () {
            return false;
        };

        this.reset();

        document.body.removeChild(document.getElementById('sw-mask'));
    },

    close: function () {
        if(typeof this.swWrapper === 'undefined'){
            return false;
        }
        try{
            ScrollWheel.instanceOpen = false;
        }
        catch(e){
            //do nothing
        }
        this.swWrapper.style.webkitTransitionTimingFunction = 'ease-in';
        this.swWrapper.style.webkitTransitionDuration = '100ms';
        this.swWrapper.style.webkitTransform = 'translate3d(0, 0, 0)';

        this.swWrapper.addEventListener('webkitTransitionEnd', this, false);
    },


    /**
     *
     * Generic methods
     *
     */

    addSlot: function (values, style, defaultValue) {
        if (!style) {
            style = '';
        }

        style = style.split(' ');

        for (var i = 0; i < style.length; i += 1) {
            style[i] = 'sw-' + style[i];
        }

        style = style.join(' ');

        var obj = { 'values': values, 'style': style, 'defaultValue': defaultValue };
        this.slotData.push(obj);
    },

    getSelectedValues: function () {
        var index, count,
            i, l,
            keys = [], values = [];

        for (var i = 0 ; i < this.slotEl.length ; i++) {
            // Remove any residual animation
            this.slotEl[i].removeEventListener('webkitTransitionEnd', this, false);
            this.slotEl[i].style.webkitTransitionDuration = '0';

            if (this.slotEl[i].slotYPosition > 0) {
                this.setPosition(i, 0);
            } else if (this.slotEl[i].slotYPosition < this.slotEl[i].slotMaxScroll) {
                this.setPosition(i, this.slotEl[i].slotMaxScroll);
            }

            index = -Math.round(this.slotEl[i].slotYPosition / this.cellHeight);

            count = 0;
            for (l in this.slotData[i].values) {
                if (count == index) {
                    keys.push(l);
                    values.push(this.slotData[i].values[l]);
                    break;
                }

                count += 1;
            }
        }

        return { 'keys': keys, 'values': values };
    },

    getSlotValue: function(slot) {
        if(slot < 0 || slot >= this.slotEl.length){
            return { 'keys': null, 'values': null };
        }
        var index, count,
            l,
            keys = [], values = [];

        index = -Math.round(this.slotEl[slot].slotYPosition / this.cellHeight);
        //index += 1;
        count = 0;
        for (l in this.slotData[slot].values) {
            if (count == index) {
                keys.push(l);
                values.push(this.slotData[slot].values[l]);
                break;
            }

            count += 1;
        }
        //keys.push(index);
        //values.push(this.slotData[slot].values[index]);
        //console.log('getSlotValue:');
        //console.log({ 'keys': keys, 'values': values });
        return { 'keys': keys, 'values': values };
    },

    hideSlotValuesAfter: function(slot, lastKey, length) {
        if(typeof length === 'undefined' || length == null){
            console.log("did you forget to pass the length of this slot to hideSlotValuesAfter?");
            return false;
        }
        lastKey++;
        var thisSlot = null;
        //console.log("slot ul slotMaxScroll: " + this.slotEl[slot].slotMaxScroll);
        while(lastKey <= length){
            thisSlot = document.getElementById(slot + "_" + lastKey + "LI");
            this.slotEl[slot].removeChild(thisSlot);
            lastKey += 1;
        }
        this.slotEl[slot].slotMaxScroll = this.swSlotWrapper.clientHeight - this.slotEl[slot].clientHeight - 86;
        //console.log("UPDATED slot ul slotMaxScroll: " + this.slotEl[slot].slotMaxScroll);
        thisSlot = null;
    },

    showSlotValuesAfter: function(slot, lastKey, length) {
        if(typeof length === 'undefined' || length == null){
            console.log("did you forget to pass the length of this slot to showSlotValuesAfter?");
            return false;
        }
        lastKey++;
        //console.log("slot ul slotMaxScroll: " + this.slotEl[slot].slotMaxScroll);
        while(lastKey <= length){
            //'<li id="' + slot + "_" + lastKey + 'LI">' + lastKey + '</li>';
            var existingLI = document.getElementById(slot + "_" + lastKey + "LI");
            if(typeof existingLI === 'undefined' || existingLI == null){
                var LI = document.createElement("LI");
                LI.id = slot + "_" + lastKey + "LI";
                LI.textContent = lastKey;
                this.slotEl[slot].appendChild(LI);
                LI = null;
            }
            lastKey += 1;
        }
        this.slotEl[slot].slotMaxScroll = this.swSlotWrapper.clientHeight - this.slotEl[slot].clientHeight - 86;
        //console.log("UPDATED slot ul slotMaxScroll: " + this.slotEl[slot].slotMaxScroll);
        thisSlot = null;
    },

    /**
     *
     * Rolling slots
     *
     */

    setPosition: function (slot, pos) {
        this.slotEl[slot].slotYPosition = pos;
        this.slotEl[slot].style.webkitTransform = 'translate3d(0, ' + pos + 'px, 0)';
    },

    scrollStart: function (e) {
        // Find the clicked slot
        var xPos = e.targetTouches[0].clientX - this.swSlots.offsetLeft;	// Clicked position minus left offset (should be 11px)

        // Find tapped slot
        var slot = 0;
        for (var i = 0; i < this.slotEl.length; i += 1) {
            slot += this.slotEl[i].slotWidth;

            if (xPos < slot) {
                this.activeSlot = i;
                break;
            }
        }

        // If slot is readonly do nothing
        if (this.slotData[this.activeSlot].style.match('readonly')) {
            this.swFrame.removeEventListener('touchmove', this, false);
            this.swFrame.removeEventListener('touchend', this, false);
            return false;
        }

        this.slotEl[this.activeSlot].removeEventListener('webkitTransitionEnd', this, false);	// Remove transition event (if any)
        this.slotEl[this.activeSlot].style.webkitTransitionDuration = '0';		// Remove any residual transition

        // Stop and hold slot position
        var theTransform = window.getComputedStyle(this.slotEl[this.activeSlot]).webkitTransform;
        theTransform = new WebKitCSSMatrix(theTransform).m42;
        if (theTransform != this.slotEl[this.activeSlot].slotYPosition) {
            this.setPosition(this.activeSlot, theTransform);
        }

        this.startY = e.targetTouches[0].clientY;
        this.scrollStartY = this.slotEl[this.activeSlot].slotYPosition;
        this.scrollStartTime = e.timeStamp;

        this.swFrame.addEventListener('touchmove', this, false);
        this.swFrame.addEventListener('touchend', this, false);

        return true;
    },

    scrollMove: function (e) {
        var topDelta = e.targetTouches[0].clientY - this.startY;

        if (this.slotEl[this.activeSlot].slotYPosition > 0 || this.slotEl[this.activeSlot].slotYPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
            topDelta /= 2;
        }

        this.setPosition(this.activeSlot, this.slotEl[this.activeSlot].slotYPosition + topDelta);
        this.startY = e.targetTouches[0].clientY;

        // Prevent slingshot effect
        if (e.timeStamp - this.scrollStartTime > 80) {
            this.scrollStartY = this.slotEl[this.activeSlot].slotYPosition;
            this.scrollStartTime = e.timeStamp;
        }
    },

    scrollEnd: function (e) {
        this.swFrame.removeEventListener('touchmove', this, false);
        this.swFrame.removeEventListener('touchend', this, false);

        // If we are outside of the boundaries, let's go back to the sheepfold
        if (this.slotEl[this.activeSlot].slotYPosition > 0 || this.slotEl[this.activeSlot].slotYPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
            this.scrollTo(this.activeSlot, this.slotEl[this.activeSlot].slotYPosition > 0 ? 0 : this.slotEl[this.activeSlot].slotMaxScroll);
            return false;
        }

        // Lame formula to calculate a fake deceleration
        var scrollDistance = this.slotEl[this.activeSlot].slotYPosition - this.scrollStartY;

        // The drag session was too short
        if (scrollDistance < this.cellHeight / 1.5 && scrollDistance > -this.cellHeight / 1.5) {
            if (this.slotEl[this.activeSlot].slotYPosition % this.cellHeight) {
                this.scrollTo(this.activeSlot, Math.round(this.slotEl[this.activeSlot].slotYPosition / this.cellHeight) * this.cellHeight, '100ms');
            }

            return false;
        }

        var scrollDuration = e.timeStamp - this.scrollStartTime;

        var newDuration = (2 * scrollDistance / scrollDuration) / this.friction;
        var newScrollDistance = (this.friction / 2) * (newDuration * newDuration);

        if (newDuration < 0) {
            newDuration = -newDuration;
            newScrollDistance = -newScrollDistance;
        }

        var newPosition = this.slotEl[this.activeSlot].slotYPosition + newScrollDistance;

        if (newPosition > 0) {
            // Prevent the slot to be dragged outside the visible area (top margin)
            newPosition /= 2;
            newDuration /= 3;

            if (newPosition > this.swSlotWrapper.clientHeight / 4) {
                newPosition = this.swSlotWrapper.clientHeight / 4;
            }
        } else if (newPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
            // Prevent the slot to be dragged outside the visible area (bottom margin)
            newPosition = (newPosition - this.slotEl[this.activeSlot].slotMaxScroll) / 2 + this.slotEl[this.activeSlot].slotMaxScroll;
            newDuration /= 3;

            if (newPosition < this.slotEl[this.activeSlot].slotMaxScroll - this.swSlotWrapper.clientHeight / 4) {
                newPosition = this.slotEl[this.activeSlot].slotMaxScroll - this.swSlotWrapper.clientHeight / 4;
            }
        } else {
            newPosition = Math.round(newPosition / this.cellHeight) * this.cellHeight;
        }

        this.scrollTo(this.activeSlot, Math.round(newPosition), Math.round(newDuration) + 'ms');
        return true;
    },

    scrollTo: function (slotNum, dest, runtime) {
        this.slotEl[slotNum].style.webkitTransitionDuration = runtime ? runtime : '100ms';
        this.setPosition(slotNum, dest ? dest : 0);

        // If we are outside of the boundaries go back to the sheepfold
        if (this.slotEl[slotNum].slotYPosition > 0 || this.slotEl[slotNum].slotYPosition < this.slotEl[slotNum].slotMaxScroll) {
            this.slotEl[slotNum].addEventListener('webkitTransitionEnd', this, false);
        }
    },

    scrollToValue: function (slot, value) {
        var yPos, count, i;

        this.slotEl[slot].removeEventListener('webkitTransitionEnd', this, false);
        this.slotEl[slot].style.webkitTransitionDuration = '0';

        count = 0;
        for (i in this.slotData[slot].values) {
            if (i == value) {
                yPos = count * this.cellHeight;
                this.setPosition(slot, yPos);
                break;
            }

            count -= 1;
        }
    },

    backWithinBoundaries: function (e) {
        e.target.removeEventListener('webkitTransitionEnd', this, false);

        this.scrollTo(e.target.slotPosition, e.target.slotYPosition > 0 ? 0 : e.target.slotMaxScroll, '150ms');
        return false;
    },


    /**
     *
     * Buttons
     *
     */

    tapDown: function (e) {
        e.currentTarget.addEventListener('touchmove', this, false);
        e.currentTarget.addEventListener('touchend', this, false);
        e.currentTarget.className = 'sw-pressed';
    },

    tapCancel: function (e) {
        e.currentTarget.removeEventListener('touchmove', this, false);
        e.currentTarget.removeEventListener('touchend', this, false);
        e.currentTarget.className = '';
    },

    tapUp: function (e) {
        this.tapCancel(e);

        if (e.currentTarget.id == 'sw-cancel') {
            this.cancelAction();
        } else {
            this.doneAction();
        }

        this.close();
    },

    setCancelAction: function (action) {
        this.cancelAction = action;
    },

    setDoneAction: function (action) {
        this.doneAction = action;
    },

    setSlotScrollEndAction: function(action) {
        this.scrollEndAction = action;
    },

    //default handlers
    cancelAction: function () {
        return false;
    },

    cancelDone: function () {
        return true;
    },

    scrollEndAction: function () {
        return false;
    }
};


function ScrollWheel(targetElementId, defaultValue, closeCallback, type, slotData ){
    /**
     *

     * Find more about the Spinning Wheel function at
     * http://cubiq.org/spinning-wheel-on-webkit-for-iphone-ipod-touch/11
     *
     * Copyright (c) 2009 Matteo Spinelli, http://cubiq.org/
     * Released under MIT license
     * http://cubiq.org/dropbox/mit-license.txt
     *
     * Version 1.4 - Last updated: 2009.07.09
     *
     */


    this.pickerDetails = {id: ""};
    this.closeCallback = closeCallback;
    var self = this;
    if(type.toLowerCase() == "date"){

        this.showDatePicker(targetElementId, defaultValue, slotData);
    }
    else if(type.toLowerCase() == "time"){
        this.showTimePicker(targetElementId, defaultValue, slotData);
    }
    else if(type.toLowerCase() == "custom"){
        this.showCustomPicker(targetElementId, defaultValue, slotData);
    }


    //default actions for SpinningWheel
    SpinningWheel.setDoneAction(function () {
        self.done.apply(self);
    });
    SpinningWheel.setCancelAction(function(){
        ScrollWheel.instanceOpen = false;
        self.closeCallback.apply(self, [self.pickerDetails.id, null]);
    });



}

ScrollWheel.prototype.instanceOpen = false;
//ScrollWheel.prototype.startYear = 0;
//ScrollWheel.prototype.endYear = 0;

ScrollWheel.prototype.showTimePicker = function (id, value, limit){
    if(ScrollWheel.instanceOpen){
        return false;
    }
    ScrollWheel.instanceOpen = true;
    var hours = {}, minutes = {}, ampm = {0:"AM", 1:"PM"}, i = 1;
    //hours
    for(i = 1 ; i < 13 ; i++){
        if(i < 10){
            hours[i] = '0' + i;
        }
        else{
            hours[i] = i;
        }
    }
    //mins
    for(i = 0 ; i < 60 ; i++){
        if(i < 10){
            minutes[i] = '0' + i;
        }
        else{
            minutes[i] = i;
        }
    }

    if(id != "")
        this.pickerDetails.id = id;
    //default values
    var now = new Date();
    var defH = now.getHours(), defM = now.getMinutes(), defAMPM = (defH < 12) ? 0 : 1;
    //convert hours to 12 hour clock format
    if(defH > 12){
        defH -= 12;
    }
    now = null;
    if(value != ""){
        var temp = value.split(":");
        defH = temp[0];
        //check if it is 0 prefixed
        if(defH.indexOf('0') == 0){
            defH = defH.charAt(1);
        }

        defM = temp[1].split(" ")[0];
        //check if it is 0 prefixed
        if(defM.indexOf('0') == 0){
            defM = defM.charAt(1);
        }
        defAMPM = (temp[1].split(" ")[1].toUpperCase() == "AM")? 0 : 1;
        temp = null;
    }

    //setup the slots now
    SpinningWheel.addSlot(hours, 'shrink', defH);
    SpinningWheel.addSlot(minutes, 'shrink', defM);
    SpinningWheel.addSlot(ampm, 'shrink', defAMPM);

    SpinningWheel.open();

    hours = null;
    minutes = null;
    seconds = null;
};

ScrollWheel.prototype.showCustomPicker = function (id, value, slotData){
    if(ScrollWheel.instanceOpen){
        return false;
    }
    ScrollWheel.instanceOpen = true;
    var defaultValue = "";
    if(id != "") {
        this.pickerDetails.id = id;
    }
    for(var i = 0 ; i < slotData.length ; i++){
        //setup the slots now
        if(value.length > i) {
            defaultValue = value[i];
        }
        SpinningWheel.addSlot(slotData[i], 'shrink', defaultValue);
    }

    SpinningWheel.open();
};

ScrollWheel.prototype.showDatePicker = function (id, value, limit){


    if(ScrollWheel.instanceOpen){
        return false;
    }
    ScrollWheel.instanceOpen = true;
    if(id != "") {
        this.pickerDetails.id = id;
    }

    var now = new Date();

    ScrollWheel.startYear = now.getFullYear()-100;
    ScrollWheel.endYear =  now.getFullYear()+12;
    ScrollWheel.maxMonth = 12;
    ScrollWheel.maxDate = 31;
    ScrollWheel.minMonth = 1;
    ScrollWheel.minDate = 1;
    if(limit.min != null){
        var tempMin = limit.min.split("/");
        ScrollWheel.startYear = parseInt(tempMin[0]);
        ScrollWheel.minMonth = parseInt(tempMin[1]);
        ScrollWheel.minDate = parseInt(tempMin[2]);

    }
    if(limit.max != null){
        var tempMax = limit.max.split("/");
        ScrollWheel.endYear = parseInt(tempMax[0])+1;
        ScrollWheel.maxMonth = parseInt(tempMax[1]);
        ScrollWheel.maxDate = parseInt(tempMax[2]);
    }

    //default values
    var defM = now.getMonth()+1, defY = now.getFullYear(), defD = now.getDate();
    if(value != ""){
        var temp = value.split("/");
        defY = temp[0];
        defM = temp[1].replace(/\b(0+)/gi,"");//去掉字符串前的0
        defD = temp[2].replace(/\b(0+)/gi,"");//去掉字符串前的0
        temp = null;
    }


    var days = { };
    var years = { };
    var months = { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12' };

    for( var i = 1; i < 32; i += 1 ) {
        days[i] = i;
    }

    for( i = ScrollWheel.startYear; i < ScrollWheel.endYear ; i += 1 ) {
        years[i] = i;
    }

    SpinningWheel.addSlot(years, 'shrink', defY);
    SpinningWheel.addSlot(months, 'shrink', defM);
    SpinningWheel.addSlot(days, 'shrink', defD);

    SpinningWheel.setSlotScrollEndAction(this.updateDates);
    SpinningWheel.open();
    now = null;
    days = null;
    months = null;
    years = null;
};

ScrollWheel.prototype.done = function(){
    ScrollWheel.instanceOpen = false;
    var results = SpinningWheel.getSelectedValues();
    //console.log('values: ' + results.values.join(' ') + ' keys: ' + results.keys.join(', '));

    this.closeCallback(this.pickerDetails.id, results);
    results = null;
};

ScrollWheel.prototype.updateDates = function (index){
    console.log("you scrolled: " + index);
    if(index!=0){
        var selY = SpinningWheel.getSlotValue(0);
        console.log(parseInt(selY.keys[0]));
        console.log(ScrollWheel.endYear);
        if(parseInt(selY.keys[0]) == ScrollWheel.startYear){
            //check min
            var selSpinning = SpinningWheel.getSlotValue(index);
            var minSpinning = 1;
            if(index ==1){
                minSpinning = ScrollWheel.minMonth;
                if(parseInt(selSpinning.keys[0])<minSpinning){
                    SpinningWheel.scrollToValue(index, minSpinning);
                }
            }else if(index ==2){
                minSpinning = ScrollWheel.minDate;
                var selM = SpinningWheel.getSlotValue(1);
                if((parseInt(selM.keys[0])==ScrollWheel.minMonth)&&(parseInt(selSpinning.keys[0])<minSpinning)){
                    SpinningWheel.scrollToValue(index, minSpinning);
                }
            }
        }else if(parseInt(selY.keys[0]) == ScrollWheel.endYear-1){
            console.log('check max');
            //check max
            var selSpinning = SpinningWheel.getSlotValue(index);
            var maxSpinning = 31;
            console.log(selSpinning);
            console.log(maxSpinning);
            if(index ==1){
                maxSpinning = ScrollWheel.maxMonth;
                if(parseInt(selSpinning.keys[0])>maxSpinning){
                    SpinningWheel.scrollToValue(index, maxSpinning);
                }
            }else if(index ==2){
                maxSpinning = ScrollWheel.maxDate;
                var selM = SpinningWheel.getSlotValue(1);
                if((parseInt(selM.keys[0])==ScrollWheel.maxMonth)&&(parseInt(selSpinning.keys[0])>maxSpinning)){
                    SpinningWheel.scrollToValue(index, maxSpinning);
                }
            }
        }


    }
    var results = null, keys = null, values = null;
    results = SpinningWheel.getSlotValue(1);
    if(results != null && results.keys != null && results.values != null){
        keys = results.keys;
        values = results.values;
        var selectedDate = SpinningWheel.getSlotValue(1);
        //update days accordingly
        // first check if it is February
        if(keys[0] == 2){
            //get the selected year from the its slot
            results = SpinningWheel.getSlotValue(0);
            //console.log('results.keys[0]:'+results.keys[0]);
            if((results.values[0] % 4) == 0){
                SpinningWheel.showSlotValuesAfter(2, 28, 31);
                SpinningWheel.hideSlotValuesAfter(2, 29, 31);
                //set the date to 29th if something other than 29 was chosen by the user
                if(parseInt(selectedDate.keys[0], 10) > 29) {
                    console.log('scrollToValue');
                    SpinningWheel.scrollToValue(2, 29);
                }
            }
            else{
                SpinningWheel.hideSlotValuesAfter(2, 28, 31);
                //set the date to 28th if something other than 29 was chosen by the user
                if(parseInt(selectedDate.keys[0], 10) > 28) {
                    SpinningWheel.scrollToValue(2, 28);
                }
            }
        }
        //now check for odd/even months
        else if(keys[0] == 1 || keys[0] == 3 || keys[0] == 5 || keys[0] == 7 || keys[0] == 8 || keys[0] == 10 || keys[0] == 12){
            SpinningWheel.showSlotValuesAfter(2, 28, 31);
        }
        //now check for odd/even months
        else if(keys[0] == 4 || keys[0] == 6 || keys[0] == 9 || keys[0] == 11){
            SpinningWheel.hideSlotValuesAfter(2, 30, 31);
            if(parseInt(selectedDate.keys[0], 10) > 30) {
                SpinningWheel.scrollToValue(2, 30);
            }
        }
        selectedDate = null;
    }
    results = null;
};
