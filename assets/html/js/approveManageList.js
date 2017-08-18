var url="";
var model;
var request;
var contentSearch="";
var result=false;
var first=false;
var mem_id=null;
var mem_name=null;

(function(){
	var app = angular.module('ApproveManage', [ ]);
app.directive('cyDatepicker', function () {
    return {
    require: 'ngModel', 
        restrict:'AEC',
        scope:{
            model:"=ngModel"
        },
        link: function (scope, element, attrs, ngModel) {
                $(element).datepicker({
        onSelect: function (dateText, inst) {
            ngModel.$setViewValue(dateText);
            },
          onClose: function( selectedDate ) {
              if(ngModel.$name=="date")
              {
                $( "input[name='endDate']" ).datepicker( "option", "minDate", selectedDate );
              }
              else{
                $( "input[name='date']" ).datepicker( "option", "maxDate", selectedDate );
              }
          }
                });
              
        }
    }
});


	app.controller('ApproveManageController',['$http','$window', function($http,$window){
		var ApproveManage=this;
		url=getPath();
    //url="oa.zhetian.net";
    //url="192.168.1.129:8080";
    ApproveManage.branch=getBranch();
    ApproveManage.pages=1;
    model=ApproveManage;
    request=$http;
    LoadData();

		ApproveManage.detial=function(id)
		{
      openUrl("applyDetial.html?applyId="+id+"&type=0",1);    
		}
    ApproveManage.shaixuan=function(){
       ApproveManage.userId = mem_id;
       var url = "approveManageSearchResult.html?unitId="+ApproveManage.branch.unitId+"&userId="+(ApproveManage.userId==null?"":ApproveManage.userId)+"&typeId="+(ApproveManage.typeId==null?"":ApproveManage.typeId)+"&startTime="+(ApproveManage.startTime==null?"":ApproveManage.startTime)+"&endTime="+(ApproveManage.endTime==null?"":ApproveManage.endTime);
       openUrl(url,1);
    }

    ApproveManage.clearSetting=function(){
      ApproveManage.startTime=null;
      ApproveManage.endTime=null;
      ApproveManage.typeId=null;
      ApproveManage.userId=null;
      mem_id=null;
      mem_name=null;
      document.getElementById("member").value="";
    }

    ApproveManage.chooseMember=function(){
            if(isAndroid()) {
             client.chooseInfo("chooseMember.html?cmdfrom=approveManageList.html");
         }else{
             client.open("open",["chooseMember.html?cmdfrom=approveManageList.html","3"],
                         function(success){
                         },
                         function(error) {
                         alert("Error: \r\n"+error);
                         });
         }
    }

		$window.onscroll=function(){


              var scrollTop=$(this).scrollTop();
              var windowHeight = $(this).height();
              var scrollHeight =document.body.scrollHeight;
              if(scrollTop + windowHeight >= scrollHeight){
				model.pages++;

              $http.post('http://'+url+'/oa/App/Apply!getApplyList.action?unitId='+model.branch.unitId+'&pages='+model.pages).success(function(data){
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


function LoadData(){
    result= false;
   if(!first) creatMask();
    model.pages=1;
          request.post('http://'+url+'/oa/App/Apply!getApplyList.action?unitId='+model.branch.unitId+'&pages='+model.pages).success(function(data){
           if(data!=null&&data.length==0)
           {
            $("#no-data").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66' /><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关审批！</span></div>");
               $("body").removeClass("liststyle");
            } else $("body").addClass("liststyle");
           if(data!=null&&data.isLogin==false)
           {
           $("body").html("网络访问出错！");
           }
           model.list=data;
           console.log(data);
           

           if(!first){
            LoadtypeList();
           }  
           first=true;
           result=true;
           }).error(function(data, status, headers, config){
                    if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
                    {
                    $("body").html("网络访问出错！");
                    }
                    });
}

function LoadtypeList(){
          request.post('http://'+url+'/oa/App/Apply!getTypeList.action').success(function(data){

           model.typeList = data.typeList;
           removeMask();
           }).error(function(data, status, headers, config){
                    if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
                    {
                    $("body").html("网络访问出错！");
                    }
                    });
}

  function refreshInfo(info){
   var info = eval("("+info+")");
   mem_id=info.id;
   mem_name=info.name;
   document.getElementById("member").value=info.name;
   document.getElementById("mem_id").value=info.id;
}   
