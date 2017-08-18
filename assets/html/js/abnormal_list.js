var url="";
var model;
var request;
var result=false;
var first=false;
(function(){
	var app=angular.module('abnormallist',[]);

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


	app.controller('abnormallistController',['$http','$window',function($http,$window){
		var abnormal=this;
        url=getPath();
        abnormal.user=getUser();
        abnormal.deal = GetQueryString("deal");
        abnormal.selectMonth = GetQueryString("selectMonth");
        model=abnormal;
        request=$http;
        
        LoadData();


	}]);
})();

function LoadData(){
       result = false;
       if(!first) creatMask();
        request.post('http://'+url+'/oa/App/AppAttenceLog!getAttenceLogStateDetail.action?userId='+model.user.id+'&selectMonth='+model.selectMonth+'&deal='+model.deal).success(function(data){
            if(data!=null&&data.list.length==0){
                $("#refreshDiv").html("<div style='margin:100px auto;width:200px;height:100px;position: relative;text-align:center;'><img  style='position: relative;' src='image/nodata.png' width='62' height='66'/><br/><span style='font-size:14px;color:rgb(141,141,141);'>没有相关异常内容!</span></div>");
             $("body").removeClass("liststyle");
            }else $("body").addClass("liststyle");
            if(data!=null&&data.isLogin==false){
                $("body").html("网络访问出错！");
            }
            model.list=data;

            for(var i=0;i<model.list.list.length;i++)
            {
             model.list.list[i].add_time = toDecimal(model.list.list[i].add_time);    
            } 
          if(!first)  removeMask();
          result=true;
          first= true;
        }).error(function(data,status,headers,config){
            if((status>=200&&status<300)||status===304||status===1223||status===0){
                $("body").html("网络访问出错！");
            }
        });
}