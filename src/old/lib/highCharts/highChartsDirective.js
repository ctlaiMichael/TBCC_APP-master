angular.module('highCharts', [])
	.directive('chart', function (i18n, $log) {
		return {
			restrict: 'A',
			link: function (scope, elem) {
				scope.$watch('data', function (data) {
                    Highcharts.setOptions({
                        global: {
                            useUTC: false
                        },
                        lang:{
                            decimalPoint:".",
                            loading:"LOADING...",
                            months:[i18n.getStringByTag('JAN'),i18n.getStringByTag('FEB'),
								i18n.getStringByTag('MAR'),i18n.getStringByTag('APR'),
								i18n.getStringByTag('MAY'),i18n.getStringByTag('JUN'),
								i18n.getStringByTag('JUL'),i18n.getStringByTag('AUG'),
								i18n.getStringByTag('SEP'),i18n.getStringByTag('OCT'),
								i18n.getStringByTag('NOV'),i18n.getStringByTag('DEC')],
                            noData:"no data",
                            shortMonths: [i18n.getStringByTag('JAN_S'),i18n.getStringByTag('FEB_S'),
								i18n.getStringByTag('MAR_S'),i18n.getStringByTag('APR_S'),
								i18n.getStringByTag('MAY_S'),i18n.getStringByTag('JUN_S'),
								i18n.getStringByTag('JUL_S'),i18n.getStringByTag('AUG_S'),
								i18n.getStringByTag('SEP_S'),i18n.getStringByTag('OCT_S'),
								i18n.getStringByTag('NOV_S'),i18n.getStringByTag('DEC_S')],
                            thousandsSep:","
                            // weekdays: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六","星期天"]
                        }
                    });

					if (data) {
						// elem.highcharts({
						Highcharts.chart(elem[0],{
							chart: {
								zoomType: 'x',
								marginLeft: 50
								// renderTo: elem
							},
							title: {
								// text: 'USD to EUR exchange rate over time'
                                text: data.title,
								style:{
									"fontSize":"1.2em"
								}
							},
							subtitle: {
								// text: document.ontouchstart === undefined ?
								// 	'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
								// text: data.subTitle
							},
							xAxis: {
                                dateTimeLabelFormats: {
                                    // year: '%Y',
                                    month: '%Y/%m',
                                    day: '%Y/%m/%d',
                                    week:'%m/%d'

                                },
                                type: 'datetime',
								labels:{
									formatter:function(){
										return '';
									}
								},
								title:{
									text:data.subTitle,
									margin:15
								}

							},
							yAxis: {
                                title: {
                                    text: '',
                                    // text: i18n.getStringByTag('CURRENT_BYE')
                                    x:-15
                                    // x:0
                                },
								labels:{
									formatter: function() {
										if(this.value>10){
											return this.value.toFixed(3);
										}
										return this.value.toFixed(4);
									},
									x:0
								}
								// tickInterval: 0.2
							},

							legend: {
								enabled: false
							},
							plotOptions: {
								area: {
									fillColor: {
										linearGradient: {
											x1: 0,
											y1: 0,
											x2: 0,
											y2: 1
										},
										stops: [
											[0, Highcharts.getOptions().colors[0]],
											[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
										]
									},
									marker: {
										radius: 2
									},
									lineWidth: 1,
									states: {
										hover: {
											lineWidth: 1
										}
									},
									threshold: null
								}
							},
							series: [{
								type: 'area',
								name: i18n.getStringByTag('EX_PRICE'),
								data: data.data
							}],
							tooltip: {  // 表示為 鼠標放在報表圖中數據點上顯示的數據信息
								formatter: function() {
									return Highcharts.dateFormat('%Y/%m/%d', this.x)+'<br/>'
										+ this.series.name +' : <b>'+ this.y+'</b>';
								}
							}
						});
					}
				});
			}
		};
	});
