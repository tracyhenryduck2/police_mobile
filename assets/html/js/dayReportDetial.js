(function(){
var app = angular.module('dayReport', [ ]);
app.controller('DayReportController',['$http','$window', function($http,$window){
creatMask();
var dayReport=this;
var url=getPath();
dayReport.pages=1;
$http.post('http://'+url+'/oa/App/AppProject!dayReportDetial.action?pages='+dayReport.pages+"&reportId="+GetQueryString("reportId")).success(function(data){
	if(data!=null&&data.isLogin==false)
	{
		$("body").html("登陆超时，请重新登陆！");
	}
	dayReport.list=data.list; 
	dayReport.note=data.note;
	removeMask();
}).error(function(data, status, headers, config){
	if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
	{
		$("body").html("网络访问出错！");
	}
});
$window.onscroll=function(){
      var scrollTop=$(this).scrollTop();
      var windowHeight = $(this).height();
      var scrollHeight =document.body.scrollHeight;
      if(scrollTop + windowHeight >= scrollHeight){
		dayReport.pages++;
		$http.post('http://'+url+'/oa/App/AppProject!dayReportDetial.action?pages='+dayReport.pages+"&reportId="+GetQueryString("reportId")).success(function(data){
		if(data!=null&&data.isLogin==false)
		{
			$("body").html("登陆超时，请重新登陆！");
		}
		dayReport.list=dayReport.list.concat(data.list);
		}).error(function(data, status, headers, config){
		if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
		{
			$("body").html("网络访问出错！");
		}
		});
	}
	};
}]);
})();



