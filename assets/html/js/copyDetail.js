var url="";
var model;
var request;
var applyId;
var user;

function LoadData(){

  creatMask();
  request.post('http://'+url+'/oa/App/Apply!applyDetial.action?applyId='+GetQueryString("applyId")).success(function(data){
  if(data!=null&&data.isLogin==false)
  {
    $("body").html("登陆超时，请重新登陆！");
  }
  model.detial=data;
  var contents =data.content; 
  contents = contents.replace(/\r\n/g,"<br/>");
  $("#content").html(contents);
  removeMask();
}).error(function(data, status, headers, config){
  if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
  {
    $("body").html("网络访问出错！");
  }
});
}


(function(){
var app = angular.module('apply', [ ]);
app.controller('ApplyController',['$http','$window', function($http,$window){
var apply=this;
url=getPath();
//url="oa.zhetian.net";
user=getUser();
//user={id:175};
// url="192.168.1.129:8080";
request=$http;
model=apply;
LoadData();

}]);
})();
