$(function(){
     var StartX;
     var StartY;
     var MoveX;
     var EndX;
     var mubiaoleft;
     var timerCount = 0;
	$("#sousuo").css("left",window.innerWidth+"px");
    var mubiao = document.getElementById("screening");
    document.getElementById("sousuo").onclick=function(){
	      creatSearchMask();
	      mubiaoleft = parseInt( (0.18) * (window.innerWidth));
	      startMove(mubiao,"left",mubiaoleft);
	      document.getElementById("Searchmask").onclick=function(){
   	       var mubiaoright = parseInt( (1) * (window.innerWidth));
           startMove(mubiao,"left",mubiaoright,removeSearchMask);
        };
   };
      
   document.getElementById("canc").onclick=function(){
     var mubiaoright = parseInt( (1) * (window.innerWidth));
     startMove(mubiao,"left",mubiaoright,removeSearchMask);
   };
    
   document.getElementById("conf").onclick=function(){
       removeSearchMask();
       document.getElementById("screening").style.left= parseInt( (1) * (window.innerWidth))+"px";
   }

   try{
       bindToScreening();
   }
   catch (e)
   {
       //alert("拖拽事件不支持");
   }
    
   function bindToScreening(){
   	   document.getElementById("screening").addEventListener("touchstart",touchstartfunC,false);
   	   document.getElementById("screening").addEventListener("touchmove",touchmovefunC,false);
   	   document.getElementById("screening").addEventListener("touchend",touchendfunC,false);
   } 
   
   function touchstartfunC(e) {

      try {
      	  StartX= Number(e.touches[0].pageX);   //记录按下时的横坐标
      	  StartY= Number(e.touches[0].pageY);
      	 
      }
      catch(e){
          
      }
      
   }
   
   function touchmovefunC(e) {
 
  try {
  	     timerCount++;
         MoveX = Number(e.touches[0].pageX);   //记录移动时的横坐标
         //console.log("移动的:"+x);
         //console.log("开始记下的点坐标:"+StartX);
         if(MoveX>StartX) 
         {

            mubiao.style.left = ( mubiaoleft + (MoveX-StartX) ) + "px";
            
         }
      }
      catch(e){

      }
   }

   function touchendfunC(e) {
   try {
          //var endX = Number(e.touches[0].pageX); //记录方开时的横坐标
          console.log(timerCount);
          EndX = MoveX;
          if(EndX > StartX)
          {
          	var speed = Number((EndX-StartX)/timerCount);
          	var ladio = Number(EndX/window.innerWidth);
          	 console.log("放开的速度为:"+speed);
          	 console.log("放开的X坐标为:"+EndX);
          	 console.log("屏幕的宽度为:"+window.innerWidth);
          	 console.log("比率为:"+ladio);
          
   	   	 
          if(speed < 10 ) 
          	{
                if(ladio<0.6)
                {
          		mubiaoleft = parseInt( (0.18) * (window.innerWidth));
          		startMove(mubiao,"left",mubiaoleft);
          		}
          		else
          		{
          	    mubiaoleft = parseInt( (1) * (window.innerWidth));
          	    startMove(mubiao,"left",mubiaoleft,removeSearchMask);
          		} 
          	}
          else 
          {   
          	 if(timerCount!=0)
          	 {
          	  mubiaoleft = parseInt( (1) * (window.innerWidth));
          	  startMove(mubiao,"left",mubiaoleft,removeSearchMask);
          	 } 
          }
      }
         	timerCount=0;
      }
      catch(e){

      }
   }

});


function creatSearchMask(){
var Searchmask = document.createElement("div"); 
Searchmask.id = "Searchmask"; 
Searchmask.style.position = "fixed"; 
Searchmask.style.top = "0%"; 
Searchmask.style.left = "0"; 
Searchmask.style.zIndex = 100; 
Searchmask.style.backgroundColor = "#000000"; 
Searchmask.style.filter = "alpha(opacity=45)"; 
Searchmask.style.opacity = "0.45"; 
Searchmask.style.width = "100%"; 
Searchmask.style.height = (window.parent.document.body.scrollHeight + 50) + "px"; 
window.parent.document.body.appendChild(Searchmask);
document.body.onmousewheel = function(){return false;}
document.body.style.overflow="hidden"; 
document.body.scrollTop = 0;
document.getElementsByTagName("body")[0].removeEventListener('touchmove', touchMoveFunc, false);   
document.body.ontouchmove=function(){
  return false;
}

}

function removeSearchMask()
{
   document.body.removeChild(document.getElementById("Searchmask"));
   document.body.onmousewheel = function(){return true;}
   document.body.style.overflow="scroll";
document.body.ontouchmove=function(){
  return true;
}   
document.getElementsByTagName("body")[0].addEventListener('touchmove', touchMoveFunc, false);  
}