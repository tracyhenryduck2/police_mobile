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
                        ngModel.$setViewValue(dateText);
                         },
                         onClose: function (dateText, inst) {
                            
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
 
app.controller('LeaveController',['$http','$window','$scope', function($http,$window,$scope){
    creatMask();
    var leave=this;    
    //var url = "26.ztoas.com:88";
    // var url = "192.168.1.129:8080";
    // var branch={roleId:4,deptId:6,unitId:2,roleLevel:1};
    // var user={id:175};
     var url=getPath();
     var branch=getBranch();
     var user=getUser();
                                  
    leave.menuState={showTime: false,showDate:false};
    $http.post('http://'+url+'/oa/App/AppAttence!getInfo.action?userId='+user.id+'&roleId='+branch.roleId+'&attenceWorkId='+GetQueryString("attenceWorkId")).success(function(data){

      leave.detail=data;
      leave.detail.req_time = toDecimal(leave.detail.req_time);//保留一位小数或者0位

    removeMask(); 
    //getProcess();    
    }).error(function(data,status,headers,config){
      if((status>=200 && status<300)||status===304||status===1223||status===0){
    	  $("body").html("网络访问出错！");
      }
});

    leave.changeType = function(){
      var date=leave.detail.date;
      var endDate=leave.detail.end_date;


     if(!isNaN(leave.detail.type))
     {
        leave.menuState.showDate=true; 
        if(leave.detail.type==2 || leave.detail.type==8)
        {
          if(date!=null&&endDate!=null&&date==endDate)
          leave.menuState.showTime=true;
          else
          leave.menuState.showTime=false;
        }
        else
        {
          leave.menuState.showTime=false; 
          leave.detail.start_time='';
          leave.detail.end_time='';
          if(date==null||endDate==null)
          {
            leave.detail.refer_time=0;
            leave.detail.req_time=0;
          }
          else 
          {
             if(date==endDate)
             {
               leave.detail.refer_time=8;
               leave.detail.req_time=8;
             }
             else
             {
              var hours=((new Date(endDate)-new Date(date))/(3600*24*1000)+1)*8;
               leave.detail.refer_time=hours;
               leave.detail.req_time=hours; 
             }

          }
        }

     }
     else      
       {
         leave.detail.date = null;
         leave.detail.end_date = null;        
         leave.detail.start_time=null;
         leave.detail.end_time=null;
         leave.detail.refer_time=null;
         leave.detail.req_time=null;  
         leave.menuState.showDate=false;
         leave.menuState.showTime=false;
       }

  }

    leave.selectDate=function(){

    	var date=leave.detail.date;
    	var endDate=leave.detail.end_date;

      if(date==null || endDate==null)
      {
              leave.detail.start_time='';
              leave.detail.end_time='';
              leave.detail.refer_time=0;
              leave.detail.req_time=0;
      }
      else
      {
           if(date!=endDate){
              leave.menuState.showTime=false;
              var hours=((new Date(endDate)-new Date(date))/(3600*24*1000)+1)*8;
              
              if(isNaN(hours)){
                $scope.$apply(function(){
                  leave.detail.start_time='';
                  leave.detail.end_time='';
                  leave.detail.refer_time=0;
                  leave.detail.req_time=0;
                });
                
              }else{
                $scope.$apply(function(){
                leave.detail.start_time='';
                leave.detail.end_time='';
                leave.detail.refer_time=hours;
                leave.detail.req_time=hours;
                });
              }
              
                }else{
                  if(leave.detail.type==2 || leave.detail.type==8) leave.menuState.showTime=true;
                   $scope.$apply(function(){
                     leave.detail.refer_time=8;
                     leave.detail.req_time=8;
                  });
                }
      }



 
    }
    
    leave.selectTime=function(){
    	var startTime=leave.detail.start_time;
    	var endTime=leave.detail.end_time;
    	if(startTime!=null && endTime!=null){
    		var reg1=startTime.split(":");
    		var reg2=endTime.split(":");
    		var hours=((reg2[0]-reg1[0])*60-(-reg2[1])-reg1[1])/60;

    		if(isNaN(hours)){
    		hours="";
    		}
    		if(hours>8){
    			leave.detail.refer_time=8;
    			leave.detail.req_time=8;
    		}else if(hours<0){
          //不允许结束时间小于开始时间
          leave.detail.end_time = leave.detail.start_time;
    			leave.detail.refer_time=0;
    			leave.detail.req_time=0;
    		}else{
    			leave.detail.refer_time=Number(hours).toFixed(1);
    			leave.detail.req_time=parseFloat(Number(hours).toFixed(1));
    		}
    	}
//判断属于哪个流程
  //       checkTimeToProcess();  
    }
leave.edit=function(){
  delete leave.detail.applyRole;
  progress("Show");

   leave.detail.userIds= mem_id;
   leave.detail.content= mem_name;
  
 $http({url:'http://'+url+'/oa/App/AppAttence!edit.action',method:'post',data:leave.detail}).success(function(data){
     if(data!=null&&data.isLogin==false)
     {
      $("body").html("登陆超时，请重新登陆！");
     }
  if(data.flag)  progress("Success","保存成功","goPrevious()");
   else          progress("Error","保存失败","");
}).error(function(data, status, headers, config){
  if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
  {
    $("body").html("网络访问出错！");
  }
}) ;
}

leave.chooseMember=function(){
        if(isAndroid()) {
         client.chooseInfo("chooseMember.html?cmdfrom=leave.html");
     }else{
         client.open("open",["chooseMember.html?cmdfrom=leave.html","3"],
                     function(success){
                     },
                     function(error) {
                     alert("Error: \r\n"+error);
                     });
     }
}

leave.check=function(){
    if( (document.getElementById("mem_id").value!=""||leave.detail.userIds!=null)
      && leave.detail.type!=null
      && leave.detail.date!=null
      && leave.detail.end_date!=null
      && leave.detail.req_time!=null)
    {
          return true; 
    }
      
    else
      return false;
}

function getProcess(){
      $http.post('http://'+url+'/oa/App/AppRoleRule!getApplyRole.action?typeId=2&roleId='+branch.roleId+'&deptId='+branch.deptId+'&unitId='+branch.unitId+'&levelId='+branch.roleLevel).success(function(data){
      if(data.roleList.length!=0)
      {
         leave.roleList = data.roleList;
         checkTimeToProcess();
      }
      else
      {
        leave.roleList  = null;
        progress("Show");
        progress("Error","未设置审批流程");
      }
        

    }).error(function(data,status,headers,config){
      if((status>=200 && status<300)||status===304||status===1223||status===0){
        $("body").html("网络访问出错！");
      }
});

}

//判断属于哪个流程
function checkTimeToProcess(){
      /*
       分三种情况进行判断： 1.数组长度为1；2.数据长度为2；3、数据长度大于2
      */
      if(leave.detail.refer_time==null || leave.roleList==null)
      {
        return;
      }

      if(leave.roleList.length>1)
       {
         if(leave.roleList.length==2)
         {
          if(leave.detail.refer_time<=leave.roleList[0].standard)
           {
              leave.detail.content =  leave.roleList[0].content;
              leave.detail.userIds = leave.roleList[0].userIds;
           }
           else
           {
              leave.detail.content =  leave.roleList[1].content;
              leave.detail.userIds = leave.roleList[1].userIds;
              
           }
         }
         else
         {
              for(var i=0;i<leave.roleList.length;i++)
               {
                 if(i==0)  
                 {
                   if(leave.detail.refer_time<=leave.roleList[0].standard)
                   {
                      leave.detail.content =  leave.roleList[0].content;
                      leave.detail.userIds = leave.roleList[0].userIds;

                   }
                 }
                 else if(i<=leave.roleList.length-2)
                 {
                  if(leave.detail.refer_time<=leave.roleList[i].standard && leave.detail.refer_time>leave.roleList[i-1].standard)
                     {
                      leave.detail.content =  leave.roleList[i].content;
                      leave.detail.userIds = leave.roleList[i].userIds;

                     }
                 }
                 else
                 {
                    if(leave.detail.refer_time>leave.roleList[leave.roleList.length-2].standard)
                    {
                      leave.detail.content =  leave.roleList[leave.roleList.length-1].content;
                      leave.detail.userIds = leave.roleList[leave.roleList.length-1].userIds;

                    }
                 }
               }
         }
       }
       else
       {
        leave.detail.content=leave.roleList[0].content;
        leave.detail.userIds=leave.roleList[0].userIds;
       } 

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


