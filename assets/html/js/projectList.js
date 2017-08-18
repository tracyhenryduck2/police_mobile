var url="";
var model;
var request;
var project;
var first=false;
var result=false;


(function(){
	var app = angular.module('project', [ ]);
	app.controller('ProjectController',['$http','$window', function($http,$window){
        project=this;
		url=getPath();
		//url="oa.zhetian.net";
		project.user=getUser();
		//project.user={id:1};
		project.pages=1;
		model=project;
		request=$http;
		LoadData();

		project.detial=function(id)
		{
            var url = "projectDetial.html?projectId="+id;
            openUrl(url,0);
		}
		project.edit = function(id){
            var url = "projectEdit.html?projectId="+id;
            openUrl(url,0);
		}
		$window.onscroll=function(){
            var scrollTop=$(this).scrollTop();
            var windowHeight = $(this).height();
            var scrollHeight =document.body.scrollHeight;
            if(scrollTop + windowHeight >= scrollHeight){
				project.pages++;
				$http.post('http://'+url+'/oa/App/AppProject!projectList.action?pages='+project.pages+"&userId="+project.user.id).success(function(data){
					project.list=project.list.concat(data);
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
   result=false;
   if(!first) creatMask();

        project.pages=1;
		request.post('http://'+url+'/oa/App/AppProject!projectList.action?pages='+"1"+"&userId="+model.user.id+"&time="+new Date().toTimeString()).success(function(data){
			if(data!=null&&data.length==0)
			{
				$("#refreshDiv").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66'/><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关项目内容!</span></div>");
                $("body").removeClass("liststyle");                                                                                                                                             
			}else $("body").addClass("liststyle");
			if(data!=null&&data.isLogin==false)
			{
				$("body").html("网络访问出错！");
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



