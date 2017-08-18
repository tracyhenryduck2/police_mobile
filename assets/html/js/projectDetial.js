(function(){
var app = angular.module('project', [ ]);
app.controller('ProjectController',['$http','$window', function($http,$window){
creatMask();
var project=this;
var url=getPath();
$http.post('http://'+url+'/oa/App/AppProject!projectDetial.action?projectId='+GetQueryString("projectId")).success(function(data){
	if(data!=null&&data.isLogin==false)
	{
		$("body").html("登陆超时，请重新登陆！");
	}
	project.detial=data;
	removeMask();
}).error(function(data, status, headers, config){
	if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
	{
		$("body").html("网络访问出错！");
	}
});
}]);
})();



