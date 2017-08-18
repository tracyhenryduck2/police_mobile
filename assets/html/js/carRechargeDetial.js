(function(){
var app = angular.module('carRechargeDet', [ ]);
app.controller('carRechargeDetController',['$http','$window', function($http,$window){
creatMask();
var carRechargeDet=this;
var url=getPath();
//var url="oa.zhetian.net";
var str1=GetQueryString("carRecharge");
carRechargeDet.detial = JSON.parse(str1); 
console.log(carRechargeDet.detial);
removeMask();
}]);
})();



