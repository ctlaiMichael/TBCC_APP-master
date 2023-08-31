// 沒做動畫 需要要改為setTimeOut
    var ringChart = function () { };

    ringChart.prototype={
        radians:function(degrees) {
            return degrees * Math.PI / 180;
        },
        degrees:function(radians) {
            return radians * 180 / Math.PI;
        },
        doRingChart:function(settingObj){
           
            // className:"circle01",
            // charTotalDegrees:360, //圖形總度數
            // chartType :ring || sector
            // percentage:63, //資料度數
            // radiusTimes:0.78, //
            // lineCapType:"round", //線條樣式
            // lineWidth:13, 
            // startPI:0.5 //開始畫圖位置
            // tolerance:0.02
            // settingObj.outsiteBox=null //最外層框
            
           

           	if(settingObj==null || typeof settingObj =="undefined"){
                //    console.log("a");
                return ;
            }else{
                //設定預設值與必要值判斷
               
            }
			//	var outerBox=document.getElementsByClassName(settingObj.className);
			var outerBox=settingObj.classObj;
			var canv = document.createElement('canvas');
			canv.id = settingObj.className;
			outerBox.appendChild(canv);
            c1=document.getElementById(settingObj.className);

            
			c1.width=outerBox.offsetWidth;
			c1.height=outerBox.offsetHeight; 
			c1.className ='setRingChartStyle';
			centerX=(c1.width/2);
			centerY=(c1.height/2);
			var ctx=c1.getContext("2d");
          

			totalDegrees=settingObj.charTotalDegrees; //圖形總度數
			percent=settingObj.percentage; //資料度數
			radius=settingObj.radiusTimes;
            realRadius=centerX*radius; //半徑 畫布寬度的百分之多少
          
			//	var outsiteBox=document.getElementsByClassName(settingObj.outerClassName);
			var outsiteBox=settingObj.outerClassObj;
            if(outsiteBox!=null && typeof outsiteBox=="object" ){
                if(outsiteBox.offsetHeight <= 580){
                    realRadius=centerX*0.65; //半徑 畫布寬度的百分之多少
                }
            }
            
			startPI=settingObj.startPI; //畫圖起始位置
            lineCapType=settingObj.lineCapType; // 線條樣式 round , butt 
            
			if(percent==100){
				lineCapType="square";
			}
			tolerance=(lineCapType=="butt")?0:settingObj.tolerance; //圓角顯示距離有誤差	
			startPostion=(startPI+tolerance); //起始點

			lineColor={
				S:100,
				L:45,
				H:140
			}
			//計算度數
		
			percentageEqualDeg=totalDegrees/100; //1% = 多少度
			percentageEqualPI=1/180; //1% = 多少PI
			endPostion=((percentageEqualDeg*percent)/180)+startPI-tolerance;
			
			ctx.lineWidth = settingObj.lineWidth; //線的粗度
			ctx.lineCap = lineCapType; // 圓角起始點要加0.02Math.PI 結束點要剪掉0.02Math.PI
			//畫圖的起始點 + 加上圓角誤差 * Math.PI; 
			colorS=lineColor.S;
			colorL=lineColor.L;
            colorH=lineColor.H;
            //畫圖
            startPoint=startPostion; //設定初始位置
			for(i=startPostion;i<=endPostion;i+=percentageEqualPI){
				ctx.beginPath();
				colorH=colorH+0.25;
				colorL=colorL+0.10;
				colorS=colorS-0.10;
				if(colorL>=75){
					colorL=75;
				}
				if(colorS<=50){
					colorS=50;
				}
				if(colorH>=190){
					colorH=190;
				}
				ctx.strokeStyle ="hsl("+colorH+", "+colorS+"%, "+colorL+"%)";				
                endPoint=i;
                if(endPoint>=endPostion){
                    endPoint=endPostion;
                }
				ctx.arc(centerX,centerY,realRadius,startPoint*Math.PI,endPoint*Math.PI);
				startPoint=endPoint;
				ctx.stroke();
			}
            
        },
        doSectorChart:function(settingObj){
            // className:"circle01",
            // charTotalDegrees:360, //圖形總度數
            // chartType :ring || sector
            // percentage:63, //資料度數
            // radiusTimes:0.78, //
            // lineCapType:"round", //線條樣式
            // lineWidth:13, 
            // startPI:0.5 //開始畫圖位置
            // tolerance:0.02
            // settingObj.outsiteBox=null //最外層框
			//	var outerBox=document.getElementsByClassName(settingObj.className);
			var outerBox=settingObj.classObj;
			var canv = document.createElement('canvas');
			canv.id = settingObj.className;
			
			outerBox.appendChild(canv);
			var img = document.createElement('img');
			img.className="circlePointer";
			img.src="./assets/images/point2.png";
			outerBox.appendChild(img);		

			var c1=document.getElementById(settingObj.className);
			c1.width=outerBox.offsetWidth;
			c1.height=outerBox.offsetHeight; 
			c1.className ='setRingChartStyle';
			centerX=(c1.width/2);
			centerY=(c1.height/2);
			
			totalDegrees=settingObj.charTotalDegrees; //圖形總度數
            percent=settingObj.percentage; //資料度數 //資料度數
            radius=settingObj.radiusTimes; //半徑 畫布寬度的百分之多少
            realRadius=centerX*radius; //半徑 畫布寬度的百分之多少
            startPI=settingObj.startPI; //畫圖起始位置
       
			percentageEqualDeg=totalDegrees/100; //1% = 多少度
            percentageEqualPI=1/180; //1% = 多少PI
            
			endPostion=((percentageEqualDeg*percent)/180)+startPI;
			//指針旋轉
			rotate=this.degrees((endPostion+0.5)*Math.PI); //deg 與 PI 起始點差0.5PI
			img.style.transform="rotate("+rotate+"deg)";

			//畫扇形區塊
			var ctx=c1.getContext("2d");
			ctx.beginPath();
			ctx.fillStyle="rgb(1, 231, 205)";
			ctx.globalAlpha=0.2;
			ctx.arc(centerX,centerY,realRadius,startPI*Math.PI,endPostion*Math.PI);
			ctx.lineTo(centerX,centerY)
			ctx.closePath();
			ctx.fill();
        }
    }
