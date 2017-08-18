var url="";
var model;
var request;
var dayReport;
var result=false;
var first=false;
(function(){
	var app = angular.module('dayReport', [ ]);
	app.controller('DayReportController',['$http','$window', function($http,$window){
		dayReport=this;
		url=getPath();
		dayReport.pages=1;
		model=dayReport;
		request=$http;
		LoadData();

		dayReport.detial=function(id)
		{
			if(isAndroid()){
				var url="workManage_dayReportDetail.html?reportId="+id;
				client.open(url,1);
			}else{
				$window.location="workManage_dayReportDetail.html?reportId="+id;
				}
		}
		$window.onscroll=function(){
              var scrollTop=$(this).scrollTop();
              var windowHeight = $(this).height();
              var scrollHeight =document.body.scrollHeight;
              if(scrollTop + windowHeight >= scrollHeight){
				dayReport.pages++;
				$http.post('http://'+url+'/oa/App/AppWorkManage!dayReportList.action?pages='+dayReport.pages+"&userId="+GetQueryString("userId")).success(function(data){
					if(data!=null&&data.isLogin==false)
					{
						$("body").html("登陆超时，请重新登陆！");
					}
					dayReport.list=dayReport.list.concat(data);
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

function LoadData(){
	if(!first) creatMask(); 
result = false;
    dayReport.pages=1;
		request.post('http://'+url+'/oa/App/AppWorkManage!dayReportList.action?pages='+"1"+"&userId="+GetQueryString("userId")).success(function(data){
			if(data!=null&&data.length==0)
			{
				$("#refreshDiv").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66' /><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关工作内容!</span></div>");
             $("body").removeClass("liststyle");
			}else $("body").addClass("liststyle");
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
		}) ;
}



