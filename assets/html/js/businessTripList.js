var url="";
var model;
var request;

var businessTripId;
var businessTrip;
var result=false;
var first=false;
function LoadData(){
    result = false;
    if(!first) creatMask();
    businessTrip.page =1 ;
    request.post('http://'+url+'/oa/App/BusinessTrip!list.action?pages='+"1"+'&userId='+model.user.id+"&time="+new Date().toTimeString()).success(function(data){
        if(data!=null&&data.length==0){
           $("#no-data").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66'/><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关出差内容!</span></div>");
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
         model.url=url;
        if(!first) removeMask();
        result=true;
        first=true;
         }).error(function(data,status,headers,config){
      if((status>=200&&status<300)||status===304||status===1223||status===0){
      $("body").html("网络访问出错！");
      }
      });
}

function deleteAction(){
    progress("Show");
    request.post('http://'+url+'/oa/App/BusinessTrip!del.action?businessTripId='+businessTripId).success(function(data){
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
	var app=angular.module('businessTrip',[ ]);
	app.controller('BusinessTripController',['$http','$window',function($http,$window){
        businessTrip=this;
		url=getPath();
		businessTrip.user=getUser();
		businessTrip.page=1;
		model=businessTrip;
		request=$http;
		LoadData();


		businessTrip.detail=function(id){
             var url = "businessTrip_detail.html?businessTripId="+id;
             openUrl(url,0);
		};
		businessTrip.edit=function(id){
             var url = "businessTrip.html?businessTripId="+id;
             openUrl(url,0);
		};
		businessTrip.del=function(id){
            businessTripId = id;
			showAlert("提示","确定删除吗？","deleteAction();");
		}
		$window.onscroll=function(){
             var scrollTop=$(this).scrollTop();
             var windowHeight = $(this).height();
             var scrollHeight =document.body.scrollHeight;
             if(scrollTop + windowHeight >= scrollHeight){
				businessTrip.page++;
				$http.post('http://'+url+'/oa/App/BusinessTrip!list.action?pages='+businessTrip.page+'&userId='+businessTrip.user.id).success(function(data){
					businessTrip.list=businessTrip.list.concat(data);
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
