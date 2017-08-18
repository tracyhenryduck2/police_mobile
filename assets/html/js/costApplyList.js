var url="";
var model;
var request;

var costApplyId;
var costApply;
var result=false;
var first=false;
function LoadData(){
    result=false;
    if(!first)  creatMask();
    costApply.page=1;
    request.post('http://'+url+'/oa/App/AppCostApply!list.action?pages='+"1"+'&userId='+model.user.id+"&time="+new Date().toTimeString()).success(function(data){
    if(data!=null&&data.length==0){
      $("#no-data").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66' /><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关费用内容!</span></div>");
        $("body").removeClass("liststyle");
     }else
     {
       $("#no-data").html("");
       $("body").addClass("liststyle");
     }
     if(data!=null&&data.isLogin==false){
     $("body").html("网络访问出错！");
     }
     model.list=data;
     console.log(data);
     model.url=url;
     if(!first)  removeMask();
     result=true;
     first=true;
     }).error(function(data,status,headers,config){
              if((status>=200&&status<300)||status===304||status===1223||status===0){
              $("body").html("网络访问出错！");
              }
              });
};

function deleteAction(){
    progress("Show");
    request.post('http://'+url+'/oa/App/AppCostApply!del.action?costApplyId='+costApplyId).success(function(data){
     if(data.flag)
     {
     progress("Success","删除成功");
     LoadData();
     }else{
     progress("Error","删除失败");
     }
     });
};

(function(){
	var app=angular.module('costApply',[ ]);
	app.controller('CostApplyController',['$http','$window',function($http,$window){
		costApply=this;
		url=getPath();
    //url="oa.zhetian.net";
		costApply.user=getUser();
		//costApply.user={id:1};
    costApply.page=1;
        model=costApply;
        request=$http;
        LoadData();

		costApply.detail=function(id){
          var url = "costApply_detail.html?costApplyId="+id;
          openUrl(url,0);
		};
		costApply.edit=function(id){
          var url = "costApply.html?costApplyId="+id;
          openUrl(url,0);
		};
		costApply.del=function(id){
          costApplyId= id;
          showAlert("提示","确定删除吗？","deleteAction();");
		}
		$window.onscroll=function(){
              var scrollTop=$(this).scrollTop();
              var windowHeight = $(this).height();
              var scrollHeight =document.body.scrollHeight;
              if(scrollTop + windowHeight >= scrollHeight){
				costApply.page++;
				$http.post('http://'+url+'/oa/App/AppCostApply!list.action?pages='+costApply.page+'&userId='+costApply.user.id).success(function(data){
					costApply.list=costApply.list.concat(data);
				}).error(function(data, status, headers, config){
				if(( status>= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
				{
				$("body").html("网络访问出错！");
				}
				});
			}
		}
	}]);
})();

