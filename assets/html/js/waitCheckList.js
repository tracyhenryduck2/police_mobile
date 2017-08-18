var url="";
var model;
var request;
var applyId;
var apply;
var result=false;
var first=false;   
function LoadData()
{

    if(!first) creatMask(); 
    apply.pages=1;
    result = false;
    request.post('http://'+url+'/oa/App/Apply!waitCheckList.action?pages='+"1"+"&userId="+model.user.id).success(function(data){
     if(data!=null&&data.length==0)
     {
     $("#refreshDiv").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66' /><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关审批内容!</span></div>");
                $("body").removeClass("liststyle");                                                                                                                                             
      }else $("body").addClass("liststyle");
     if(data!=null&&data.isLogin==false)
     {
     $("body").html("网络访问出错！");
     }
     model.list=data; 
     for(var i=0;i<model.list.length;i++)
     GetCustomWorkContent(model.list[i],i);
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

function GetCustomWorkContent(data,index){
   if(data!=null&&data.content!=null&&data.type_id==10)
     {
        var aa = data.content.indexOf("<span id='cc'>");
        var bb = data.content.substr(aa);
        var bb_index = bb.indexOf("</span>");
        var aa_length = "<span id='cc'>".length;
        var sublast = bb.substr(aa_length,bb_index-aa_length);
        model.list[index].reason = sublast;
     }
}


(function(){
	var app = angular.module('apply', [ ]);
	app.controller('ApplyController',['$http','$window', function($http,$window){

		apply=this;
	  url=getPath();
    //url="oa.zhetian.net";
    apply.user=getUser();
    //apply.user={id:175};
		apply.pages=1;
		model=apply;
		request=$http;
		LoadData();

    apply.copy=function(id){
              var url = "copyEdit.html?applyId="+id;
              openUrl(url,1);
    }

		apply.detial=function(id)
		{
          var url = "applyDetial.html?applyId="+id+"&type=1";
          openUrl(url,0);
		}
		$window.onscroll=function(){
			var scrollTop=$(this).scrollTop();
              var windowHeight = $(this).height();
              var scrollHeight =document.body.scrollHeight;
              if(scrollTop + windowHeight >= scrollHeight){
				apply.pages++;
				$http.post('http://'+url+'/oa/App/Apply!waitCheckList.action?pages='+apply.pages+"&userId="+apply.user.id).success(function(data){
					apply.list=apply.list.concat(data);
               for(var i=0;i<model.list.length;i++)
              GetCustomWorkContent(model.list[i],i);
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



