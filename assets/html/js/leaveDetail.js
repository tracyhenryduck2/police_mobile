(function(){
	var app=angular.module('leave',[]);
	app.controller('LeaveController',['$http','$window',function($http,$window){
		creatMask();
		var leave=this;
		var url=getPath();
		$http.post('http://'+url+'/oa/App/AppAttence!detail.action?attenceWorkId='+GetQueryString("attenceWorkId")).success(function(data){
			//alert(data.in_address);
			if(data!=null&&data.isLogin==false){
				$("body").html("网络访问出错！");
			}
			leave.detail=data;
			leave.url=url;
		removeMask();
		}).error(function(data,status,headers,config){
			if((status>=200 && status<300)||status===304||status===1223||status===0){
				$("body").html("网络访问出错！");
			}
		});
	}]);
})();