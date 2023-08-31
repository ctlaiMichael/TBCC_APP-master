
var CanvasChartClass = function (optionData, do_type) {
	this.chartData = {
		data: {
			type: 'line',
			legend: [],
			xLabel: [],
			series: []
		},
		type: {}
	};

	this.init(optionData, do_type);
}
CanvasChartClass.prototype.boxList = {};
/**
 * default 執行
 **/
CanvasChartClass.prototype.init = function (optionData, do_type) {


	if (typeof do_type === 'undefined') {
		do_type = 'create';
	}
	// console.error('make chart:', do_type, optionData);
	if (typeof optionData === 'object' && $(optionData).length > 0) {
		if (do_type === 'set') {
			this.setChartDataType(optionData); //手動create
		} else {
			this.createCanvasChart(optionData);
		}
	}
};
/**
 * 檢查資料類型
 **/
CanvasChartClass.prototype.checkDataType = function () {
	var type_name = "";
	this.data_type = {};
	for (key in this.chartData.data) {
		type_name = typeof (this.chartData.data[key]);
		if (type_name === 'object' && Object.prototype.toString.call(this.chartData.data[key]) === '[object Array]') {
			type_name = 'array';
		}
		this.chartData.type[key] = type_name;
	}
};
/**
 * 設定chartData
 **/
CanvasChartClass.prototype.setChartDataType = function (set_data) {
	if (typeof set_data !== 'object') {
		return false;
	}
	$.extend(this.chartData.data, set_data);
	this.checkDataType();
};
/**
 * 設定chartData value
 **/
CanvasChartClass.prototype.setChartData = function (set_data) {
	var data_type = this.chartData.type;
	for (key in set_data) {
		if (typeof data_type[key] === 'undefined') {
			continue;
		}
		switch (data_type[key]) {
			case 'array':
				if (typeof set_data[key] === 'object') {
					this.chartData.data[key] = set_data[key];
				} else {
					this.chartData.data[key].push(set_data[key]);
				}
				break;
			case 'object':
				$.extend(this.chartData.data[key], set_data[key]);
				break;
			default:
				this.chartData.data[key] = set_data[key];
				break;
		}
	}
};
/**
 * 設定chartData value
 **/
CanvasChartClass.prototype.getChartData = function (key) {
	if (typeof this.chartData.data[key] !== 'undefined') {
		return this.chartData.data[key];
	} else {
		return undefined;
	}
};
/**
 * 製作canvas
 **/
CanvasChartClass.prototype.createCanvasChart = function (optionData, pageType) {
	var classObj = this;
	if (typeof pageType === 'undefined') {
		pageType = '';
	}
	var _isIpad = false;
	if ($(window).width()  >= 768 ) {
		_isIpad = true;
	}

	// if (typeof optionData["width"] === 'undefined' || !optionData["width"]) {
	// 	optionData["width"] = ($('#' + optionData.targetId).parent().length > 0) 
	// 							? $('#' + optionData.targetId).parent().width() : $(window).width();
	// }
	// if (typeof optionData["height"] === 'undefined' || !optionData["height"]) {
	// 	optionData["height"] = ($('#' + optionData.targetId).parent().length > 0)
	// 							? $('#' + optionData.targetId).parent().height() : $(window).height();
	// }
	// if (typeof (optionData["width"]) != 'undefined' && typeof (optionData["height"]) != 'undefined') {
	// 	// console.log('width:' + optionData["width"] + 'px;height:' + optionData["height"] + 'px');
	// 	$('#' + optionData.targetId).attr('style', 'width:' + optionData["width"] + 'px;height:' + optionData["height"] + 'px');
	// }

	var doEvent = false;
	//==event==//
	if (typeof optionData.event === 'object') {
		doEvent = optionData.event;
	}

	/**
	 * 預設的樣式顏色
	 **/
	var _styleList = [{
		lineStyle: {
			color: '#C73046'
		},
		itemStyle: {
			color: '#C73046'//'#FF5809'
		}
	}, {
		lineStyle: {
			color: '#5C86B8'
		},
		itemStyle: {
			color: '#5C86B8'// '#005AB5'
		}
	}];
	/**
	 * echart position 處理
	 **/
	function _echartPosition(point, params, dom) {
		if ($('#' + optionData.targetId).length !== 1) {
			return;
		}
		var result = [];
		var canvas_size = [$('#' + optionData.targetId).width(),
		$('#' + optionData.targetId).height()];
		var item_size = [$(dom).width(), $(dom).height()];

		if ((point[0] + item_size[0]) >= canvas_size[0]) {
			result[0] = canvas_size[0] - item_size[0] - 30;
		}
		if ((point[1] + item_size[1]) >= canvas_size[1]) {
			result[1] = canvas_size[1] - item_size[1] - 30;
		}
		if (result.length > 0) {
			for (var i = 0; i < 2; i++) {
				if (typeof result[i] === 'undefined') {
					result[i] = canvas_size[i] / 2;
				}
			}
			return result;
		}
		return;
	}
	/**
	 * echart axis label 處理
	 **/
	function _echartAxisLabel(count, show_number) {

		if (!count) {
			return 'auto';
		}
		if (typeof type === 'undefined') {
			type = 'date';
		}
		var interval = Math.round(count / show_number);

		return function (i, val, k) {
			var number = i + 1;

			if (number === 1 || number === count) {
				return true;
			}
			if (number % interval === 0) {
				return true;
				//return ((count - number) >= interval) ? true : false;
			}
		}
	}

	/**
	 * 檢查 optionData
	 **/
	function check_option() {
		// console.error('check_option', optionData,
		// 	typeof optionData.targetId !== 'string',
		// 	$('#' + optionData.targetId).length !== 1,
		// 	optionData.targetId,
		// 	$('#' + optionData.targetId).length
		// );
		if (typeof optionData.targetId !== 'string'
			|| $('#' + optionData.targetId).length !== 1) {
			//miss object
			return false;
		}
		// if(typeof classObj.boxList[optionData.targetId] === 'undefined'){
		// 	classObj.boxList[optionData.targetId] = {
		// 		'type' : false,
		// 		'obj' : {}
		// 	};
		// }
		classObj.boxList[optionData.targetId] = {
			'type': false,
			'obj': {}
		};
		// console.error('check_option end', optionData);
		return optionData.targetId;
	}
	/**
	 * 設定 canvasOption
	 * return canvasOption
	 **/
	function get_option() {
		// console.error('Chart get_option', optionData);

		if (typeof optionData.legend !== 'object'
			|| typeof optionData.series !== 'object') {
			return false;
		}
		//==default set==//
		var canvasOption = {
			//==[其他設定]==//
			backgroundColor: '#FFF', //背景色(ord: #F8F8D8)
			//==[整體字型]==//
			textStyle: {
				// fontFamily : '微軟正黑體'
			},
			//==[提示框]==//
			tooltip: {
				trigger: 'axis',
				position: _echartPosition
			},
			toolbox: {
				show: false
			},
			//==[座標]==//
			grid: {
				show: true, //網格
				top: '10%',
				left: '10%',
				right: '12%',
				bottom: '10%',
				containLabel: true
			},
			//==[標題]==//
			title: {
				text: '',
				subtext: '',
				x: 'center',
				y: 0
			},
			//==[數據說明]==//
			legend: {
				data: [],
				x: 'center',
				y: 'bottom'
			},
			xAxis: [],
			yAxis: [],
			series: []
		};
		//==guid==//
		if (typeof optionData.grid === 'object') {
			$.extend(canvasOption.grid, optionData.grid);
		}
		//==title==//
		if (typeof optionData.title === 'string') {
			canvasOption.title.text = optionData.title;
		}
		if (typeof optionData.subtitle === 'string') {
			canvasOption.title.subtext = optionData.subtext;
		}
		//==color==//
		if (typeof optionData.color === 'object') {
			canvasOption.color = optionData.color;
		}
		canvasOption.legend.data = optionData.legend;

		/* 如果以後有其他的圖例，可以用下列方式擴充*/
		// console.error("optionData", optionData.type);

		switch (optionData.type) {
			case 'pie': //線圖
				canvasOption = makePieChart(canvasOption);
				break;
			case 'line': //線圖
			default:
				canvasOption = makeLineChart(canvasOption, optionData.xAxis.padding);
				break;
		}

		return canvasOption;
	}
	/**
	 * 設定 pie 的 option
	 **/
	function makePieChart(canvasOption) {
		// console.error('set pipe:', canvasOption);
		delete canvasOption['grid']; // 無座標
		// == 其他設定 == //
		var otherSet = (typeof optionData.otherSet === 'object')? optionData.otherSet : {};
		// == 標題處理 == //
		$.extend(canvasOption['title'], {
			x: 'center',
			y: 'center',
			textStyle: {
				fontSize: '22',
				fontWeight: 'bold'
			}
		});
		//==[series]==//
		canvasOption.series = [];
		var tmp_index = -1;
		var default_font_color = '';
		for (tkey in optionData.series) {
			if (typeof optionData.series[tkey] !== 'object') {
				continue;
			}
			tmp_index++;
			var tmp_data = {
				type: 'pie',
				name: '',
				data: optionData.series[tkey]['data'],
				// == 特殊設定 == //
				clockwise: true, // 順時針排序data
				hoverAnimation: false, // 滑入動畫效果
				avoidLabelOverlap: true, // 是否启用防止标签重叠策略 (true疑似少資料)
				stillShowZeroSum: true, // 是否在数据和为0（一般情况下所有数据为0） 的时候不显示扇区。
				// == 樣式設定 == //
				minAngle: 10, // 最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互。
				radius: ['35%', '70%'],
				// radius: ['45%', '80%'],
				center: ['50%', '50%'],
				label: {
					normal: {
						show: true,
						align: 'center',
						formatter: '{title|{b}}' + '\n' + '{percent|{d}}%',
						textStyle: {
							fontSize: '12'
						},
						rich: {
							title: {
								lineHeight: 13,
								align: 'center'
							},
							percent: {
								align: 'center'
							}
						}
					},
					// == label滑入效果(手機為點擊) == //
					// emphasis: {
					// 	show: true,
					// 	textStyle: {
					// 		fontSize: '15',
					// 		fontWeight: 'bold'
					// 	}
					// }
				},
				labelLine: {
					normal: {
						show: false,
						length: 7,
						length2: 5
					}
				}
			};
			if (_isIpad) {
				tmp_data.label['normal']['fontSize'] = '22';
				$.extend(tmp_data.label['normal']['textStyle'], {
					fontSize: '22'
				});
				$.extend(tmp_data.label['normal']['rich'], {
					title: {
						fontSize: '22',
						lineHeight: 25,
						align: 'center'
					},
					percent: {
						fontSize: '22',
						align: 'center'
					}
				});
				$.extend(tmp_data.labelLine['normal'], {
					length: 10,
					length2: 5
				});
			}
			// console.log('show set:', tmp_data);
			// == label == //
			if (typeof optionData.series[tkey]['label'] === 'object') {
				$.extend(tmp_data.label, optionData.series[tkey]['label']);
			}
			// == 其他設定 == //
			if (typeof otherSet.series !== 'undefined' && typeof otherSet.series[tkey] === 'object') {
				$.extend(tmp_data, otherSet.series[tkey]);
			}
			if (typeof otherSet.default_font_color !== 'undefined' && otherSet.default_font_color) {
				default_font_color = (typeof otherSet.default_font_color === 'string') 
										? otherSet.default_font_color : '#3d4953';
			}
			if (typeof otherSet.radius !== 'undefined' && otherSet.radius) {
				tmp_data.radius = otherSet.radius;
			}
			if (default_font_color) {
				tmp_data['label']['normal']['color'] = default_font_color;
				tmp_data['label']['normal']['textStyle']['color'] = default_font_color;
				// tmp_data['labelLine']['normal']['lineStyle']['color'] = default_font_color;
				if (typeof tmp_data['label']['normal']['rich']['title'] !== 'undefined') {
					tmp_data['label']['normal']['rich']['title']['color'] = default_font_color;
				}
				if (typeof tmp_data['label']['normal']['rich']['percent'] !== 'undefined') {
					tmp_data['label']['normal']['rich']['percent']['color'] = default_font_color;
				}
			}
			// == 樣式處理 == //
			// var style_index = tmp_index % _styleList.length;
			// var tmp_style = (typeof _styleList[style_index] != 'undefined') ? _styleList[style_index]
			// 	: _styleList[0];
			// if (typeof optionData.styleSet != 'undefined'
			// 	&& typeof optionData.styleSet[style_index] != 'undefined') {
			// 	$.extend(tmp_style, optionData.styleSet[style_index]);
			// }
			// $.extend(tmp_data.itemStyle.normal, tmp_style['itemStyle']);

			canvasOption.series.push(tmp_data);
		}

		return canvasOption;
	}


	/**
	 * 設定 Line 的 option
	 **/
	function makeLineChart(canvasOption, paddingVal) {
		//==[X Axis]==//
		var xSet = {
			name: '',
			type: 'category',
			nameLocation: 'middle',
			position: 'bottom',
			boundaryGap: false,
			nameGap: 45,
			nameTextStyle: {
				fontWeight: 'bold',
				fontSize: 12,
				padding: [paddingVal[0], 0, 0, paddingVal[3]],

			},
			inverse: false,
			axisLabel: {
				show: true,
				rotate: 30,
				textStyle: {
					fontSize: 12,

				},
				interval: 0
			},
			data: []
		};
		//==label color==//
		var i = -1;
		xSet.axisLabel.textStyle.color = function () {
			i++;
			return (i % 2 === 0) ? '#333' : '#666';
		}
		delete i;

		if (typeof optionData.xAxis === 'object') {
			$.extend(xSet, optionData.xAxis);
			if (xSet.data[xSet.data.length - 1] === "") {
				xSet.data.splice(-1, 1);
			}
			//==label interval==//
			var x_length = xSet.data.length;
			if (x_length > 3
				&& (typeof optionData.xAxis.axisLabel === 'undefined' || typeof optionData.xAxis.axisLabel.interval === 'undefined')
			) {
				xSet.axisLabel.interval = _echartAxisLabel(x_length, 2);
			}
			if (typeof optionData.xAxis.label_type !== 'undefined' && optionData.xAxis.label_type === 'time') {
				//==label formatter==//
				xSet.axisLabel.formatter = function (value, index) {
					if (typeof value === 'string') {
						value = value.replace(/\-/g, '/');
					}
					var date = new Date(value);
					if (date === 'Invalid Date' || !date.getTime()) {
						return value;
					}
					// 					if (index === 0) {
					// 						return value;
					// 					}
					var HH = date.getHours();
					if (HH < 10) {
						HH = "0" + HH;
					}
					var mm = date.getMinutes();
					if (mm < 10) {
						mm = "0" + mm;
					}
					var ss = date.getSeconds();
					if (ss < 10) {
						ss = "0" + ss;
					}
					//var texts = [ HH, mm, ss ];
					var texts = [HH, mm];
					return texts.join(':');
				}
				xSet.axisLabel.rotate = 0;//final set
			}
			if (typeof optionData.xAxis.label_type !== 'undefined' && optionData.xAxis.label_type === 'date') {

				xSet.axisLabel.formatter = function (value, index) {
					if (typeof value === 'string') {
						value = value.replace(/\-/g, '/');
					}
					var date = new Date(value);
					if (date === 'Invalid Date' || !date.getTime()) {
						return value;
					}
					var YYYY = date.getFullYear();
					var MM = (date.getMonth() + 1);
					if (MM < 10) {
						MM = "0" + MM;
					}
					var DD = date.getDate();
					if (DD < 10) {
						DD = "0" + DD;
					}
					var texts = [YYYY, MM, DD];
					return texts.join('/');
				}
				xSet.axisLabel.rotate = 0;
			}
		}
		//==[Y Axis]==//
		var ySet = {
			name: '',
			type: 'value',
			nameLocation: 'middle',
			position: 'left',
			nameRotate: 90,
			nameGap: 38,
			nameTextStyle: {
				fontWeight: 'bold',
				fontSize: 12
			},
			scale: true,
			axisLabel: {
				formatter: function (value) {
					if (typeof value !== 'string') {
						value = value.toString();
					}
					var dig = getDecimalPlaces(value);
					return value + getStrPad(4, dig);
				}
			}
		};
		if (typeof optionData.yAxis === 'object') {
			$.extend(ySet, optionData.yAxis);
		}
		canvasOption.xAxis = [xSet];
		canvasOption.yAxis = [ySet];
		//==[series]==//
		canvasOption.series = [];
		for (tkey in optionData.legend) {
			if (typeof optionData.series[tkey] !== 'object') {
				continue;
			}
			var tmp_data = {
				type: 'line',
				name: optionData.legend[tkey],
				data: optionData.series[tkey]['data'],
				//clipOverflow : false,
				//==(線設定)==//
				lineStyle: {
					normal: {
						width: 3
					}
				},
				//==(點設定)==//
				itemStyle: {
					normal: {}
				},
				//==(點文字)==//
				// label : { emphasis:{show:true, position:[10,50], textStyle:{fontSize:20 } } }, 
				// areaStyle: {normal: {}},
				//==特殊線(平均值線)== start//
				// markLine: {
				// 	lineStyle: {
				// 		normal: {
				// 			opacity: 0.5
				// 		}
				// 	},
				// 	precision: 2,
				// 	data: [{
				// 		type: 'average',
				// 		name: '平均值',
				// 		symbolSize: 1,
				// 		label: {
				// 			normal: {
				// 				show: false,
				// 				position: 'end'
				// 			}
				// 		}
				// 	}]
				// }
				//==特殊線(平均值線)== end//
			};
			var tmp_style = (typeof _styleList[tkey] != 'undefined') ? _styleList[tkey]
				: _styleList[0];
			if (typeof optionData.styleSet != 'undefined'
				&& typeof optionData.styleSet[tkey] != 'undefined') {
				$.extend(tmp_style, optionData.styleSet[tkey]);
			}
			$.extend(tmp_data.lineStyle.normal, tmp_style['lineStyle']);
			$.extend(tmp_data.itemStyle.normal, tmp_style['itemStyle']);
			if (typeof optionData.otherSet === 'object') {
				if (typeof optionData.otherSet.markLine != 'undefined'
					&& !optionData.otherSet.markLine) {
					//==特殊線 close==//
					tmp_data.markLine = {};
				}
				if (typeof optionData.otherSet.markPoint != 'undefined'
					&& optionData.otherSet.markPoint) {
					//==(特殊標記)==//
					tmp_data.markPoint = {
						symbol: 'pin',
						// symbolSize : 30,
						symbolOffset: [0, 0],
						symbolRotate: 75,
						itemStyle: {
							normal: {
								opacity: 0.5
							}
						},
						data: [{
							type: 'max',
							name: '最大值'
						}, {
							type: 'min',
							name: '最小值'
						}]
					};
				}
			} //end otherSet
			canvasOption.series.push(tmp_data);
		} //end for
		
		//其他設定
		var otherSet = (typeof optionData.otherSet === 'object')? optionData.otherSet : {};
		if (typeof otherSet.legend !== 'undefined' && typeof otherSet.legend === 'object') {
			$.extend(canvasOption.legend, otherSet.legend);
		}
		
		return canvasOption;
	}
	// console.error('Chart check_option');
	//--makeLine end--//
	if (!(objId = check_option())) {
		return false;
	}
	if (!(canvas_option = get_option())) {
		return false;
	}

	//==Strat Create==//
	if (!classObj.boxList[objId]['type']) {
		var element = document.getElementById(objId);
		//Chart Size reset
		var carvas_size = {};
		if (typeof optionData.otherSet === 'object' && typeof optionData.otherSet['sizeAllowBox'] !== 'undefined'
			&& $('#' + objId).closest(optionData.otherSet['sizeAllowBox']).length > 0
		) {
			var tmp_box_obj = $('#' + objId).closest(optionData.otherSet['sizeAllowBox']);
			optionData["width"] = tmp_box_obj.width();
			optionData["height"] = tmp_box_obj.height();
		}

		if (typeof (optionData["width"]) != 'undefined' && optionData["width"]
			&& typeof (optionData["height"]) != 'undefined' &&　optionData["height"]
		) {
			element.style.width = optionData["width"] + 'px';
			element.style.height = optionData["height"] + 'px';
		} else {
			var screen_w = $(window).width();
			element.style.width = screen_w + 'px';
			element.style.height = (Math.round(screen_w * 0.85) + 50) + 'px';
			carvas_size = { height: (Math.round(screen_w * 0.85) - 50) }
		};
		var myChart = echarts.init(element, carvas_size);
		myChart.setOption(canvas_option);
		classObj.boxList[objId]['obj'] = myChart;
		classObj.boxList[objId]['type'] = true;

		// console.log('doEvent:', doEvent);
		// == event == //
		if (typeof doEvent === 'object') {
			var tmp_key;
			for (tmp_key in doEvent) {
				if (typeof doEvent['click'] === 'function') {
					// == click event == //
					// console.log('doEvent is click:', doEvent['click']);
					myChart.on('click', doEvent['click']);
				}
			}
		}

	} else {
		classObj.boxList[objId]['obj'].setOption(canvas_option);
	}

};
function getDecimalPlaces(val) {
	var dig = 0;
	var pos = val.indexOf(".");
	if (pos != -1) {
		pos++;
		dig = val.substring(pos).length;
	}
	return dig;
}
/**
 * dig: 指定小數位數
 * diff: 目前存在的小數位數
 */
function getStrPad(dig, diff) {
	// console.log('getStrPad dig, diff',dig, diff);
	var prefix = "";
	if (diff == 0) {
		prefix = ".";
		return prefix + "0000000000".substring(0, dig);
	} else {
		return "0000000000".substring(0, dig - diff);
	}
}
