
(function(){
    var app = angular.module('addWork', [ ]);
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
app.directive('lyDatepicker', function () {
    return {
    require: 'ngModel', 
        restrict:'AEC',
        scope:{
            model:"=ngModel"
        },
        link: function (scope, element, attrs, ngModel) {
                $(element).timepicker({
                    onSelect: function (dateText, inst) {
                       
                         },
                         onClose: function (dateText, inst) {
                        	 ngModel.$setViewValue(dateText);
                              },
                             });
        }
    }
});

app.directive('lyPicker', function () {
    return {
    require: 'ngModel', 
        restrict:'AEC',
        scope:{
            model:"=ngModel"
        },
        link: function (scope, element, attrs, ngModel) {
                $(element).mobiscroll().time({
                    lang: 'zh',
                    display: 'modal',
                    mode: 'scroller'
                });    
        }
    }
});

app.controller('AddWorkController',['$http','$window','$scope', function($http,$window,$scope){
//    creatMask();
    var addWork=this;
    // var url="oa.zhetian.net";
    // var branch={roleId:1};
    // var user={id:1};
    var url=getPath();
    var branch=getBranch();
    var user=getUser();
    $http.post('http://'+url+'/oa/App/AppAttence!getInfo.action?userId='+user.id+'&roleId='+branch.roleId+'&attenceWorkId='+GetQueryString("attenceWorkId")).success(function(data){
      //alert(data.in_address);
     if(data.flag){
           if(data!=null&&data.isLogin==false){
              $("body").html("登陆超时，请重新登陆！");
           }
           addWork.detail=data;
           addWork.processinit();
           addWork.detail.req_time = toDecimal(addWork.detail.req_time);
     }else{
         progress("Show");
         progress("Error","未指定上级审批权限","goPrevious()");
     }
//      removeMask();
    }).error(function(data,status,headers,config){
      if((status>=200 && status<300)||status===304||status===1223||status===0){
    	  $("body").html("网络访问出错！");
      }
});
    
    $scope.selectTime=function(){
    	var startTime=addWork.detail.start_time;
    	var endTime=addWork.detail.end_time;
    	if(startTime!=null && endTime!=null){
    		var reg1=startTime.split(":");
    		var reg2=endTime.split(":");
    		var hours=((reg2[0]-reg1[0])*60-(-reg2[1])-reg1[1])/60;
	  		if(isNaN(hours)){
	  		hours="";
	  		}
	  		$scope.addWork.detail.refer_time=hours.toFixed(1);
	  		$scope.addWork.detail.req_time=parseFloat(hours.toFixed(1));
    	}
    }
addWork.edit=function(){
  progress("Show");
 $http({url:'http://'+url+'/oa/App/AppAttence!edit.action',method:'post',data:addWork.detail}).success(function(data){
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

addWork.processinit=function(){
   if(addWork.detail.applyRole.length>1)
     {
       for(var i=0;i<addWork.detail.applyRole.length;i++)
       {
         if(addWork.detail.applyRole[i].sub_type_id==null)  
          {addWork.detail.apply_role_id=addWork.detail.applyRole[i].id;
            addWork.detail.content=addWork.detail.applyRole[i].content;
          }
       }
     }
    else if(addWork.detail.applyRole.length==1)
    {
        addWork.detail.apply_role_id=addWork.detail.applyRole[0].id;
        addWork.detail.content=addWork.detail.applyRole[0].content;
    }
}

}]);
})();



