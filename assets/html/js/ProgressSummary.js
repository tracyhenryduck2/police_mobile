var url="";
var model;
var request;
var first=false;
var result=false;

(function(){
var app = angular.module('ProgressSummary', [ ]);

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

app.controller('ProgressSummaryController',['$http','$window', function($http,$window){
var ProgressSummary=this;
url=getPath();
//url="oa.zhetian.net";
model=ProgressSummary;
request=$http;
LoadData();

ProgressSummary.shaixuan=function()
{
      var url = 'ProgressSummarySearchResult.html?ownershipId='+(ProgressSummary.belong==null?"":ProgressSummary.belong)+'&startTime='+(ProgressSummary.date==null?"":ProgressSummary.date)+'&endTime='+(ProgressSummary.end_date==null?"":ProgressSummary.end_date);

      if(isAndroid()==true)    client.open(url,1);
      else                     window.location=url;
}

}]);
})();

function LoadData(){
  result=false;
if(!first) creatMask();
request.post('http://'+url+'/oa/App/AppDProject!progressSummary.action').success(function(data){
if(data!=null&&data.length==0)
		{
			$("#no-data").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' /><br/><span style='font-size:18px;color:rgb(141,141,141);'>没有相关任务内容！</span></div>");
               $("body").removeClass("liststyle");
            } else $("body").addClass("liststyle");
		if(data!=null&&data.isLogin==false)
		{
			$("body").html("登陆超时，请重新登陆！");
		}
	model.list=data;
  result=true; 
}).error(function(data, status, headers, config){
		if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
		{
			$("body").html("网络访问出错！");
		}
		});

request.post('http://'+url+'/oa/App/AppDProject!getOwnership.action').success(function(data){

	model.belongTo=data; 
	if(!first)  removeMask();
  first=true;
}).error(function(data, status, headers, config){
		if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
		{
			$("body").html("网络访问出错！");
		}
		});


}



