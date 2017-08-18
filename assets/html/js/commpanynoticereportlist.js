var url="";
var model;
var request;
var notice ;
var result=false;
var first=false;

(function(){
	var app = angular.module('Notice', [ ]);

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

	app.controller('NoticeController',['$http','$window','$scope', function($http,$window,$scope){
		notice=this;
		url=getPath();
		notice.user=getUser();
		 // url="26.ztoas.com:88";
		 // notice.user={id:175};
         notice.page=1;
		 model=notice;
		 request=$http;
		 LoadData();

		notice.detial=function(id)
		{
          var url = "companynoticereportdetail.html?id="+id+"&toUserId="+notice.user.id;
          //window.location=url;
          openUrl(url,0);
		}

    notice.chooseMember=function(){    
            if(isAndroid()) {
             client.chooseInfo("chooseMember.html?cmdfrom=companynoticereportlist.html");
         }else{
             client.open("open",["chooseMember.html?cmdfrom=companynoticereportlist.html","3"],
                         function(success){
                         },
                         function(error) {
                         alert("Error: \r\n"+error);
                         });
         }
    }

    notice.refresher=function(id,name){
                    $scope.$apply(function(){
                   notice.searchreporter = new Object();  
                   notice.searchreporter.id=id;
                   notice.searchreporter.name=name;
  

     
             });
    }
 
    notice.shaixuan=function(){
    	first=false;
    	LoadData();
    }

    notice.clearSetting=function(){
      notice.startTime=null;
      notice.endTime=null;
      notice.searchreporter=null;
    }
		$window.onscroll=function(){
             var scrollTop=$(this).scrollTop();
             var windowHeight = $(this).height();
             var scrollHeight =document.body.scrollHeight;
             if(scrollTop + windowHeight >= scrollHeight){
				notice.page++;
				$http.post("http://"+url+"/oa/App/AppCompanyNoticeReport!list.action?toUserId="+notice.user.id+"&pages="+notice.page+"&startTime="+(notice.startTime==null?"":notice.startTime)+"&endTime="+(notice.endTime==null?"":notice.endTime)+"&fromUserId="+(notice.searchreporter==null?"":notice.searchreporter.id)).success(function(data){
					notice.list=notice.list.concat(data);
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

function LoadData(){
         result =false;
		 if(!first)  creatMask();
		model.page = 1;
		request.post("http://"+url+"/oa/App/AppCompanyNoticeReport!list.action?toUserId="+model.user.id+"&pages="+model.page+"&startTime="+(model.startTime==null?"":model.startTime)+"&endTime="+(model.endTime==null?"":model.endTime)+"&fromUserId="+(model.searchreporter==null?"":model.searchreporter.id)).success(function(data){
           if(data!=null&&data.length==0)
           {
            $("#no-data").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66' /><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关发文内容！</span></div>");
               $("body").removeClass("liststyle");
            } else{ $("body").addClass("liststyle");$("#no-data").html("");}
			if(data!=null&&data.isLogin==false)
			{
				$("body").html("登陆超时，请重新登陆！");
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
		}) ;
}

  function refreshInfo(info){
   var info = eval("("+info+")");
   model.refresher(info.id,info.name);
}  