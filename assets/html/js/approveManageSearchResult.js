var url="";
var model;
var request;
var result=false;
var first=false;
(function(){
var app = angular.module('ApproveManageSearchResult', []);

app.controller('ApproveManageSearchResultController',['$http','$window', function($http,$window){
var ApproveManageSearchResult=this;
url=getPath();
//url="192.168.1.129:8080";
//ApproveManageSearchResult.user=getUser();
model=ApproveManageSearchResult;
request=$http;
LoadData();

ApproveManageSearchResult.detial=function(id){
  openUrl("applyDetial.html?applyId="+id+"&type=0",1); 
}
		$window.onscroll=function(){


              var scrollTop=$(this).scrollTop();
              var windowHeight = $(this).height();
              var scrollHeight =document.body.scrollHeight;
              if(scrollTop + windowHeight >= scrollHeight){
				model.pages++;

              $http.post('http://'+url+'/oa/App/Apply!getApplyList.action?pages='+model.pages+'&unitId='+GetQueryString("unitId")+'&userId='+GetQueryString("userId")+'&startTime='+GetQueryString("startTime")+'&endTime='+GetQueryString("endTime")+'&typeId='+GetQueryString("typeId")).success(function(data){
              model.list=model.list.concat(data);
            }).error(function(data, status, headers, config){
              if(( status>= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
              {
                $("body").html("网络访问出错！");
              }
            });
			}
		};

}]);
})();

function LoadData(){
  result= false;
  if(!first) creatMask();
  model.pages=1;
request.post('http://'+url+'/oa/App/Apply!getApplyList.action?pages=1&unitId='+GetQueryString("unitId")+'&userId='+GetQueryString("userId")+'&startTime='+GetQueryString("startTime")+'&endTime='+GetQueryString("endTime")+'&typeId='+GetQueryString("typeId")).success(function(data){
if(data!=null&&data.length==0)
	{
		$("#refreshDiv").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66'/><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关审批内容！</span></div>");
           $("body").removeClass("liststyle");
    } else $("body").addClass("liststyle");
	if(data!=null&&data.isLogin==false)
	{
		$("body").html("登陆超时，请重新登陆！");
	}
	  model.list=data; 
     if(!first)	 removeMask();
     first=true;
     result=true;
}).error(function(data, status, headers, config){
		if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
		{
			$("body").html("网络访问出错！");
		}
		});

}



