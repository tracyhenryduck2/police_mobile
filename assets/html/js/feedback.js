(function(){
   var app = angular.module("feedback",[]);

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



  app.controller('feedbackController', ['$http','$window', function($http,$window){
      var fback = this;
      var url = getPath();
      fback.user = getUser();

      $http.post('http://'+url+'/oa/App/AppFeedBack!getType.action').success(function(data){

      if(data!=null&&data.isLogin==false){
        $("body").html("用户未登录!");
      }
      fback.typeofques = data; 
      }).error(function(data,status,header,config){

      if((status >=200 && status <300) || status == 304 || status == 1223 || status == 0)
      {
        $("body").html("网络访问出错！");
      }
      });

      fback.sub = function(){
       progress("Show"); 
           $http({url:'http://'+url+'/oa/App/AppFeedBack!getFeedBack.action',data:{'content':fback.sub.content,'userId':fback.user.id,'typeId':fback.sub.Itm},method:'post'}).success(function(data){
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
  }])
})();