var url="";
var model;
var request;
var applyId;
var apply;
var first=false;
var result=false;
function LoadData(){
   result=false;
   if(!first) creatMask();
    apply.pages=1;
    request.post('http://'+url+'/oa/App/Apply!myApplyList.action?pages='+"1"+"&userId="+model.user.id).success(function(data){
   if(data!=null&&data.length==0)
   {
   $("#refreshDiv").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66'/><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关审批内容!</span></div>");
   $("body").removeClass("liststyle");  
   }                                                                                                                                                         
   else $("body").addClass("liststyle");
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
};

function CancelAction(){
     progress("Show");
    request.post('http://'+url+'/oa/App/Apply!cancel.action?applyId='+applyId).success(function(data){
      if(data.flag)
      {
      progress("Success","处理成功");
      LoadData();
      }else{
      progress("Error","操作失败");
      }
      });
};

function DeleteAction(){
     progress("Show");
    request.post('http://'+url+'/oa/App/Apply!delApply.action?applyId='+applyId).success(function(data){
      if(data.flag)
      {
      progress("Success","删除成功");
      LoadData();
      }else{
      progress("Error","操作失败");
      }
      });
};


(function(){
	var app = angular.module('apply', [ ]);
	app.controller('ApplyController',['$http','$window', function($http,$window){
    apply=this;
    //url="192.168.1.129:8080";
		url=getPath();
		
    apply.user=getUser();
    //apply.user={id:175};
    apply.pages=1;
    model=apply;
    request=$http;
    LoadData();

		apply.cancel=function(id)
		{
              applyId = id ;
              showAlert("提示","确定作废吗？","CancelAction();");
		}
		apply.del=function(id)
		{
              applyId = id ;
              showAlert("提示","确定删除吗？","DeleteAction();");
		}

apply.copy = function(id){
          var url = "copyEdit.html?applyId="+id;
          openUrl(url,1);
}

		apply.detial=function(id)
		{
          var url = "applyDetial.html?applyId="+id+"&type=0";
          openUrl(url,0);
		}
		$window.onscroll=function(){
              var scrollTop=$(this).scrollTop();
              var windowHeight = $(this).height();
              var scrollHeight =document.body.scrollHeight;
              if(scrollTop + windowHeight >= scrollHeight){
				apply.pages++;
				$http.post('http://'+url+'/oa/App/Apply!myApplyList.action?pages='+apply.pages+"&userId="+apply.user.id).success(function(data){
					apply.list=apply.list.concat(data);
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




