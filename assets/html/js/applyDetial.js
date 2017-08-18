var url="";
var model;
var request;
var applyId;
var user;
var branch;
var sub_note;
var mem_id=null;
var mem_name=null;
function ApproveAction(){
    //model.isShow=false;
    progress("Show");
    request.post('http://'+url+'/oa/App/Apply!approve.action?applyId='+applyId+'&levelId='+branch.roleLevel+'&userId='+user.id+'&reason='+sub_note).success(function(data){
       if(data.flag)
       {
       progress("Success","处理成功","goPrevious()");
       //LoadData();
       }else{
       progress("Error","操作失败");
       }
       });
}

function RefuseAction(){
    //model.isShow=false;
    progress("Show");
    request.post('http://'+url+'/oa/App/Apply!refuse.action?applyId='+applyId+'&levelId='+branch.roleLevel+'&userId='+user.id+'&reason='+sub_note).success(function(data){
    if(data.flag)
    {
    progress("Success","处理成功","goPrevious()");
    //LoadData();
    }else{
    progress("Error","操作失败");
    }
    });
}

function TurnOthers(){
    //model.isShow=false;
    progress("Show");
    request.post('http://'+url+'/oa/App/Apply!reset.action?applyId='+applyId+'&levelId='+branch.roleLevel+'&userId='+mem_id+'&reason='+sub_note).success(function(data){
    if(data.flag)
    {
    progress("Success","处理成功","goPrevious()");
    //LoadData();
    }else{
    progress("Error","操作失败");
    }
    });
}


function LoadData(){

  creatMask();
  request.post('http://'+url+'/oa/App/Apply!applyDetial.action?applyId='+GetQueryString("applyId")).success(function(data){
  if(data!=null&&data.isLogin==false)
  {
    $("body").html("登陆超时，请重新登陆！");
  }
  model.detial=data;
  if( model.detial.list!=null && model.isShow==false && model.detial.list[model.detial.list.length-1].status==1&&model.detial.list[model.detial.list.length-1].user_id==model.detial.user_id )
  model.note = model.detial.list[model.detial.list.length-1].reason;
  var contents =data.content; 
  contents = contents.replace(/\r\n/g,"<br/>");
  $("#content").html(contents);
  //replaceFujianUrl();
  removeMask();
}).error(function(data, status, headers, config){
  if((status >= 200 && status < 300 ) || status === 304 || status === 1223 || status === 0)
  {
    $("body").html("网络访问出错！");
  }
});
}

    function replaceFujianUrl(){
         var aa = $("#content").find("a").eq(0);
         if(aa!=null)
         {
         var  bb=aa.attr("href");
         if(bb!=undefined && bb!=null)
         {
            bb=bb.toString().replace("../..","http://"+url);
            $("#content").find("a").eq(0).attr("href",bb);
         }

         } 
    }

(function(){
var app = angular.module('apply', [ ]);
app.controller('ApplyController',['$http','$window', function($http,$window){
var apply=this;
url=getPath();
user=getUser();
branch=getBranch();
// url="oa.zhetian.net";
// user={id:175};
 // url="192.168.1.129:8080";
 // user={id:1};
request=$http;
apply.isShow=false;
apply.showName = false;
apply.now_applyer_id = user.id;
var type=GetQueryString("type");
if(parseInt(type)==1)
{
  apply.isShow=true;
} 
model=apply;
LoadData();


		apply.approve=function()
		{

         if(apply.note==null)  sub_note="";
         else                  sub_note = apply.note;
          applyId = GetQueryString("applyId") ;
          showAlert("提示","确定同意申请吗？","ApproveAction();");

                                      
		}
		apply.refuse=function()
		{

              if(apply.note==null)  sub_note="";
              else                  sub_note = apply.note;
              applyId = GetQueryString("applyId");
              showAlert("提示","确定拒绝申请吗？","RefuseAction();");


		}

    apply.turn=function()
    {
          if(mem_id!=null&&mem_id!=0)
        {
              if(apply.note==null)  sub_note="";
              else                  sub_note = apply.note;
              applyId = GetQueryString("applyId");
              showAlert("提示","确定流转申请吗？","TurnOthers();");   
        }
        else
        {
             progress("Error","请输入流转人","");
        }
    }

    apply.showturn=function(flag){
        apply.showName = flag;
    }

    apply.chooseMember=function(){
     if(isAndroid()) {
         client.chooseInfo("chooseMember.html?cmdfrom=applyDetial.html");
     }else{
         client.open("open",["chooseMember.html?cmdfrom=applyDetial.html","3"],
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

