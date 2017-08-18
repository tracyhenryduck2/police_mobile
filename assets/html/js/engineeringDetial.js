var url="";
var model;
var request;
var dProjectId;
function LoadData(){

  creatMask();
  request.post('http://'+url+'/oa/App/AppDProject!detail.action?dProjectId='+GetQueryString("dProjectId")).success(function(data){
                                                                                                    
  if(data!=null&&data.isLogin==false)
  {
                                                                                                                  
    $("body").html("登陆超时，请重新登陆！");
  }
  model.detial=data; 
  console.log(data);
  removeMask();
}).error(function(data, status, headers, config){
  if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
  {
    $("body").html("网络访问出错！");
  }
});
}


(function(){
var app = angular.module('dProject', [ ]);
app.controller('DProjectController',['$http','$window', function($http,$window){
var dProject=this;
url=getPath();
//url="oa.zhetian.net";
request=$http;
model=dProject;
LoadData();

}]);
})();



