var url="";
var model;
var request;
var planId;
var workPlan;
var result=false;
var first=false;

function LoadData(){
//creatMask();
 //if(!first) creatMask(); 
result = false;
    request.post('http://'+url+'/app/Indexapp!noticeList.action').success(function(data){
        if(data!=null&&data.length==0)
        {
        $("#no-data").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66'/><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关通知内容!</span></div>");
        }
        else
        {
          $("#no-data").html("");  
        }

        model.list=data;
       if(!first) removeMask();
       first=true;
       result=true;  
        }).error(function(data, status, headers, config){
         if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
         {
         //$("body").html("网络访问出错！");
         }
         });
};


(function(){
var app = angular.module('workPlan', [ ]);
app.controller('WorkPlanController',['$http','$window', function($http,$window){
workPlan=this;

model=workPlan;
bindEvent();
request=$http;

                                     
                                     
workPlan.gotodetail = function(id){
     var url = "notice_message.html?id="+id;
     openUrl(url,1);
}
                                     

}]);
})();

function addNativeOK(){
//url="oa.zhetian.net";
url=getPath();
LoadData();
}