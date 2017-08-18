var url="";
var model;
var request;
var carRechargeId;
var carRecharge;
var result=false;
var first=false;   
function LoadData()
{

    if(!first) creatMask(); 
    carRecharge.pages=1;
    result = false;
    request.post('http://'+url+'/oa/App/AppCarRecharge!list.action?pages=1&userId='+model.user.id).success(function(data){
     if(data!=null&&data.length==0)
     {
     $("#no-data").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66' /><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关审批内容!</span></div>");
                $("body").removeClass("liststyle");                                                                                                                                             
      }else $("body").addClass("liststyle");
     if(data!=null&&data.isLogin==false)
     {
     $("body").html("网络访问出错！");
     }
     model.list=data; 
     console.log(data);
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
	var app = angular.module('carRecharge', [ ]);
	app.controller('carRechargeController',['$http','$window', function($http,$window){

		carRecharge=this;
	  url=getPath();
    // url="oa.zhetian.net";
    carRecharge.user=getUser();
    //carRecharge.user={id:1};
		carRecharge.pages=1;
		model=carRecharge;
		request=$http;
		LoadData();


		carRecharge.detial=function(obj)
		{
         var str = JSON.stringify(obj);  
          var url = "carRechargeDetial.html?carRecharge="+str;
          openUrl(url,0);
          //window.location=url;
		}
    carRecharge.edit=function(obj)
    {
         var str=JSON.stringify(obj);
         var url = "carRechargeEdit.html?carEdit="+str;
         openUrl(url,0);
         //window.location=url;
    }
    carRecharge.del=function(id){
          carRechargeId= id;
          showAlert("提示","确定删除吗？","deleteAction();");
          //deleteAction();
    }

		$window.onscroll=function(){
			var scrollTop=$(this).scrollTop();
      var windowHeight = $(this).height();
              var scrollHeight =document.body.scrollHeight;
              if(scrollTop + windowHeight >= scrollHeight){
				carRecharge.pages++;
				$http.post('http://'+url+'/oa/App/AppCarRecharge!list.action?pages='+carRecharge.pages+"&userId="+carRecharge.user.id).success(function(data){
					carRecharge.list=carRecharge.list.concat(data);
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


function deleteAction(){
    progress("Show");
    request.post('http://'+url+'/oa/App/AppCarRecharge!del.action?carRechargeId='+carRechargeId).success(function(data){
     if(data.flag)
     {
     progress("Success","删除成功");
     LoadData();
     }else{
     progress("Error","删除失败");
     }
     });
}; 

