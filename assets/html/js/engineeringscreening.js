var url="";
var model;
var request;
var contentSearch="";
var result=false;
function LoadData(){
   if(!result) creatMask();
    model.pages=1;
          request.post('http://'+url+'/oa/App/AppDProject!list.action?pages='+model.pages).success(function(data){
           if(data!=null&&data.length==0)
           {
            $("#no-data").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66' /><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关工程！</span></div>");
               $("body").removeClass("liststyle");
            } else $("body").addClass("liststyle");
           if(data!=null&&data.isLogin==false)
           {
           $("body").html("网络访问出错！");
           }
           model.list=data;
           console.log(data);
           }).error(function(data, status, headers, config){
                    if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
                    {
                    $("body").html("网络访问出错！");
                    }
                    });

          request.post('http://'+url+'/oa/App/AppDProject!getInfo.action').success(function(data){

           model.yu=data;
          if(!result) removeMask(); 
          result=true;
           }).error(function(data, status, headers, config){
                    if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
                    {
                    $("body").html("网络访问出错！");
                    }
                    });
  

};


(function(){
	var app = angular.module('dProject', [ ]);
	app.controller('dProjectController',['$http','$window', function($http,$window){
		var dProject=this;
		url=getPath();
    //url="oa.zhetian.net";
    dProject.pages=1;
    model=dProject;
    request=$http;
    LoadData();

		dProject.detial=function(id)
		{
          var url = "engineeringDetial.html?dProjectId="+id;
          openUrl(url,0);
       
		}

    dProject.shaixuan=function(){
       var url = "engineeringscreeningSearchList.html?projectProgress="+(dProject.projectprogress==null?"":dProject.projectprogress)+"&projectCode="+(dProject.code==null?"":dProject.code)+"&projectType="+(dProject.projectType==null?"":dProject.projectType)+"&projectArea="+(dProject.projectArea==null?"":dProject.projectArea)+"&projectAttr="+(dProject.projectAttr==null?"":dProject.projectAttr)+"&projectName="+(dProject.name==null?"":dProject.name);
          openUrl(url,1);
    }
        
		$window.onscroll=function(){


              var scrollTop=$(this).scrollTop();
              var windowHeight = $(this).height();
              var scrollHeight =document.body.scrollHeight;
              if(scrollTop + windowHeight >= scrollHeight){
				model.pages++;

              $http.post('http://'+url+'/oa/App/AppDProject!list.action?pages='+model.pages).success(function(data){
              model.list=model.list.concat(data);
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




