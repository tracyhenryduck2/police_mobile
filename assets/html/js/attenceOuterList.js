var url="";
var model;
var request;
var attenceOuter;
var first=false;
var result=false;
(function(){
	var app=angular.module('attenceOuter',[ ]);
	app.controller('AttenceOuterController',['$http','$window',function($http,$window){
        attenceOuter=this;
        //url="192.168.1.129:8080";
		url=getPath();
		//attenceOuter.user={id:1};
		attenceOuter.user=getUser();
		attenceOuter.page=1;
		model=attenceOuter;
		request=$http;
		LoadData();

		attenceOuter.detail=function(id){
         var url = "attenceOuter_detail.html?attenceOuterId="+id;
         openUrl(url,0);
		};

        attenceOuter.del=function(id){
                      showAlert("提示","确定删除吗？","DeleteAction("+id+");");
        }

		$window.onscroll=function(){
             var scrollTop=$(this).scrollTop();
             var windowHeight = $(this).height();
             var scrollHeight =document.body.scrollHeight;
             if(scrollTop + windowHeight >= scrollHeight){
				attenceOuter.page++;
				$http.post('http://'+url+'/oa/App/AttenceOuter!attenceList.action?pages='+attenceOuter.page+'&userId='+attenceOuter.user.id).success(function(data){
					attenceOuter.list=attenceOuter.list.concat(data);
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

function DeleteAction(applyId){

     progress("Show");
    request.post('http://'+url+'/oa/App/AttenceOuter!delAttence.action?attenceOuterId='+applyId).success(function(data){
      if(data.flag)
      {
      progress("Success","删除成功");
      LoadData();
      }else{
      progress("Error","操作失败");
      }
      });
};

function LoadData(){
	    result=false;
		if(!first) creatMask();
        attenceOuter.page=1;
		request.post('http://'+url+'/oa/App/AttenceOuter!attenceList.action?pages='+"1"+'&userId='+model.user.id).success(function(data){
			if(data!=null&&data.length==0)
			{
				$("#refreshDiv").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66'/><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关外勤内容!</span></div>");
                $("body").removeClass("liststyle");                                                                                                        
			}
			else  $("body").addClass("liststyle");
			if(data!=null&&data.isLogin==false)
			{
				$("body").html("网络访问出错！");
			}
			model.list=data;
			console.log(data);
			model.url=url;
			if(!first) removeMask();
			first=true;
			result=true;
		}).error(function(data,status,headers,config){
			if((status>=200&&status<300)||status===304||status===1223||status===0){
				$("body").html("网络访问出错！");
			}
		});
}