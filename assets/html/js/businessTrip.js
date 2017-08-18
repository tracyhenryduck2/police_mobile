var mem_id=null;
var mem_name=null;


(function(){
    var app = angular.module('businessTrip', [ ]);
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
           var startTime=$("#startTime").val();
           var endTime=$("#endTime").val();
           var sd=new Date(startTime);
           var ed=new Date(endTime);
           if(isNaN(sd)||isNaN(ed)){
        	   $("#days").html();
           }else{
          
           var day=(ed-sd)/(3600*24*1000)+1;
           $("#days").html(day);
           }
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
app.controller('BusinessTripController',['$http','$window','$scope', function($http,$window,$scope){
    creatMask();
    var businessTrip=this;
    var url=getPath();
    var branch=getBranch();
    var user=getUser();
    // var url="oa.zhetian.net";
    //var url = "26.ztoas.com:88";
    // var url = "192.168.1.129:8080";
    // var branch={roleId:4,deptId:6,unitId:2,roleLevel:1};
    // var user={id:175};
    $http.post('http://'+url+'/oa/App/BusinessTrip!getInfo.action?userId='+user.id+'&roleId='+branch.roleId+'&businessTripId='+GetQueryString("businessTripId")).success(function(data){
    if(data.flag){
       if(data!=null&&data.isLogin==false){
    	  $("body").html("网络访问出错！");
       }
       businessTrip.detail=data;
     }else{
       progress("Show");
       progress("Error","未指定上级审批权限","goPrevious()");
     }
      removeMask();
      //getprocess();
    }).error(function(data,status,headers,config){
      if((status>=200 && status<300)||status===304||status===1223||status===0){
    	  $("body").html("网络访问出错！");
      }
});
  
    
businessTrip.edit=function(){
 progress("Show");

if(mem_id!=null)
{
   businessTrip.detail.userIds= mem_id;
   businessTrip.detail.content= mem_name;

 $http({url:'http://'+url+'/oa/App/BusinessTrip!edit.action',method:'post',data:businessTrip.detail}).success(function(data){
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
else
{
  progress("Error","未选择审批人","");
}


}

businessTrip.chooseMember=function(){
        if(isAndroid()) {
         client.chooseInfo("chooseMember.html?cmdfrom=businessTrip.html");
     }else{
         client.open("open",["chooseMember.html?cmdfrom=businessTrip.html","3"],
                     function(success){
                     },
                     function(error) {
                     alert("Error: \r\n"+error);
                     });
     }
}

businessTrip.check=function(){
    if( (document.getElementById("mem_id").value!=""||businessTrip.detail.userIds!=null)
      && businessTrip.detail.address!=null
      && businessTrip.detail.vehicle!=null
      && businessTrip.detail.start_date!=null
      && businessTrip.detail.end_date!=null
      && businessTrip.detail.money!=null
      && businessTrip.detail.note!=null)
    {
      return true;
    }
      
    else
      return false;
}
function getprocess(){
        $http.post('http://'+url+'/oa/App/AppRoleRule!getApplyRole.action?typeId=4&roleId='+branch.roleId+'&deptId='+branch.deptId+'&unitId='+branch.unitId+'&levelId='+branch.roleLevel).success(function(data){
      if(data.roleList.length!=0 && data.roleList!=null)
      {
         businessTrip.roleList = data.roleList;
         businessTrip.detail.content = businessTrip.roleList[businessTrip.roleList.length-1].content;
         businessTrip.detail.userIds = businessTrip.roleList[businessTrip.roleList.length-1].userIds;
      }
      else
      {
        businessTrip.roleList  = null;
        progress("Show");
        progress("Error","未设置审批流程");
      }
        

    }).error(function(data,status,headers,config){
      if((status>=200 && status<300)||status===304||status===1223||status===0){
        $("body").html("网络访问出错！");
      }
});
}


}]);
})();

  function refreshInfo(info){
   var info = eval("("+info+")");
   mem_id=info.id;
   mem_name=info.name;
   document.getElementById("member").value=info.name;
   document.getElementById("mem_id").value=info.id;
}   

