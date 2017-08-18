(function(){
	var app=angular.module('costApply',[]);
	app.controller('CostApplyController',['$http','$window',function($http,$window){
		creatMask();
		var costApply=this;
		var url=getPath();
		$http.post('http://'+url+'/oa/App/AppCostApply!detail.action?costApplyId='+GetQueryString("costApplyId")).success(function(data){
			//alert(data.in_address);
			if(data!=null&&data.isLogin==false){
				$("body").html("网络访问出错！");
			}
			costApply.detail=data;
			costApply.url=url;
		removeMask();
		}).error(function(data,status,headers,config){
			if((status>=200 && status<300)||status===304||status===1223||status===0){
				$("body").html("网络访问出错！");
			}
		});
	}]);
})();