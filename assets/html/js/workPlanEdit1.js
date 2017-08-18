(function(){
    var app = angular.module('workPlan', [ ]);
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

app.controller('WorkPlanController',['$http','$window','$scope', function($http,$window,$scope){
    creatMask();
    var workPlan=this;
    var url=getPath();
    workPlan.user=getUser();
    $http.post('http://'+url+'/oa/App/AppProject!getWorkPlanInitInfo.action?creatUser='+workPlan.user.id+'&type=1').success(function(data){
       workPlan.projects=data.projects; 
       removeMask();
   }).error(function(data, status, headers, config){
      if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
      {
         $("body").html("网络访问出错！");
     }
 });
   //var workPlanId=GetQueryString("workPlanId");
  // if(workPlanId!=null)
   //{
    //   $http.post('http://'+url+'/oa/App/AppProject!getWorkPlanInfo.action?workPlanId='+workPlanId).success(function(data){
    //       workPlan.users=data.users; 
     //      workPlan.detial=data.workPlan;
           
    //   }).error(function(data, status, headers, config){
     //     if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
     //     {
     //        $("body").html("网络访问出错！");
     //    }
    // });
  // }
   workPlan.edit=function(){
    progress("Show");
    //if(workPlanId==null)
    //{
       workPlan.detial.creat_user=workPlan.user.id;
      workPlan.detial.schedule=0;
  // }
   workPlan.detial.execute_user=workPlan.user.id;
   $http({url:'http://'+url+'/oa/App/AppProject!editWorkPlan1.action',method:'post',data:workPlan.detial}).success(function(data){
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
}
}]);

})();



