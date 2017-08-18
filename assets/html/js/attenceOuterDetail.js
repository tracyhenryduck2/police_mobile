//document.write(”<script language=javascript src=’http://api.map.baidu.com/api?v=2.0&ak=sgfz5jGjPEpKEvInYsfsenen’></script>”);
(function(){
	var app=angular.module('attenceOuter',[]);
	app.controller('AttenceOuterController',['$http','$window',function($http,$window){
		creatMask();
		var attenceOuter=this;
		var url=getPath();
		//var url="192.168.1.129:8080";
		$http.post('http://'+url+'/oa/App/AttenceOuter!attenceDetail.action?attenceOuterId='+GetQueryString("attenceOuterId")).success(function(data){
			//alert(data.in_address);
			if(data!=null&&data.isLogin==false){
				$window.location='to_login.html';
			}
			attenceOuter.detail=data;
			attenceOuter.url=url;
			// var outLat=data.out_lat;
			// var outLng=data.out_lng;
			var inLat=data.lat;
			var inLng=data.lng;
			var map = new BMap.Map("allmap");
			map.centerAndZoom(new BMap.Point(inLng, inLat), 14);
			var marker1 = new BMap.Marker(new BMap.Point(inLng, inLat));  // 创建标注
			map.addOverlay(marker1);              // 将标注添加到地图中
			// var map1=new BMap.Map("allmap1");
			// map1.centerAndZoom(new BMap.Point(outLng, outLat), 14);
			// var marker=new BMap.Marker(new BMap.Point(outLng, outLat));
			// map1.addOverlay(marker);
			removeMask();
		}).error(function(data,status,headers,config){
			if((status>=200 && status<300)||status===304||status===1223||status===0){
				$window.location='internet_error.html';
			}
		});
	}]);
})();