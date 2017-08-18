var url="";
var model;
var request;
var Copy;
var result=false;
var first=false;
(function(){
var app = angular.module('Copy', [ ]);
app.controller('CopyController',['$http','$window', function($http,$window){
Copy=this;
//url="pm.zhetian.net";
url=getPath();
//Copy.user={id:175};
Copy.user=getUser();
Copy.pages=1;
model=Copy;
request=$http;
LoadData();

Copy.detial=function(id)
{
   if(isAndroid()==true)   client.open("copyDetail.html?applyId="+id,0);
   else                 	$window.location="copyDetail.html?applyId="+id;
}
$window.onscroll=function(){
      var scrollTop=$(this).scrollTop();
      var windowHeight = $(this).height();
      var scrollHeight =document.body.scrollHeight;
      if(scrollTop + windowHeight >= scrollHeight){
		Copy.pages++;
		$http.post('http://'+url+'/oa/App/ApplyCopy!list.action?pages='+Copy.pages+"&userId="+Copy.user.id).success(function(data){
		Copy.list=Copy.list.concat(data);
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
    Copy.pages=1;
request.post('http://'+url+'/oa/App/ApplyCopy!list.action?pages='+"1"+"&userId="+model.user.id).success(function(data){
 if(data!=null&&data.length==0)
		{
			$("#refreshDiv").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66' /><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关抄送内容!</span></div>");
          $("body").removeClass("liststyle");
		} else $("body").addClass("liststyle");
		if(data!=null&&data.isLogin==false)
		{
			$("body").html("网络访问出错！");
		}
	model.list=data;
	console.log(data);
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


