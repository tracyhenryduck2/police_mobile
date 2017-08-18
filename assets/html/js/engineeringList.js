var url="";
var model;
var request;
var contentSearch="";
var result=false;
var first=false;
function LoadData(){
  result= false;
    if(!first) creatMask();
    model.pages=1;
          request.post('http://'+url+'/oa/App/AppDProject!list.action?pages='+model.pages).success(function(data){
           if(data!=null&&data.length==0)
           {
            $("#no-data").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66' /><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关工程!</span></div>");
             $("body").removeClass("liststyle");
           }else $("body").addClass("liststyle");
           if(data!=null&&data.isLogin==false)
           {
           $("body").html("网络访问出错！");
           }
           model.list=data;

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



function creatSearchMask(){
var Searchmask = document.createElement("div"); 
Searchmask.id = "Searchmask"; 
Searchmask.style.position = "fixed"; 
Searchmask.style.top = "0%"; 
Searchmask.style.left = "0"; 
Searchmask.style.zIndex = 1000; 
Searchmask.style.backgroundColor = "#000000"; 
Searchmask.style.filter = "alpha(opacity=45)"; 
Searchmask.style.opacity = "0.45"; 
Searchmask.style.width = "100%"; 
Searchmask.style.height = (window.parent.document.body.scrollHeight + 50) + "px"; 
window.parent.document.body.appendChild(Searchmask);
document.body.onmousewheel = function(){return false;}
document.body.style.overflow="hidden"; 
document.body.scrollTop = 0;
document.getElementsByTagName("body")[0].removeEventListener('touchmove', touchMoveFunc, false);   
document.getElementsByTagName("body")[0].addEventListener('touchmove', function(){return false;}, false);  
Searchmask.onmousedown=function(){
   removeSearchMask();
}

var search = document.createElement("div");
search.id="sear";
search.style.position = "fixed";
search.style.top = "0"; 
search.style.left = "0";  
search.style.zIndex = 1500;
search.style.backgroundColor = "rgb(134, 130, 130)";  
search.style.width = "100%"; 
search.style.height = "50px";
search.innerHTML="<div id=\"search\"><span class=\"first\"><img  src=\"image/sear.png\"/></span><input placeholder=\"请输入项目名称关键字\" type=\"text\" id=\"searchVal\" /><a id=\"cancl\">取消</a></div>";
window.parent.document.body.appendChild(search); 

document.getElementById("cancl").onmousedown=function(){
  var content = document.getElementById("searchVal");
   if(content.value=="")   removeSearchMask();
   else
   {
       removeSearchMask();
       contentSearch =  escape(content.value);
       var url = "engineeringSearchList.html?searchContent="+contentSearch ;
       openUrl(url,1);
   }                 
   
}


document.getElementById("searchVal").oninput=function(){
  var btn = document.getElementById("cancl");
  if(this.value=="")    btn.innerHTML="取消";
  else                 btn.innerHTML="搜索";

}

}




function removeSearchMask()
{
   document.body.removeChild(document.getElementById("Searchmask"));
   document.body.removeChild(document.getElementById("sear"));
   document.body.onmousewheel = function(){return true;}
   document.body.style.overflow="scroll";

document.getElementsByTagName("body")[0].addEventListener('touchmove', touchMoveFunc, false);   


}
(function(){
	var app = angular.module('dProject', [ ]);
	app.controller('dProjectController',['$http','$window', function($http,$window){
    var dProject=this;
    url=getPath();
    dProject.pages=1;
    model=dProject;
    request=$http;
    LoadData();

    dProject.detial=function(id)
    {
      var url = "engineeringDetial.html?dProjectId="+id;
      openUrl(url,1);
    }
      dProject.search=function(){
      creatSearchMask();
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




