var checkcount=0;
var timer1 = null;  //做轮询加载数据结果的计时器
var timer2 = null;  //延迟上拉动画的延时计时器    //两者必须在必要的函数中touchstart函数中清空
var startX = 0, startY = 0,type=0; 
var startX2 = 0,startY2 = 0;
var timer3 =null //计数器记录
$(function () {
	 		window.loadheight = $('#scrollTitle').height();
   			$("#scrollTitle").css("marginTop", "-" + loadheight+ "px");
 
        });

function bindEvent() {  
  document.getElementsByTagName("body")[0].addEventListener('touchstart', touchSatrtFunc, false);  
  document.getElementsByTagName("body")[0].addEventListener('touchmove', touchMoveFunc, false);  
  document.getElementsByTagName("body")[0].addEventListener('touchend', touchEndFunc, false);  
}  

//刷新加载数据定时判断函数
function checkResult(){
       checkcount++; 
       
       if(checkcount<600)
         {
          if(result==true)  
            {
              clearInterval(timer1);
              $("#xialawenzi").html("刷新成功");
              $("#jiantou").attr("src","images/jiazaisuccess.png");
              //收起并还原初始状态

             var startpoint = $("#scrollTitle").css("marginTop"); 
             if(parseInt(startpoint) == -150 )
              timer2 = setTimeout(function(){ $("#scrollTitle").animate({"marginTop":"-" + loadheight+ "px"},100,function(){

              $("#jiantou").attr("src","images/arr.png"); 
              $("#xialawenzi").html("下拉刷新");
              $("#jiantou").css("transform","rotate(180deg)");  
              }); },500);   
            }
         }
       else
         {
           checkcount=0; 
           clearInterval(timer1);
           $("#xialawenzi").html("刷新失败"); 
             $("#jiantou").attr("src","images/jiazaifail.png");
               //收起并还原初始状态
              var startpoint = $("#scrollTitle").css("marginTop");  
             if(parseInt(startpoint) == -150 )  
             timer2 = setTimeout(function(){ $("#scrollTitle").animate({"marginTop":"-" + loadheight+ "px"},100,function(){
              $("#jiantou").attr("src","images/arr.png"); 
              $("#xialawenzi").html("下拉刷新");
              $("#jiantou").css("transform","rotate(180deg)");  
              }); },500);             
         }   
}

//刷新下拉Start函数
function touchSatrtFunc(evt) {  
                try  
                {  
                    clearInterval(timer1);
                    clearTimeout(timer2);
                    //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  
                    var startpoint = $("#scrollTitle").css("marginTop");
                    if(parseInt(startpoint)<-150)
                    {
                      $("#jiantou").attr("src","images/arr.png"); 
                      $("#jiantou").css("transform","rotate(180deg)");
                      $("#xialawenzi").html("下拉刷新");  
                    }
                    else
                    {
                      $("#jiantou").attr("src","images/arr.png");
                      $("#jiantou").css("transform","rotate(0deg)"); 
                      $("#xialawenzi").html("释放刷新");  
                    }
                    var touch = evt.touches[0]; //获取第一个触点

                    var x1 = Number(touch.pageX); //页面触点X坐标  
                    var y1 = Number(touch.pageY); //页面触点Y坐标 
                    startX = x1;  
                    startY = y1; 

                   var touch2 = evt.touches[1]; 
                    if(touch2 !=null)
                    {
                      var x2 = Number(touch2.pageX); //页面触点X坐标  
                      var y2 = Number(touch2.pageY); //页面触点Y坐标  
                    //记录触点初始位置  
  
                      startX2 = x2;
                      startY2 = y2;  
                    }

                    //if(touch2!=undefined) alert(touch2);
                }  
                catch (e) {  
                    alert('touchSatrtFunc：' + e.message);  
                }  
            }  
//刷新下拉Move函数
function touchMoveFunc(evt) {  
               try  
                {  
                    //console.log($(window).scrollTop());

                    var touch = evt.touches[0]; //获取第一个触点

                    var x = Number(touch.pageX); //页面触点X坐标  
                    var y = Number(touch.pageY); //页面触点Y坐标 
                    var st = $(window).scrollTop();
                    //判断滑
                    if (y - startY >0) {  
                        var h=y-startY;
                        if(st<=0)
                        {  
                            type=1;
                            evt.preventDefault();
                            var top=Number($('#scrollTitle').css("marginTop").replace('px', ''));
                            h=top+h/2;
                            if(h<=0)
                            {
                                $("#scrollTitle").css("marginTop",h+"px"); 
                                if(h+150>0)    //-150px是刷新的分界点，也是文字和箭头刷新的分界点
                                {
                                   $("#jiantou").attr("src","images/arr.png");
                                   $("#jiantou").css("transform","rotate(0deg)"); 
                                   $("#xialawenzi").html("释放刷新"); 
                                } 
                            }
                            //$("#scrollTitle").css("height",  h + "px");
                            startY=y;
                            return;
                        }
                    } 
                    else if(y-startY<0){
                        
                        if( type==1 ) {
                              evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  
                        }
                        console.log($(window).scrollTop());
                        if(st<=0)
                        {
                            //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  
                            
                            var h=startY-y;
                            h=Number($('#scrollTitle').css("marginTop").replace('px', ''))-h/2;

                            $("#scrollTitle").css("marginTop",h+"px");
                            
                            if(h+150<0 || h+150==0)        
                            {
                                 $("#jiantou").css("transform","rotate(180deg)"); 
                                  $("#xialawenzi").html("下拉刷新"); 
                            }
                              
                            startY=y;
                           return;
                        }
                    } 
                    var touch2 = evt.touches[1]; //获取第二个触点  多点触发

                    if(touch2 !=null)
                    {
                        var x2 = Number(touch2.pageX); //页面触点X坐标  
                        var y2 = Number(touch2.pageY); //页面触点Y坐标  
                        if (y2 - startY2 >0) {  
                            var h=y2-startY2;
                            if(st<=0)
                            {  
                                type=0;
                                evt.preventDefault();
                                var top=Number($('#scrollTitle').css("marginTop").replace('px', ''));
                                h=top+h/2;
                                if(h<=0)
                                {
                                    $("#scrollTitle").css("marginTop",h+"px"); 
                                }
                                //$("#scrollTitle").css("height",  h + "px");
                                startY2=y2;
                            }
                        } 
                        else if(y2-startY2<0){
                            if(st<=0)
                            {
                                type=1;
                                var h=startY2-y2;
                                h=Number($('#scrollTitle').css("marginTop").replace('px', ''))-h/2;
                                $("#scrollTitle").css("marginTop",h+"px");
                                startY2=y2;
                            }
                        } 
                    }
                    
                }  
                catch (e) {  
                    alert('touchMoveFunc：' + e.message);  
                }  
            }  

//刷新下拉End函数
function touchEndFunc(evt) {  
                try {
                     type = 0;  
                    //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
                    var isRefresh=Number($('#scrollTitle').css("marginTop").replace('px', ''))>=-150;
                    var loadheight = $('#scrollTitle').height();
                    if(isRefresh) //满足刷新要求
                    {   
                        checkcount = 0;
                        $("#xialawenzi").html("正在刷新"); 
                        $("#jiantou").attr("src","images/jia.gif");
                        LoadData(); 
                        //-150px分界处停留显示刷新是否成功
                        $("#scrollTitle").animate({"marginTop":"-150px"},500,function(){
                        //运动到临界处时进行定时判断，每500ms判断刷新是否成功,持续30S
                        timer1 = setInterval("checkResult()",50);

                        });
                        
                    } 
                    else  //若不满足刷新条件，则运动到起始位置
                    {
                        $("#scrollTitle").animate({"marginTop":"-"+loadheight+"px"},100);
                    }
                        
                    
                }  
                catch (e) {                  
                }  
                    
                    
            }  


