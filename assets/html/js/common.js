

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	 var parm = location.search; //获取url中"?"符后的字串
     if(parm.indexOf("?") == -1){
		parm=client.getParm();
     }
     var r = parm.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
function getUser()
{
	var userJson=eval("("+client.getUserJson()+")");
	if(userJson==null)
	{
		alert("没有json数据");
	}
	var user=userJson.user;
	return user;
}

function getBranch(){
 	var userJson=eval("("+client.getUserJson()+")");
	if(userJson==null){
		alert("没有json数据");
	}
	var branch=userJson.branch;
	return branch;
}

function getPath()
{
	return client.getIpPort();
}
function getFilePath()
{
    return "http://"+client.getIpPort()+"/notice_file/";
}

/*获取小数掉后一位，如果为零，则取整*/
function toDecimal(x) { 


    if(x == undefined || x == null || isNaN(x))
    {
      return;
    }
    else
    {
      if(((x*10)%10)==0)
      {
        return (x);
      }
      else
      {
        return(Math.round(x*10)/10);
      }
    }

} 

function isAndroid(){
   return true;
}
function creatMask(popDivId) { 
// 参数w为弹出页面的宽度,参数h为弹出页面的高度,参数s为弹出页面的路径 
var maskDiv = window.parent.document.createElement("div"); 
maskDiv.id = "maskDiv"; 
maskDiv.style.position = "fixed"; 
maskDiv.style.top = "0"; 
maskDiv.style.left = "0"; 
maskDiv.style.zIndex = 1000; 
maskDiv.style.background = "rgb(255, 255, 255)"; 
maskDiv.style.filter = "alpha(opacity=100)"; 
maskDiv.style.opacity = "1"; 
maskDiv.style.width = "100%"; 
maskDiv.style.height = (window.parent.document.body.scrollHeight + 50) + "px"; 
maskDiv.innerHTML="<div style='margin:100px auto;width:50px;height:100px;position: relative;'><img  style='margin:100px auto;position: relative;' src='images/jia.gif' /></div>"
window.parent.document.body.appendChild(maskDiv); 
maskDiv.onmousedown = function() { 
return; 
};
} 

function removeMask()
{
  window.parent.document.body.removeChild(window.parent.document.getElementById("maskDiv"));
  // flag_of_cre=true;
  try{

  }catch (e) {  
                //alert("不支持TouchEvent事件！" + e.message);  
             } 
  

}
function change(ele)
{
  ele.style.height = (ele.scrollHeight-8) + 'px';
}
function goPrevious() {
    var deviceType = isAndroid();
    if(deviceType){
        client.goBack();
    }else{
        history.back();
    }
};

function progress(type,message,method){
    if(isAndroid()){
    	client.progress(type,message,method);
    }else{
        client.progress("progress",[type,message,method],
                        function(success){
                        },
                        function(error) {
                        alert("Error: \r\n"+error);
                        });
    }
};


function showAlert(title,message,method){
    if(isAndroid()){
    	client.confirm(title,message,method);
    }else{
        client.showAlertView("showAlertView",[title,message,method],
         function(success){

         },
         function(error) {
         alert("Error: \r\n"+error);
         });
    }
};

function openUrl(url,type ){
    if(isAndroid()){
        client.open(url,type);
    }else{
        client.open("open",[url,"1"],
         function(success){
         },
         function(error) {
         alert("Error: \r\n"+error);
         });
    }
};


function  download(url,name){

    var str = client.getIpPort()+'/DownLoad!downLoad.action?fileRealName='+url+'&fileName='+name;
     window.location='http://'+str;
}

function downloadCompanyReAttach(url,name){
     var str = client.getIpPort()+'/oa/App/AppCompanyDayReport!downLoad.action?fileId='+url+'&fileName='+name;
     window.location='http://'+str;
}

function reload(){
    location.reload();
}