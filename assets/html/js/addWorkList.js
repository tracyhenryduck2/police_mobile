var url="";
var model;
var request;

var attenceWorkId;
var addWork;
var result=false;
var first=false;
function LoadData(){
  result=false;
   if(!first) creatMask();
    addWork.page=1;
    request.post('http://'+url+'/oa/App/AppAttence!list.action?type=1&pages='+"1"+'&userId='+model.user.id+'&time='+new Date().toTimeString()).success(function(data){
      if(data!=null&&data.length==0){
   $("#no-data").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66'/><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关加班内容!</span></div>");
        $("body").removeClass("liststyle");
         }else     {
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
    request.post('http://'+url+'/oa/App/AppAttence!del.action?attenceWorkId='+attenceWorkId).success(function(data){

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
	var app=angular.module('addWork',[ ]);
	app.controller('AddWorkController',['$http','$window',function($http,$window){
        addWork=this;
		url=getPath();
        addWork.user=getUser();
        addWork.page=1;
		model=addWork;
		request=$http;
		LoadData();

		addWork.detail=function(id){
            var url = "add_work_detail.html?attenceWorkId="+id;
            openUrl(url,0);
		};
		addWork.edit=function(id){
            var url = "add_work.html?attenceWorkId="+id;
            openUrl(url,0);
		};
		addWork.del=function(id){
            attenceWorkId= id;
            showAlert("提示","确定删除吗？","deleteAction();");
		}
		$window.onscroll=function(){
                var scrollTop=$(this).scrollTop();
                var windowHeight = $(this).height();
                var scrollHeight =document.body.scrollHeight;
                if(scrollTop + windowHeight >= scrollHeight){
                addWork.page++;
				$http.post('http://'+url+'/oa/App/AppAttence!list.action?type=1&pages='+addWork.page+'&userId='+addWork.user.id).success(function(data){
					addWork.list=addWork.list.concat(data);
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
