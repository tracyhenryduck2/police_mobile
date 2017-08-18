var url="";
var model;
var request;
var workPlan;
var result=false;
var first=false;
(function(){
	var app = angular.module('workPlan', [ ]);
	app.controller('WorkPlanController',['$http','$window', function($http,$window){
        workPlan=this;
		url=getPath();
		workPlan.user=getUser();
		workPlan.pages=1;
		model=workPlan;
		request=$http;
		LoadData();

		workPlan.detial=function(id)
		{
			if(isAndroid()==true)  client.open("workPlanDetial.html?workPlanId="+id,0);
		     else                  $window.location="workPlanDetial.html?workPlanId="+id;
		}
		$window.onscroll=function(){
             var scrollTop=$(this).scrollTop();
             var windowHeight = $(this).height();
             var scrollHeight =document.body.scrollHeight;
             if(scrollTop + windowHeight >= scrollHeight){
				workPlan.pages++;
				$http.post('http://'+url+'/oa/App/AppProject!completeWorkList.action?pages='+workPlan.pages+"&userId="+workPlan.user.id).success(function(data){
					workPlan.list=workPlan.list.concat(data);
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
	      result=false;
		  if(!first) creatMask();
        workPlan.pages=1;
		request.post('http://'+url+'/oa/App/AppProject!completeWorkList.action?pages='+"1"+"&userId="+model.user.id).success(function(data){
			if(data!=null&&data.length==0)
			{
				$("#refreshDiv").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66'/><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关工作内容!</span></div>");
            $("body").removeClass("liststyle");                                                                                                                
			} else $("body").addClass("liststyle");
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
		});
}



