/**
 * [Q&A Service]
 */
define([
	"app"
	,"data/qanda"
]
, function (MainApp,qandaData) {
//=====[qandaServices START] Q&A相關=====//
MainApp.register.service("qandaServices",function()
{
	var MainClass = this;
	this.getData = function()
	{
		var data = qandaData;
		return data;
	}
});
});