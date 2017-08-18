var url="";
var model;
var request;
var dayReport ;
var result=false;
var first=false;

(function(){
	var app = angular.module('dayReport', [ ]);
	app.controller('DayReportController',['$http','$window', function($http,$window){
		dayReport=this;
		url=getPath();
		dayReport.user=getUser();
		dayReport.pages=1;
		model=dayReport;
		request=$http;
		LoadData();

		dayReport.detial=function(id)
		{
          var url = "dayReportDetial.html?reportId="+id;
          openUrl(url,0);
		}
		dayReport.edit=function(date)
		{
          var url = "dayReportEdit.html?date="+date;
          openUrl(url,0);
		}
		$window.onscroll=function(){
              var scrollTop=$(this).scrollTop();
              var windowHeight = $(this).height();
              var scrollHeight =document.body.scrollHeight;
                                        
              if(scrollTop + windowHeight >= scrollHeight){
				dayReport.pages++;
        
				$http.post('http://'+url+'/oa/App/AppProject!dayReportList.action?pages='+dayReport.pages+"&userId="+dayReport.user.id).success(function(data){
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
        dayReport.pages = 1;
         result =false;
		 if(!first)  creatMask();
		request.post('http://'+url+'/oa/App/AppProject!dayReportList.action?pages='+"1"+"&userId="+model.user.id+"&time="+new Date().toTimeString()).success(function(data){
			if(data!=null&&data.length==0)
			{
				$("#refreshDiv").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66'/><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关日报内容!</span></div>");
              $("body").removeClass("liststyle");                                                                                                                                               
			}else $("body").addClass("liststyle");
			if(data!=null&&data.isLogin==false)
			{
				$("body").html("登陆超时，请重新登陆！");
			}
			model.list=data; 
			 if(!first) removeMask();
			 result=true;
			 first=true;
		}).error(function(data, status, headers, config){
			if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
			{
				$("body").html("网络访问出错！");
			}
		}) ;
}

