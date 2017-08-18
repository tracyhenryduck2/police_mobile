(function(){
var app = angular.module('workPlan', [ ]);
app.controller('WorkPlanController',['$http','$window', function($http,$window){
creatMask();
var workPlan=this;
var url=getPath();
$http.post('http://'+url+'/oa/App/AppProject!workPlanDetial.action?workPlanId='+GetQueryString("workPlanId")).success(function(data){
if(data!=null&&data.isLogin==false)
		{
			$("body").html("登陆超时，请重新登陆！");
		}
	workPlan.detial=data; 
	removeMask();
}).error(function(data, status, headers, config){
		if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
		{
			$("body").html("网络访问出错！");
		}
		});
}]);
})();



