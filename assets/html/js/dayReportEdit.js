(function(){
	var app = angular.module('dayReport', [ ]);
	app.config(function($httpProvider) {
		$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
		
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
         var param = function(obj) {
         	var query = '';
         	var name, value, fullSubName, subName, subValue, innerObj, i;
         	
         	for (name in obj) {
         		value = obj[name];
         		
         		if (value instanceof Array) {
         			for (i = 0; i < value.length; ++i) {
         				subValue = value[i];
         				fullSubName = name + '[' + i + ']';
         				innerObj = {};
         				innerObj[fullSubName] = subValue;
         				query += param(innerObj) + '&';
         			}
         		} else if (value instanceof Object) {
         			for (subName in value) {
         				subValue = value[subName];
         				fullSubName = name + '[' + subName + ']';
         				innerObj = {};
         				innerObj[fullSubName] = subValue;
         				query += param(innerObj) + '&';
         			}
         		} else if (value !== undefined && value !== null) {
         			query += encodeURIComponent(name) + '='
         			+ encodeURIComponent(value) + '&';
         		}
         	}
         	
         	return query.length ? query.substr(0, query.length - 1) : query;
         };
         
         return angular.isObject(data) && String(data) !== '[object File]'
         ? param(data)
         : data;
     }];
 });

app.controller('DayReportController',['$http','$window','$scope', function($http,$window,$scope){
	creatMask();
	var dayReport=this;
	var url=getPath();
	//var url="oa.zhetian.net";
	dayReport.user=getUser();
	//dayReport.user={id:1};
	dayReport.date=GetQueryString("date");
	//dayReport.date="1418832000";
	dayReport.init=function(){
		$http.post('http://'+url+'/oa/App/AppProject!getDayReportInfo.action?userId='+dayReport.user.id+'&date='+dayReport.date).success(function(data){
			if(data!=null&&data.isLogin==false)
			{
				$("body").html("登陆超时，请重新登陆！");
			}
			// for(var i=0;i<data.dayReport.length;i++)
			// {
			// 	var array=new Array();
			// 	var j=data.dayReport[i].schedule;
			// 	for(j;j<=100;j=j+5)
			// 	{
			// 		var obb = new Object();
			// 		obb.showschedule=j+"%";
			// 		obb.submitschedule=j;
			// 		array.push(obb);
			// 	}
			// 	data.dayReport[i].schedules=array;
			// }
			// dayReport.list=data.dayReport;
			dayReport.list=new Array();
			if(data.detial!=null)
			{
				dayReport.note=data.detial.note;
			}
			else{
				dayReport.note=null;
			}
			removeMask();
			
		}).error(function(data, status, headers, config){
			if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
			{
				$("body").html("网络访问出错！");
			}
		});
	};
	dayReport.init();
	dayReport.del=function(id){
		if(dayReport.list.length>1)
		{
			var index=0;
			for(var i=0;i<dayReport.list.length;i++)
			{
				if(dayReport.list[i].id==id)
				{
					index=i;
				}
			}
			dayReport.list.splice(index,1);
			dayReport.list;
		}
	};
	dayReport.edit=function(){
        progress("Show");
		$http({url:'http://'+url+'/oa/App/AppProject!editDayReport.action',method:'post',data:{'list':JSON.stringify(dayReport.list),'note':dayReport.note,'userId':dayReport.user.id,'date':dayReport.date}}).success(function(data){
			if(data!=null&&data.isLogin==false)
			{
				$("body").html("登陆超时，请重新登陆！");
			}
			if(data.flag)
			{
                progress("Success","保存成功","goPrevious()");
			}
			else
			{
                progress("Error","保存失败","");
			}
		}).error(function(data, status, headers, config){
			if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
			{
				$("body").html("网络访问出错！");
			}
		});
	};
}]);
})();



