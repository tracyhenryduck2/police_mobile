var url="";
var model;
var request;
var result=false;
var first = false;
(function(){
   var app = angular.module("clientFeedbackList",[]);


  app.controller('clientFeedbackListController', ['$http','$window', function($http,$window){
      var FeedbackList = this;

      url=getPath();
      //url="oa.zhetian.net";
      FeedbackList.user=getUser();
      //FeedbackList.user={id:1};
      model=FeedbackList;
      request=$http;
      LoadData();
   

    /*配合angular框架ng-switch实现时间过滤，若处理时间为null，则可以不显示，若不处理，则会显示19700-1-1*/
   FeedbackList.status = function(deal_time){
       if(deal_time !="" && deal_time !=null)  return true;
      else return false;
   }
   
   FeedbackList.addlist = function(){

       openUrl("clientFeedBackEdit.html",0);
   }

  }])
})();

function LoadData(){
       result =false;
       if(!first) creatMask();
      request.post('http://'+url+'/oa/App/AppFeedBack!list.action?userId='+model.user.id).success(function(data){

      if(data!=null&&data.length==0){
     $("#no-data").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66'/><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关反馈内容!</span></div>"); 
       $("body").removeClass("liststyle");
      }
      else
     {
       $("#no-data").html("");
       $("body").addClass("liststyle");
     }
      if(data!=null&&data.isLogin==false){
        $("body").html("用户未登录!");
      }
      model.list = data; 
     if(!first) removeMask();
     result=true;
     first=true;
      }).error(function(data,status,header,config){

      if((status >=200 && status <300) || status == 304 || status == 1223 || status == 0)
      {
        $("body").html("网络访问出错！");
      }
      });
}