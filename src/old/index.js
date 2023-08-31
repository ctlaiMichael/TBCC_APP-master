/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        
        app.receivedEvent('deviceready');
        console.log('Device Ready');
        $('#article').css("height", function(index) {
            return $(window).height();
        });
        //angular.bootstrap(document, ["webapp"]);
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
    }

    // ,
    // onRegister: function(tokenid){
    //
    //     var udid = device.uuid;
    //     var version = device.version;
    //     var platform = device.platform;
    //     var manufacturer = device.manufacturer;
    //     var model = device.model;
    //     var hostname = device.hostname;
    //     var app_name = device.appinfo.name;
    //     var app_version = device.appinfo.version;
    //     var app_identifier = device.appinfo.identifier;
    //
    //     var postData = {};
    //     postData['udid'] = udid;
    //     postData['appuid'] = app_name;
    //     postData['model'] = model;
    //     postData['platform'] = platform;
    //     postData['version'] = version;
    //     postData['name'] = hostname;
    //     postData['tokenid'] = tokenid;
    //     postData['account'] = "Jason";
    //     postData['pushon'] = true;
    //
    //     var  xhttp = new XMLHttpRequest();
    //     xhttp.open("POST", "http://192.168.100.69:8080/MPushServer/rest/device/register", true);
    //     xhttp.setRequestHeader('Content-Type', 'application/json');
    //     xhttp.onreadystatechange = function () {
    //         if (xhttp.readyState == 4)
    //         {
    //             if (xhttp.status == 200)
    //             {
    //                 alert(xhttp.responseText);
    //             }else
    //             {
    //                 alert('http error:' + xhttp.status);
    //             }
    //         }
    //     }
    //     var myjson = JSON.stringify(postData);
    //     alert(myjson);
    //     xhttp.send(myjson);
    // }
};

app.initialize();