var url="";
var model;
var request;
var customapply;
var result=false;
var first=false;   
function LoadData()
{

    if(!first) creatMask(); 
    customapply.pages=1;
    result = false;
    request.post('http://'+url+'/oa/App/AppCustomApply!list.action?pages=1&applyUserId='+model.user.id).success(function(data){
     if(data!=null&&data.length==0)
     {
     $("#no-data").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66' /><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关工作内容!</span></div>");
                $("body").removeClass("liststyle");                                                                                                                                             
      }else
      {
        $("#no-data").html("");
        $("body").addClass("liststyle");
        model.list=data; 
        console.log(data);
      } 
     if(data!=null&&data.isLogin==false)
     {
     $("body").html("网络访问出错！");
     }

     if(!first) removeMask();
     first=true;
     result=true; 
     }).error(function(data, status, headers, config){
              if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
              {
              $("body").html("网络访问出错！");
              }
              });

}


(function(){
	var app = angular.module('customapply', [ ]);
	app.controller('customapplyController',['$http','$window', function($http,$window){

		customapply=this;
	  url=getPath();
    //url="oa.zhetian.net";
    customapply.user=getUser();
    //customapply.user={id:1};
		customapply.pages=1;
		model=customapply;
		request=$http;
		LoadData();


		customapply.detial=function(id)
		{ 
          var url = "customapplydetail.html?customapplyId="+id;
          openUrl(url,0);
          //window.location=url;
		}
    customapply.edit=function(obj)
    {
         var str=JSON.stringify(obj);
         str = escape(str);
         var url = "customapplyEdit.html?customapplyId="+str;
         openUrl(url,0);
         //window.location=url;
    }


		$window.onscroll=function(){
			var scrollTop=$(this).scrollTop();
      var windowHeight = $(this).height();
              var scrollHeight =document.body.scrollHeight;
              if(scrollTop + windowHeight >= scrollHeight){
				customapply.pages++;
				$http.post('http://'+url+'/oa/App/AppCustomApply!list.action?pages='+customapply.pages+"&applyUserId="+customapply.user.id).success(function(data){
					customapply.list=customapply.list.concat(data);
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


