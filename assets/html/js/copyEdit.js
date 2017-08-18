var model;

(function(){
    var app = angular.module('leave', [ ]);
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

 
app.controller('LeaveController',['$http','$window','$scope', function($http,$window,$scope){
    //creatMask();
    var leave=this;
    model = leave;    
    //var url = "26.ztoas.com:88";
     //var url = "192.168.1.129:8080";
    // var branch={roleId:4,deptId:6,unitId:2,roleLevel:1};
    // var user={id:175};
      var url=getPath();
     // var branch=getBranch();
     // var user=getUser();
    leave.user=getUser();                              
    leave.userlist = new Array();
    leave.note="";
    leave.applyId=GetQueryString("applyId");
//     $http.post('http://'+url+'/oa/App/AppAttence!getInfo.action?userId='+user.id+'&roleId='+branch.roleId+'&attenceWorkId='+GetQueryString("attenceWorkId")).success(function(data){

//       leave.detail=data;
//       leave.detail.req_time = toDecimal(leave.detail.req_time);//保留一位小数或者0位

//     removeMask(); 
//     //getProcess();    
//     }).error(function(data,status,headers,config){
//       if((status>=200 && status<300)||status===304||status===1223||status===0){
//     	  $("body").html("网络访问出错！");
//       }
// });

leave.delete=function(id){
       for(var i=0; i<leave.userlist.length; i++){
            if(leave.userlist[i].id==id){
               console.log(leave.userlist[i]);
               leave.userlist.splice(i,1);
            }
          }
}

leave.add=function(id,name){
       var flag = false;

               $scope.$apply(function(){
                       for(var i=0; i<leave.userlist.length; i++){
                        if(leave.userlist[i].id==id) flag = true;
                      }
                      if(!flag)
                      {
                        var dsa = new Object();
                        dsa.id = id;
                        dsa.name = name;
                        leave.userlist.push(dsa);
                      }
              });

}

    
leave.edit=function(){
  progress("Show");
 if(leave.userlist==null || leave.userlist.length==0)
 {
    progress("Error","未选择抄送人","");
 }
 else
 {

     var dsa = "";
      for(var i=0;i<leave.userlist.length;i++)
      {
        dsa+=leave.userlist[i].id;
        dsa+=",";
      }
         $http({url:'http://'+url+'/oa/App/ApplyCopy!addApplyCopy.action',method:'post',data:{"applyId":leave.applyId,"fromUserId":leave.user.id,"copyNote":leave.note,"lookers":dsa}}).success(function(data){
         if(data!=null&&data.isLogin==false)
         {
          $("body").html("登陆超时，请重新登陆！");
         }
      if(data.flag)  progress("Success","抄送成功","goPrevious()");
       else          progress("Error","抄送失败","");
    }).error(function(data, status, headers, config){
      if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
      {
        $("body").html("网络访问出错！");
      }
    }) ;
 }
  

}

leave.chooseMember=function(){
        if(isAndroid()) {
         client.chooseInfo("chooseMember.html?cmdfrom=copyEdit.html");
     }else{
         client.open("open",["chooseMember.html?cmdfrom=copyEdit.html","3"],
                     function(success){
                     },
                     function(error) {
                     alert("Error: \r\n"+error);
                     });
     }
}




}]);
})();

  function refreshInfo(info){
   var info = eval("("+info+")");
   model.add(info.id,info.name);
}   


