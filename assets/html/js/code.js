var url="";
var model;
var request;
var Code;
var result=false;
function LoadData(){
  result=false;
    request.post('http://'+url+'/app/ProjectOverview!ajaxProjectOverview.action').success(function(data){
        console.log(data);
         //model.list = data;
         }).error(function(data,status,headers,config){
      if((status>=200&&status<300)||status===304||status===1223||status===0){
      $("body").html("网络访问出错！");
      }
      });
}


(function(){
	var app=angular.module('Code',[ ]);
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
	app.controller('CodeController',['$http','$window','$scope',function($http,$window,$scope){
    Code=this;
		request=$http;
    model=Code;

    Code.confirm=function(){

        if(Code.oldpassword==null||Code.oldpassword=='')
        {
          progress("Error","原密码为空");
          return;
        }
        if(Code.newpassword==null||Code.newpassword=='')
        {
          progress("Error","新密码为空");
          return;
        }
        if(Code.newpasswordconfirm==null||Code.newpasswordconfirm=='')
        {
          progress("Error","密码确认为空");
          return;
        }
        if(Code.newpassword!=Code.newpasswordconfirm)
        {
          progress("Error","输入密码不一致");
          return;
        }
        
        progress("Show","正在提交中...");

         $http({url:'http://'+url+'/app/Index!modPassword.action',method:'post',data:{"uId":Code.user.id,"newPassword":Code.newpassword}}).success(function(data){
          progress("Dismiss");
         if(data.result==1)
         {
             progress("Success","修改成功!","goPrevious();");
         }
         else
         {
            progress("Error","修改失败!");
         }
    }).error(function(data, status, headers, config){
      if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
      {
        progress("Dismiss");
        progress("Error","网络访问出错!");
      }
    }) ;

    }

	}]);
})();

function addNativeOK(){
    url = getPath();
    model.user = getUser();
}
