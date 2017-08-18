var url="";
var model;
var request;
var notice ;
var result=false;
var first=false;

(function(){
	var app = angular.module('notice', [ ]);
	app.controller('NoticeController',['$http','$window', function($http,$window){
		notice=this;
		url=getPath();
		notice.user=getUser();
		notice.branch=getBranch();
		// url="oa.zhetian.net";
		// notice.user={id:1};
        // notice.branch={deptId:1};
		model=notice;
		request=$http;
		LoadData();

		notice.detial=function(id)
		{
          var url = "notice_message.html?id="+id;
          openUrl(url,0);
		}

	}]);
})();

function LoadData(){
         result =false;
		 if(!first)  creatMask();
		request.post("http://"+url+"/oa/App/ShowNotice!getNoticeList.action?deptId="+notice.branch.deptId).success(function(data){
			if(data!=null&&data.length==0)
			{
			  $("#refreshDiv").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66'/><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关日报内容!</span></div>");
              $("body").removeClass("liststyle");                                                                                                                                               
			}else $("body").addClass("liststyle");
			if(data!=null&&data.isLogin==false)
			{
				$("body").html("登陆超时，请重新登陆！");
			}
			model.list=data.noticeList; 
			console.log(data);
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

