(function(){
	var app=angular.module('businessTrip',[]);
	app.controller('BusinessTripController',['$http','$window',function($http,$window){
		creatMask();
		var businessTrip=this;
		var url=getPath();
		$http.post('http://'+url+'/oa/App/BusinessTrip!detail.action?businessTripId='+GetQueryString("businessTripId")).success(function(data){
			//alert(data.in_address);
			if(data!=null&&data.isLogin==false){
				$("body").html("网络访问出错！");
			}
			businessTrip.detail=data;
			businessTrip.url=url;
			removeMask();
		}).error(function(data,status,headers,config){
			if((status>=200 && status<300)||status===304||status===1223||status===0){
				$("body").html("网络访问出错！");
			}
		});
	}]);
})();