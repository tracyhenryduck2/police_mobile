(function(){
    var app = angular.module('carRecharge', [ ]);
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


app.controller('carRechargeController',['$http','$window','$scope', function($http,$window,$scope){
    creatMask();
    var carRecharge=this;
    var url=getPath();
    //var url="oa.zhetian.net";
    carRecharge.user=getUser();
    var branch=getBranch();
    //carRecharge.user={id:1};
    //branch={roleId:1};
    carRecharge.detail = new Object();
    carRecharge.detail.user_id=carRecharge.user.id;
    var editdata = GetQueryString("carEdit");
    if(editdata==-1)
    {

    }
    else
    {
      var a = JSON.parse(editdata); 
     carRecharge.detail = a;
     carRecharge.detail.Id=a.id;
     carRecharge.detail.last_mileage =carRecharge.detail.year_mileage-carRecharge.detail.mileage;
     carRecharge.detail.sumMoneyStart = carRecharge.detail.year_money-carRecharge.detail.money;
    }
    $http.post('http://'+url+'/oa/App/AppCarRecharge!getCars?userId='+carRecharge.user.id).success(function(data){
      if(data.length==0)
       {
       progress("Error","无车辆可选","goPrevious()");
       }
       else
       {
            carRecharge.carInfo=data;
            console.log(carRecharge.carInfo);
            $http.post('http://'+url+'/oa/App/AppCarRecharge!getApplyRole?roleId='+branch.roleId).success(function(data1){

               carRecharge.process=data1;
               console.log(carRecharge.process);

              if(editdata==-1) 
              {
                     //若只有一辆车则初始化就为该车辆，若不是则提示选择
                     if(carRecharge.carInfo.length==1)
                     {
                     carRecharge.detail.car_id=carRecharge.carInfo[0].id;
                     carRecharge.detail.code=carRecharge.carInfo[0].code;
                     carRecharge.detail.last_mileage=carRecharge.carInfo[0].initial_mileage==null?0:carRecharge.carInfo[0].initial_mileage;
                     //TESTcarRecharge.detail.last_mileage=1000;
                     carRecharge.detail.standard_mileage=carRecharge.carInfo[0].standard_mileage==null?0:carRecharge.carInfo[0].standard_mileage;
                     carRecharge.detail.sumMoneyStart=carRecharge.carInfo[0].sumMoney==null?0:carRecharge.carInfo[0].sumMoney;
                     checkMileage();
                     checkSumMoney();
                     checkProcess();
                   }
              } 
              else
              {
                  checkProcess();
              }                         

               
           }).error(function(data, status, headers, config){
              if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
              {
                 $("body").html("网络访问出错！");
             }
          });
          removeMask();

       } 


   }).error(function(data, status, headers, config){
      if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
      {
         $("body").html("网络访问出错！");
     }
 });






   carRecharge.edit=function(){
    progress("Show"); 
 console.log(carRecharge.detail);
   if(carRecharge.detail.last_mileage>carRecharge.detail.mileage) client.showMsg("当前里程数小于上次里程数，请重新填写");   
   else
    {

         $http({url:'http://'+url+'/oa/App/AppCarRecharge!edit.action',method:'post',data:carRecharge.detail}).success(function(data){
             if(data!=null&&data.isLogin==false)
             {
              $("body").html("登陆超时，请重新登陆！");
          }
          console.log(data);
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

};

  carRecharge.codeChange=function(){
    if(carRecharge.detail.car_id==null)  
    {
    }
    else 
    {
       for(var i=0;i<carRecharge.carInfo.length;i++)
       {
        if(carRecharge.detail.car_id==carRecharge.carInfo[i].id)
        {
           carRecharge.detail.code=carRecharge.carInfo[i].code;
           carRecharge.detail.last_mileage=carRecharge.carInfo[0].initial_mileage==null?0:carRecharge.carInfo[0].initial_mileage;
           carRecharge.detail.standard_mileage=carRecharge.carInfo[0].standard_mileage==null?0:carRecharge.carInfo[0].standard_mileage;
           carRecharge.detail.sumMoneyStart=carRecharge.carInfo[0].sumMoney==null?0:carRecharge.carInfo[0].sumMoney;
            break;
        }
       }
       
       checkMileage(); 
       checkProcess();
       checkSumMoney();
    }
  }

  carRecharge.changeMileage=function(){
     if(carRecharge.detail.car_id==null) client.showMsg("对不起，请选择车辆");

        checkMileage();
        checkProcess();

  }

  carRecharge.changeMoney=function(){
     if(carRecharge.detail.car_id==null) client.showMsg("对不起，请选择车辆");
        checkSumMoney();

  }
//动态更新累计里程数
function checkMileage(){

if(carRecharge.detail.mileage==null)
{
   carRecharge.detail.year_mileage = carRecharge.detail.last_mileage;
   carRecharge.detail.real_mileage = carRecharge.detail.last_mileage;
}
else
{
    if(carRecharge.detail.last_mileage==null)  carRecharge.detail.last_mileage=0;

    if(carRecharge.detail.mileage>=carRecharge.detail.last_mileage)
    {
      carRecharge.detail.year_mileage = carRecharge.detail.mileage-carRecharge.detail.last_mileage;
      carRecharge.detail.real_mileage = carRecharge.detail.mileage-carRecharge.detail.last_mileage;
    } 
    else
    {
      carRecharge.detail.year_mileage = carRecharge.detail.last_mileage;
      carRecharge.detail.real_mileage = carRecharge.detail.last_mileage;
    }
}

}
//流程选择
function checkProcess(){
   if(carRecharge.detail.mileage==null)
   {
       carRecharge.detail.content = carRecharge.process[0].content;
       carRecharge.detail.apply_role_id =  carRecharge.process[0].id;
   }
   else
   {
       if(carRecharge.detail.mileage < carRecharge.detail.standard_mileage )
       {
        carRecharge.detail.content = carRecharge.process[0].content;
        carRecharge.detail.apply_role_id =  carRecharge.process[0].id;
       }
       else
       {
        carRecharge.detail.content =  carRecharge.process[1].content;
        carRecharge.detail.apply_role_id = carRecharge.process[1].id;
       } 
   }

}

function checkSumMoney(){
  if(carRecharge.detail.sumMoneyStart==null) carRecharge.detail.sumMoneyStart=0;
  if(carRecharge.detail.money==null)  carRecharge.detail.year_money=carRecharge.detail.sumMoneyStart; 
  else  carRecharge.detail.year_money=carRecharge.detail.sumMoneyStart+carRecharge.detail.money;
}
}]);

})();



