var mem_id=null;
var mem_name=null;
var file_url ="";

(function(){
    var app = angular.module('customapply', [ ]);
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


app.controller('customapplyController',['$http','$window','$scope', function($http,$window,$scope){
    var customapply=this;
    var url=getPath();   
    customapply.user=getUser();
    customapply.branch= getBranch();
    // var url="192.168.1.129:8080";
    // customapply.user={id:153};
    // customapply.branch={roleId:197,deptId:65,unitId:1,roleLevel:3};

    customapply.detail = new Object();
    var editdata = unescape(GetQueryString("customapplyId"));
    if(editdata==-1)
    {

    }
    else
    {
     customapply.detail = JSON.parse(editdata); 
     customapply.detail.money = customapply.detail.money/100;
     mem_id=customapply.detail.user_id;
     file_url = customapply.detail.file_url;
    }

    $http.post('http://'+url+'/oa/App/AppCustomApply!getInfo.action?userId='+customapply.user.id+'&roleId='+customapply.branch.roleId).success(function(data){
      if(data!=null && data.length!=0){
         customapply.typeslist = data;
         if(data.length==1) customapply.detail.projectTypeId = customapply.typeslist[0].id; 
       }else{
         progress("Show");
         progress("Error","未指定上级审批权限","goPrevious()");
       }
     
    }).error(function(data,status,headers,config){
      if((status>=200 && status<300)||status===304||status===1223||status===0){
        $("body").html("网络访问出错！");
      }
});


   customapply.edit=function(){
    progress("Show"); 
    customapply.detail.file_url= file_url;
    customapply.detail.user_id=mem_id;
    if(customapply.detail.money==null) customapply.detail.money=0;

    $http({url:'http://'+url+'/oa/App/AppCustomApply!edit.action',method:'post',data:{"applyUserId":customapply.user.id,"content":customapply.detail.content,"fileUrl":customapply.detail.file_url,"money":customapply.detail.money,"name":customapply.detail.name,"userId":customapply.detail.user_id,"projectTypeId":customapply.detail.projectTypeId}}).success(function(data){
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

customapply.check=function(){
    if( (document.getElementById("mem_id").value!=""||customapply.detail.user_id!=null)
      && customapply.detail.name!=null
      && customapply.detail.content!=null)
    {
      return true;
    }
      
    else
      return false;
}

customapply.showImageDialog=function(){
      if(isAndroid()){
         client.showPhotoSheet("AppCustomApply");
       }else{
         client.showPhotoSheet("showPhotoSheet",["AppCustomApply"],
                   function(success){
                     
                   },
                   function(error) {
                   alert("Error: \r\n"+error);
                   });
         
       }
}

customapply.chooseMember=function(){
        if(isAndroid()) {
         client.chooseInfo("chooseMember.html?cmdfrom=customapplyEdit.html");
     }else{
         client.open("open",["chooseMember.html?cmdfrom=customapplyEdit.html","3"],
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
   mem_id=info.id;
   mem_name=info.name;
   document.getElementById("member").value=info.name;
   document.getElementById("mem_id").value=info.id;
}   

function RefreshImage(url,filename){
   //var url="http://img.sc115.com/uploads/png/110125/20110125121600406.png";
   //$("#ima").attr("src",url);
               //图片加载完成消除残影
              // 
    $("#refoc").find("input").val(filename);  
    file_url = url;        
}