(function(){
	var app=angular.module('dayReport',[]);
	app.controller('DayReportController',['$http','$window',function($http,$window){
		creatMask();
		var dayReport=this;
		var url=getPath();
		$http.post('http://'+url+'/oa/App/AppWorkManage!dayReportDetial.action?reportId='+GetQueryString("reportId")).success(function(data){
			//alert(data.in_address);
			if(data!=null&&data.isLogin==false){
				 $("body").html("登陆超时，请重新登陆！");
			}
			removeMask();
			dayReport.taskReport=data.taskReport;
			dayReport.mapper=data.mapper;
			dayReport.bean=data.bean;
			dayReport.list=data.list;
			dayReport.attenceLogList=data.attenceLogList;
			dayReport.url="http://"+url+"/upload/"+dayReport.mapper.in_pic;
			dayReport.url1="http://"+url+"/upload/"+dayReport.mapper.out_pic;
			var outLat=data.mapper.out_lat;
			var outLng=data.mapper.out_lng;
			var inLat=data.mapper.in_lat;
			var inLng=data.mapper.in_lng;
			var map = new BMap.Map("allmap");
			map.centerAndZoom(new BMap.Point(inLng, inLat), 14);
			var marker1 = new BMap.Marker(new BMap.Point(inLng, inLat));  // 创建标注
			map.addOverlay(marker1);              // 将标注添加到地图中
			var map1=new BMap.Map("allmap1");
			map1.centerAndZoom(new BMap.Point(outLng, outLat), 14);
			var marker=new BMap.Marker(new BMap.Point(outLng, outLat));
			map1.addOverlay(marker);
		}).error(function(data,status,headers,config){
			if((status>=200 && status<300)||status===304||status===1223||status===0){
				$("body").html("网络访问出错！");
			}
		});
	}]);
})();