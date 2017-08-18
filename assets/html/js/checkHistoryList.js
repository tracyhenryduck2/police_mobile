var url="";
var model;
var request;
var apply;
var result=false;
var first=false;
(function(){
var app = angular.module('apply', [ ]);
app.controller('ApplyController',['$http','$window','$scope', function($http,$window,$scope){
apply=this;
//url = "192.168.10.109:8080/police";
//url=getPath();
//apply.user=getUser();
//apply.user = {id:1};
       bindEvent();
apply.pages=1;
model=apply;
request=$http;
//LoadData();
apply.detial=function(id)
{
   var url = "applyDetial.html?applyId="+id+"&type=0";
        openUrl(url,1);
}

apply.copy=function(id){
          var url = "copyEdit.html?applyId="+id;
          openUrl(url,1);
}

apply.gotoChat=function(id,name,content,time,phone){
  client.openChat(id,name,content,time,phone);
}

apply.refresh=function(id,content,time){
	$scope.$apply(function(){
		for(var i=0;i<apply.list.length;i++)
		{
			if(apply.list[i].id==id){
			apply.list[i].is_read = 1;
			if(content!=null) apply.list[i].content2 = content;
			if(time!=null)    apply.list[i].reply_time = time;	
				break;
			}
		}
	});
}

setInterval(function(){
	LoadData();
},30000);


}]);
})();

function LoadData(){
	result=false;
	//if(!first) creatMask();
    apply.pages=1;
request.post('http://'+url+'/app/Indexapp!listapp.action?policeid='+model.user.id).success(function(data){
 if(data!=null&&data.length==0)
		{
			$("#refreshDiv").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66' /><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有留言内容!</span></div>");
          $("body").removeClass("liststyle");
		} else $("body").addClass("liststyle");
	model.list=data;
	console.log(data);
	//if(!first) removeMask(); 
	result=true;
	first=true;
}).error(function(data, status, headers, config){
		if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
		{
				$("body").html('</div><div class="db">网络请求失败</div><div class="dc">请检查您的网络<br>重新加载吧</div><div class="dd"><div class="newss22"><a onclick="reload()">重新加载</a></div></div>');
		}
		});
}

function MyResume(){
	var id = client.readNotGlobalInfo("read");
    if(id!=null){

    	client.saveNotGlobalInfo("read",null);
	    var time = client.readNotGlobalInfo("submit_time");
	    var content = client.readNotGlobalInfo("content");
	    if(time!=null&&content!=null){
	    	    	client.saveNotGlobalInfo("submit_time",null);
	    	    	client.saveNotGlobalInfo("content",null);
	    }
      apply.refresh(id,content,time);
    }


}

function addNativeOK(){
   url = getPath();
   model.user = getUser();
   LoadData();
}
