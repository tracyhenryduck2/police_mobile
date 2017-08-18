(function(){
	var app=angular.module('customapplyDet',[]);
	app.controller('customapplyDetController',['$http','$window',function($http,$window){
		creatMask();
		var customapplyDet=this;
		//customapplyDet.base="http://"+"oa.zhetian.net"+"/upload/";
		var url=getPath();
		//var url="oa.zhetian.net";
		$http.post('http://'+url+'/oa/App/AppCustomApply!detail.action?customApplyId='+GetQueryString("customapplyId")).success(function(data){

			if(data!=null&&data.isLogin==false){
				$("body").html("网络访问出错！");
			}
			customapplyDet.detial=data;
			subToFileUrl();
			removeMask();
		}).error(function(data,status,headers,config){
			if((status>=200 && status<300)||status===304||status===1223||status===0){
				$("body").html("网络访问出错！");
			}
		});

	function subToFileUrl(){
        if(customapplyDet.detial.file_url!=null&&customapplyDet.detial.file_url.length>13) 
        customapplyDet.detial.subfile_url= customapplyDet.detial.file_url.substring(13); 
	}

    //判断是否为图片
	// customapplyDet.checkBitmap=function(url){
	// 	var extStart=url.lastIndexOf(".");
	// 	var ext=url.substring(extStart,url.length).toUpperCase();
	// 	if(ext!=".BMP"&&ext!=".PNG"&&ext!=".GIF"&&ext!=".JPG"&&ext!=".JPEG")  return false;
	// 	else                                                                  return true;
	// }
customapplyDet.download=function(){
	download(customapplyDet.detial.file_url,customapplyDet.detial.subfile_url);
}

	}]);
})();

// function creatImgMask(url) { 
// // 参数w为弹出页面的宽度,参数h为弹出页面的高度,参数s为弹出页面的路径 
// var maskDiv = window.parent.document.createElement("div"); 
// maskDiv.id = "ImgmaskDiv"; 
// maskDiv.style.position = "fixed"; 
// maskDiv.style.top = "0"; 
// maskDiv.style.left = "0"; 
// maskDiv.style.zIndex = 1000; 
// maskDiv.style.backgroundColor = "rgba(35, 34, 34, 0.701961)"; 
// // maskDiv.style.filter = "alpha(opacity=70)"; 
// // maskDiv.style.opacity = "0.7"; 
// maskDiv.style.width = "100%"; 
// maskDiv.style.height = (window.parent.document.body.scrollHeight + 50) + "px"; 
// maskDiv.innerHTML="<div id='imgshow' align='center' style='margin: 0px auto;width: 200px;height: 200px;position: relative;'><img id='aaa'  style='position: relative;' src='"+url+"' /></div>"
// window.parent.document.body.appendChild(maskDiv);

// maskDiv.onmousedown = function() { 
// 	//console.log(document.getElementById("aaa").offsetHeight);
//    removeImgMask();
// };
// var obj = document.getElementById("aaa");
// //等图片加载完获取高度让他放置在屏幕中间
// obj.onload=function(){
//   document.getElementById("imgshow").style.marginTop=(window.innerHeight - obj.height)/2+"px";
// }

// } 

// function removeImgMask()
// {
//   window.parent.document.body.removeChild(window.parent.document.getElementById("ImgmaskDiv"));
//   // flag_of_cre=true;
//   //http://26.ztoas.com:88/upload/1429767990971IMG_20150315_174619.jpg
// }