var url="";
var model;
var request;
var first=false;
var result=false;

(function(){
var app = angular.module('ProgressSummary', [ ]);


app.controller('ProgressSummaryController',['$http','$window', function($http,$window){
var ProgressSummary=this;
url=getPath();
//url="oa.zhetian.net";
model=ProgressSummary;
request=$http;
LoadData();


}]);
})();

function LoadData(){
	result=false;
if(!first) creatMask();
request.post('http://'+url+'/oa/App/AppDProject!progressSummary.action?ownershipId='+GetQueryString("ownershipId")+'&startTime='+GetQueryString("startTime")+'&endTime='+GetQueryString("endTime")).success(function(data){
if(data!=null&&data.length==0)
		{
			$("#refreshDiv").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' /><br/><span style='font-size:18px;color:rgb(141,141,141);'>没有相关任务内容！</span></div>");
               $("body").removeClass("liststyle");
            } else $("body").addClass("liststyle");
		if(data!=null&&data.isLogin==false)
		{
			$("body").html("登陆超时，请重新登陆！");
		}
	model.list=data; 
 if(!first) removeMask(); 
 first=true;
 result=true;
}).error(function(data, status, headers, config){
		if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
		{
			$("body").html("网络访问出错！");
		}
		});

}



