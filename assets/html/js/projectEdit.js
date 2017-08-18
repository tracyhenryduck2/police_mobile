(function(){
    var app = angular.module('project', [ ]);
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
              if(ngModel.$name=="startTime")
              {
                $( "input[name='endTime']" ).datepicker( "option", "minDate", selectedDate );
              }
              else{
                $( "input[name='startTime']" ).datepicker( "option", "maxDate", selectedDate );
              }
          }
                });
              
        }
    }
});
app.controller('ProjectController',['$http','$window','$scope', function($http,$window,$scope){
    creatMask();
    var project=this;
    var url=getPath();
    project.user=getUser();
    $http.post('http://'+url+'/oa/App/AppProject!getInfo.action').success(function(data){
     if(data!=null&&data.isLogin==false)
     {
      $("body").html("登陆超时，请重新登陆！");
  }
  project.types=data.types; 
  project.status=data.status;
}).error(function(data, status, headers, config){
 if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
 {
  $("body").html("网络访问出错！");
}
});
var projectId=GetQueryString("projectId");
if(projectId!=null)
{
 $http.post('http://'+url+'/oa/App/AppProject!getProjectInfo.action?projectId='+projectId).success(function(data){
     if(data!=null&&data.isLogin==false)
     {
      $("body").html("登陆超时，请重新登陆！");
  }
  project.detial=data;
  removeMask();
}).error(function(data, status, headers, config){
 if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
 {
  $("body").html("网络访问出错！");
}
}) ;
}
project.edit=function(){
 progress("Show");
if(projectId==null)
    {
     project.detial.creat_user=project.user.id;
 }
 $http({url:'http://'+url+'/oa/App/AppProject!editProject.action',method:'post',data:project.detial}).success(function(data){
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
}) ;
}
}]);
})();



