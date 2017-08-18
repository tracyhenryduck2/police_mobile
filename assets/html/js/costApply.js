
var url_upload=null;

(function(){
    var app = angular.module('costApply', [ ]);
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
app.controller('CostApplyController',['$http','$window','$scope', function($http,$window,$scope){
    creatMask();
    var costApply=this;
    var url=getPath();
    var user=getUser(); 
    var branch=getBranch();
     // var url="oa.zhetian.net";
     // var branch={roleId:1};
     // var user={id:1};
    // var url = "26.ztoas.com:88";
    // var url = "192.168.1.129:8080";
    // var branch={roleId:197,deptId:65,unitId:1,roleLevel:3};
    // var user={id:153};
    // var branch={roleId:4,deptId:6,unitId:2,roleLevel:1};
    // var user={id:175};

    $http.post('http://'+url+'/oa/App/AppCostApply!getInfo.action?userId='+user.id+'&roleId='+branch.roleId+'&costApplyId='+GetQueryString("costApplyId")).success(function(data){
     if(data.flag){
         if(data!=null&&data.isLogin==false){
    	   $("body").html("网络访问出错！");
         }
         console.log(data);
         costApply.detail=data;
         costApply.detail.content="";
         costApply.detail.date=null;
       }else{
         progress("Show");
         progress("Error","未指定上级审批权限","goPrevious()");
       }
     removeMask();
    }).error(function(data,status,headers,config){
      if((status>=200 && status<300)||status===304||status===1223||status===0){
    	  $("body").html("网络访问出错！");
      }
});
  
    
costApply.edit=function(){
progress("Show"); 
//增加图片路径 
costApply.detail.pic_name = url_upload;

/*************************/
 if(costApply.roleList==null)  progress("Error","未设置审批流程");
 else
 $http({url:'http://'+url+'/oa/App/AppCostApply!edit.action',method:'post',data:costApply.detail}).success(function(data){
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
}

costApply.changexingzhi= function(){
    if(costApply.detail.project_type_id!=undefined)
     getprocess();


}

costApply.changeMoney=function(){
   checkMoney();
}

function getprocess(){
      $http.post('http://'+url+'/oa/App/AppRoleRule!getApplyRole.action?typeId=6&roleId='+branch.roleId+'&subTypeId='+(costApply.detail.project_type_id)+'&deptId='+branch.deptId+'&unitId='+branch.unitId+'&levelId='+branch.roleLevel).success(function(data){
      
      if(data.roleList.length!=0)
      {
       costApply.roleList = data.roleList;
       console.log(costApply.roleList);
       checkMoney();
      }
      else
      {
       costApply.roleList = null;
       progress("Show");
       progress("Error","未设置审批流程");
      }

    }).error(function(data,status,headers,config){
      if((status>=200 && status<300)||status===304||status===1223||status===0){
        $("body").html("网络访问出错！");
      }
});
}

function checkMoney(){
       if(costApply.detail.money==null || costApply.roleList==null)
    {
         return;
    }

       
      /*
       分三种情况进行判断： 1.数组长度为1；2.数据长度为2；3、数据长度大于2
      */ 
      if(costApply.roleList.length>1)
       {
         if(costApply.roleList.length==2)
         {
          if(costApply.detail.money<=costApply.roleList[0].standard)
           {
              costApply.detail.content =  costApply.roleList[0].content;
              costApply.detail.userIds = costApply.roleList[0].userIds;
           }
           else
           {
              costApply.detail.content =  costApply.roleList[1].content;
              costApply.detail.userIds = costApply.roleList[1].userIds;
              
           }
         }
         else
         {
              for(var i=0;i<costApply.roleList.length;i++)
               {
                 if(i==0)  
                 {
                   if(costApply.detail.money<=costApply.roleList[0].standard)
                   {
                      costApply.detail.content =  costApply.roleList[0].content;
                      costApply.detail.userIds = costApply.roleList[0].userIds;
                      
                   }
                 }
                 else if(i<=costApply.roleList.length-2)
                 {
                  if(costApply.detail.money<=costApply.roleList[i].standard && costApply.detail.money>costApply.roleList[i-1].standard)
                     {
                      costApply.detail.content =  costApply.roleList[i].content;
                      costApply.detail.userIds = costApply.roleList[i].userIds;
                      
                     }
                 }
                 else
                 {
                    if(costApply.detail.money>costApply.roleList[costApply.roleList.length-2].standard)
                    {
                      costApply.detail.content =  costApply.roleList[costApply.roleList.length-1].content;
                      costApply.detail.userIds = costApply.roleList[costApply.roleList.length-1].userIds;
                     
                    }
                 }
               }
         }
       }
       else
       {
        costApply.detail.content=costApply.roleList[0].content;
        costApply.detail.userIds=costApply.roleList[0].userIds;
       }  
       
}

    costApply.showImageDialog=function(){
       //client.showImageDiolog...
       if(isAndroid()){
         client.showPhotoSheet("AppCostApply");
       }else{
         client.showPhotoSheet("showPhotoSheet",["AppCostApply"],
                   function(success){
                     
                   },
                   function(error) {
                   alert("Error: \r\n"+error);
                   });
         
       }
       
    }

}]);
})();


function RefreshImage(url,filename){
   //var url="http://img.sc115.com/uploads/png/110125/20110125121600406.png";
   $("#ima").attr("src",getFilePath()+url);
    url_upload = url;
      
               //图片加载完成消除残影
   $("#ima").load(function(){
                  
  $("#refoc").css("border-bottom","none");
  $("#refoc").css("border-bottom","1px solid #F9EDED");
  
  });

}
